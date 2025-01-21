<template>
  <form ref="updatePostForm" class="flex flex-col gap-4 mt-4">
    <div class="flex flex-col gap-4">
      <template v-if="!initialPost.parent_id">
        <InputLink v-model="post.link" @click.prevent />
        <p v-if="errors && errors.length" class="text-error text-sm">
          {{ errors.find(e => e.input === 'link')?.message }}
        </p>
      </template>
      <MyTextarea @click.prevent v-model="post.description" id="newDescription" :additionalClass="'resize-none textarea-accent w-full'"/>
      <InputTags v-if="!initialPost.parent_id" @click.prevent v-model="getTags" :limit="limit" />
      <p v-if="errors && errors.length" class="text-error text-sm">
        {{ errors.find(e => e.input === 'tags')?.message }}
      </p>
    </div>
    <div class="flex flex-wrap gap-2 ml-auto">
      <button @click.prevent="cancelEdit" class="btn btn-error btn-outline">Cancel</button>
      <button @click.prevent="updatePost" type="submit" class="btn btn-success">Update</button>
    </div>
  </form>
</template>

<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { usePostsStore } from '@/stores/postsStore'
import { validateTags, cleanUrl } from '@/utils/link.js'

const MyTextarea = defineAsyncComponent(() => import('@/components/Inputs/MyTextarea.vue'))
const InputLink = defineAsyncComponent(() => import('@/components/Inputs/InputLink.vue'))
const InputTags = defineAsyncComponent(() => import('@/components/Inputs/InputTags.vue'))

const props = defineProps({
  post: {
    type: Object,
    required: true,
  }
})

const errors = ref([])
const limit = ref(authStore.myPlan.tags) // Max number of tags can be used on a post
const initialPost = { ...props.post }

const cancelEdit = () => {
  Object.assign(props.post, initialPost)
  props.post.onEdit = false
}

const getTags = computed(() => {
  return props.post.tags.map(t => { return { key: '', value: t.name } })
})

const datasIsValid = computed(() => {
  const maxLength = 280
  if (props.post.link) {
    const linkRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    if (!props.post.link.match(linkRegex)) return false
  }
  return props.post.description.length <= maxLength
})

const updatePostForm = ref(null)
const updatePost = async () => {
  if (!datasIsValid.value) return

  errors.value = []

  if (props.post.link) {
    const cleanLink = cleanUrl(props.post.link)
    if (!cleanLink) {
      errors.value.push({ input: "link", message: 'Error has occurred with the provided link' })
    }
  }

  // Create a new FormData object
  const form = updatePostForm.value
  const formData = new FormData(form)

  // Get the form data as an object
  const formObject = {}
  for (let pair of formData.entries()) {
    formObject[pair[0]] = pair[1]
  }

  // Get the tags
  let tags = []
  if (!initialPost.parentId) {
    for (let i = 0; i < limit.value; i++) {
      if (formObject[`tag_${i}`]) {
        tags.push(formObject[`tag_${i}`])
      }
    }
    props.post.tags = tags.map(t => ({ name: t }))
  }

  if (tags.length) {
    const tagsIsValid = validateTags(tags)
    if (!tagsIsValid) {
      errors.value.push({ input: "tags", message: 'Tags must be between 3 and 25 characters without spaces' })
    }
  }

  if (errors.value.length) return

  props.post.onEdit = false
  props.post.updated_at = new Date()

  // Update post request
  const postStore = usePostsStore()
  const newValues = {
    ...props.post
  }

  delete newValues.comments
  delete newValues.usersIdsWhoBookmarked
  delete newValues.usersIdsWhoLiked
  delete newValues.profiles
  delete newValues.onEdit
  delete newValues.tags
  postStore.updatePost(newValues, tags)
}
</script>
