<template>
  <div class="collapse collapse-arrow bg-base-100 rounded-box">
    <input type="checkbox" class="peer" />
    <div class="collapse-title text-xl font-medium">
        <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium">{{ title }}</h2>
        <div v-if="total" class="flex items-center gap-2">
          <span>{{ done }}/{{ total }}</span>
          <ProgressBar :tasks="tasks" class="w-10"/>
        </div>
      </div>
    </div>
    <div class="collapse-content">
      <div ref="sortableList" class="flex flex-col gap-2 mb-2 flex-1 todolist" :data-list="title">
        <TodoItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @delete="deleteItem"
        />
      </div>
      <form @submit.prevent="addItem" class="mt-auto">
        <div class="input-group">
          <input v-model="newItem" type="text" placeholder="Add task" class="input input-bordered h-8 w-full" required/>
          <button class="btn btn-square h-8 w-8 min-h-0">
            <i class="fa-solid fa-circle-plus"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, computed, onMounted, inject } from 'vue'
import Sortable from 'sortablejs'

const ProgressBar = defineAsyncComponent(() => import ("@/components/Todo/ProgressBar.vue"))
const TodoItem = defineAsyncComponent(() => import ("@/components/Todo/TodoItem.vue"))

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  },
})

const emit = defineEmits(['moveItem'])

const total = computed(() => {
  return props.tasks.length
})
const done = computed(() => {
  return props.tasks.filter(item => item.isDone).length
})

const newItem = ref('')

const addItem = () => {
  if (newItem.value.trim() === '') return
  const item = {
    id: Date.now(),
    title: newItem.value.trim(),
    isDone: false,
    description: null
  }
  props.tasks.push(item)
  newItem.value = ''
}

const deleteItem = (itemId) => {
  const index = props.tasks.findIndex(item => item.id === itemId)
  props.tasks.splice(index, 1)
}

const sortableList = ref(null)
const isOnMobile = inject('isOnMobile')
const initSortableList = () => {
  new Sortable(sortableList.value, {
    group: 'shared',
    handle: isOnMobile ? '.handle' : '',
    animation: 150,
    easing: "cubic-bezier(1, 0, 0, 1)",
    onEnd: (evt) => {
      if (evt.newIndex !== evt.oldIndex && evt.to === evt.from) {
        const item = props.tasks.splice(evt.oldIndex, 1)[0]
        props.tasks.splice(evt.newIndex, 0, item)
      }
    },
    onAdd: (evt) => {
      emit('moveItem', {
        from: evt.from.getAttribute("data-list"),
        to: evt.to.getAttribute("data-list"),
        newIndex: evt.newIndex,
        oldIndex: evt.oldIndex,
      })
    },
  })
}

onMounted(() => {
  initSortableList()
})
</script>

<style scoped>
.sortable-chosen {
  cursor: grabbing;
}
.todolist {
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 250px;
}
</style>
