<template>
  <div class="flex flex-col gap-2">
    <label for="profile-picture" class="label">
      <span class="label-text">
        {{ title }}
      </span>
      <span class="text-xs text-red-500">{{ required ? 'Required' : 'Not required' }}</span>
    </label>
    <p class="text-xs">
      <i>
        Only accept image format like (jpg, png or jpeg). It's possible to zoom and move with your
        mouse and trackpad.
        <span class="text-xs text-warning">({{ maxSize }} max)</span>
      </i>
    </p>
    <div class="relative flex flex-col gap-2">
      <Cropper
        v-if="circle"
        ref="cropperRef"
        class="cropper rounded-box bg-base-200"
        :stencil-component="CircleStencil"
        :auto-zoom="true"
        :src="image.src"
        @change="cropImage"
      />
      <Cropper
        v-else
        ref="cropperRef"
        class="cropper rounded-box bg-base-200"
        :auto-zoom="true"
        :src="image.src"
        @change="cropImage"
      />
      <input
        ref="fileRef"
        type="file"
        name="profile-picture"
        @change="uploadImage($event)"
        accept="image/*"
        class="hidden"
      />
      <div v-if="!image.src" class="absolute border border-primary-content rounded-box m-2 top-0 left-0 bottom-0 right-0 flex align-center justify-center cursor-pointer" @click="fileRef.click()">
        <span class="flex flex-col align-center justify-center">
          <i class="fa-solid fa-image text-5xl"></i>
        </span>
      </div>

      <div v-else class="flex gap-2 ml-auto">
        <div class="tooltip tooltip-left tooltip-ghost" data-tip="Flip">
          <button class="btn btn-square btn-ghost" @click.prevent="isOnMobile ? cropperRef.flip(0, 1) : cropperRef.flip(1, 0)">
            <i class="fa-solid fa-arrow-right-arrow-left"></i>
          </button>
        </div>
        <div class="tooltip tooltip-left tooltip-ghost" data-tip="Rotate">
          <button class="btn btn-square btn-ghost" @click.prevent="cropperRef.rotate(90)">
            <i class="fa-solid fa-rotate"></i>
          </button>
        </div>
        <div v-if="previewFeed" class="tooltip tooltip-left tooltip-accent" data-tip="Preview">
          <button class="btn btn-square btn-accent" @click.prevent="$emit('preview')">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
        <div class="tooltip tooltip-left tooltip-error ml-auto" data-tip="Remove picture">
          <button class="btn btn-square btn-error" @click.prevent="image.src = ''; $emit('updateImage', null);">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <Teleport v-if="error" to="#alert-container">
    <div v-if="error" class="alert alert-error shadow-lg">
      <div>
        <svg @click="error = ''" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ error }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from "vue"
import { Cropper, CircleStencil } from "vue-advanced-cropper"

const error = ref('')
const emit = defineEmits(['updateImage', 'preview'])

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  maxSize: {
    type: String,
    default: '1 Mb',
  },
  required: {
    type: Boolean,
    default: true
  },
  circle: {
    type: Boolean,
    default: false
  },
  previewFeed: {
    type: Boolean,
    default: false
  }
})

const cropperRef = ref()
const fileRef = ref()

const image = reactive({
  src: '',
  type: '',
})

const cropImage = () => {
  const result = cropperRef.value.getResult()
  const img = result.canvas.toDataURL(image.type)
  emit('updateImage', img)
}

const uploadImage = (event) => {
  // Reference to the DOM input element
  const { files } = event.target
  // Ensure that you have a file before attempting to read it
  if (files && files[0]) {
    // Check that the file is an image
    if (!/^image\//.test(files[0].type)) {
      this.error = 'Please select an image file'
      return
    }
    // 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    if (image.src) {
      URL.revokeObjectURL(image.src)
    }
    // 2. Create the blob link to the file to optimize performance:
    const blob = URL.createObjectURL(files[0])

    // 3. Update the image. The type will be derived from the extension and it can lead to an incorrect result:
    image.src = blob
    image.type = files[0].type
  }
}
</script>

<style lang="scss">
@import "vue-advanced-cropper/dist/style.css";
@import 'vue-advanced-cropper/dist/theme.classic.css';

.cropper {
  min-height: 200px;
  max-height: 400px;
}

.vue-advanced-cropper__foreground, .vue-advanced-cropper__background, .vue-advanced-cropper__image-wrapper {
  border-radius: var(--rounded-box, 1rem);
}
</style>
