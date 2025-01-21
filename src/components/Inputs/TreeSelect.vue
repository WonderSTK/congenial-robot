<template>
  <div class="dropdown">
    <label tabindex="0">
      <select v-model="value" name="type" class="hidden select badge gap-2 h-10 min-h-0 rounded-full badge-accent" required>
        <option v-for="(option, index) in options" :key="index" :value="option">{{ option.name }}</option>
      </select>
      <span ref="span" @click="isDropdownOpen = !isDropdownOpen" class="select badge gap-2 h-10 min-h-0 rounded-full text-accent-content bg-base-200">{{ value ? value.name : placeholder }}</span>
    </label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow rounded-box w-52 mt-2 text-accent-content bg-base-200" :class="isDropdownOpen ? '' : ' hidden'">
      <template v-for="(option, index) in options" :key="index">

        <div v-if="option.children" class="collapse collapse-arrow">
          <input type="checkbox" :checked="option.open" />
          <div class="collapse-title text-lg font-bold">
            {{ option.name }}
          </div>
          <div class="collapse-content">
            <div class="overflow-scroll max-h-[200px]">
              <li
                v-for="(suboption, index) in option.children" :key="index"
                :class="value ? (value.name === suboption.name ? 'text-accent' : '') : ''"  
              >
                <a class="flex justify-between" @click.self="value = suboption; isDropdownOpen = false;">
                  {{ suboption.name }}
                  <button
                    v-if="option.removeOption"
                    class="btn btn-circle btn-ghost btn-xs text-error"
                    @click.prevent="emit('delete:option', suboption)"
                  >
                    X
                  </button>
                </a>
              </li>
              <p
                v-if="!option.children.length"
                class="link link-hover font-extralight"
                @click="emit('addOption')"
              >
                <i>Add options</i>
              </p>
            </div>
          </div>
        </div>

        <li v-else :class="value ? (value.name === option.name ? 'text-accent' : '') : ''">
          <a @click.self="value = option; isDropdownOpen = false;">
            {{ option.name }}
            <button
              v-if="option.removeOption"
              class="btn btn-circle btn-ghost btn-xs text-error"
              @click.prevent="emit('delete:option', option)"
            >
              X
            </button>
          </a>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const isDropdownOpen = ref(false)

const props = defineProps({
  modelValue: {
    type: [Object, null],
    required: true
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select option'
  },
})

const emit = defineEmits(['update:modelValue', 'delete:option', 'addOption'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
