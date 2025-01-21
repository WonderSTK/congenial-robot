<template>
  <Feed v-if="postToShow" :posts="[postToShow]" :postTargeted="true" class="pb-2" />
</template>

<script setup>
import { defineAsyncComponent, ref, watch, watchEffect } from 'vue'
import { supabase } from '@/utils/supabase'
import router from '@/router'

const Feed = defineAsyncComponent(() => import ("@/components/Feed.vue"))

const postToShow = ref(null)
const loadPost = async (postId) => {
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *, tags(name), profiles(username, certified, pdp), usersIdsWhoBookmarked:posts_saved(user_id), usersIdsWhoLiked:reactions!reactions_post_id_fkey(user_id),
      comments:posts(
        *, profiles(username, certified, pdp), usersIdsWhoBookmarked:posts_saved(user_id), usersIdsWhoLiked:reactions!reactions_post_id_fkey(user_id),
        comments:posts(*, profiles(username, certified, pdp), usersIdsWhoBookmarked:posts_saved(user_id), usersIdsWhoLiked:reactions!reactions_post_id_fkey(user_id), comments:posts(id))
      )
    `)
    .eq('private', false)
    .is('deleted_at', null)
    .eq('usersIdsWhoLiked.type', 'like')
    .eq('comments.usersIdsWhoLiked.type', 'like')
    .eq('comments.comments.usersIdsWhoLiked.type', 'like')
    .is('usersIdsWhoLiked.deleted_at', null)
    .is('comments.usersIdsWhoLiked.deleted_at', null)
    .is('comments.comments.usersIdsWhoLiked.deleted_at', null)
    .eq('id', postId)
    .order('published_at', { foreignTable: 'comments', ascending: false })
    .single()
  if (error) router.push('/404')

  postToShow.value = post
}

watchEffect(() => {
  if (router.currentRoute.value.path.startsWith('/post/')) {
    loadPost(router.currentRoute.value.params.postId)
  }
})
</script>
