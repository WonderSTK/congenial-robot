<template>
  <ProfileDetails />
  <div class="grid gap-4 mt-4 md:grid-cols-2 pb-2">
    <ChangePassword />
    <DeleteAccount v-if="authStore.myPlan.canDeactivateAccount" />
    <PrivacyPolicy />
    <AboutUs />
    <Terms />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
const ProfileDetails = defineAsyncComponent(() => import ('./ProfileDetails.vue'))
const ChangePassword = defineAsyncComponent(() => import ('./ChangePassword.vue'))
const PrivacyPolicy = defineAsyncComponent(() => import ('./PrivacyPolicy.vue'))
const DeleteAccount = defineAsyncComponent(() => import ('./DeleteAccount.vue'))
const AboutUs = defineAsyncComponent(() => import ('./AboutUs.vue'))
const Terms = defineAsyncComponent(() => import ('./Terms.vue'))
</script>
