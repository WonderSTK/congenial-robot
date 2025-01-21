<template>
  <h2 class="text-lg font-bold mb-4 sticky top-0 z-10 bg-base-100/50 backdrop-blur-sm">{{ title }}</h2>
  <div v-for="user in users" :key="user.user_id" class="flex justify-between items-center my-4 gap-6">
    <div class="flex items-center gap-2">
      <router-link :to="'/profile/' + user.user_id" class="hover:brightness-90">
        <div class="avatar" :class="user.online ? 'online' : ''">
          <div class="w-12 rounded-full">
            <img :src="authStore.getPdpLink(user)" :alt="'Avatar ' + user.username" class="w-12 h-12 rounded-full">
          </div>
        </div>
      </router-link>
      <router-link :to="'/profile/' + user.user_id" class="hover:underline mb-2" :class="authStore.user?.userId === user.user_id ? 'text-primary' : ''">
        <h3 class="text-md font-bold">{{ user.username }}</h3>
      </router-link>
    </div>
    <UserButtonAction v-if="!authStore.user || authStore.user.userId !== user.user_id" :id="user.user_id" class="mb-2 btn-sm rounded-full" :action="action" @action="$emit('action', $event)" :checked="isChecked(user.user_id)" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, reactive, watch } from 'vue'
const UserButtonAction = defineAsyncComponent(() => import ("@/components/UserButtonAction.vue"))
const emit = defineEmits(['action'])

const props = defineProps({
  users: {
    type: Array,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  action: {
    type: Object,
    required: true,
  },
  checked: {
    type: [Boolean, Function],
  },
})

const isChecked = (id) => {
  if (typeof props.checked === 'function') {
    return props.checked(id)
  }
  return props.checked
}

const users = reactive(props.users)

watch(() => props.users, (newUsers) => {
  users.length = 0
  users.push(...newUsers)
})
</script>
