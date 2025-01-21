<template>
  <div class="flex bg-base-100 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <a href="/">
        <img class="mx-auto h-14 w-auto" src="/logo.png" alt="Your Company" />
      </a>
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="login" action="#" method="POST">
        <div class="form-control">
          <label for="email" class="label">
            <span class="label-text">
              Email
              <span class="text-red-500">*</span>
            </span>
          </label>
          <input v-model="email" name="email" type="email" required class="input input-bordered bg-base-200 shadow-sm" />

          <label for="password" class="label mt-4">
            <span class="label-text">
              Password
              <span class="text-red-500">*</span>
            </span>
            <div class="text-sm">
              <label for="forgot-password" class="font-semibold text-primary cursor-pointer hover:text-primary-focus">Forgot password?</label>

              <input type="checkbox" id="forgot-password" class="modal-toggle" ref="forgot-password" />
              <label for="forgot-password" class="modal cursor-pointer">
                <label class="modal-box relative" for="">
                  <label for="forgot-password" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                  <h3 class="text-lg font-bold">Resend a password</h3>
                  <form @submit.prevent="authStore.forgotPassword({ email: sendTo, captchaToken }); alerts = [{ type: 'success', message: 'An email has been sent if account exist' }]; $refs['forgot-password'].checked = false;" class="flex flex-col gap-4">
                    <p class="py-4">You will receive a link to log into your account and you will be able to change your password in your settings</p>
                    <input v-model="sendTo" id="email" name="email" type="email" autocomplete="email" required placeholder="Email account" class="input input-bordered bg-base-200 shadow-sm" />
                    <Captcha v-if="!captchaToken" class="ml-auto mr-auto" @newToken="captchaToken = $event" />
                    <div class="flex gap-2 w-full justify-end">
                      <label for="forgot-password" class="btn btn-error btn-outline">Cancel</label>
                      <button type="submit" class="btn btn-success" :class="!captchaToken ? 'btn-disabled' : ''">Confirm</button>
                    </div>
                  </form>
                </label>
              </label>
            </div>
          </label>
          <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="input input-bordered bg-base-200 shadow-sm" />

          <Captcha class="ml-auto mr-auto mt-6" @newToken="captchaToken = $event" />
          <button type="submit" class="btn btn-primary w-full mt-6" :class="!captchaToken ? 'btn-disabled' : ''">Sign in</button>

          <p class="mt-10 text-center text-sm font-extralight">
            Not a member?
            <router-link to="/account/register" class="font-semibold text-primary hover:text-primary-focus">Register now</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
  <SwitchTheme class="fixed bottom-8 left-8"/>

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
import { defineAsyncComponent, ref, inject } from "vue"

const SwitchTheme = defineAsyncComponent(() => import ("@/components/SwitchTheme.vue"))
const Captcha = defineAsyncComponent(() => import ("@/components/Captcha.vue"))

const email = ref('')
const sendTo = ref('')
const password = ref('')
const alerts = ref([])

const captchaToken = ref(null)

const authStore = inject('authStore')

const login = async() => {
  const isLoged = await authStore.signIn(email.value, password.value, captchaToken.value)
  if (!isLoged) {
    alerts.value.push({ type: 'error', message: 'Incorrect password or email' })
  }
}
</script>
