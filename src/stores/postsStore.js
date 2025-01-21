import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase'
import { decode } from 'base64-arraybuffer'

export const usePostsStore = defineStore('posts', {
  actions: {
    async addPost(post, tags, showcase = null) {
      const { data: createdPost, error } = await supabase
        .from('posts')
        .insert([{ ...post }])
        .select()
      if (error) return false

      if (tags) await this.affectTags(createdPost[0], tags)

      if (showcase) await this.affectShowcase(createdPost[0].id, showcase)

      if (post.parent_id) await this.comment(post, createdPost[0].id)

      return createdPost[0]
    },

    async updatePost(post, tags) {
      const { data: updatedPost, error } = await supabase
        .from('posts')
        .update({ ...post })
        .eq('id', post.id)
        .select()
      if (error) return

      // Delete actual tags for re-affect them
      await supabase
        .from('posts_tags')
        .delete()
        .eq('post_id', updatedPost[0].id)

      // Re-affect
      await this.affectTags(updatedPost[0], tags)
    },

    async affectShowcase(postId, dataImage) {
      if (dataImage) {
        const fileName = `showcase-${postId}.jpg`
        const { data, error } = await supabase.storage
          .from('showcase')
          .upload(`public/${fileName}`, decode(dataImage.split(',')[1]), {
            contentType: 'image/jpg',
            upsert: true
          })

        if (!error) {
          await supabase
            .from('posts')
            .update({ showcase: data.path })
            .eq('id', postId)
        }
      }
    },

    async affectTags(post, tags) {
      // TODO: Implement method to normalize tags name
      if (tags && tags.length) {
        // 1. Check existing tags in base
        const { data: existingTags, error } = await supabase
          .from('tags')
          .select('id,name')
          .in('name', tags)

        // 2. Filter for keep only new tags
        const newTags = tags.filter(tag => !existingTags.some(existingTag => existingTag.name === tag))

        // 3. Insert new tags
        const { data: createdTags } = await supabase
          .from('tags')
          .upsert(newTags.map(tag => ({ name: tag })), { onConflict: ['name'] })
          .select()

        const postTags = createdTags.concat(existingTags).map(t => ({ post_id: post.id, tag_id: t.id }))

        await supabase
          .from('posts_tags')
          .insert(postTags)
      }
    },

    async deletePost(post) {
      const { error } = await supabase
        .from('posts')
        .update({ deleted_at: new Date() })
        .eq('id', post.id)
      if (!error) post.deleted_at = new Date()
    },

    async undeletePost(post) {
      const { error } = await supabase
        .from('posts')
        .update({ deleted_at: null })
        .eq('id', post.id)
      if (!error) post.deleted_at = null
    },

    async comment(post, comment_id) {
      await supabase
        .from('reactions')
        .insert([
          { post_id: post.parent_id, user_id: post.user_id, type: 'comment', comment_id },
        ])
    },

    async like(post, user_id) {
      const post_id = post.id
      const { data: isAlreadyLiked } = await supabase
        .from('reactions')
        .select()
        .eq('post_id', post_id)
        .eq('user_id', user_id)
        .eq('type', 'like')
        .single()

      if (isAlreadyLiked) {
        if (isAlreadyLiked.deleted_at) {
          // Re-like
          const { error } = await supabase
            .from('reactions')
            .update({ deleted_at: null, created_at: new Date(), is_read: true })
            .eq('post_id', post_id)
            .eq('user_id', user_id)
          if (!error) post.usersIdsWhoLiked.push({ user_id })
        } else {
          // Unlike
          const { error } = await supabase
            .from('reactions')
            .update({ deleted_at: new Date() })
            .eq('post_id', post_id)
            .eq('user_id', user_id)
          if (!error) post.usersIdsWhoLiked = post.usersIdsWhoLiked.filter(p => p.user_id != user_id)
        }
      } else {
        // First like
        const { error } = await supabase
          .from('reactions')
          .insert([
            { post_id, user_id, type: 'like' },
          ])
        if (!error) post.usersIdsWhoLiked.push({ user_id })
      }
    },

    async bookmark(post, user_id) {
      const post_id = post.id
      const { data: isAlreadyBookmarked } = await supabase
        .from('posts_saved')
        .select()
        .eq('post_id', post_id)
        .eq('user_id', user_id)
        .single()

      if (isAlreadyBookmarked) {
        const { error } = await supabase
          .from('posts_saved')
          .delete()
          .eq('post_id', post_id)
          .eq('user_id', user_id)
        if (!error) post.usersIdsWhoBookmarked = post.usersIdsWhoBookmarked.filter(p => p.user_id != user_id)
      } else {
        const { error } = await supabase
          .from('posts_saved')
          .insert([
            { post_id, user_id },
          ])
        if (!error) post.usersIdsWhoBookmarked.push({ user_id })
      }
    },

    async retrievePosts({ perPage = 10, page = null, userId = null, isPrivate = false, isComment = null, isPromoted = false, postIds = null, usersIdsThatIFollow = null }) {
      let query = supabase
        .from('posts')
        .select('*, tags(name), profiles(username, certified, pdp), comments:posts(id), usersIdsWhoBookmarked:posts_saved(user_id), usersIdsWhoLiked:reactions!reactions_post_id_fkey(user_id)')
        .eq('private', isPrivate)
        .eq('promoted', isPromoted)
        .is('deleted_at', null)
        .eq('usersIdsWhoLiked.type', 'like')
        .is('usersIdsWhoLiked.deleted_at', null)

      if (userId) {
        query = query.eq('user_id', userId)
      }

      if (postIds) {
        query = query.in('id', postIds)
      } else {
        query = isComment !== null ? query.not('parent_id', 'is', null) : query.is('parent_id', null)
      }

      if (usersIdsThatIFollow) {
        query = query.in('user_id', usersIdsThatIFollow)
      }

      if (page != null) query = query.range(page * perPage, (page + 1) * perPage - 1)

      query = query.order('published_at', { ascending: false })

      const { data: posts, error } = await query

      if (posts && posts.length >= perPage) {
        // ADS
        const { data: ads, error: e } =
          await supabase.rpc('get_random_ad', { excluded_posts: this.excluded_posts, privileged_users: usersIdsThatIFollow })
          .single()
        
        if (ads && !e) {
          this.excluded_posts.push(ads.id)
          const { data: randomAd, error: err } = await supabase
            .from('posts')
            .select('*, tags(name), profiles(username, certified, pdp), comments:posts(id), usersIdsWhoBookmarked:posts_saved(user_id), usersIdsWhoLiked:reactions!reactions_post_id_fkey(user_id)')
            .eq('id', ads.id)
            .single()
    
          if (!err) {
            posts.push(randomAd)
          }
        }
      }

      return posts
    },
  },
  state: () => ({
    excluded_posts: [],
    // Used for preview promote content
    fakePosts: [
      {
        id: 1,
        user_id: 1,
        profiles: {
          username: "SoCrafty",
          certified: true,
          pdpPreview: 'https://i.pravatar.cc/100?img=11',
        },
        description: "Live chat and offline messaging for businesses",
        link: "chatra.io",
        tags: [{ name: "Web Development" }, { name: "VueJs" }],
        published_at: new Date('2023-03-24T21:42:00'),
        deleted_at: null,
        usersIdsWhoLiked: [],
        usersIdsWhoBookmarked: [],
        comments: [{}, {}, {}, {}]
      },
      {
        id: 2,
        user_id: 2,
        profiles: {
          username: "Oskava",
          pdpPreview: 'https://i.pravatar.cc/100?img=0',
        },
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
          printer took a galley of type and scrambled it to make a type specimen book.`,
        link: "https://llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch.co.uk/",
        tags: [{ name: "Web Development" }, { name: "React native" }],
        published_at: new Date('2023-03-23T10:42:00'),
        deleted_at: null,
        usersIdsWhoLiked: [],
        usersIdsWhoBookmarked: [],
        comments: [{}, {}]
      },
    ],
  }),
})
