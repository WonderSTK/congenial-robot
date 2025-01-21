import { defineStore } from "pinia"

export const useThemeStore = defineStore('theme', {
  actions: {
    switchTheme() {
      this.currentTheme = (this.currentTheme === 'cupcake') ? 'dark' : 'cupcake'
    },
    setTheme() {
      document.querySelector("html").setAttribute("data-theme", this.currentTheme)
      localStorage.setItem('currentTheme', this.currentTheme)
    }
  },
  state: () => ({
    currentTheme: 'cupcake',
  }),
})
