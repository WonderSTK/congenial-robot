<template>
  <div v-if="canAddCustomTag" class="bg-base-100 rounded-box shadow-lg p-4 flex flex-wrap items-start gap-2 mb-4">
    <div class="flex flex-1 gap-2 items-top flex-col">
      <p>
        My tags
        <a @click="toggleMyTags()" class="select-none	link text-accent opacity-60 hover:opacity-100">{{ checkedMyTags.length ? 'uncheck' : 'check' }} all</a>
      </p>

      <div class="flex flex-wrap gap-2 items-center">
        <template v-if="!editMyTags">
          <label v-for="(tag, index) in myTags.filter(tag => !tag.archive)" :key="index" class="cursor-pointer label bg-base-200 btn btn-ghost min-h-min h-min border-0 gap-2 rounded-box p-0 pr-2">
            <input type="checkbox" v-model="tag.checked" class="checkbox checkbox-accent rounded-box" />
            <span class="label-text">{{ tag.name }}</span>
          </label>
        </template>
        <template v-else>
          <label v-for="(tag, index) in myTags" :key="index" :class="tag.archive ? 'opacity-40' : ''" class="cursor-pointer label bg-base-200 btn btn-ghost min-h-min h-6 border-0 gap-2 rounded-box p-0 pl-2 pr-2">
            <input type="checkbox" class="hidden" v-model="tag.archive" />
            <span class="label-text">{{ tag.name }}</span>
            <i class="fa-solid fa-trash"></i>
          </label>
        </template>
      </div>

      <form @submit.prevent="addNewTag()">
        <div class="input-group">
          <input v-model="tagName" name="mytag" type="text" placeholder="Enter tag name" class="input input-bordered h-8" maxlength="30"/>
          <button class="btn btn-square h-8 w-8 min-h-0">
            <i class="fa-solid fa-circle-plus"></i>
          </button>
        </div>
      </form>
    </div>

    <div class="tooltip tooltip-left ml-auto" :data-tip="editMyTags ? 'Valid edit' : 'Edit my tags'">
      <label class="swap btn">
        <input type="checkbox" v-model="editMyTags" @click="() => { if (editMyTags) updateMyTags() }" />
        <div class="swap-on"><i class="fa-solid fa-check"></i></div>
        <div class="swap-off"><i class="fa-regular fa-pen-to-square"></i></div>
      </label>
    </div>
  </div>

  <div v-if="postsSaved.length" class="bg-base-100 rounded-box shadow-lg p-4 flex flex-col gap-2">
    <div>
      Existing tags
      <a @click="toggleExistingTags()" class="select-none	link text-accent opacity-60 hover:opacity-100">{{ checkedTags.length ? 'uncheck' : 'check' }} all</a>
    </div>
    <div class="flex flex-wrap gap-2 max-h-[150px] overflow-scroll">
      <label v-for="(tag, index) in tags" :key="index" class="cursor-pointer label bg-base-200 btn btn-ghost min-h-min h-min border-0 gap-2 rounded-box p-0 pr-2">
        <input type="checkbox" v-model="tag.checked" class="checkbox checkbox-accent rounded-box" />
        <span class="label-text">{{ tag.name }}</span>
      </label>
    </div>
  </div>
  <div v-else class="bg-base-100 rounded-box shadow-lg p-4 w-full text-info flex items-baseline gap-2">
    <i class="fa-solid fa-circle-info"></i>
    <p class="leading-8">
      Looks like you haven't saved any content yet. You can easily save content by clicking on the
      <ReactionButton identifiant="bookmark" icon="fa-bookmark" btnColor="btn-accent btn-sm" string="Bookmark" />
      button available on a post !
    </p>
  </div>

  <section class="flex justify-end gap-2 w-full mt-4">
    <template v-if="canExport">
      <div v-if="postsToShow.length" class="tooltip tooltip-left" data-tip="Export current selection">
        <button @click="exportBookmarks(postsToShow)" class="btn btn-square">
          <i class="fa-solid fa-file-circle-check"></i>
        </button>
      </div>
      <div v-if="postsSaved.length" class="tooltip tooltip-left" data-tip="Export all">
        <button @click="exportBookmarks(postsSaved)" class="btn btn-square">
          <i class="fa-solid fa-file-csv"></i>
        </button>
      </div>
    </template>
    <div v-else class="tooltip tooltip-left" data-tip="Export">
      <router-link to="/upgrades" class="btn btn-square">
        <i class="fa-solid fa-file-circle-check"></i>
      </router-link>
    </div>
  </section>

  <Feed @showTagManagement="showTagManagement" class="mt-4 pb-2" :posts="postsToShow || []" :tagsToDisplay="checkedTags.concat(checkedMyTags)"/>

  <Teleport v-if="authStore.action === 'tag-management'" to="#modal-container">
    <!-- Modal tag management -->
    <input type="checkbox" id="tag-management" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="tag-management" class="modal modal-open cursor-pointer">
      <label class="modal-box relative" for="">
        <label for="tag-management" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Tag management</h3>
        <form v-if="myTagsPost.length" @submit.prevent="updateAssociateTags()" class="flex flex-col gap-4">
          <p class="py-4">Select/Unselect the tags to add or remove and confirm</p>
          <div class="flex flex-wrap gap-2">
            <label v-for="(tag, index) in myTagsPost" :key="index" class="cursor-pointer label bg-base-200 btn btn-ghost min-h-min h-min border-0 gap-2 rounded-box p-0 pr-2">
              <input type="checkbox" class="checkbox checkbox-accent rounded-box" v-model="tag.checked"/>
              <span class="label-text">{{ tag.name }}</span>
            </label>
          </div>
          <div class="flex gap-2 w-full justify-end">
            <label for="tag-management" class="btn btn-error btn-outline">Cancel</label>
            <button type="submit" class="btn btn-success">Confirm</button>
          </div>
        </form>
        <p v-else class="py-4">Please create a new tag first</p>
      </label>
    </label>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref, reactive, computed, inject, onBeforeMount, markRaw } from "vue"
