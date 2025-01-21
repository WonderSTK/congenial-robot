<template>
  <div class="btm-nav shadow-lg shadow-inner">
    <router-link to="/" active-class="active" class="text-primary">
      <i class="fa-solid fa-house"></i>
    </router-link>
    <router-link to="/bookmark" active-class="active" class="text-primary">
      <svg width="20" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 18V2C0 1.45 0.196 0.979 0.588 0.587C0.98 0.195 1.45067 -0.000666876 2 -2.09555e-07H12C12.55 -2.09555e-07 13.021 0.196 13.413 0.588C13.805 0.98 14.0007 1.45067 14 2V18L7 15L0 18Z" fill="currentColor"/>
      </svg>
    </router-link>
    <router-link to="/today" active-class="active" class="text-primary">
      <i class="fa-solid fa-calendar-day"></i>
    </router-link>
    <router-link to="/inbox" active-class="active" class="text-primary">
      <div class="relative">
        <span v-if="authStore.user && unread_messages" class="absolute bg-secondary -right-3 -top-3 scale-90 rounded-full w-5 h-5 text-secondary-content text-center text-[.55rem] leading-5">
          {{ formatNumberNotif(unread_messages) }}
        </span>
        <i class="fa-solid fa-envelope"></i>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { useUnreadMessages } from '@/modules/unreadMessagesModule.js'
const { unread_messages } = useUnreadMessages()
import { formatNumberNotif } from '@/utils/notif'
</script>

<style scoped>
.btm-nav {
  box-shadow: 0px 0px 10px #00000069;
}
</style>
