import { useEventBus } from '@vueuse/core'

import { useDiscreteApi } from '@/composables'
import router from '@/router'
import { useUserStore } from '@/stores'

export type RequestEventPayload =
  | { type: 'request' }
  | { type: 'requestError'; error: any }
  | { type: 'response'; data: ResponseBody<any> }
  | { type: 'responseError'; error: any; code?: number }

export const requestEventBus = useEventBus<RequestEventPayload>('request')

export function useRequestEventBus() {
  const { message: messageApi } = useDiscreteApi()
  const { cleanup } = useUserStore()

  requestEventBus.on((event) => {
    const currentPath = router.currentRoute.value.path
    switch (event.type) {
      case 'request':
        break

      case 'requestError':
        messageApi.error(`requestError: ${event.error.message}`)
        break

      case 'response':
        if (event.data.code === 201) {
          messageApi.success(event.data.message)
        }

        break

      case 'responseError':
        messageApi.error(`${event.error.response?.data?.message || event.error.message}`)
        if (event.code === 401) {
          cleanup(currentPath)
        }

        break

      default:
        break
    }
  })
}
