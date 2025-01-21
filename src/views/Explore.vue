<template>
  <div class="flex flex-col gap-4 pb-2">
    <SearchBar v-if="!showMore && !isOnMobile" />
    <!-- Breadcrumb for return in back -->
    <div v-if="$route.query.s || showMore" class="text-sm breadcrumbs">
      <ul>
        <li><router-link to="/explore">Explore</router-link></li> 
        <li><router-link :to="$route.query.s ? `/explore?s=${$route.query.s}` : '/explore?showMore=true'">{{ $route.query.s || 'All trends' }}</router-link></li>
      </ul>
    </div>
    <div v-if="users && users.length" class="bg-base-100 rounded-box shadow-lg px-4 py-2 w-full">
      <UsersList title="Users" :users="users" :action="{ off: 'Unfollow', on: 'Follow' }" @action="authStore.follow($event)" :checked="(id) => authStore.getFollowing().ids.includes(id)" />
    </div>
    <Trends v-if="!$route.query.s" :showMore="showMore" />
    <Feed v-if="!showMore" :posts="posts" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, computed, onMounted, ref, watch } from "vue"
import { supabase } from '@/utils/supabase'

const SearchBar = defineAsyncComponent(() => import ("@/components/SearchBar.vue"))
const Trends = defineAsyncComponent(() => import ("@/components/Trends.vue"))
const Feed = defineAsyncComponent(() => import ("@/components/Feed.vue"))
const UsersList = defineAsyncComponent(() => import ("@/components/UsersList.vue"))

import { useRoute } from 'vue-router'
const route = useRoute()

import { usePostsStore } from "@/stores/postsStore"
const postStore = usePostsStore()

const posts = ref([])
const users = ref([])

onMounted(() => {
  targetLogic(route.query.s)
})

const loadTrendPosts = async () => {
  const { data: topTenPostsIds } = await supabase
    .from('top_10_posts')
    .select('post_id')
  posts.value = await postStore.retrievePosts({ postIds: topTenPostsIds.map(p => p.post_id) })
}

const search = async (query) => {
  // Search posts
  const { data: postsFind } = await supabase.rpc('search_posts', { keyword: query })
  posts.value = await postStore.retrievePosts({ postIds: postsFind.map(p => p.id ) })

  // Search users
  const { data: usersFind } = await supabase.rpc('search_users', { keyword: query })
  users.value = usersFind
}

const targetLogic = (searchVal) => {
  users.value = []
  posts.value = []
  if (searchVal) {
    const query = searchVal?.toLowerCase()
    search(query)
  } else {
    loadTrendPosts()
  }
}

watch(() => route.query.s, (newVal) => {
  targetLogic(newVal)  
})

const showMore = computed(() => {
  return route.query.showMore === "true"
})
</script>
