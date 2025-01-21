<template>
  <div class="card rounded-box shadow-lg bg-base-100">
    <div class="card-body">
      <h2 class="card-title mb-4">About us</h2>
      <p class="mb-2">{{ app_name }} is a user-centric platform that is dedicated to...</p>
      <label for="about" @click="authStore.action = 'about'" class="btn btn-outline">Show more</label>
    </div>
  </div>

  <Teleport v-if="authStore.action === 'about'" to="#modal-container">
    <input type="checkbox" id="about" class="modal-toggle" @change="authStore.closeModal(!$event.target.checked)" />
    <label for="about" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <label for="about" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold">About us</h3>
        <div class="flex flex-col gap-4 mt-6">
          <p>
            {{ app_name }} is a user-centric platform that is dedicated to providing an exceptional bookmarking
            experience to its users. Our platform allows users to retain their bookmarks as long as
            they want, and access them anytime and anywhere they go. We understand that every user has
            unique preferences, and that's why we provide personalised bookmarking options to ensure
            that every user has a seamless and personalised experience.
          </p>

          <p>
            Our mission is to create a platform that is not only user-friendly but also secure and private.
            We take the privacy and security of our users seriously, and we have implemented industry-standard
            security measures to protect their personal information. We also understand the importance of
            keeping up with technological advancements, and we are exploring ways to integrate Web 3.0
            into our platform in the future, which will offer even greater benefits to our users.
          </p>

          <p>
            At {{ app_name }}, we are committed to providing a platform that is intuitive, efficient, and
            reliable. Our team of experienced professionals is dedicated to ensuring that our users
            have a smooth and enjoyable experience, and we are always striving to improve our platform.
            We value the trust that our users place in us, and we are committed to earning and maintaining
            that trust by providing an exceptional bookmarking experience.
          </p>
        </div>
      </label>
    </label>
  </Teleport>
</template>
