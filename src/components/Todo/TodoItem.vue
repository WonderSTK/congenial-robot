<template>
  <div class="bg-base-300 rounded-box">
    <div class="p-2" @click="isEditing = !isEditing">
      <div class="flex items-center gap-2">
        <input type="checkbox" v-model="task.isDone" class="checkbox checkbox-accent h-6 w-6" @click.stop/>

        <!-- Display mode -->
        <template v-if="!isEditing">
          <div class="text-lg truncate w-full" :class="task.isDone ? 'line-through' : ''">
            <span>{{ task.title }}</span>
          </div>
          <button @click.stop="onDelete" class="btn btn-square btn-error btn-outline h-8 w-8 min-h-0">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <div v-if="isOnMobile" class="handle flex items-center gap-2 md:hidden">
            <button class="btn btn-square btn-outline h-8 w-8 min-h-0">
              <i class="fa-solid fa-grip-horizontal"></i>
            </button>
          </div>
        </template>

        <!-- Edit mode -->
        <template v-else>
          <input @input="handleInput" v-model="task.title" type="text" class="h-8 w-full bg-base-300 resize-none outline-none text-lg" @click.stop/>
          <button @click.stop="authStore.object = task; authStore.action = 'maximize-content'" class="btn btn-square btn-outline h-8 w-8 min-h-0">
            <i class="fa-solid fa-maximize"></i>
          </button>
          <button @click.stop="isEditing = !isEditing" class="btn btn-square btn-outline h-8 w-8 min-h-0">
            <i class="fa-solid fa-arrow-up"></i>
          </button>
        </template>
      </div>
    </div>
    <div class="collapse-content" :class="isEditing ? 'collapse-show' : ''">
      <MyTextarea v-model="task.description" blockedAtLimit :maxChars="5000" placeholder="Content..." :additionalClass="'bg-base-300 mt-1 resize-none border-none h-[120px] w-full'" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const MyTextarea = defineAsyncComponent(() => import('@/components/Inputs/MyTextarea.vue'))

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])

const isEditing = ref(false)

const onDelete = () => {
  const taskId = props.task.id
  emit('delete', taskId)
}

const handleInput = (event) => {
  if (props.task.title.length > 30) {
    props.task.title = props.task.title.slice(0, 30)
  }
}
</script>

<style scoped>
.collapse-show {
  padding-bottom: 1rem;
  transition: padding 0.2s ease-in-out, background-color 0.2s ease-in-out;
  max-height: none;
}
</style>
