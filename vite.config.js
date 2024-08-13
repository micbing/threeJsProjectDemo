import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host:'192.168.8.84'
  // },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled:true
      }
    }
  },
  plugins: [vue()],
})
