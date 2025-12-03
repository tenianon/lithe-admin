import type {
  MenuDividerOption as MenuDividerOptionRaw,
  MenuOption as MenuOptionRaw,
  MenuGroupOption as MenuGroupOptionRaw,
} from 'naive-ui'
import type { VNodeChild } from 'vue'
import type { RouteRecordRaw, RouteParamsGeneric } from 'vue-router'

type NoIndex<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K]
}

type ReplaceKeys<T, R extends Partial<Record<keyof T, unknown>>> = T extends unknown
  ? {
      [K in keyof T]: K extends keyof R ? R[K] : T[K]
    } & Omit<R, keyof T>
  : never

type CustomRouteRecordRaw = ReplaceKeys<
  RouteRecordRaw,
  {
    component: string
  }
>

type RouteOption = Omit<CustomRouteRecordRaw, 'children'> & {
  type?: never
}

export type MenuOption = ReplaceKeys<
  NoIndex<MenuOptionRaw>,
  {
    icon?: string | (() => VNodeChild)
    children?: MenuMixedOptions[]
    label?: string | (() => VNodeChild)
  }
> &
  RouteOption

type MenuGroup = NoIndex<
  ReplaceKeys<
    MenuGroupOptionRaw,
    {
      children?: Array<MenuOption | MenuDivider>
    }
  >
>

type MenuDivider = NoIndex<MenuDividerOptionRaw>

export type MenuMixedOptions = MenuOption | MenuGroup | MenuDivider

export interface CustomRouteMeta {
  title?: string | (() => VNodeChild)
  icon?: string | (() => VNodeChild)
  componentName?: string
  pinned?: boolean
  showTab?: boolean
  enableMultiTab?: boolean
  keepAlive?: boolean
  renderTabTitle?: (params: RouteParamsGeneric) => string
}
