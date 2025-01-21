<template>
  <header class="navbar bg-base-100 sticky top-0 flex justify-between gap-4">
    <div class="avatar mobile-nav">
      <div class="w-12 rounded-full">
        <img :src="authStore.getPdpLink()" :alt="authStore.getUsername() + ' avatar'" class="w-12 h-12 rounded-full"/>
      </div>

      <input v-if="authStore.user" v-model="isOpen" type="checkbox" class="absolute opacity-0 cursor-pointer w-12 h-12">

      <span v-if="authStore.user" id="swipeableEl" @click="isOpen = false" class="mobile-nav-background fixed z-10 top-0 left-0 bottom-0 w-full bg-black hidden opacity-0 h-full"></span>
      <MobileNav v-if="authStore.user" class="mobile-nav-content fixed z-10 top-0 -left-full bottom-0 h-full"/>

    </div>
    <SearchBar v-if="authStore.user" />
  </header>
</template>

<script setup>
import { defineAsyncComponent, ref, inject, onMounted } from "vue"
import "@/assets/hammer.js"

const SearchBar = defineAsyncComponent(() => import ("@/components/SearchBar.vue"))
const MobileNav = defineAsyncComponent(() => import ("@/components/Mobile/MobileNav.vue"))

const isOpen = ref(false)
const authStore = inject('authStore')

onMounted(() => {
  if(authStore.user) {
    const swipeableEl = document.body
    const hammer = Hammer(swipeableEl)
    hammer.on('swipeleft', () => {
      isOpen.value = false
    })
    hammer.on('swiperight', () => {
      isOpen.value = true
    })
  }
})
</script>

<style scoped lang="scss">
.navbar {
  box-shadow: 0px 10px 10px #00000026;
}

.mobile-nav-background {
  transition: opacity .5s .5s;
}
.mobile-nav-content {
  transition: left .5s;
}
.mobile-nav input[type=checkbox]:checked {
  ~ .mobile-nav-content {
    left: 0;
  }
  ~ .mobile-nav-background {
    opacity: .5;
    display: block;
  }
}
</style>
