<template>
  <Teleport v-if="authStore.action === 'who-liked'" to="#modal-container">
    <!-- Modal users who liked -->
    <input type="checkbox" id="users-who-liked" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="users-who-liked" class="modal cursor-pointer">
      <label class="modal-box relative pt-0" for="">
        <label for="users-who-liked" class="btn btn-sm btn-circle sticky top-4 left-full z-20">✕</label>
        <UsersList title="Who liked" :users="usersWhoLiked" :action="{ off: 'Unfollow', on: 'Follow' }" @action="authStore.follow($event)" :checked="(id) => authStore.getFollowing().ids.includes(id)" />
        <p v-if="!usersWhoLiked.length" class="py-4">No one has liked this post yet</p>
      </label>
    </label>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref, inject, watch } from "vue"
import { supabase } from '@/utils/supabase'

const UsersList = defineAsyncComponent(() => import ("@/components/UsersList.vue"))

const usersWhoLiked = ref([])
const authStore = inject('authStore')

watch(() => authStore.action, async (newVal) => {
  if (newVal === 'who-liked') {
    const { data } = await supabase
      .from('profiles')
      .select()
      .in('user_id', authStore.currentPostSelected.usersIdsWhoLiked.map(u => u.user_id))
    usersWhoLiked.value = data
  }
})
</script>
