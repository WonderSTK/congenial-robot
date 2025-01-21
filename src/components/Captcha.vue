<template>
  <vue-hcaptcha
    sitekey="390234ee-b108-4220-8160-ae908e0894a6"
    :theme="theme"
    @verify="setCaptchaToken"
  />
</template>

<script setup>
import { computed } from "vue"
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'

import { useThemeStore } from "@/stores/themeStore"
const themeStore = useThemeStore()
const theme = computed(() => {
  return themeStore.currentTheme === 'cupcake' ? 'light' : 'dark'
})

const emit = defineEmits(['newToken'])

const setCaptchaToken = (token, eKey) => {
  emit('newToken', token)
}
</script>
