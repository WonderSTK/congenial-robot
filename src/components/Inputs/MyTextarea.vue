<template>
  <div class="relative">
    <textarea :id="id" v-model="value" name="description" @keypress.enter.exact="handleKeyPress" @focus="$emit('focus')" @blur="$emit('blur')" class="textarea" :class="additionalClass + ' ' + (remainingChars < 0 ? 'textarea-error' : '')" :placeholder="placeholder" required></textarea>
    <div class="absolute right-3 bottom-4 radial-progress ml-auto" :class="getStyle + ' ' + (value?.length < 5 ? 'hidden' : '')" :style="`--value:${ratioChars}; --size: 2rem; --thickness: ${remainingChars >= 0 ? '2px' : '0px'};`">
      <p class="text-xs">{{ remainingChars <= 20 ? remainingChars : null }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, null],
    required: true
  },
  id: {
    type: String,
    required: false
  },
  placeholder: {
    type: String,
    required: false
  },
  additionalClass: {
    type: String,
    required: false
  },
  maxChars: {
    type: Number,
    default: 280
  },
  blockedAtLimit: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'enter'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    if (props.blockedAtLimit && value.length > props.maxChars) {
      value = value.slice(0, props.maxChars)
      return
    }
    emit('update:modelValue', value)
  }
})

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    const textarea = document.getElementById(props.id)
    if (textarea) textarea.blur()
    emit('enter')
  }
}

const ratioChars = computed(() => {
  return (value.value?.length / props.maxChars) * 100
})
const remainingChars = computed(() => {
  return props.maxChars - value.value?.length
})
const getStyle = computed(() => {
  if (remainingChars.value <= 0) {
    return 'text-error scale-110'
  }
  else if (remainingChars.value <= 10) {
    return 'text-error scale-110 animated'
  }
  else if (remainingChars.value <= 20) {
    return 'text-warning scale-110 animate-pulse'
  }
  return 'text-accent'
})
</script>

<style scoped>
.animated {
  animation: shake 0.8s;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
