<template>
  <div class="flex w-full items-center justify-center gap-2">
    <!-- Settings -->
    <router-link to="/settings" active-class="active" class="btn btn-square">
      <i class="fa-solid fa-gear"></i>
    </router-link>

    <!-- Notifications -->
    <router-link to="/notifications" active-class="active" class="btn btn-square">
      <div class="relative">
        <span v-if="authStore.user && authStore.user.reactions_not_seen" class="absolute bg-secondary -right-3 -top-3 scale-90 rounded-full w-5 h-5 text-secondary-content text-[.55rem] leading-5">
          {{ formatNumberNotif(authStore.user.reactions_not_seen) }}
        </span>
        <i class="fa-solid fa-bell"></i>
      </div>
    </router-link>

    <!-- Inbox -->
    <router-link to="/inbox" active-class="active" class="btn gap-2">
      <div class="relative">
        <span v-if="authStore.user && unread_messages" class="absolute bg-secondary -right-3 -top-3 scale-90 rounded-full w-5 h-5 text-secondary-content text-[.55rem] leading-5">
          {{ formatNumberNotif(unread_messages) }}
        </span>
        <i class="fa-solid fa-envelope"></i>
        Inbox
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { useUnreadMessages } from '@/modules/unreadMessagesModule.js'
const { unread_messages } = useUnreadMessages()
import { formatNumberNotif } from '@/utils/notif'
</script>
