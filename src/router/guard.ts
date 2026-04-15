// import { isEmpty } from 'es-toolkit/compat'

import { routerEventBus } from '@/event-bus'
import { useUserStore } from '@/stores'

import type { Router } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

export function setupRouterGuard(router: Router) {
  const userStore = useUserStore()

  const { cleanup } = userStore

  router.beforeEach(async (to, from) => {
    routerEventBus.emit({ type: 'beforeEach' })

    if (to.name === 'signIn') {
      if (!userStore.token) {
        return
      } else {
        return from.fullPath
      }
    }

    if (!userStore.token) {
      cleanup(to.fullPath)
      return
    }

    if (userStore.token && !router.hasRoute('layout')) {
      try {
        // if (isEmpty(userStore.userRoute)) {
        //   cleanup()
        //   return
        // }

        router.addRoute({
          path: '/',
          name: 'layout',
          component: Layout,
          // if you need to have a redirect when accessing / routing
          // redirect: '/',
          children: userStore.userRoute,
        })

        return to.fullPath
      } catch (error) {
        console.error('Error resolving user menu or adding route:', error)
        cleanup()
        return
      }
    }
  })

  router.beforeResolve(() => {})

  router.afterEach(() => {
    routerEventBus.emit({ type: 'afterEach' })
  })
}
