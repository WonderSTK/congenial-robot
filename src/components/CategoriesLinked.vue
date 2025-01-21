<!-- Carousel of categories (go to section on click) -->
<template>
  <section>
    <div class="text-lg font-bold">
      <i class="fa-regular fa-folder"></i>
      Categories
    </div>
    <div class="carousel carousel-center space-x-4 rounded-box mt-4">
      <button @click="scrollToCategory(category.name)" v-for="category in categories" :key="category" class="carousel-item btn btn-outline btn-primary flex flex-col justify-center items-center bg-base-100 rounded-box w-32 h-32 gap-2">
        <span class="text-5xl">{{ category.icon }}</span>
        <p>{{ category.name }}</p>
      </button>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const scrollToCategory = (id) => {
  const section = document.getElementById(id)
  setTimeout(() => {
    section.scrollIntoView({ behavior: 'smooth' })
  }, 300)
}
</script>
