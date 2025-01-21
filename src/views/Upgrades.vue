<template>
  <section>
    <!-- Actual plan -->
    <h2 v-if="authStore.myPlan" class="mb-4 text-xl tracking-tight font-extrabold">Actual active plan</h2>
    <div v-if="authStore.myPlan" class="flex md:grid grid-cols-2 flex-wrap gap-6 justify-between bg-base-100 rounded-box shadow-lg mb-6 p-6">
      <ul class="text-sm text-left">
        <li v-for="(feature, index) of authStore.myPlan.features" :key="index" class="mb-2 flex items-center gap-2">
          <template v-if="feature.unlock">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            <span>{{ feature.content }}</span>
          </template>
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-500 xmark" fill="currentColor" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            <s>{{ feature.content }}</s>
          </template>
        </li>
      </ul>
      <div class="flex flex-col gap-2 text-left">
        <div>
          <h3 class="text-2xl font-semibold">{{ authStore.myPlan.title }}</h3>
          <p class="font-extralight">{{ authStore.myPlan.description }}</p>
        </div>
        <div class="flex ml-auto items-baseline">
          <div class="mr-2 text-5xl font-extrabold">${{ authStore.myPlan.billing_type ? (authStore.myPlan.costs[authStore.myPlan.billing_type]) : 0 }}</div>
          <div>/{{ authStore.myPlan?.billing_type || billedType }}</div>
        </div>
        <p class="ml-auto" v-html="endingAt()" />
      </div>
    </div>
    <!-- Other plans -->
    <div class="mx-auto max-w-screen-xl">
        <div class="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold">Choose the perfect plan for you</h2>
          <p class="mb-5 font-extralight sm:text-xl">Select the one that best suits you according to your needs</p>
        </div>
        <div @change="changeBilled" class="flex items-center w-full justify-center mb-4 gap-2">
          Month
          <input type="checkbox" class="toggle toggle-primary" />
          Year
        </div>
        <div class="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0 p-2">
          <PricingCard v-for="(plan, index) of otherPlans" :key="index" :plan="plan" :myPlanId="authStore.myPlan ? authStore.myPlan.plan_id : 1" :billedType="billedType" />
        </div>
    </div>
  </section>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, inject } from 'vue'

const PricingCard = defineAsyncComponent(() => import('@/components/Upgrade/PricingCard.vue'))

import { useUpgradesPlanStore } from "@/stores/upgradesPlan"
const upgradesPlanStore = useUpgradesPlanStore()
const plans = upgradesPlanStore.plans

const authStore = inject('authStore')

const endingAt = () => {
  if (!authStore.myPlan.ending_at) return
  // format ISO 8601 (ex : "2023-11-15T14:30:00Z")
  const endingAt = new Date(authStore.myPlan.ending_at)
  const currentDate = new Date()

  const differenceInMilliseconds = endingAt - currentDate
  const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24))

  if (differenceInDays > 7) {
    return `Ends in ${differenceInDays} days`
  } else if (differenceInDays > 3 ) {
    return `<b class='text-warning'>Ends in ${differenceInDays} days</b>`
  } else if (differenceInDays > 0 ) {
    return `<b class='text-error'>Ends in ${differenceInDays} days</b>`
  } else if (differenceInDays === 0) {
    return "<b class='text-error'>Ends today</b>"
  } else {
    return "<b class='text-error'>Ending</b>"
  }
}

const otherPlans = computed(() => {
  const plansCopy = [...plans]
  if (!authStore.myPlan) return plansCopy

  const actualPlanIndex = plans.findIndex(p => p.id === authStore.myPlan.plan_id)
  plansCopy.splice(actualPlanIndex, 1)
  return plansCopy
})

const billedType = ref('month')
function changeBilled() {
  billedType.value = billedType.value === 'month' ? 'year' : 'month'
}
</script>
