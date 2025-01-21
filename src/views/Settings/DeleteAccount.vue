<template>
  <div class="card rounded-box shadow-lg bg-base-100">
    <div class="card-body">
      <h2 class="card-title mb-4">Deactivate account</h2>
      <p class="mb-2">Deactivating your account implies that account recovery will not be possible</p>
      <label for="delete-account" @click="authStore.action = 'delete-account'" class="btn btn-outline btn-error">Deactivate account</label>
    </div>
  </div>

  <Teleport v-if="authStore.action === 'delete-account'" to="#modal-container">
    <input type="checkbox" id="delete-account" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="delete-account" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <label for="delete-account" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Deactivate account</h3>
        <form @submit.prevent="deactivateMyAccount" class="flex flex-col">
          <InputPassword v-model="actualPassword" :name="'Your actual password'" :errors="errors" />
          <Captcha class="ml-auto mr-auto mt-4" @newToken="captchaToken = $event" />
          <div class="flex gap-2 w-full justify-end mt-4">
            <label for="delete-account" class="btn btn-error btn-outline">Cancel</label>
            <button type="submit" class="btn btn-success">Deactivate</button>
          </div>
        </form>
      </label>
    </label>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, ref, inject } from 'vue'
import { supabase } from '@/utils/supabase'

const InputPassword = defineAsyncComponent(() => import ("@/components/Inputs/InputPassword.vue"))
const Captcha = defineAsyncComponent(() => import ("@/components/Captcha.vue"))

const actualPassword = ref('')
const captchaToken = ref(null)

const authStore = inject('authStore')

const errors = ref([])
const alerts = ref([])

const deactivateMyAccount = async () => {
  errors.value = []
  
  const { error } = await supabase.auth.signInWithPassword({
    email: authStore.user.email,
    password: actualPassword.value,
    options: {
      captchaToken: captchaToken.value
    }
  })

  if (error) {
    errors.value.push({ input: 'Your actual password', message: 'Invalid password' })
    return
  }

  await supabase
    .from('profiles')
    .update({
      deleted_at: new Date()
    })
    .eq('user_id', authStore.user.userId)

  await supabase
    .from('posts')
    .update({
      deleted_at: new Date()
    })
    .eq('user_id', authStore.user.userId)

  await supabase
    .from('reactions')
    .update({
      deleted_at: new Date()
    })
    .eq('user_id', authStore.user.userId)

  authStore.action = null
  actualPassword.value = ''
  authStore.logout()
}
</script>
