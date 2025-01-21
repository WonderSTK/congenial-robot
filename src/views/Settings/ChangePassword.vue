<template>
  <div class="card rounded-box shadow-lg bg-base-100">
    <div class="card-body">
      <h2 class="card-title mb-4">Change password</h2>
      <p class="mb-2">You can change your password at any time</p>
      <label for="change-password" @click="authStore.action = 'change-password'" class="btn btn-primary">Change password</label>
    </div>
  </div>

  <Teleport v-if="authStore.action === 'change-password'" to="#modal-container">
    <input type="checkbox" id="change-password" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="change-password" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <label for="change-password" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Change your password</h3>
        <form @submit.prevent="updateMyPassword" class="flex flex-col">
          <InputPassword v-model="newPassword" :name="'New password'" :checkStrength="true" :errors="errors" />
          <InputPassword v-model="confirmNewPassword" :name="'Confirm'" :errors="errors" />
          <div class="flex gap-2 w-full justify-end mt-4">
            <label for="change-password" class="btn btn-error btn-outline">Cancel</label>
            <button type="submit" class="btn btn-success">Change</button>
          </div>
        </form>
      </label>
    </label>
  </Teleport>

  <Teleport v-if="alerts && alerts.length" to="#alert-container">
    <div v-for="(alert, index) in alerts" :key="index" class="alert shadow-lg" :class="alert.type === 'success' ? 'alert-success' : 'alert-error'">
      <div>
        <svg @click="alerts = []" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ alert.message }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref, inject, onMounted } from 'vue'
import { supabase } from "@/utils/supabase"

const InputPassword = defineAsyncComponent(() => import ("@/components/Inputs/InputPassword.vue"))

const newPassword = ref('')
const confirmNewPassword = ref('')
const actualPassword = ref('')
const errors = ref([])
const alerts = ref([])
const authStore = inject('authStore')

const updateMyPassword = async() => {
  errors.value = []

  // Password validation
  if (!newPassword.value.trim() || newPassword.value !== confirmNewPassword.value) {
    errors.value.push(
      { input: 'New password', message: 'Passwords do not match.' },
      { input: 'Confirm', message: 'Passwords do not match.' },
    )
  }

  if (!isPasswordValid(newPassword.value)) {
    errors.value.push(
      { input: 'New password', message: 'Password does not match criteria.' },
    )
  }

  if (!errors.value.length) {
    authStore.action = null
    const { data, error } = await supabase.auth.updateUser({ password: newPassword.value })
    if (error) {
      alerts.value.push({ message: 'Error has occurred', type: 'error' })
      return
    }
    alerts.value.push({ message: 'Your password has been modified', type: 'success' })
    newPassword.value = ''
    confirmNewPassword.value = ''
  }
}

function isPasswordValid(password) {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-=]/.test(password)
  
  return (
    password.length >= 8 &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSymbol
  )
}

const checkHash = () => {
  if (window.location.hash === '#change-password') {
    authStore.action = 'change-password'
    setTimeout(() => {
      document.getElementById('change-password').checked = true
    }, 500)
  }
}

onMounted(() => {
  checkHash()
})
</script>
