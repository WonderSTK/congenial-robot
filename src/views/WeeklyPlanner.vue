<template>
  <div class="flex flex-col w-full">
    <h1 class="text-3xl font-bold text-center">Weekly Planner</h1>
    <div class="grid flex-wrap gap-4 mt-4 pb-2 items-start">
      <TodoList
        ref="list"
        v-for="(day, index) in days" 
        :key="index"
        :title="day"
        :tasks="tasks[day]"
        :class="getDayName() === day ? 'border border-accent' : 'opacity-60'"
        @moveItem="moveItem"
      />
    </div>
  </div>

  <ModalTodoContent />
</template>

<script setup>
import { defineAsyncComponent, ref, onMounted, watch } from "vue"

const TodoList = defineAsyncComponent(() => import ("@/components/Todo/TodoList.vue"))
const ModalTodoContent = defineAsyncComponent(() => import ("@/components/Modal/TodoContent.vue"))

const days = ref(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
const tasks = ref({
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
})

onMounted(() => {
  loadTasks()
})

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

const loadTasks = () => {
  const tasksCached = JSON.parse(localStorage.getItem('tasks'))
  if (tasksCached) {
    tasks.value = tasksCached
  }
}

const getDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const day = new Date().getDay()
  return days[day]
}

const moveItem = (data) => {
  const item = tasks.value[data.from].splice(data.oldIndex, 1)[0]
  tasks.value[data.to].splice(data.newIndex, 0, item)
}

watch(() => tasks, () => {
  saveTasks()
}, { deep: true })
</script>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
}
</style>
