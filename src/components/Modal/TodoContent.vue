<template>
  <!-- Maximize TODO content -->
  <Teleport v-if="authStore.action === 'maximize-content'" to="#modal-container">
    <input type="checkbox" id="maximize-content" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="maximize-content" class="modal modal-open cursor-pointer">
      <label class="modal-box relative pt-0" for="">
        <label for="maximize-content" class="btn btn-sm btn-circle sticky top-4 left-full z-20">✕</label>
        <div class="flex items-center gap-2 mb-2">
          <input type="checkbox" v-model="authStore.object.isDone" class="checkbox checkbox-accent h-6 w-6" @click.stop/>
          <input @input="handleInput(authStore)" v-model="authStore.object.title" type="text" class="h-8 w-full bg-base-100 resize-none outline-none text-lg font-bold mr-12" @click.stop/>
        </div>
        <MyTextarea v-model="authStore.object.description" blockedAtLimit :maxChars="5000" placeholder="Content..." :additionalClass="'bg-base-300 mt-1 resize-none h-auto min-h-[500px] border-none w-full'" />
      </label>
    </label>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const MyTextarea = defineAsyncComponent(() => import('@/components/Inputs/MyTextarea.vue'))

const handleInput = (authStore) => {
  if (authStore.object.title.length > 30) {
    authStore.object.title = authStore.object.title.slice(0, 30)
  }
}
</script>
