<template>
  <nav class="bg-base-100 p-4 flex flex-col shadow-lg w-5/6">

    <div class="flex flex-col gap-2 p-4">
      <div class="flex justify-between">
        <router-link :to="authStore.getProfileLink()" active-class="ring ring-primary ring-offset-base-100 ring-offset-2" class="w-12 h-12 rounded-full hover:brightness-90">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img :src="authStore.getPdpLink()" :alt="authStore.getUsername() + ' avatar'"/>
            </div>
          </div>
        </router-link>
        <!-- Log out -->
        <button v-if="authStore.user" @click="authStore.logout()" class="btn btn-square">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      <router-link :to="authStore.getProfileLink()" class="flex gap-1 items-center text-md font-bold hover:underline">{{ authStore.getUsername() }} <img v-if="authStore.user && authStore.user.certified" class="rem7" src="/src/assets/certificate.svg" alt="certificate icon" /></router-link>
      <div class="flex gap-2">
        <div><span class="font-extralight">{{ authStore.getFollowing().count }}</span> Following</div>
        <div><span class="font-extralight">{{ authStore.getFollowers().count }}</span> Followers</div>
      </div>
    </div>

    <div class="divider"></div>

    <ul class="menu">

      <!-- Profile -->
      <li>
        <router-link to="/explore" active-class="active">
          <i class="fa-solid fa-hashtag"></i>
          Explore
        </router-link>
      </li>

      <!-- My RSS -->
      <li>
        <router-link to="/rss" active-class="active">
          <i class="fa-solid fa-rss"></i>
          <p>My RSS</p>
        </router-link>
      </li>

      <!-- Read Later -->
      <li>
        <router-link to="/read-later" active-class="active">
          <i class="fa-solid fa-clock"></i>
          <p>Read Later</p>
        </router-link>
      </li>

      <!-- Notifications -->
      <li>
        <router-link to="/notifications" active-class="active">
          <i class="fa-solid fa-bell"></i>
          <p>Notifications</p>
          <div v-if="authStore.user && authStore.user.reactions_not_seen" class="badge badge-secondary">{{ formatNumberNotif(authStore.user.reactions_not_seen) }}</div>
        </router-link>
      </li>

      <!-- Weekly -->
      <li>
        <router-link to="/weekly-planner" active-class="active">
          <i class="fa-solid fa-calendar-week"></i>
          <p>Weekly Planner</p>
        </router-link>
      </li>

      <div class="divider"></div> 

      <!-- Settings -->
      <li>
        <router-link to="/settings" active-class="active">
          <i class="fa-solid fa-gear"></i>
          Settings
        </router-link>
      </li>

      <!-- Upgrade -->
      <li>
        <router-link to="/upgrades" active-class="active">
          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.63099 15.4125L4.96224 18.225C4.75599 18.3563 4.54036 18.4125 4.31536 18.3937C4.09036 18.375 3.89349 18.3 3.72474 18.1688C3.55599 18.0375 3.42474 17.8733 3.33099 17.676C3.23724 17.4788 3.21849 17.2586 3.27474 17.0156L4.51224 11.7L0.37786 8.12813C0.19036 7.95938 0.0733603 7.767 0.0268603 7.551C-0.0196397 7.335 -0.0057648 7.12425 0.0684852 6.91875C0.143485 6.7125 0.255985 6.54375 0.405985 6.4125C0.555985 6.28125 0.762235 6.19688 1.02474 6.15938L6.48099 5.68125L8.59036 0.675C8.68411 0.45 8.82961 0.28125 9.02686 0.16875C9.22411 0.0562501 9.42549 0 9.63099 0C9.83724 0 10.0386 0.0562501 10.2351 0.16875C10.4316 0.28125 10.5771 0.45 10.6716 0.675L12.781 5.68125L18.2372 6.15938C18.4997 6.19688 18.706 6.28125 18.856 6.4125C19.006 6.54375 19.1185 6.7125 19.1935 6.91875C19.2685 7.125 19.2827 7.33613 19.2362 7.55213C19.1897 7.76813 19.0724 7.96013 18.8841 8.12813L14.7497 11.7L15.9872 17.0156C16.0435 17.2594 16.0247 17.4799 15.931 17.6771C15.8372 17.8744 15.706 18.0383 15.5372 18.1688C15.3685 18.3 15.1716 18.375 14.9466 18.3937C14.7216 18.4125 14.506 18.3563 14.2997 18.225L9.63099 15.4125Z" fill="currentColor"/>
          </svg>
          <p>Upgrades</p>
        </router-link>
      </li>
    </ul>

    <div class="bg-gradient-to-r from-base-100 w-full h-20 absolute bottom-0 left-0">
      <SwitchTheme class="absolute bottom-8 left-8"/>
    </div>
  </nav>
</template>

<script setup>
import { defineAsyncComponent } from "vue"
const SwitchTheme = defineAsyncComponent(() => import ("@/components/SwitchTheme.vue"))
import { formatNumberNotif } from '@/utils/notif'
</script>

<style scoped>
.rem7 {
  width: .7rem !important;
  height: .7rem !important;
}
</style>
