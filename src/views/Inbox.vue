<template>
  <ChatContainer
    :current-user-id="`${authStore.user.userId}`"
    :is-device="isDevice"
  />
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted } from 'vue'

const ChatContainer = defineAsyncComponent(() => import('@/components/ChatContainer.vue'))

const isDevice = ref(false)
onMounted(() => {
  isDevice.value = window.innerWidth < 500
  window.addEventListener('resize', ev => {
    if (ev.isTrusted) isDevice.value = window.innerWidth < 500
  })
})
</script>
