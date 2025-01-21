<template>
  <button class="btn btn-outline group rounded-box anim-button" :class="btnColor">
    <input type="checkbox" :id="identifiant" :checked="checked"/>
    <label class="rounded-box" :for="identifiant"></label>
    <i class="fa-regular" :class="icon"></i>
    <p v-if="number === 0 || number" class="ml-2">{{ nFormatter(number) }}</p>
    <p v-if="string" class="ml-2">{{ string }}</p>
  </button>
</template>

<script setup>
const props = defineProps({
  identifiant: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    required: true,
  },
  btnColor: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: false,
  },
  string: {
    type: String,
    required: false,
  },
})

const nFormatter = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'G'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(2).replace(/\.0$/, '') + 'K'
  }
  return num
}
</script>

<style lang="scss" scoped>
.anim-button {
  position: relative;

  label {
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    transition: all 0.5s;
    box-shadow: 0px 0px 0px 0.5em rgba(13, 165, 142, 0);
  }

  &:active label {
    box-shadow: 0 0 0 0 hsl(var(--ac) / var(--tw-text-opacity));
    transition: 0s;
  }

  input {
    display: none;
    &:checked {
      + label {
        ~ i {
          font-weight: 900;
        }
      }
    }
  }
}
</style>
