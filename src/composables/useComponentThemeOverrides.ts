import { computed } from 'vue'

import { toRefsPreferencesStore } from '@/stores/preferences'
import twc from '@/utils/tailwindColor'

import type { GlobalThemeOverrides } from 'naive-ui'

export function useComponentThemeOverrides() {
  const { isDark } = toRefsPreferencesStore()

  const scrollbarInMainLayout = computed<GlobalThemeOverrides['Scrollbar']>(() =>
    isDark.value
      ? {
          color: twc.neutral[800],
          colorHover: twc.neutral[750],
        }
      : {
          color: twc.neutral[350],
          colorHover: twc.neutral[400],
        },
  )

  const overlayThemeOverrides = computed<GlobalThemeOverrides>(() => {
    const DARK: GlobalThemeOverrides = {
      Input: {
        color: twc.neutral[750],
        border: `1px solid ${twc.neutral[700]}`,
      },
    }

    return isDark.value
      ? {
          Input: DARK.Input,
          Scrollbar: {
            color: twc.neutral[750],
            colorHover: twc.neutral[700],
          },
          Select: {
            peers: {
              InternalSelection: {
                ...DARK.Input,
              },
              InternalSelectMenu: {
                color: twc.neutral[700],
                optionColorActivePending: twc.neutral[600],
                optionColorPending: twc.neutral[600],
                peers: {
                  Scrollbar: {
                    color: twc.neutral[600],
                    colorHover: twc.neutral[550],
                  },
                },
              },
            },
          },
        }
      : {
          Scrollbar: {
            color: twc.neutral[200],
            colorHover: twc.neutral[250],
          },
        }
  })

  return {
    scrollbarInMainLayout,
    overlayThemeOverrides,
  }
}
