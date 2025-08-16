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

  const menuList = ref<MenuProps['options']>([])

  const routeList = ref<RouteRecordRaw[]>([])

  const setToken = (value: string | null) => {
    token.value = value
  }

  async function resolveMenuList() {
    const res = await new Promise<MergeMenuMixedOptions[]>((resolve) => {
      resolve(routeRecordRaw)
    })

    menuList.value = resolveMenu(res) || []
    routeList.value = resolveRoute(res) || []
  }

  function cleanup(redirectPath?: string) {
    router.replace({
      name: 'signIn',
      ...(redirectPath ? { query: { r: redirectPath } } : {}),
    })

    token.value = null

    if (router.hasRoute('layouts')) {
      router.removeRoute('layouts')
    }

    menuList.value = []

    routeList.value = []
  }

  return {
    user,
    token,
    menuList,
    routeList,
    resolveMenuList,
    setToken,
    cleanup,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
