<template>
  <label :for="name" :class="isOnMobile ? 'mt-2' : 'mt-4'" class="label">
    <span class="label-text">
      {{ name }}
      <span class="text-red-500">*</span>
    </span>
    <div v-if="checkStrength">
      <span class="mr-2" :class="getProgressStyle">{{ state.strength }}</span>
      <progress class="progress w-20" :class="getProgressStyle" :value="state.progressBarValue" max="100"></progress>
    </div>
  </label>

  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :name="name"
    type="password"
    required
    class="input input-bordered bg-base-200 shadow-sm"
    :class="errors.find(e => e.input === name) ? 'input-error' : ''"
  />
  <p v-if="checkStrength" class="text-xs font-extralight mt-1">
    Minimum of 8 characters, with upper, lower, number and symbol
  </p>
  <p v-if="showErrors" class="text-error text-sm">
    {{ errors.find(e => e.input === name)?.message }}
  </p>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  errors: {
    type: Array,
    default: [],
  },
  modelValue: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  checkStrength: {
    type: Boolean,
    default: false
  },
  showErrors: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:modelValue'])

const state = reactive({
  strength: '',
  progressBarValue: 0,
})

const updatePasswordStrength = () => {
  if (!props.modelValue) {
    state.strength = ''
    state.progressBarValue = 0
    return
  }

  // const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/
  const rules = [
    /(?=.{8,})/,
    /(?=.*[A-Z])/,
    /(?=.*[a-z])/,
    /(?=.*[0-9])/,
    /(?=.*[^A-Za-z0-9])/
  ]

  let validCount = 0
  for (const rule of rules) {
    if (rule.test(props.modelValue)) {
      validCount++
    }
  }

  if (validCount <= 2) {
    state.strength = 'Weak'
    state.progressBarValue = 25
  } else if (validCount === 3) {
    state.strength = 'Average'
    state.progressBarValue = 50
  } else if (validCount === 4) {
    state.strength = 'Strength'
    state.progressBarValue = 75
  } else {
    state.strength = 'Excellent'
    state.progressBarValue = 100
  }
}

watch(() => props.modelValue, () => {
  updatePasswordStrength()
})

const getProgressStyle = computed(() => {
  if (state.progressBarValue <= 25) {
    return 'text-error progress-error'
  } else if (state.progressBarValue <= 50) {
    return 'text-warning progress-warning'
  } else if (state.progressBarValue <= 75) {
    return 'text-info progress-info'
  }
  return 'text-success progress-success'
})
</script>
