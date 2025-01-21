import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tagName => {
          return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
        }
      }
    }
  })],
  resolve: {
		alias: [
			{
				find: "@",
				replacement: path.resolve(__dirname, "src")
			},
		]
	},
})
