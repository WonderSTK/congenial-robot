<template>
  <div class="grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
    <router-link :to="'/profile/' + user.user_id" v-for="user in users" :key="user.userId" class="bg-base-100 border rounded-lg shadow hover:brightness-90" :class="authStore.user.userId === user.user_id ? 'border-primary' : ''">
      <div class="flex flex-col items-center pb-10 pt-4">
        <img class="w-16 h-16 mb-3 rounded-full shadow-lg" :src="authStore.getPdpLink(user)" :alt="user.username + ' avatar'" />
        <h5 class="mb-1 font-medium">{{ user.username }}</h5>
        <div v-if="authStore.user.userId !== user.user_id" class="flex mt-4 space-x-3 md:mt-6">
          <UserButtonAction :id="user.user_id" class="btn-xs" :action="{ off: 'Unfollow', on: 'Follow' }" @action="authStore.follow($event)" :checked="authStore.getFollowing().ids.includes(user.user_id)" />
          <button @click.prevent.stop="createRoom(authStore.user, user, router)" class="btn btn-outline btn-xs">Message</button>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const UserButtonAction = defineAsyncComponent(() => import ("@/components/UserButtonAction.vue"))

import { createRoom } from '@/utils/chat'
import router from '@/router'

const props = defineProps({
  users: {
    type: Array,
    required: false
  },
})
</script>
