import { requestEventBus } from '@/event-bus'

export async function mockRequest<T = any>(
  data: ResponseBody<T>,
  options?: {
    delay?: number
    shouldFail?: boolean
    errorCode?: number
  },
) {
  const { delay = 300, shouldFail = false, errorCode } = options || {}

  requestEventBus.emit({ type: 'request' })

  await new Promise((resolve) => setTimeout(resolve, delay))

  if (shouldFail) {
    const error = new Error(data.message || 'Mock request failed')
    requestEventBus.emit({ type: 'responseError', error, code: errorCode })
    throw error
  }

  requestEventBus.emit({ type: 'response', data })
  return data
}
