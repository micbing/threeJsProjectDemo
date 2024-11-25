import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url';
// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host:'192.168.8.84'
  // },
    server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  resolve: {
    alias: {
       '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled:true
      }
    }
  },
  plugins: [vue()],
})
