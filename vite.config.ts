import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Inspector from 'unplugin-vue-dev-locator/vite'

// https://vite.dev/config/
export default defineConfig({
  // 使用相对路径，可同时部署到:
  // base: '/tomato_clock/',
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    vue(),
    Inspector(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ 定义 @ = src
    },
  },
})
