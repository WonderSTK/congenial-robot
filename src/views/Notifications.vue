<template>
  <div class="p-6 border rounded-box shadow-lg border-base-100 bg-base-100">
    <a v-if="notifications.length" @click="archiveAll()" class="select-none ml-auto link text-accent opacity-60 hover:opacity-100">Clear all</a>
    <ol class="flex flex-col divide-y mt-2">
      <li v-for="(notification, index) of notifications" :key="index" class="px-2 py-4 rounded-lg hover:bg-base-200">
        <router-link :to="'/post/' + (notification.comment_id || notification.post_id)" class="flex items-start gap-4 group" @click="readNotification(notification)">
          <img class="w-12 h-12 rounded-full sm:mb-0" :class="notification.is_read ? 'opacity-30' : ''" :src="authStore.getPdpLink({pdp: notification.pdp })" :alt="'Avatar ' + notification.username" />
          <div :class="notification.is_read ? 'opacity-30' : ''">
            <div class="flex gap-1 text-base font-normal">
              <p class="font-semibold">
                {{ notification.username }}
                <span class="font-extralight">{{ notification.type }}</span>
                your
                <span class="font-extralight">post</span>
              </p>
            </div>
            <!-- <div v-if="notification.comment" class="text-sm font-extralight">"{{ notification.comment }}"</div> -->
            <span class="flex gap-1 mt-2 items-center text-xs font-extralight">
              <template v-if="notification.private">
                <svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"></path><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path></svg>
                Private
              </template>
              <template v-else>
                <svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"></path></svg>
                Public
              </template>
            </span>
          </div>
          <div class="tooltip tooltip-left tooltip-error ml-auto hidden group-hover:block" data-tip="Delete">
            <button @click.prevent.stop="archiveNotification(notification)" class="btn btn-circle btn-error">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </router-link>
      </li>
      <div v-if="!notifications.length">
        No notifications found or all is archived
      </div>
    </ol>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { supabase } from '@/utils/supabase'

const notifications = ref([])
const authStore = inject('authStore')

const loadNotifications = async () => {
  const { data, error } = await supabase.rpc('get_reactions_by_user', { authenticated_user_id: authStore.user.userId })
  if (!error) notifications.value = data
}

const readNotification = async (notif) => {
  await supabase
    .from('reactions')
    .update({ is_read: true })
    .eq('post_id', notif.post_id)
    .eq('user_id', notif.user_id)
}

const setNotifcationsAsSeen = async () => {
  const notSeen = notifications.value.filter(n => !n.is_see)
  if (notSeen.length) {
    const { error } = await supabase
      .from('reactions')
      .update({ is_see: true })
      .in('id', notSeen.map(n => n.id))
    if (!error) authStore.user.reactions_not_seen = 0
  }
}

const archiveNotification = async (notif) => {
  await supabase
    .from('reactions')
    .update({ archiving_date: new Date() })
    .eq('post_id', notif.post_id)
    .eq('user_id', notif.user_id)
  
  const index = notifications.value.findIndex(n => (n.user_id == notif.user_id) && (n.post_id == notif.post_id) && (n.type == notif.type))
  notifications.value.splice(index, 1)
}

const archiveAll = async () => {
  const { error } = await supabase
    .from('reactions')
    .update({ archiving_date: new Date() })
    .in('id', notifications.value.map(n => n.id))
  if (!error) notifications.value = []
}

onMounted(async () => {
  await loadNotifications()
  setNotifcationsAsSeen()
})
</script>