import { supabase } from '@/utils/supabase'
import router from '@/router'
import Papa from 'papaparse'

const Feed = defineAsyncComponent(() => import ("@/components/Feed.vue"))
const ReactionButton = defineAsyncComponent(() => import ("@/components/ReactionButton.vue"))

const tagName = ref('')
const myTagsPost = ref([]) // Associed tags on a post
const postId = ref(null) // Use for modal tag management
const editMyTags = ref(false)

const authStore = inject('authStore')

const canAddCustomTag = ref(true)
const canExport = ref(!!authStore.myPlan.canExport)
const myTags = ref([])
const associateTags = ref([])

const maxTags = ref(authStore.myPlan.tags)

const loadTagsData = async () => {
  const { data } = await supabase
    .from('profiles')
    .select('my_tags, associate_tags')
    .eq('user_id', authStore.user.userId)
    .single()

  myTags.value = data.my_tags?.slice(0, maxTags.value).map(tag => ({ ...tag, checked: true })) || []
  associateTags.value = data.associate_tags ? data.associate_tags : {}
}

const tags = ref([])
const postsSaved = ref([])

const loadPostsSaved = async () => {
  const { data } = await supabase
    .from('posts_saved')
    .select('created_at, posts(*, tags(name), profiles(username, certified, pdp), comments:posts(id), usersIdsWhoBookmarked:posts_saved(user_id), usersIdsWhoLiked:reactions!reactions_post_id_fkey(user_id))')
    .is('posts.deleted_at', null)
    .eq('user_id', authStore.user.userId)
    .order('created_at', { ascending: false })

  postsSaved.value = data.filter(d => d.posts).map(d => d.posts)
}

// Tags already exist on post
const setupTags = () => {
  const uniqueTags = new Set()
  postsSaved.value.forEach(post => {
    post.tags.forEach(tag => {
      uniqueTags.add(tag.name)
    })
  })
  tags.value = [...uniqueTags].map(tag => { return { checked: true, name: tag } })
}

// Tags that the user added on a post
const setupAssociateTags = () => {
  for (const [postId, tagsIds] of Object.entries(associateTags.value)) {
    const post = postsSaved.value.find(p => p.id === postId)
    if (post) {
      post.myTags = new Set()
      tagsIds.forEach(tagId => {
        const tagName = myTags.value.find(tag => tag.id == tagId)?.name
        post.myTags.add(tagName)
      })
    }
  }
}

