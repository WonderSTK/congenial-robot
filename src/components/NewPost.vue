<template>
  <form id="newPost" @submit.prevent="sendForm()" class="flex flex-col space-y-4 p-4 rounded-box shadow-lg bg-base-100 mb-4">
    <div class="flex">
      <!-- Status -->
      <div class="dropdown">
        <label tabindex="0">
          <select v-model="type" name="type" @change="isPublic = !isPublic" class="hidden select badge gap-2 h-10 min-h-0 rounded-full" :class="isPublic ? 'badge-accent' : 'badge-secondary'" required>
            <option value="public" class="hidden" selected>Public 🌐</option>
            <option value="private" class="hidden">Private 🔒</option>
          </select>
          <span ref="span" @click="isDropdownOpen = !isDropdownOpen" class="select badge gap-2 h-10 min-h-0 rounded-full text-accent-content" :class="isPublic ? 'bg-accent' : 'bg-secondary'">{{ isPublic ? 'Public 🌐' : 'Private 🔒' }}</span>
        </label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow rounded-box w-52 mt-2 text-accent-content" :class="`${isPublic ? 'bg-accent' : 'bg-secondary'}` + `${isDropdownOpen ? '' : ' hidden'}`">
          <li :class="isPublic ? 'hidden' : ''">
            <a @click="type = 'public'; isPublic = true; isDropdownOpen = false;">
              Public 🌐
            </a>
          </li>
          <li :class="!isPublic ? 'hidden' : ''">
            <a @click="type = 'private'; isPublic = false; isDropdownOpen = false;">
              Private 🔒
            </a>
          </li>
        </ul>
      </div>

      <!-- Create promoted content -->
      <div v-if="authStore.myPlan.canPromoteContent" class="tooltip tooltip-left tooltip-error ml-auto" data-tip="Promote content">
        <label v-if="isNotFilled()" class="opacity-50 cursor-not-allowed btn btn-circle btn-error border border-red-600 border-2">🔥</label>
        <label v-else for="promote-content" @click="authStore.action = 'promote-content'" class="btn btn-circle btn-error border border-red-600 border-2">🔥</label>
      </div>
    </div>

    <!-- Link -->
    <InputLink v-model="link" />
    <p v-if="errors && errors.length" class="text-error text-sm">
      {{ errors.find(e => e.input === 'link')?.message }}
    </p>

    <!-- Description -->
    <MyTextarea v-model="description" placeholder="Description" :additionalClass="'w-full pb-10 ' + (isPublic ? 'textarea-accent' : 'textarea-secondary')" />

    <!-- Tags -->
    <InputTags v-model="selectedTags" :badgeType="isPublic ? 'badge-accent' : 'badge-secondary'" :limit="limit" />
    <p v-if="errors && errors.length" class="text-error text-sm">
      {{ errors.find(e => e.input === 'tags')?.message }}
    </p>

    <!-- Submit -->
    <button type="submit" class="btn" :class="(isPublic ? 'btn-accent' : 'btn-secondary') + (!datasIsValid ? ' btn-disabled' : '')" :disabled="isNotFilled()">Post</button>
  </form>

  <Teleport v-if="authStore.action === 'promote-content'" to="#modal-container">
    <!-- Modal promote content -->
    <input type="checkbox" id="promote-content" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <div class="modal">
      <label class="modal-box relative" for="">
        <label for="promote-content" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Promote Content</h3>
        <form @submit.prevent class="flex flex-col gap-4">
          <p class="mt-4">Select a period during which you want to run the promotion</p>
          <div class="flex items-center gap-4">
            <InputDate v-model="startingDate" placeholder="Starting date" :minDate="new Date()" />
            <span>-</span>
            <InputDate v-model="endingDate" placeholder="Ending date" :minDate="startingDate" />
          </div>

          <PictureUploader @updateImage="showcase = $event" @preview="preview" title="Showcase picture" :previewFeed="true" />
          <div class="flex gap-2 w-full justify-end mt-4">
            <label for="promote-content" class="btn btn-error btn-outline">Cancel</label>
            <button @click="sendForm(true)" :disabled="(!showcase || !startingDate || !endingDate) || startingDate > endingDate" type="submit" class="btn btn-success">Promote</button>
          </div>
        </form>
      </label>
    </div>

    <!-- Modal for preview content -->
    <input type="checkbox" id="preview-content" class="modal-toggle" />
    <div class="modal">
      <label class="modal-box relative w-11/12 max-w-5xl bg-base-300" for="preview-content">
        <label for="preview-content" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Preview content</h3>
        <div class="flex flex-col gap-4">
          <p class="py-4 flex items-center gap-4">
            This is what your content will look like, you can switch theme: 
            <SwitchTheme />
          </p>
          <Feed :posts="postsToPreview" />
        </div>
      </label>
    </div>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref, inject, computed } from 'vue'
import { usePostsStore } from '@/stores/postsStore'
import { validateTags, cleanUrl } from '@/utils/link.js'
import { supabase } from '@/utils/supabase'
import axios from 'axios'
const authStore = inject('authStore')

