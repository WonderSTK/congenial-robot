<template>
  <div class="flex bg-base-100 min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <a href="/">
        <img class="mx-auto h-14 w-auto" src="/logo.png" alt="Your Company" />
      </a>
      <h2 :class="isOnMobile ? 'mt-2' : 'mt-10'" class="text-center text-2xl font-bold leading-9 tracking-tight">Create new acount</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="register()" action="#" method="POST">
        <div class="form-control">
          <template v-if="!nextStep">
            <label for="email" class="label">
              <span class="label-text">
                Email address
                <span class="text-red-500">*</span>
              </span>
            </label>
            <input v-model="email" name="email" type="email" autocomplete="email" required class="input input-bordered bg-base-200 shadow-sm" :class="errors.find(e => e.input === 'email') ? 'input-error' : ''" />
            <p class="text-error text-sm">
              {{ errors.find(e => e.input === 'email')?.message }}
            </p>

            <label for="username" :class="isOnMobile ? 'mt-2' : 'mt-4'" class="label">
              <span class="label-text">
                Username
                <span class="text-red-500">*</span>
              </span>
            </label>

            <div class="dropdown autocomplete">
              <input v-model="username" autocomplete="off" name="username" type="text" required class="input input-bordered bg-base-200 shadow-sm w-full" :class="errors.find(e => e.input === 'username') ? 'input-error' : ''" />
              <p class="text-error text-sm">
                {{ errors.find(e => e.input === 'username')?.message }}
              </p>
            </div>

            <InputPassword v-model="password" :name="'Password'" :checkStrength="true" :errors="errors" />
            <InputPassword v-model="confirmPassword" :name="'Confirm password'" :errors="errors" />

            <button @click="checkDatas" class="btn btn-primary w-full mt-6">Register</button>
          </template>

          <template v-else>
            <Captcha class="ml-auto mr-auto" @newToken="captchaToken = $event" />
            <button type="submit" class="btn btn-primary w-full mt-6" :class="!captchaToken ? 'btn-disabled' : ''">Confirm</button>
          </template>

          <p class="mt-10 text-center text-sm font-extralight">
            Already member?
            <router-link to="/account/login" class="font-semibold text-primary hover:text-primary-focus">Sign in</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>

  <div class="bg-gradient-to-r from-base-100 w-20 h-20 fixed bottom-0 left-0">
    <SwitchTheme class="absolute bottom-8 left-8"/>
  </div>

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
const PictureUploader = defineAsyncComponent(() => import ("@/components/Inputs/PictureUploader.vue"))
const InputPassword = defineAsyncComponent(() => import ("@/components/Inputs/InputPassword.vue"))
const Captcha = defineAsyncComponent(() => import ("@/components/Captcha.vue"))

const email = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref([])
const alerts = ref([])
const authStore = inject('authStore')

const nextStep = ref(false)
const captchaToken = ref(null)

const checkDatas = async() => {
  // Remove last errors
  errors.value = []

  // Email validation
  if (!email.value.trim() || !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.value.push({ input: "email", message: 'Please enter a valid email address' })
  }

  // Username validation
  if (!username.value.trim()) {
    errors.value.push({ input: "username", message: 'Please enter a username' })
  }

  // Password validation
  if (!password.value.trim() || password.value !== confirmPassword.value) {
    errors.value.push(
      { input: 'Password', message: 'Passwords do not match' },
      { input: 'Confirm password', message: 'Passwords do not match' },
    )
  }

  // Cleaning entries to avoid security vulnerabilities
  const cleanedUsername = username.value.trim()
  const cleanedPassword = password.value.trim()

  if (!isPasswordValid(cleanedPassword)) {
    errors.value.push({ input: 'Password', message: 'Password does not match criteria' })
  }

  const regex = /^[a-zA-Z0-9]*$/;
  if (!regex.test(cleanedUsername)) {
    errors.value.push({ input: "username", message: 'Special characters are prohibited for username' })
  }

  if (cleanedUsername.length < 3) {
    errors.value.push({ input: "username", message: 'Must be at least 3 characters' })
  }

  // Check if username already taken
  const usernameExist = await authStore.checkIfUsernameExist(cleanedUsername)
  if (usernameExist) {
    errors.value.push({ input: "username", message: 'This username is already taken' })
  }

  if (!errors.value.length) {
    nextStep.value = true
  }
}

const register = async() => {
  if (!captchaToken.value) return

  const cleanedEmail = email.value.trim()
  const cleanedUsername = username.value.trim()
  const cleanedPassword = password.value.trim()

  const register = await authStore.signUp({
    username: cleanedUsername,
    email: cleanedEmail,
    password: cleanedPassword,
    captchaToken: captchaToken.value
  })

  if (register) {
    alerts.value.push({ type: 'success', message: `A confirmation link has been sent to ${cleanedEmail}` })
    email.value = ''
    username.value = ''
    password.value = ''
    confirmPassword.value = ''
    captchaToken.value = ''
  } else {
    alerts.value.push({ type: 'error', message: 'Error has occured' })
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
</script>

<style scoped>
.autocomplete ul {
  top: 0;
  left: 0;
  right: 0;
  padding-top: 3.5rem;
}

.autocomplete input {
  position: relative;
  z-index: 999;
}
</style>
