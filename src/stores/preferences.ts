import { useStorage, useColorMode } from '@vueuse/core'
import { defineStore, acceptHMRUpdate, storeToRefs } from 'pinia'
import { computed, watch } from 'vue'

import { pinia } from '.'

import type { WatermarkProps } from 'naive-ui'
import type { ComputedRef } from 'vue'

type NavigationMode = 'sidebar' | 'horizontal'

export interface PreferencesOptions {
  navigationMode: NavigationMode
  sidebarMenu: {
    collapsed: boolean
    minWidth: number
    width: number
    maxWidth: number
    mobileWidth: number
  }
  showFooter: boolean
  showLogo: boolean
  tabs: {
    show: boolean
    showTabClose: boolean
    tabBorderPosition: 'top' | 'bottom'
  }
  showNavigationButton: boolean
  breadcrumb: {
    show: boolean
    enableTransition: boolean
  }
  showTopLoadingBar: boolean
  navigationTransition: {
    enable: boolean
    effect: 'slider' | 'scale' | 'fade' | 'fade-left' | 'fade-right'
  }
  enableTextSelect: boolean
  watermark: {
    show: boolean
  } & Partial<WatermarkProps>

  noise: {
    show: boolean
    opacity: number
  }
}

export const DEFAULT_PREFERENCES_OPTIONS = {
  navigationMode: 'sidebar',
  sidebarMenu: {
    collapsed: false,
    minWidth: 64,
    width: 256,
    maxWidth: 456,
    mobileWidth: 256,
  },
  showFooter: true,
  tabs: {
    show: true,
    showTabClose: true,
    tabBorderPosition: 'top',
  },
  showLogo: true,
  showNavigationButton: true,
  breadcrumb: {
    show: true,
    enableTransition: true,
  },
  showTopLoadingBar: true,
  navigationTransition: {
    enable: true,
    effect: 'slider',
  },
  enableTextSelect: true,
  watermark: {
    show: false,
    content: import.meta.env.VITE_WATERMARK_CONTENT || '',
    fontColor: '#D81E1E96',
    fontSize: 16,
    width: 384,
    height: 384,
    xGap: 0,
    yGap: 0,
    xOffset: 12,
    yOffset: 60,
    globalRotate: 0,
    rotate: -20,
    textAlign: 'center',
    cross: true,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 16,
    image: '',
    imageHeight: 64,
    imageWidth: 64,
    imageOpacity: 0.5,
  },
  noise: {
    show: true,
    opacity: 20,
  },
} as const

const DEFAULT_THEME_COLOR = '#8e51ff'

export const usePreferencesStore = defineStore('preferencesStore', () => {
  const preferences = useStorage<PreferencesOptions>('preferences', DEFAULT_PREFERENCES_OPTIONS)

  const themeColor = useStorage<string>('theme-color', DEFAULT_THEME_COLOR)

  const themeMode = useColorMode({
    emitAuto: true,
    storageKey: 'theme-mode',
    disableTransition: false,
  })

  const isDark = computed(() => themeMode.state.value === 'dark')

  const computedPreferences = Object.fromEntries(
    Object.entries(preferences.value).map(([key]) => [
      key,
      computed(() => preferences.value[key as keyof PreferencesOptions]),
    ]),
  ) as { [K in keyof PreferencesOptions]: ComputedRef<PreferencesOptions[K]> }

  const reset = () => {
    Object.assign(preferences.value, structuredClone(DEFAULT_PREFERENCES_OPTIONS))
    themeColor.value = DEFAULT_THEME_COLOR
    themeMode.value = 'auto'
  }

  watch(
    () => preferences.value.enableTextSelect,
    (enabled) => {
      document.documentElement.style.userSelect = enabled ? '' : 'none'
    },
    {
      immediate: true,
    },
  )

  return {
    themeColor,
    themeMode,
    isDark,
    preferences,
    ...computedPreferences,
    reset,
  }
})

export function toRefsPreferencesStore() {
  return {
    ...storeToRefs(usePreferencesStore(pinia)),
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreferencesStore, import.meta.hot))
}
