<template>
  <DatePicker
    v-model="value"
    :min-date="minDate"
    auto-apply
    :month-change-on-scroll="false"
    :position="position"
    :placeholder="placeholder"
    :dark="themeStore.currentTheme === 'dark'"
  />
</template>

<script setup>
import DatePicker from '@vuepic/vue-datepicker'

import { computed } from 'vue'

import { useThemeStore } from "@/stores/themeStore"
const themeStore = useThemeStore()

const props = defineProps({
  modelValue: {
    type: [Date, null],
    required: true
  },
  minDate: {
    type: Date,
    required: false
  },
  position: {
    type: String,
    default: 'center'
  },
  placeholder: {
    type: String,
    default: 'Select date'
  },
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<style>
@import '@vuepic/vue-datepicker/dist/main.css';
.dp__arrow_top, .dp__arrow_bottom {
  left: 91%;
}
</style>
