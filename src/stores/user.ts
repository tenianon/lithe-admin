import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import router from '@/router'
import { resolveMenu, resolveRoute } from '@/router/helper'

import { pinia } from '.'

import type { MenuMixedOptions } from '@/router/helper'
import type { MenuOption } from 'naive-ui'
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

  const token = useStorage<string | null>('token', null)

  const menuList = ref<MenuOption[]>([])

  const routeList = ref<RouteRecordRaw[]>([])

  async function resolveMenuList() {
    const res = await new Promise<MenuMixedOptions[]>((resolve) => {
      resolve([])
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

    if (router.hasRoute('layout')) {
      router.removeRoute('layout')
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
    cleanup,
  }
})

export function toRefsUserStore() {
  return {
    ...storeToRefs(useUserStore(pinia)),
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
