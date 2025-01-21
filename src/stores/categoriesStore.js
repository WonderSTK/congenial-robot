import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [
      {
        icon: '🔥',
        name: 'Hot news',
      },
      {
        icon: '💳',
        name: 'Cryptocurrency',
      },
      {
        icon: '🏦',
        name: 'Economy',
      },
      {
        icon: '💻',
        name: 'Technology',
      },
      {
        icon: '💰',
        name: 'Stock Market',
      },
      {
        icon: '💸',
        name: 'Wealth',
      },
      {
        icon: '🏎️',
        name: 'Automotive',
      },
    ],
  }),
})
