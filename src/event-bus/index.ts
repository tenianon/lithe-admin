import { useRouterEventBus } from './routerEvent'

export * from './routerEvent'

export function setupEventBus() {
  useRouterEventBus()
}
