import { useStorage } from '@vueuse/core'
import { mergeWith } from 'lodash-es'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { watch } from 'vue'

type NavigationMode = 'sidebar' | 'horizontal'

export interface PreferencesOptions {
  navigationMode: NavigationMode
  sidebarMenu: Partial<{
    collapsed: boolean
    width: number
    maxWidth: number
  }>
  showFooter: boolean
  showLogo: boolean
  showTabs: boolean
  showTabClose: boolean
  showNavigation: boolean
  showBreadcrumb: boolean
  showWatermark: boolean
  showNoise: boolean
  showTopLoadingBar: boolean
  enableNavigationTransition: boolean
  enableTextSelect: boolean
  noiseOpacity: number
}

export const DEFAULT_PREFERENCES_OPTIONS = {
  navigationMode: 'sidebar',
  sidebarMenu: {
    collapsed: false,
    width: 64,
    maxWidth: 256,
  },
  showFooter: true,
  showTabs: true,
  showTabClose: true,
  showLogo: true,
  showNoise: true,
  showWatermark: false,
  showNavigation: true,
  showBreadcrumb: true,
  showTopLoadingBar: true,
  enableNavigationTransition: true,
  enableTextSelect: true,
  noiseOpacity: 0.02,
} as const

export const usePreferencesStore = defineStore('preferencesStore', () => {
  const preferences = useStorage<PreferencesOptions>('preferences', DEFAULT_PREFERENCES_OPTIONS)

  const modify = (options: Partial<PreferencesOptions>) => {
    preferences.value = mergeWith({}, preferences.value, options, (objValue, srcValue) => {
      if (Array.isArray(objValue) && Array.isArray(srcValue)) {
        return srcValue
      }
    })
  }

  const reset = () => {
    preferences.value = structuredClone(DEFAULT_PREFERENCES_OPTIONS)
  }

  watch(
    () => preferences.value.enableTextSelect,
    (newValue) => {
      document.documentElement.style.userSelect = newValue ? 'auto' : 'none'
    },
    {
      immediate: true,
    },
  )

  return {
    preferences,
    reset,
    modify,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePreferencesStore, import.meta.hot))
}
