import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      '/user': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/alarm': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/building': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/report': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/room': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/sensor': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/device': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/monitoring': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
