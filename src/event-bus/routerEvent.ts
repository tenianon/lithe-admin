import { useEventBus } from '@vueuse/core'

import { useDiscreteApi } from '@/composables'
import { toRefsPreferencesStore } from '@/stores'

export type RouterEventPayload = { type: 'beforeEach' } | { type: 'afterEach' }

export const routerEventBus = useEventBus<RouterEventPayload>('router')

export function useRouterEventBus() {
  const { loadingBar } = useDiscreteApi()

  const { showTopLoadingBar } = toRefsPreferencesStore()

  routerEventBus.on((event) => {
    switch (event.type) {
      case 'beforeEach':
        if (showTopLoadingBar.value) {
          loadingBar.start()
        }
        break

      case 'afterEach':
        if (showTopLoadingBar.value) {
          loadingBar.finish()
        }
        break

      default:
        break
    }
  })
}
