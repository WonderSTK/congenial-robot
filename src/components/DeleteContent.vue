<template>
  <div class="select-text card-body group rounded-box">
    <div class="flex items-center gap-4">
      <div class="avatar">
        <div class="w-12 rounded-full">
          <img src="/guest.png" alt="Unknow user" />
        </div>
      </div>
      <div>
        <div class="flex items-baseline gap-1 font-bold hover:underline w-fit">
          Unknow user
        </div>
        <div class="cursor-text text-xs font-extralight">{{ new Date(post.deleted_at).toDateString() }}</div>
      </div>
    </div>

    <div class="flex flex-col gap-4 mt-4">
      <p class="mt-4 pr-4 cursor-text break-words font-extralight">
        <i v-if="authStore.user.userId !== post.user_id">This post has been deleted.</i>
        <i v-else class="text-warning">You have deleted this post.</i>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  }
})
</script>
