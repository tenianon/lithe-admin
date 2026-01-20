import { isEmpty } from 'es-toolkit/compat'

import { routerEventBus } from '@/event-bus'
import { useUserStore } from '@/stores'

import type { Router } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

export function setupRouterGuard(router: Router) {
  const userStore = useUserStore()

  const { cleanup } = userStore

  router.beforeEach(async (to, from, next) => {
    routerEventBus.emit({ type: 'beforeEach' })

    if (to.name === 'signIn') {
      if (!userStore.token) {
        next()
      } else {
        next(from.fullPath)
      }

      return false
    }

    if (!userStore.token) {
      cleanup(to.fullPath)
      next()
      return false
    }

    if (userStore.token && !router.hasRoute('layout')) {
      try {
        if (isEmpty(userStore.userRoute)) {
          cleanup()
          next()
          return false
        }

        router.addRoute({
          path: '/',
          name: 'layout',
          component: Layout,
          // if you need to have a redirect when accessing / routing
          redirect: '/dashboard',
          children: userStore.userRoute,
        })

        next(to.fullPath)
      } catch (error) {
        console.error('Error resolving user menu or adding route:', error)
        cleanup()
        next()
      }

      return false
    }

    next()
    return false
  })

  router.beforeResolve((_, __, next) => {
    next()
  })

  router.afterEach(() => {
    routerEventBus.emit({ type: 'afterEach' })
  })
}
