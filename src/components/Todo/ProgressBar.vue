<template>
  <div class="relative h-2 rounded-sm bg-gray-200">
    <div :style="{width: progressWidth}" class="h-full rounded-sm transition-all duration-300 ease-out bg-accent"></div>
  </div>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  }
})

const progressWidth = computed(() => {
  const completedTasks = props.tasks.filter((task) => task.isDone).length
  const totalTasks = props.tasks.length
  const progressPercent = (completedTasks / totalTasks) * 100
  return `${progressPercent}%`
})
</script>
