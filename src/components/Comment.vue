<template>
  <router-link draggable="false" :to="`/post/${comment.id}`" class="select-text flex flex-col pr-6 ml-6 pl-6">
    <router-link :to="'/profile/' + comment.user_id" class="absolute -left-6 hover:brightness-90">
      <div class="avatar">
        <div class="w-12 rounded-full ring ring-4 ring-base-300">
          <img :src="authStore.getPdpLink(comment.profiles)" :alt="'Avatar' + comment.profiles.username" />
        </div>
      </div>
    </router-link>
    <router-link :to="'/profile/' + comment.user_id" class="flex items-baseline gap-1 font-bold hover:underline w-fit">
      {{ comment.profiles.username }}
      <img v-if="comment.certified" src="/src/assets/certificate.svg" alt="certificate icon" />
    </router-link>
    <div @click.prevent class="text-xs font-extralight cursor-text">{{ new Date(comment.published_at).toDateString() }}</div>
    <EditView v-if="comment.onEdit" :post="comment" />
    <template v-else>
      <p @click.prevent class="mt-4 pr-4 cursor-text break-words">{{ comment.description }}</p>
      <div class="flex items-center gap-2 mr-auto mt-4">
        <ReactionButton @click.prevent="postStore.like(comment, authStore.user.userId)" :identifiant="`${comment.id}-like`" :checked="containsMyId(comment.usersIdsWhoLiked, authStore.user.userId)" :icon="'fa-heart'" :btnColor="'btn-error'" :number="comment.usersIdsWhoLiked?.length" />
        <ReactionButton :identifiant="`${comment.id}-comment`" :icon="'fa-comment'" :btnColor="'btn-ghost'" :number="comment.comments.length" />
      </div>
    </template>
  </router-link>
  <!-- Actions -->
  <Actions class="absolute right-6 top-0 z-10" :post="comment" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const ReactionButton = defineAsyncComponent(() => import('@/components/ReactionButton.vue'))
const Actions = defineAsyncComponent(() => import('@/components/Actions.vue'))
const EditView = defineAsyncComponent(() => import('@/components/EditView.vue'))

import { usePostsStore } from '@/stores/postsStore'
const postStore = usePostsStore()

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const containsMyId = (obj, userId) => {
  return obj.some(o => o.user_id === userId)
}
</script>
