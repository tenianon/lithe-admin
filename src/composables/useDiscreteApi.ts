import { zhCN, dateZhCN, createDiscreteApi } from 'naive-ui'
import { computed, h } from 'vue'

import { useTheme } from './useTheme'

import type { ConfigProviderProps } from 'naive-ui'

export function getConfigProviderProps() {
  const { theme, themeOverrides } = useTheme()

  const configProviderProps = computed<ConfigProviderProps>(() => ({
    locale: zhCN,
    dateLocale: dateZhCN,
    theme: theme.value,
    themeOverrides: themeOverrides.value,
    icons: {
      info: () => h('span', { class: 'iconify ph--info size-full' }),
      success: () => h('span', { class: 'iconify ph--seal-check size-full' }),
      warning: () => h('span', { class: 'iconify ph--warning size-full' }),
      error: () => h('span', { class: 'iconify ph--smiley-x-eyes size-full' }),
    },
  }))

  return configProviderProps
}

export function useDiscreteApi() {
  const configProviderProps = getConfigProviderProps()

  return createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar', 'modal'], {
    configProviderProps,
    notificationProviderProps: {
      placement: 'bottom-left',
    },
  })
}
