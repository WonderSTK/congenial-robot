<template>
  <div class="form-control w-full">
    <div class="input-group">
      <input type="text" placeholder="Search…" class="input input-bordered w-full" v-model="searchQuery" @keypress.enter="search" />
      <button name="search" @click="search" class="btn btn-square">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import { watch, ref } from 'vue'

const searchQuery = ref(router.currentRoute.value.query.s || '')

const search = () => {
  if (searchQuery.value) {
    router.push({ name: 'explore', query: { s: searchQuery.value } })
  } else {
    router.push('/explore')
  }
}

watch(() => router.currentRoute.value.query.s, (newValue) => {
  searchQuery.value = newValue || ''
})
</script>
