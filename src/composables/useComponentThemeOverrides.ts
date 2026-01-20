import { computed } from 'vue'

import { toRefsPreferencesStore } from '@/stores/preferences'
import { twColor } from '@/utils/colors'

import type { GlobalThemeOverrides } from 'naive-ui'

export function useComponentThemeOverrides() {
  const { isDark } = toRefsPreferencesStore()

  const scrollbarInMainLayout = computed<GlobalThemeOverrides['Scrollbar']>(() =>
    isDark.value
      ? {
          color: twColor('neutral', 800),
          colorHover: twColor('neutral', 750),
        }
      : {
          color: twColor('neutral', 350),
          colorHover: twColor('neutral', 400),
        },
  )

  const overlayThemeOverrides = computed<GlobalThemeOverrides>(() => {
    const DARK: GlobalThemeOverrides = {
      Input: {
        color: twColor('neutral', 750),
        border: `1px solid ${twColor('neutral', 700)}`,
      },
    }

    return isDark.value
      ? {
          Input: DARK.Input,
          Scrollbar: {
            color: twColor('neutral', 750),
            colorHover: twColor('neutral', 700),
          },
          Select: {
            peers: {
              InternalSelection: {
                ...DARK.Input,
              },
              InternalSelectMenu: {
                color: twColor('neutral', 700),
                optionColorActivePending: twColor('neutral', 600),
                optionColorPending: twColor('neutral', 600),
                peers: {
                  Scrollbar: {
                    color: twColor('neutral', 600),
                    colorHover: twColor('neutral', 550),
                  },
                },
              },
            },
          },
        }
      : {
          Scrollbar: {
            color: twColor('neutral', 200),
            colorHover: twColor('neutral', 250),
          },
        }
  })

  return {
    scrollbarInMainLayout,
    overlayThemeOverrides,
  }
}
