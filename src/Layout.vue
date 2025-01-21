<template>
  <MobileHeader v-if="isOnMobile" class="z-50"/>
  <div id="layout" ref="virtualScrollList" class="gap-[1vw] flex flex-row w-full bg-base-300" :class="isOnMobile ? '' : 'h-screen overflow-y-auto'">
    <div v-if="!isOnMobile" class="xl:w-1/5 w-24 p-2 h-full sticky top-0 z-10">
      <NavigationBar class="h-full" />
    </div>
    <div class="w-1/2 flex-1 p-2" :class="isOnMobile ? 'pb-[5rem] min-h-[90vh]' : ''">
      <router-view></router-view>
    </div>
    <div v-if="!isOnMobile && rightSideBar" class="w-1/4 p-2 hidden lg:flex flex-col justify-between min-w-min sticky top-0 z-10">
      <SearchBar v-if="showTrends" class="mb-4" />
      <div class="flex flex-col w-full h-full items-center gap-4 mb-4 max-h-full overflow-x-hidden overflow-y-auto">
        <Trends v-if="showTrends" />
        <div v-if="suggestions && suggestions.length" class="bg-base-100 rounded-box shadow-lg px-4 py-2 w-full">
          <UsersList title="Who to follow" :users="suggestions" :action="{ off: 'Unfollow', on: 'Follow' }" @action="authStore.follow($event)" :checked="(id) => authStore.getFollowing().ids.includes(id)" />
        </div>
      </div>
      <Footer />
    </div>
  </div>
  <MobileTab v-if="isOnMobile && authStore.user" class="z-20"/>

  <RegistrationBanner v-if="!authStore.user" />
</template>

<script setup>
import { defineAsyncComponent, ref, inject } from "vue"
import { supabase } from '@/utils/supabase'

// Initialize scrollEnd event
import { useInfiniteScroll } from '@vueuse/core'
const virtualScrollList = ref(null)
const count = ref(0)
const globalData = inject('globalData')
useInfiniteScroll(
  virtualScrollList,
  () => {
    count.value += 1
    globalData.scrollEndTriggered = count.value
  },
  { distance: 100 }
)

const NavigationBar = defineAsyncComponent(() => import ("@/components/NavigationBar.vue"))
const MobileTab = defineAsyncComponent(() => import ("@/components/Mobile/MobileTab.vue"))
const MobileHeader = defineAsyncComponent(() => import ("@/components/Mobile/MobileHeader.vue"))
const SearchBar = defineAsyncComponent(() => import ("@/components/SearchBar.vue"))
const UsersList = defineAsyncComponent(() => import ("@/components/UsersList.vue"))
const Footer = defineAsyncComponent(() => import ("@/components/Footer.vue"))
const Trends = defineAsyncComponent(() => import ("@/components/Trends.vue"))
const RegistrationBanner = defineAsyncComponent(() => import ("@/components/Banner/RegistrationBanner.vue"))

const props = defineProps({
  rightSideBar: {
    type: Boolean,
    default: true
  },
  showTrends: {
    type: Boolean,
    default: true
  },
})

const isOnMobile = inject('isOnMobile')
const suggestions = ref([])
if (!isOnMobile && props.rightSideBar) {
  const loadSuggestions = async () => {
    const authStore = inject('authStore')
    const fakeUUID = '123e4567-e89b-12d3-a456-426655440000'
    const { data: randomSuggested } = await supabase.rpc('get_random_profiles2', { authenticated_user_id: authStore.user?.userId || fakeUUID })
    suggestions.value = randomSuggested
  }
  loadSuggestions()
}
</script>
