import { useRequestEventBus } from './requestEvent'
import { useRouterEventBus } from './routerEvent'

export * from './requestEvent'
export * from './routerEvent'

export function setupEventBus() {
  useRouterEventBus()
  useRequestEventBus()
}
