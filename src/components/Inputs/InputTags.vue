<template>
  <div class="form-control">
    <label class="input-group input-group-sm">
      <span><i class="fa-solid fa-tag"></i></span>
      <VoerroTagsInput
        element-id="tags"
        input-id="input-tags"
        :value="value"
        :limit="limit"
        :add-tags-on-comma="true"
        :hide-input-on-limit="true"
        @keydown.space.prevent
        :validate="checkTag"
        wrapper-class="flex	flex-wrap w-full bg-base-300"
        placeholder="Tags comma separated (max of five)"
      >
        <template v-slot:selected-tag="{ tag, index, removeTag }">
          <input type="hidden" :name="`tag_${index}`" :value="tag.value">
          <div class="btn h-6 p-1 min-h-0 badge whitespace-nowrap" :class="badgeType" @click.prevent="removeTag(index)">
            <i class="fa-solid fa-circle-xmark mr-1"></i>
            {{ tag.value }}
          </div>
        </template>
      </VoerroTagsInput>
    </label>
  </div>
</template>

<script setup>
import VoerroTagsInput from '@voerro/vue-tagsinput'

import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: []
  },
  limit: {
    type: Number,
    default: 5
  },
  badgeType: {
    type: String,
    default: 'badge-accent'
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

const checkTag = (tag) => {
  const maxLength = 25
  const tagWithoutSpaces = tag.replace(/\s/g, '')
  return (tag === tagWithoutSpaces && tag.length <= maxLength)
}
</script>

<style>
.tags-input-root {
  width: 100%;
}
.tags-input {
  border-top-right-radius: var(--rounded-btn, 0.5rem);
  border-bottom-right-radius: var(--rounded-btn, 0.5rem);
  gap: 0.5rem;
  padding: 0.5rem 0 0.5rem 0;
}
.tags-input-badge {
  padding: 0;
}
#input-tags {
  flex: 1;
  background: none;
  outline: none;
}
</style>