onBeforeMount(async() => {
  await loadPostsSaved()
  setupTags()
  await loadTagsData()
  setupAssociateTags()
})

const checkedMyTags = computed(() => {
  return myTags.value.filter(tag => tag.checked && !tag.archive).map(tag => tag.name)
})

const checkedTags = computed(() => {
  return tags.value.filter(tag => tag.checked).map(tag => tag.name)
})

const postsToShow = computed(() => {
  if (!checkedMyTags.value.length && !checkedTags.value.length) {
    return postsSaved.value.filter(p => !p.tags || !p.tags.length)
  }
  return postsSaved.value.filter(p => p.tags.some(tag => checkedTags.value.includes(tag.name)) || checkedMyTags.value.some(tag => p.myTags?.has(tag)) )
})

const toggleExistingTags = () => {
  if (checkedTags.value.length) {
    tags.value.forEach(tag => {
      tag.checked = false
    })
  } else {
    tags.value.forEach(tag => {
      tag.checked = true
    })
  }
}

const toggleMyTags = () => {
  if (checkedMyTags.value.length) {
    myTags.value.forEach(tag => {
      tag.checked = false
    })
  } else {
    myTags.value.forEach(tag => {
      tag.checked = true
    })
  }
}

const addNewTag = () => {
  if (myTags.value.length >= maxTags.value) {
    router.push('/upgrades')
    return
  }

  if (tagName.value && tagName.value.replace(/\s/g, "").length > 0) {
    tagName.value = tagName.value.toUpperCase()
    if (!myTags.value.find(tag => tag.name === tagName.value)) {
      const tag = {
        id: myTags.value.length + 1,
        name: tagName.value,
        archive: false,
      }
      myTags.value.push({ ...tag, checked: true })

      // Update user tags
      updateMyTags()
    }
    tagName.value = ''
  }
}

const showTagManagement = (id) => {
  if (!canAddCustomTag) return router.push('/upgrades')
  const post = postsSaved.value.find(p => p.id === id)
  if (post) {
    postId.value = id
    myTagsPost.value = myTags.value.map(tag => {
      return { ...tag, checked: (post.myTags && post.myTags.has(tag.name)) ? true : false }
    })
    authStore.action = 'tag-management'
  }
}

const updateMyTags = async (removeArchived = true) => {
  if (removeArchived) {
    myTags.value = myTags.value.filter(t => !t.archive)
  }

  await supabase
    .from('profiles')
    .update({ my_tags: myTags.value })
    .eq('user_id', authStore.user.userId)
}

const updateAssociateTags = async () => {
  const post = postsSaved.value.find(p => p.id === postId.value)
  delete post.myTags
  delete associateTags.value[postId.value]
  const tags = []
  for (const tag of myTagsPost.value) {
    if (tag.checked) tags.push(tag.id)
  }
  if (tags.length) {
    associateTags.value[postId.value] = tags
    // Uptade myTags post
    post.myTags = new Set()
    tags.forEach(tagId => {
      const tagName = myTags.value.find(tag => tag.id == tagId).name
      post.myTags.add(tagName)
    })
  }

  // Update user associate_tags
  await supabase
    .from('profiles')
    .update({ associate_tags: associateTags.value })
    .eq('user_id', authStore.user.userId)

  // Close modal
  authStore.action = null
}

/**
 * Function to export datas in a CSV file
 */
const exportBookmarks = (posts) => {
  // Create a CSV string
  const csvContent = Papa.unparse(posts.map(post => ({
    link: post.link,
    description: post.description,
    tags: post.tags.map(t => t.name).join(', '),
    myTags: post.myTags ? Array.from(post.myTags).join(', ') : '',
    publishedAt: new Date(post.published_at).toDateString(),
  })))

  // Set the content type and disposition of the response
  const filename = 'bookmarked_links.csv'
  const contentType = 'text/csv'

  // Create a Blob from the CSV string
  const blob = new Blob([csvContent], { type: contentType })

  // Create a download link
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', filename)
  document.body.appendChild(link)

  // Trigger the download
  link.click()
}
</script>
