import type { VNodeChild } from 'vue'
import type { RouteParamsGeneric } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string | (() => VNodeChild)
    icon?: string | (() => VNodeChild)
    componentName?: string
    pinned?: boolean
    showTab?: boolean
    enableMultiTab?: boolean
    keepAlive?: boolean
    renderTabTitle?: (params: RouteParamsGeneric) => string
  }
}
