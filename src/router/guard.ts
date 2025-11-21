import { useEventBus } from '@/event-bus'
import { useUserStore, toRefsUserStore } from '@/stores'

import type { Router } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

export function setupRouterGuard(router: Router) {
  const { resolveMenuList, cleanup } = useUserStore()

  const { token, routeList } = toRefsUserStore()
  const { routerEventBus } = useEventBus()

  router.beforeEach(async (to, from, next) => {
    routerEventBus.emit('beforeEach')

    if (to.name === 'signIn') {
      if (!token.value) {
        next()
      } else {
        next(from.fullPath)
      }

      return false
    }

    if (!token.value) {
      cleanup()
      next()
      return false
    }

    if (token.value && !router.hasRoute('layout')) {
      try {
        await resolveMenuList()

        router.addRoute({
          path: '/',
          name: 'layout',
          component: Layout,
          // if you need to have a redirect when accessing / routing
          redirect: '/dashboard',
          children: routeList.value,
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
    routerEventBus.emit('afterEach')
  })
}