const MyTextarea = defineAsyncComponent(() => import ("@/components/Inputs/MyTextarea.vue"))
const PictureUploader = defineAsyncComponent(() => import ("@/components/Inputs/PictureUploader.vue"))
const Feed = defineAsyncComponent(() => import ("@/components/Feed.vue"))
const SwitchTheme = defineAsyncComponent(() => import ("@/components/SwitchTheme.vue"))
const InputDate = defineAsyncComponent(() => import ("@/components/Inputs/InputDate.vue"))
const InputLink = defineAsyncComponent(() => import ("@/components/Inputs/InputLink.vue"))
const InputTags = defineAsyncComponent(() => import ("@/components/Inputs/InputTags.vue"))

const isPublic = ref(true)
const isDropdownOpen = ref(false)
const emit = defineEmits(['newPostCreated'])

// V-model for inputs
const link = ref("")
const description = ref("")
const type = ref("public")
const limit = ref(authStore.myPlan.tags) // Max number of tags can be used on a post
const selectedTags = ref([])

// Preview promote content
const postsToPreview = ref([])
const showcase = ref('')
const startingDate = ref(null)
const endingDate = ref(null)

const errors = ref([])

const isNotFilled = () => {
  return type.value === "" || link.value === "" || description.value === ""
}

const getFormObject = () => {
  // Create a new FormData object
  const form = document.getElementById('newPost')
  const formData = new FormData(form)
  // Get the form data as an object
  const formObject = {}
  for (let pair of formData.entries()) {
    formObject[pair[0]] = pair[1]
  }
  return formObject
}

const sendForm = async (isPromoted = false) => {
  if (!datasIsValid.value) return
  if (isPromoted && (!showcase.value || !startingDate.value || !endingDate.value) || startingDate.value > endingDate.value) {
    return false
  }

  errors.value = []

  const cleanLink = cleanUrl(link.value)
  if (!cleanLink) {
    errors.value.push({ input: "link", message: 'Error has occurred with the provided link' })
  }

  const formObject = getFormObject()

  // Get the tags
  let tags = []
  for (let i = 0; i < limit.value; i++) {
    if (formObject[`tag_${i}`]) {
      tags.push(formObject[`tag_${i}`])
    }
  }

  const tagsIsValid = validateTags(tags)
  if (!tagsIsValid) {
    errors.value.push({ input: "tags", message: 'Tags must be between 3 and 25 characters without spaces' })
  }

  if (errors.value.length) return

  // Create the new post
  const newPost = {
    user_id: authStore.user.userId,
    description: formObject["description"],
    link: cleanLink,
    private: formObject["type"] === 'private' ? true : false,
    published_at: new Date(),
  }

  if (isPromoted) {
    newPost.promoted = true
    newPost.starting_date = startingDate.value
    newPost.ending_date = endingDate.value
    openPromotePayment()
  }

  // Save post
  const postStore = usePostsStore()
  const post = await postStore.addPost(newPost, tags, showcase.value)
  if (post) {
    emit('newPostCreated', {
      ...post,
      profiles: { username: authStore.user.username, pdp: authStore.user.pdp },
      comments: [],
      usersIdsWhoLiked: [],
      usersIdsWhoBookmarked: [],
      tags: tags.map(tag => ({ name: tag })),
      showcasePreview: showcase.value
    })
  }

  // Reset form datas
  description.value = ''
  link.value = ''
  type.value = 'public'
  selectedTags.value = []
  errors.value = []

  authStore.action = null
  showcase.value = ''
  startingDate.value = null
  endingDate.value = null
}

const openPromotePayment = async (plan) => {
  // Retrieve customer_id
  const { data, error } = await supabase
    .from('stripe_customers')
    .select('customer_id')
    .eq('user_id', authStore.user.userId)
    .single()

  if (!error) {
    axios.post(`http://localhost:3000/promote-payment`, {
      customer_id: data.customer_id
    })
    .then(async function (response) {
      window.open(response.data.url, '_blank')
    })
  }
}

const datasIsValid = computed(() => {
  const maxLength = 280
  if (link.value) {
    const linkRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
    if (!link.value.match(linkRegex)) return false
  }
  return description.value.length <= maxLength
})

const preview = () => {
  const postStore = usePostsStore()
  const posts = postStore.fakePosts
  const formObject = getFormObject()
  // Get the tags
  let tags = []
  for (let i = 0; i < limit.value; i++) {
    if (formObject[`tag_${i}`]) {
      tags.push({ name: formObject[`tag_${i}`]})
    }
  }

  postsToPreview.value = [posts[0], {
    ...authStore.user,
    profiles: {
      username: authStore.user.username,
      certified: authStore.user.certified,
      pdp: authStore.user.pdp,
    },
    user_id: authStore.user.userId,
    description: description.value,
    link: link.value,
    promoted: true,
    showcasePreview: showcase.value,
    tags,
    published_at: new Date(),
    deleted_at: null,
    usersIdsWhoLiked: [],
    usersIdsWhoBookmarked: [],
    comments: []
  }, posts[1]]
  document.getElementById('preview-content').checked = true
}
</script>
