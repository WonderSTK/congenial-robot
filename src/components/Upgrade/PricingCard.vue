<template>
  <div class="flex flex-col p-6 mx-auto w-full max-w-lg text-center bg-base-100 rounded-box border shadow-lg" :class="myPlanId + 1 === plan.id ? 'border-primary' : 'border-neutral'">
    <h3 class="mb-4 text-2xl font-semibold">{{ plan.title }}</h3>
    <p class="mb-4 font-extralight sm:text-lg">{{ plan.description }}</p>
    <div class="mt-auto flex flex-col space-y-8">
      <div class="flex justify-center items-baseline">
        <span class="mr-2 text-5xl font-extrabold" :class="myPlanId + 1 === plan.id ? 'text-primary' : ''">{{ formatPrice(plan.costs[billedType]) }}</span>
        <span class="font-extralight">/{{ billedType }}</span>
      </div>
      <ul v-if="plan.features && plan.features.length > 0" role="list" class="space-y-4 text-left">
        <li v-for="(feature, index) of plan.features" :key="index" class="flex items-center gap-3">
          <template v-if="feature.unlock">
            <svg class="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
            <span>{{ feature.content }}</span>
          </template>
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 w-5 h-5 text-red-500 xmark" fill="currentColor" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            <s>{{ feature.content }}</s>
          </template>
        </li>
      </ul>
      <button @click.prevent="changePlan(plan)" class="btn btn-primary">Get started</button>
    </div>
  </div>
</template>

<script setup>
import { supabase } from '@/utils/supabase'
import axios from 'axios'
import { inject } from "vue"
const authStore = inject('authStore')

const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  billedType: {
    type: String,
    required: true
  },
  myPlanId: {
    type: Number,
    required: true,
  }
})

const formatPrice = (price) => {
  const currency = 'USD'
  const locale = 'en-US'
  return price.toLocaleString(locale, { style: 'currency', currency: currency })
}

const changePlan = async (plan) => {
  // Retrieve customer_id
  const { data, error } = await supabase
    .from('stripe_customers')
    .select('customer_id')
    .eq('user_id', authStore.user.userId)
    .single()

  if (!error) {
    axios.post(`http://localhost:3000/create-payment-link`, {
      customer_id: data.customer_id,
      priceId: plan[`price_id_${props.billedType}`]
    })
    .then(async function (response) {
      window.location.href = response.data.url
    })
  }
}
</script>

<style scoped>
.xmark {
  width: 20px;
  height: 20px;
}
</style>
