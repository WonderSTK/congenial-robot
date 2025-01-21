<template>
  <div class="select-text flex flex-col pr-6 ml-6 pl-6">
    <div class="avatar absolute -left-6 hover:brightness-90">
      <div class="w-12 rounded-full ring ring-4 ring-base-300">
        <img src="/guest.png" alt="Unknow user" />
      </div>
    </div>
    <div class="flex items-baseline gap-1 font-bold hover:underline w-fit">
      Unknow user
    </div>
    <div class="text-xs font-extralight cursor-text">{{ new Date(comment.deleted_at).toDateString() }}</div>
    <p class="mt-4 pr-4 cursor-text break-words font-extralight">
      <i v-if="authStore.user.userId !== comment.user_id">This comment has been deleted.</i>
      <i v-else class="text-warning">You have deleted this comment.</i>
    </p>
  </div>
  <!-- Actions -->
  <Actions v-if="authStore.user.userId === comment.user_id" class="absolute right-6 top-0 z-10" :post="comment" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const Actions = defineAsyncComponent(() => import('@/components/Actions.vue'))

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  }
})
</script>
