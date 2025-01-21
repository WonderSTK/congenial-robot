<template>
  <div class="bg-base-100 rounded-box shadow-lg py-2 w-full">
    <h2 class="text-lg font-bold mb-4 px-4">Trends for you</h2>
    <ul v-if="trends.length">
      <li v-for="(trend) in visibleTrends" :key="trend.tag_id" class="py-2 px-4 hover:bg-base-200 group">
        <router-link :to="`/explore?s=${trend.name}`" class="flex flex-col gap-1">
          <div class="badge badge-ghost whitespace-nowrap hover:cursor-pointer group-hover:invert">
            {{ trend.name }}
          </div>
          <span class="text-sm font-extralight ml-1">{{ formatNumberWithAbbreviation(trend.count) }} posts</span>
        </router-link>
      </li>
      <li class="mt-4 text-accent hover:text-accent-focus">
        <router-link to="/explore?showMore=true" v-if="!showMore" class="flex px-4 hover:underline">See more</router-link>
      </li>
    </ul>
    <p v-else class="px-4 mb-4 italic">No trends currently available</p>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue"
import { supabase } from '@/utils/supabase'

const props = defineProps({
  showMore: {
    type: Boolean,
    default: false
  }
})

const trends = ref([])

onMounted(async () => {
  const { data: topTen } = await supabase
    .from('trends_tags')
    .select('*')
  trends.value = topTen
})

const visibleTrends = computed(() => props.showMore ? trends.value : trends.value.slice(0, 3))

const formatNumberWithAbbreviation = (number) => {
  const abbreviations = ['', 'K', 'M', 'B', 'T']
  const min = number < 1000
  let magnitude = 0

  while (number >= 1000) {
    number /= 1000
    magnitude++
  }

  return (min ? number : number.toFixed(1)) + abbreviations[magnitude]
}
</script>
