import { useEventBus as _useEventBus } from '@vueuse/core'

import { useDiscreteApi } from '@/composables'
import { toRefsPreferencesStore } from '@/stores'

import type { EventBusKeys } from '@/event-bus/interface'

export function useEventBus() {
  const routerEventBus = _useEventBus<EventBusKeys['router']>('router')

  return {
    routerEventBus,
  }
}

export function setupEventBus() {
  const { routerEventBus } = useEventBus()

  const { loadingBar } = useDiscreteApi()

  const { showTopLoadingBar } = toRefsPreferencesStore()

  routerEventBus.on((event) => {
    switch (event) {
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
