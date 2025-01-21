<template>
  <div v-for="comment of comments" :key="comment.id" class="mb-10 px-4">
    <ol class="relative ml-10 hover:bg-base-200" :class="comment.comments.length ? 'border-l border-l-4 border-base-300 pb-4' : ''">
      <DeletedComment v-if="comment.deleted_at" :comment="comment" />
      <Comment v-else :comment="comment" />
    </ol>
    <template v-for="(subcomment, index) of comment.comments.slice(0, comment.index)" :key="subcomment.id">
      <ol class="relative ml-10 hover:bg-base-200" :class="(index + 1) < comment.comments.length ? 'border-l border-l-4 border-base-300 pb-4' : ''">
        <DeletedComment v-if="subcomment.deleted_at" :comment="subcomment" />
        <Comment v-else :comment="subcomment" />
      </ol>

      <!-- See more comments -->
      <span
        v-if="comment.comments.length > 1 && comment.index !== comment.comments.length && (index + 1) === comment.index"
        @click.prevent="comment.index++"
        class="relative flex ml-11 pl-12 cursor-pointer"
      >
        <div class="absolute -left-3 py-1 bg-base-100">
          <svg class="w-5 h-5 text-base-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
            <path fill="currentColor" d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
          </svg>
        </div>
        <span class="flex-1 text-accent hover:text-accent-focus hover:underline">See more</span>
      </span>
    </template>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, watch } from 'vue'
import { usePostsStore } from '@/stores/postsStore'

const Comment = defineAsyncComponent(() => import ("@/components/Comment.vue"))
const DeletedComment = defineAsyncComponent(() => import ("@/components/DeletedComment.vue"))

const props = defineProps({
  comments: {
    type: Array,
    required: true
  }
})

const postStore = usePostsStore()
const comments = ref(props.comments)

watch(() => props.comments, (n, o) => {
  comments.value = props.comments
})
</script>
