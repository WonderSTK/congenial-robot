<template>
  <Teleport v-if="authStore.action === 'report'" to="#modal-container">
    <input ref="reportModal" type="checkbox" id="report-content" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <div class="modal">
      <label class="modal-box relative" for="">
        <label for="report-content" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Report Content</h3>
        <form @submit.prevent class="flex flex-col gap-4">
          <div class="relative mt-2">
            <ul class="menu bg-base-100 w-full gap-2" :class="reportType ? 'hidden' : ''">
              <p>Help us understand. What's wrong with this Post?</p>
              <li>
                <a @click.prevent="reportType = 'violence'" class="flex items-center justify-between">
                  Violence
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </li>
              <li>
                <a @click.prevent="reportType = 'suspicious'" class="flex items-center justify-between">
                  It is suspicious or post spam
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </li>
              <li>
                <a @click.prevent="reportType = 'sensitive'" class="flex items-center justify-between">
                  It contains sensitive content
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </li>
              <li>
                <a @click.prevent="reportType = 'dangerous'" class="flex items-center justify-between">
                  The comments made are inappropriate or dangerous.
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
              </li>
            </ul>
            <div v-if="reportType" class="flex flex-col gap-2 w-full">
              <a @click.prevent="reportType = ''" class="link flex items-center w-fit text-accent hover:text-accent-focus hover:underline">
                <i class="fa-solid fa-arrow-left"></i>
                <p class="ml-2">Back</p>
              </a>
              <MyTextarea v-model="details" placeholder="Please tell us the situation as much as possible" :additionalClass="'w-full textarea-accent h-40'" />
            </div>
          </div>
          <div class="flex gap-2 w-full justify-end mt-4">
            <label for="report-content" class="btn btn-error btn-outline">Cancel</label>
            <button @click="reportPost" type="submit" class="btn btn-success">Report</button>
          </div>
        </form>
      </label>
    </div>
  </Teleport>

  <Teleport v-if="alerts.length" to="#alert-container">
    <div v-for="(alert, index) in alerts" :key="index" class="alert shadow-lg" :class="alert.type === 'success' ? 'alert-success' : 'alert-error'">
      <div>
        <svg @click="alerts = []" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ alert.message }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref, inject } from 'vue'
import { supabase } from '@/utils/supabase'

const MyTextarea = defineAsyncComponent(() => import('@/components/Inputs/MyTextarea.vue'))

const details = ref('')
const reportType = ref('')
const alerts = ref([])
const reportModal = ref(null)

const authStore = inject('authStore')

const reportPost = async () => {
  const { error } = await supabase
    .from('reports')
    .insert({
      user_id: authStore.user.userId,
      post_id: authStore.currentPostSelected.id,
      category: reportType.value,
      comment: details.value
    })

  alerts.value = []
  reportModal.value.checked = false
  details.value = ''
  reportType.value = ''

  if (!error) alerts.value.push({ type: 'success', message: 'The post has been reported' })
}
</script>
