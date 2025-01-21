<template>
  <Teleport v-if="authStore.action === 'share'" to="#modal-container">
    <input ref="reportModal" type="checkbox" id="share-content" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label class="modal" for="share-content">
      <label class="modal-box relative" for="">
        <label for="share-content" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">Share Content</h3>
        <p class="mt-2 mb-2">Where would you like to share this content?</p>
        <div class="flex gap-2 items-center justify-center">
          <div class="tooltip tooltip-twitter" data-tip="Share on twitter">
            <button @click="shareOnTwitter" class="btn btn-circle btn-ghost">
              <img class="w-6" src="/src/assets/twitter.png" alt="Share on twitter" />
            </button>
          </div>
          <div class="tooltip tooltip-whatsapp" data-tip="Share on WhatsApp">
            <button @click="shareOnWhatsApp" class="btn btn-circle btn-ghost">
              <img class="w-6" src="/src/assets/whatsapp.png" alt="Share on WhatsApp" />
            </button>
          </div>
          <div class="tooltip tooltip-fb" data-tip="Share on Facebook">
            <button @click="shareOnFacebook" class="btn btn-circle btn-ghost">
              <img class="w-6" src="/src/assets/facebook.png" alt="Share on Facebook" />
            </button>
          </div>
        </div>
      </label>
    </label>
  </Teleport>
</template>

<script setup>
import { inject, onMounted } from "vue"
const authStore = inject('authStore')

onMounted(() => {
  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.crossOrigin = 'anonymous'
  script.src = 'https://connect.facebook.net/en_US/sdk.js'
  document.head.appendChild(script)


  window.fbAsyncInit = function() {
    FB.init({
      appId            : '213255038169793',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v16.0'
    })
  }
})

const getPostContent = (post) => {
  let text = `${post.description}`
  if (post.link) text += `${post.link}`
  if (post.tags && post.tags.length) text += `\n\n ${post.tags?.map(tag => `#${tag.name.trim().replace(/\s+/g, '')}`).join(" ")}`
  return text
}

const shareOnTwitter = () => {
  const post = authStore.currentPostSelected
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getPostContent(post))}`
  window.open(twitterIntentUrl, "_blank")
}

const shareOnFacebook = () => {
  const post = authStore.currentPostSelected

  FB.ui(
    {
      method: "share",
      href: post.link,
      quote: getPostContent(post),
    }
  )
}

const shareOnWhatsApp = () => {
  const post = authStore.currentPostSelected
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(getPostContent(post))}`
  window.open(whatsappUrl, "_blank")
}
</script>

<style scoped>
.tooltip-fb {
  --tooltip-color: #4050b5;
  --tooltip-text-color: white;
}
.tooltip-twitter {
  --tooltip-color: #01a9f4;
  --tooltip-text-color: white;
}
.tooltip-whatsapp {
  --tooltip-color: #24d366;
  --tooltip-text-color: white;
}
</style>
