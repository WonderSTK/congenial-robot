<template>
  <SearchBar v-if="!isOnMobile" class="mb-4 lg:hidden" />
  <NewPost v-if="authStore.user" @newPostCreated="newPost = $event" />
  <Feed class="pb-2" :newPost="newPost" />
</template>

<script setup>
import { defineAsyncComponent, ref } from "vue"
const Feed = defineAsyncComponent(() => import ("@/components/Feed.vue"))
const NewPost = defineAsyncComponent(() => import ("@/components/NewPost.vue"))
const SearchBar = defineAsyncComponent(() => import ("@/components/SearchBar.vue"))

const newPost = ref(null)
</script>
