import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [vue(), vueJsx(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5799,
      host: true,
    },
    build: {
      rollupOptions: {
        output: {
          advancedChunks: {
            groups: [
              {
                name: 'echarts',
                test: /\/echarts/,
              },
              {
                name: 'chroma-js',
                test: /\/chroma-js/,
              },
              {
                name: 'es-toolkit',
                test: /\/es-toolkit/,
              },
              {
                name: 'naive-ui',
                test: /\/naive-ui/,
              },
              {
                name: 'vue-draggable-plus',
                test: /\/vue-draggable-plus/,
              },
              {
                name: 'vueuse',
                test: /\/vueuse/,
              },
              {
                name: 'vue',
                test: /\/vue/,
              },
              {
                name: 'vue-router',
                test: /\/vue-router/,
              },
              {
                name: 'pinia',
                test: /\/pinia/,
              },
            ],
          },

          assetFileNames: (info) => {
            const notHash = ['topography.svg', 'texture.png', 'noise.png']
            if (notHash.includes(info.names[0])) {
              return 'assets/[name][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },

          minify: {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          },
        },
      },
    },
  }
})
