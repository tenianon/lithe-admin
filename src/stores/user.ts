import { useStorage } from '@vueuse/core'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'

import router from '@/router'
import { resolveMenu, resolveRoute } from '@/router/helper'

import { pinia } from '.'

const userInfo = {
  avatar: '',
  id: 1,
  name: 'Lithe User',
  role: 'user',
  token: null,
  menu: [],
}

export const useUserStore = defineStore('userStore', () => {
  const user = useStorage<typeof userInfo>('user', userInfo)

  const token = useStorage<string | null>('token', null)

  function cleanup(redirectPath?: string) {
    router.replace({
      name: 'signIn',
      ...(redirectPath ? { query: { r: redirectPath } } : {}),
    })

    token.value = null
    user.value = userInfo

    if (router.hasRoute('layout')) {
      router.removeRoute('layout')
    }
  }

  const userMenu = computed(() => {
    return resolveMenu(user.value.menu)
  })
  const userRoute = computed(() => {
    return resolveRoute(user.value.menu)
  })

  return {
    user,
    token,
    userMenu,
    userRoute,
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
