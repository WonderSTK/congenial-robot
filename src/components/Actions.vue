<template>
  <details v-if="(post.user_id === authStore.user.userId) || !post.deleted_at" class="dropdown dropdown-end absolute right-6 top-0 z-10">
    <summary tabindex="0" class="btn btn-xs btn-ghost">
      <i class="fa-solid fa-ellipsis fa-xl"></i>
    </summary>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 w-52 rounded-box gap-2">
      <template v-if="!post.deleted_at">
        <li v-if="post.user_id !== authStore.user.userId">
          <label @click="authStore.currentPostSelected = post; authStore.action = 'report'" for="report-content">
            <svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 19H22L11 0L0 19ZM12 16H10V14H12V16ZM12 12H10V8H12V12Z" fill="#FD2626"/>
            </svg>
            Report
          </label>
        </li>
        <li>
          <label @click="authStore.currentPostSelected = post; authStore.action = 'share'" for="share-content">
            <i class="fa-solid fa-share"></i>
            Share
          </label>
        </li>
        <li v-if="post.user_id === authStore.user.userId && !minutesElapsed(new Date(post.published_at), 5)">
          <button @click="post.onEdit = true">
            <i class="fa-solid fa-edit"></i>
            Edit
          </button>
        </li>
        <li v-if="post.user_id === authStore.user.userId && !post.promoted">
          <button @click="postStore.deletePost(post)" class="text-red-500">
            <i class="fa-solid fa-trash"></i>
            Delete
          </button>
        </li>
        <li v-if="post.user_id === authStore.user.userId && post.promoted">
          <button @click="postStore.deletePost(post)" class="text-red-500">
            <i class="fa-solid fa-ban"></i>
            Cancel promote
          </button>
        </li>
      </template>
      <template v-else>
        <li>
          <button @click="postStore.undeletePost(post)" class="text-warning">
            <i class="fa-solid fa-rotate-left"></i>
            Undelete
          </button>
        </li>
      </template>
    </ul>
  </details>
</template>

<script setup>
import { usePostsStore } from '@/stores/postsStore'
import { minutesElapsed } from '@/utils/dates'
const postStore = usePostsStore()

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>
