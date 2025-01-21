<template>
  <div class="flex px-8 gap-4 mb-10">
    <router-link :to="authStore.getProfileLink()" class="w-12 h-12 rounded-full hover:brightness-90">
      <div class="avatar">
        <div class="w-12 rounded-full">
          <img :src="authStore.getPdpLink()" :alt="authStore.getUsername() + ' avatar'"/>
        </div>
      </div>
    </router-link>
    <section class="flex flex-col flex-1 gap-2">
      <div v-if="showReplyBox" class="text-sm">
        In answer to
        <router-link :to="'/profile/' + post.user_id" class="text-info hover:underline">@{{ post.profiles.username }}</router-link>
      </div>
      <MyTextarea id="newComment" v-model="reply" @enter="submitReply" @focus="showReplyBox = true" @blur="!reply ? showReplyBox = false : ''" placeholder="Type your reply here" :additionalClass="'resize-none w-full ' + (showReplyBox ? 'textarea-primary h-auto pb-10' : 'h-1')"/>
      <button v-if="showReplyBox" @click="submitReply" :disabled="!reply.length || reply.length > 280" class="btn btn-primary justify-end mt-2 ml-auto h-8 min-h-0">Reply</button>
    </section>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, inject } from 'vue'
import { usePostsStore } from '@/stores/postsStore'

const MyTextarea = defineAsyncComponent(() => import('@/components/Inputs/MyTextarea.vue'))
const authStore = inject('authStore')

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const showReplyBox = ref(false)
const reply = ref('')

const submitReply = async () => {
  if (!reply.value.trim() || reply.length > 280) return

  const postStore = usePostsStore()
  const comment = {
    user_id: authStore.user.userId,
    parent_id: props.post.id,
    description: reply.value,
    published_at: new Date(),
  }

  const newComment = await postStore.addPost(comment)
  props.post.comments.unshift({
    ...newComment,
    profiles: { username: authStore.user.username, pdp: authStore.user.pdp },
    comments: [],
    usersIdsWhoLiked: []
  })

  reply.value = ''
  showReplyBox.value = false
}
</script>
