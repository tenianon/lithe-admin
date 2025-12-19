import { isFunction, omit, isString, pickBy } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { h } from 'vue'
import { RouterLink } from 'vue-router'

import type { MenuMixedOptions, MenuOption } from './interface'
import type { MenuProps } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

export function resolveMenu(options: MenuMixedOptions[], parentDisabled = false) {
  const menuOptions: MenuProps['options'] = []

  options.forEach((item) => {
    if (!item.type || item.type === 'group') {
      const { children, name, path, label, icon, key, disabled, extra, props, show, type } =
        item as MenuOption

      const mergedDisabled = parentDisabled || disabled

      const renderIcon = icon
        ? isFunction(icon)
          ? icon
          : () => h('span', { class: `${icon}` })
        : null

      const menu = pickBy(
        {
          key: key || name || path,
          icon: renderIcon,
          label,
          disabled,
          extra,
          props,
          show,
          type,
          name,
        },
        (v) => v !== undefined,
      ) as NonNullable<MenuProps['options']>[number]

      if (Array.isArray(children) && !isEmpty(children)) {
        menu.children = resolveMenu(children, mergedDisabled)
      } else {
        menu.label =
          mergedDisabled || isFunction(label)
            ? label
            : () => h(RouterLink, { to: { name } }, { default: () => label })
      }

      menuOptions.push(menu)
    } else {
      menuOptions.push(item)
    }
  })

  return menuOptions
}

export function resolveRoute(options: MenuMixedOptions[]) {
  const modules = import.meta.glob('@/views/**/*.vue')

  const routeOptions: RouteRecordRaw[] = []

  function flattenOptions(options: MenuMixedOptions[]): MenuMixedOptions[] {
    return options.flatMap((item) => {
      if (item.type === 'divider') {
        return []
      }

      if (item.type === 'group' && Array.isArray(item.children) && !isEmpty(item.children)) {
        return flattenOptions(item.children)
      }

      return [item]
    })
  }

  flattenOptions(options).forEach((item) => {
    const { label, icon, meta, component, children, disabled, ...rest } = item as MenuOption

    if (!disabled) {
      let componentModule: (() => Promise<unknown>) | null = null

      if (!isEmpty(component) && isString(component)) {
        const extractName = component.replace(/^\/|\.vue$/g, '')
        const modulePath = `/src/views/${extractName}.vue`
        if (modules[modulePath]) {
          componentModule = modules[modulePath]
        }
      }

      const route = omit(
        {
          ...rest,
          ...(componentModule ? { component: componentModule } : {}),
          meta: {
            ...meta,
            title: meta?.title || label,
            icon,
          },
        },
        ['type', 'label', 'icon', 'disabled', 'extra', 'props', 'show', 'key'],
      ) as RouteRecordRaw

      if (Array.isArray(children) && !isEmpty(children)) {
        route.children = resolveRoute(children)
      }

      routeOptions.push(route)
    }
  })

  return routeOptions
}
