<template>
  <div class="fixed bottom-0 z-50 w-full bg-primary p-6 flex flex-col gap-2 justify-center items-center text-primary-content sm:flex-row sm:justify-evenly">
    <div class="flex flex-col items-center sm:items-start">
      <p class="text-xl font-bold sm:text-2xl">All your stuff in one place.</p>
      <p>Get to your bookmarks from any computer, anytime, anywhere.</p>
    </div>
    <div class="flex gap-2">
      <router-link to="/account/login" class="btn btn-outline text-primary-content">
        Sign in
      </router-link>
      <router-link to="/account/register" class="btn btn-ghost btn-active">
        Register
      </router-link>
    </div>
  </div>
</template>
