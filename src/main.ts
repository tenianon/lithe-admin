import './assets/main.css'

import { createApp } from 'vue'

import { setupEventBus } from '@/event-bus'
import { setupRouterGuard } from '@/router/guard'
import { pinia } from '@/stores'
import { checkVersion } from '@/utils/checkVersion'

import App from './App.vue'
import router from './router'

async function setupApp() {
  checkVersion()

  const app = createApp(App)

  app.use(pinia)

  app.use(router)

  setupRouterGuard(router)

  setupEventBus()

  await router.isReady()

  if (window.loaderElement) {
    window.loaderElement.remove()
    window.loaderElement = null
  }

  app.mount('#app')
}

setupApp()
