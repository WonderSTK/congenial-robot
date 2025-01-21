<template>
  <div class="card rounded-box shadow-lg bg-base-100">
    <div class="card-body">
      <MyTextarea v-if="canEdit" v-model="user.description" id="userDescription" :additionalClass="'resize-none h-[200px] textarea-accent w-full'" />
      <p v-else class="mb-2">{{ user.description || 'No description yet.' }}</p>
      <label v-if="user.userId === authStore.user.userId" class="swap btn btn-ghost btn-active ml-auto">
        <input type="checkbox" v-model="canEdit" @change="() => { if(!canEdit) updateDescription() }" />
        <div class="swap-on"><i class="fa-solid fa-check"></i></div>
        <div class="swap-off"><i class="fa-regular fa-pen-to-square"></i></div>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from "vue"
import { supabase } from '@/utils/supabase'

const MyTextarea = defineAsyncComponent(() => import('@/components/Inputs/MyTextarea.vue'))
const canEdit = ref(false)

const props = defineProps({
  user: {
    type: Object,
    required: true,
  }
})

const updateDescription = async() => {
  await supabase
    .from('profiles')
    .update({ description: props.user.description })
    .eq('user_id', props.user.userId)
}
</script>
