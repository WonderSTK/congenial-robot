<template>
  <button class="btn btn-primary btn-outline min-h-0 swap anim-swap">
    <input type="checkbox" :id="id" :checked="isChecked" />
    <label class="rounded-full z-10" :for="id" @click.prevent="$emit('action', id)"></label>
    <div class="swap-on">{{ action.off }}</div>
    <div class="swap-off">{{ action.on }}</div>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  id: {
    required: true
  },
  action: {
    type: Object,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false
  },
})

const isChecked = ref(props.checked)
watch(() => props.checked, (newValue) => {
  isChecked.value = newValue
})
</script>

<style lang="scss" scoped>
.anim-swap {
  position: relative;

  label {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    transition: all 0.5s;
    box-shadow: 0px 0px 0px 0.5em rgba(13, 165, 142, 0);

    grid-column-start: auto;
    grid-row-start: auto;
  }

  &:active label {
    box-shadow: 0 0 0 0 hsl(var(--ac) / var(--tw-text-opacity));
    transition: 0s;
  }

  input {
    display: none;
    &:checked {
      ~ .swap-on {
        opacity: .5;
      }

      + label {
        box-shadow: 0 0 0 0 hsl(var(--ac) / var(--tw-text-opacity));
        transition: 0s;
        ~ i {
          font-weight: 900;
        }
      }
    }
  }
}
</style>
