<template>
  <ProfileHeader v-if="user" :user="{ ...user, nbPosts: userPublicPosts.length, isAuthUser }" />
  <AboutCard v-if="route.params.tab === 'about'" :user="user" class="mt-4" />
  <UsersGrid v-if="route.params.tab === 'followers' || route.params.tab === 'following'" :users="usersToShow" class="mt-4" />
  <Feed class="mt-4 pb-2" :posts="postsToShow || []" />
</template>

<script setup>
import { defineAsyncComponent, reactive, computed, inject, ref, watch, onBeforeMount } from "vue"
import { supabase } from '@/utils/supabase'

import { useRoute } from 'vue-router'
import router from '@/router'

const Feed = defineAsyncComponent(() => import ("@/components/Feed.vue"))
const ProfileHeader = defineAsyncComponent(() => import ("@/components/ProfileHeader.vue"))
const AboutCard = defineAsyncComponent(() => import ("@/components/AboutCard.vue"))
const UsersGrid = defineAsyncComponent(() => import ("@/components/UsersGrid.vue"))

import { usePostsStore } from "@/stores/postsStore"
const postStore = usePostsStore()
const authStore = inject('authStore')

const route = useRoute()
const paramId = ref(route.params.id)
const authUser = authStore.user

const isAuthUser = computed(() => {
  return paramId.value === authUser.userId
})

const userPublicPosts = ref([])
const loadPublicPosts = async () => {
  userPublicPosts.value = await postStore.retrievePosts({ userId: paramId.value })
}

const userPrivatePosts = ref(null)
const loadPrivatePosts = async () => {
  userPrivatePosts.value = await postStore.retrievePosts({ userId: paramId.value, isPrivate: true })
}

const userReplies = ref(null)
const loadReplies = async () => {
  userReplies.value = await postStore.retrievePosts({ userId: paramId.value, isComment: true })
}

const userPromoted = ref(null)
const loadPromoted = async () => {
  userPromoted.value = await postStore.retrievePosts({ userId: paramId.value, isPromoted: true })
}

const user = ref(null)
const loadUser = async () => {
  if (isAuthUser.value) {
    user.value = authUser
    return
  }
  const profile = await authStore.getUserInfos(paramId.value)
  user.value = { ...profile, userId: paramId.value }
}

onBeforeMount(() => {
  loadUser()
  loadPublicPosts()
})

const postsToShow = computed(() => {
  switch (route.params.tab) {
    case 'followers':
      loadUsers(user.value?.followers.map(f => f.user_id))
      return []
    case 'following':
      loadUsers(user.value?.following.map(f => f.user_follow_id))
      return []
    case 'about':
      return []
    case 'replies':
      if (!userReplies.value) loadReplies()
      return userReplies.value
    case 'private':
      if (!isAuthUser.value) return null
      if (!userPrivatePosts.value) loadPrivatePosts()
      return userPrivatePosts.value
    case 'promoted':
      if (!isAuthUser.value) return null
      if (!userPromoted.value) loadPromoted()
      return userPromoted.value
    default:
      return userPublicPosts.value
  }
})

const usersToShow = ref([])
const loadUsers = async (ids) => {
  const { data: users } = await supabase
    .from('profiles')
    .select('user_id, username, pdp')
    .in('user_id', ids)
  usersToShow.value = users
}

watch(() => route.params.id, (newVal) => {
  paramId.value = newVal
  user.value = null
  usersToShow.value = []
  userPrivatePosts.value = null
  userReplies.value = null
  if (newVal) {
    loadUser()
    loadPublicPosts()
  }
})
</script>
