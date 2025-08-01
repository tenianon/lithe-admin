import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

import router from '@/router'
import { resolveMenu, resolveRoute } from '@/router/helper'
import { routeRecordRaw } from '@/router/record'

import type { MergeMenuMixedOptions } from '@/router/helper'
import type { MenuProps } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

interface User {
  avatar?: string
  id?: string
  name?: string
  role?: 'admin' | 'user'
}

const DEFAULT_USER: User = {
  avatar: '',
  id: '2000',
  name: 'Lithe User',
  role: 'admin',
}

export const useUserStore = defineStore('userStore', () => {
  const user = useStorage<User>('user', DEFAULT_USER)

  const token = useStorage<string | null>('token', '')

  const userMenu = ref<MenuProps['options']>([])

  const userRoute = ref<RouteRecordRaw[]>([])

  const setToken = (value: string | null) => {
    token.value = value
  }

  async function resolveUserMenu() {
    const res = await new Promise<MergeMenuMixedOptions[]>((resolve) => {
      if (token.value?.includes('admin')) {
        resolve(routeRecordRaw)
      } else {
        const allowedRoutes = ['dashboard', 'dataShow', 'notfoundPage', 'about']
        const filteredRoutes = routeRecordRaw.filter((route) => {
          return !route.type && route.name && allowedRoutes.includes(route.name as string)
        })
        resolve(filteredRoutes)
      }
    })

    userMenu.value = resolveMenu(res) || []
    userRoute.value = resolveRoute(res) || []
  }

  function cleanup(redirectPath?: string) {
    router.replace({
      name: 'signin',
      ...(redirectPath ? { query: { r: redirectPath } } : {}),
    })

    token.value = null

    if (router.hasRoute('layout')) {
      router.removeRoute('layout')
    }

    userMenu.value = []

    userRoute.value = []
  }

  return {
    user,
    token,
    userMenu,
    userRoute,
    resolveUserMenu,
    setToken,
    cleanup,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
