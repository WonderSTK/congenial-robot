<template>
  <div class="profile bg-base-200 rounded-box">
    <div class="profile-avatar gap-2 md:gap-8">
      <div class="avatar">
        <div class="w-24 sm:w-36 rounded-full">
          <img :src="authStore.getPdpLink(user)" :alt="user.username + ' avatar'"/>
        </div>
      </div>
      <div class="flex flex-col items-center md:items-start gap-2 mb-4 md:mb-10 text-white">
        <h3 class="flex items-center gap-2 font-bold text-2xl">
          {{ user.username }}
          <img v-if="user.certified" src="/src/assets/certificate.svg" alt="certificate icon" />
        </h3>
        <div class="inline-flex flex-wrap justify-center text-sm sm:text-base gap-4 font-extralight">
          <router-link :to="'/profile/' + user.userId + '/followers'" activeClass="underline" class="hover:link">Followers {{ user.followers.length }}</router-link>
          <router-link :to="'/profile/' + user.userId + '/following'" activeClass="underline" class="hover:link">Following {{ user.following.length }}</router-link>
          <div>Links shared {{ user.nbPosts }}</div>
        </div>
      </div>
    </div>

    <img v-if="authStore.getWallpaperLink(user)" class="profile-cover rounded-box" :src="authStore.getWallpaperLink(user)" :alt="`Wallpaper of ${user.username}`">

    <div class="profile-menu bg-base-100">
      <router-link :to="`/profile/${user.userId}`" exact-active-class="active" class="profile-menu-link">Timeline</router-link>
      <router-link :to="{ name: 'ProfileTab', params: { tab: 'about' }}" active-class="active" class="profile-menu-link">About</router-link>
      <router-link :to="{ name: 'ProfileTab', params: { tab: 'replies' }}" active-class="active" class="profile-menu-link">Replies</router-link>
      <router-link v-if="user.isAuthUser" :to="{ name: 'ProfileTab', params: { tab: 'private' }}" active-class="active" class="profile-menu-link">Private</router-link>
      <router-link v-if="user.isAuthUser" :to="{ name: 'ProfileTab', params: { tab: 'promoted' }}" active-class="active" class="profile-menu-link">Promoted</router-link>
    </div>

    <div class="absolute flex gap-2 right-6 top-4 z-10">
      <div v-if="!user.isAuthUser" class="tooltip tooltip-left" data-tip="Message">
        <button @click="createRoom(authStore.user, user, router)" class="btn border-none bg-base-300 hover:bg-base-300 rounded-full sm:h-12 sm:w-12 w-8 h-8 min-h-0">
          <i class="fa-solid fa-envelope"></i>
        </button>
      </div>
      <div v-if="!user.isAuthUser" class="tooltip tooltip-left" :data-tip="authStore.getFollowing().ids.includes(user.userId) ? 'Unfollow' : 'Follow'">
        <button @click="authStore.follow(user.userId)" class="btn border-none bg-base-300 hover:bg-base-300 rounded-full sm:h-12 sm:w-12 w-8 h-8 min-h-0">
          <i v-if="!authStore.getFollowing().ids.includes(user.userId)" class="fa-solid fa-user-plus"></i>
          <i v-else class="fa-solid fa-user-minus"></i>
        </button>
      </div>
      <div v-if="user.isAuthUser" class="tooltip tooltip-left" data-tip="Change wallpaper">
        <label for="profile-wallpaper" @click="authStore.action = 'profile-wallpaper'" class="btn border-none bg-base-300 hover:bg-base-300 rounded-full sm:h-12 sm:w-12 w-8 h-8 min-h-0">
          <i class="fa-solid fa-camera"></i>
        </label>
      </div>
    </div>
  </div>

  <Teleport v-if="authStore.action === 'profile-wallpaper'" to="#modal-container">
    <!-- Modal profile picture -->
    <input type="checkbox" id="profile-wallpaper" class="modal-toggle" ref="wallpaper" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="profile-wallpaper" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <label for="profile-wallpaper" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Change your wallpaper</h3>
        <form @submit.prevent="updateProfileWallpaper(picture); authStore.action = null;" class="flex flex-col gap-4">
          <PictureUploader @updateImage="picture = $event" title="Wallpaper" />
          <div class="flex gap-2 w-full justify-end mt-4">
            <label for="profile-wallpaper" class="btn btn-error btn-outline">Cancel</label>
            <button type="submit" class="btn btn-success">Change</button>
          </div>
        </form>
      </label>
    </label>
  </Teleport>
</template>

<script setup>
import { defineAsyncComponent, inject, ref } from 'vue'
import { createRoom } from '@/utils/chat'
import router from '@/router'

import { supabase } from "@/utils/supabase"
import { decode } from 'base64-arraybuffer'
const authStore = inject('authStore')

const PictureUploader = defineAsyncComponent(() => import ("@/components/Inputs/PictureUploader.vue"))
const picture = ref('')

const props = defineProps({
  user: {
    type: Object,
    required: true,
  }
})

const updateProfileWallpaper = async (dataImage) => {
  if (dataImage) {
    const fileName = `wallpaper-${authStore.user.userId}.jpg`
    const { data, error } = await supabase.storage
      .from('wallpapers')
      .upload(`public/${fileName}`, decode(dataImage.split(',')[1]), {
        contentType: 'image/jpg',
        upsert: true
      })
    if (!error) {
      await supabase
        .from('profiles')
        .update({ wallpaper: data.path })
        .eq('user_id', authStore.user.userId)
      authStore.user.wallpaperPreview = dataImage
    } else {
      alert(error.message)
    }
  }
}
</script>

<style scoped lang="scss">
.profile {
 position: relative;
 height: 40vh;
 min-height: 250px;
 max-height: 350px;
 z-index: 1;

 &-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
 }
}

.profile-menu {
 position: absolute;
 bottom: 0;
 padding-left: 200px;
 width: 100%;
 display: flex;
 border-radius: 0 0 8px 8px;
 overflow: auto;
}

.profile-menu-link {
 padding: 20px 16px;
 transition: 0.3s;
 cursor: pointer;
 z-index: 99;

 &.active,
 &:hover {
  color: hsl(var(--p));
  background-color: hsl(var(--b2, var(--b1)) / var(--tw-bg-opacity));
  border-bottom: 3px solid hsl(var(--p) / var(--tw-bg-opacity));
 }
 &.active {
  font-weight: bold;
 }
}

.profile-avatar {
  position: absolute;
  align-items: center;
  display: flex;
  z-index: 1;
  bottom: 16px;
  left: 24px;
  text-shadow: 0 0 5px black;
  .font-extralight {
    text-shadow: 0 0 5px black, 0 0 5px black, 0 0 5px black;
  }
}

@media screen and (max-width: 768px) {
 .profile-avatar {
  top: 0;
  left: 0;
  width: 100%;
  max-height: 80%;
  align-items: center;
  flex-direction: column;
  justify-content: center;
 }
 .profile-menu {
  padding-left: 0;
  width: 100%;
  overflow: auto;
  justify-content: center;
 }
 .profile-menu-link {
  padding: 16px;
  font-size: 15px;
 }
}
</style>
