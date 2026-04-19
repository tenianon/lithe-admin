import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

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
      port: 6799,
      host: true,
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
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
                name: 'dnd-kit',
                test: /\/@dnd-kit\/vue/,
              },
              {
                name: 'vueuse',
                test: /\/vueuse/,
              },
              {
                name: 'vue-router',
                test: /\/vue-router/,
              },
              {
                name: 'pinia',
                test: /\/pinia/,
              },
              {
                name: 'vue',
                test: /\/vue/,
              },
            ],
          },

          assetFileNames: (asset) => {
            const notHash = ['topography.svg', 'texture.png', 'noise.png']
            if (asset.names?.some((name) => notHash.includes(name))) {
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
      cssMinify: false
    },
  }
})
