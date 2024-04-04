import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // port: 5173,
    proxy: {
      '/v1': {
        target: 'https://ent.uqiantu.com',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/data': {
        target: 'https://ent.uqiantu.com',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: "web"
  }
})
