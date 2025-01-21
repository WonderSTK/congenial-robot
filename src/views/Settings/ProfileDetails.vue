<template>
  <div class="card rounded-box shadow-lg bg-base-100">
    <div class="card-body">
      <h2 class="card-title mb-4">Profile Details</h2>

      <div class="flex flex-col gap-2 md:gap-10 md:flex-row">
        <label for="profile-picture" @click="authStore.action = 'profile-picture'" class="avatar hover:brightness-90 cursor-pointer">
          <div class="w-28 rounded-full">
            <img :src="authStore.getPdpLink()" :alt="authStore.getUsername() + ' avatar'" />
          </div>
        </label>
        <div>
          <div class="flex flex-wrap gap-2 mt-2">
            <label for="profile-picture" @click="authStore.action = 'profile-picture'" class="btn btn-primary">Upload profile picture</label>
            <button @click="removeProfilePicture()" class="btn btn-error btn-outline">Remove</button>
          </div>
          <p class="text-xs mt-4"><i>*Only accept image format like (jpg, png or jpeg).</i></p>
        </div>
      </div>

      <div class="flex flex-col flex-wrap gap-2 md:gap-6 md:flex-row">
        <div class="flex-1 form-control">
          <label class="label">
            <span class="label-text font-semibold">Username</span>
          </label>
          <input type="text" class="input input-bordered w-full" v-model="username" @blur="checkUsernameValidity" />
        </div>
        <div class="flex-1 for-control">
          <label class="label">
            <span class="label-text font-semibold">Email</span>
          </label>
          <input type="text" class="input input-bordered w-full" v-model="email" @blur="checkEmailValidity" />
        </div>
      </div>
    </div>
  </div>

  <Teleport v-if="authStore.action === 'profile-picture'" to="#modal-container">
    <!-- Modal profile picture -->
    <input type="checkbox" id="profile-picture" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="profile-picture" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <label for="profile-picture" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Change your profile picture</h3>
        <form @submit.prevent="updateProfilePicture(picture); authStore.action = null;" class="flex flex-col gap-4">
          <PictureUploader @updateImage="picture = $event" title="Profile picture" :circle="true" />
          <div class="flex gap-2 w-full justify-end mt-4">
            <label for="profile-picture" class="btn btn-error btn-outline">Cancel</label>
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
import { mapUser } from '@/utils/chat'
import { updateUser } from '@/database/firestore'
import { defineAsyncComponent, inject, ref } from 'vue'
import { supabase } from "@/utils/supabase"
import { decode } from 'base64-arraybuffer'
const authStore = inject('authStore')

const PictureUploader = defineAsyncComponent(() => import ("@/components/Inputs/PictureUploader.vue"))

const picture = ref('')
const email = ref(authStore.user.email)
const username = ref(authStore.user.username)
const alerts = ref([])

const checkEmailValidity = async() => {
  alerts.value = []
  if (authStore.user.email === email.value) return
  // Email validation
  if (!email.value.trim() || !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    alerts.value.push({ message: 'Please enter a valid email address.', type: 'error' })
    email.value = authStore.user.email
  } else {
    const { data, error } = await supabase.auth.updateUser({ email: email.value })
    if (error) {
      alerts.value.push({ message: 'Error has occurred', type: 'error' })
      return
    }
    alerts.value.push({ message: 'An email has been sent to you to confirm', type: 'success' })
  }
}

const checkUsernameValidity = async() => {
  alerts.value = []
  if (authStore.user.username === username.value) return

  const cleanedUsername = username.value.trim()

  const regex = /^[a-zA-Z0-9]*$/;
  if (!regex.test(cleanedUsername)) {
    alerts.value.push({ type: "error", message: 'Special characters are prohibited for username' })
  }

  if (cleanedUsername.length < 3) {
    alerts.value.push({ type: "error", message: 'Must be at least 3 characters' })
  }

  // Check if username already taken
  const usernameExist = await authStore.checkIfUsernameExist(cleanedUsername)
  if (usernameExist) {
    alerts.value.push({ type: "error", message: 'This username is already taken' })
  }

  // Username validation
  if (!username.value.trim()) {
    alerts.value.push({ message: 'Please enter a username.', type: 'error' })
  }

  if (alerts.value.length) {
    username.value = authStore.user.username
  } else {
    const { error } = await supabase
      .from('profiles')
      .update({ username: username.value })
      .eq('user_id', authStore.user.userId)
    if (error) {
      alerts.value.push({ message: 'Error has occurred', type: 'error' })
      return
    }
    authStore.user.username = username.value
    alerts.value.push({ message: 'Your username has been changed', type: 'success' })
  }
}

const updateProfilePicture = async (dataImage) => {
  alerts.value = []
  if (dataImage) {
    const fileName = `avatar-${authStore.user.userId}.jpg`
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`public/${fileName}`, decode(dataImage.split(',')[1]), {
        contentType: 'image/jpg',
        upsert: true
      })

    if (!error) {
      await supabase
        .from('profiles')
        .update({ pdp: data.path })
        .eq('user_id', authStore.user.userId)
      authStore.user.pdpPreview = dataImage

      // Update user for firebase (need for update also avatar used on chat)
      authStore.user.pdp = data.path
      const user = mapUser(authStore.user)
      await updateUser(user._id, user)
    } else {
      alerts.value.push({ message: error.message, type: 'error' })
    }
  } else {
    removeProfilePicture()
  }
}

const removeProfilePicture = async () => {
  await supabase
    .from('profiles')
    .update({ pdp: null })
    .eq('user_id', authStore.user.userId)
  authStore.user.pdpPreview = '/guest.png'
}
</script>
