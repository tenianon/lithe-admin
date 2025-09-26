<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import {
  NConfigProvider,
  NModalProvider,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider,
  NWatermark,
  NGlobalStyle,
  NEl,
} from 'naive-ui'
import { storeToRefs } from 'pinia'
import { provide, ref } from 'vue'
import { RouterView } from 'vue-router'

import Noise from '@/components/Noise.vue'
import { getConfigProviderProps } from '@/composables'
import { usePreferencesStore } from '@/stores'

import { layoutInjectionKey, mediaQueryInjectionKey } from './injection'

import type { LayoutSlideDirection } from './injection'

const { watermark, noise } = storeToRefs(usePreferencesStore())

const configProviderProps = getConfigProviderProps()

const breakpoints = useBreakpoints(breakpointsTailwind)

const layoutSlideDirection = ref<LayoutSlideDirection>(null)

const shouldRefreshRoute = ref(false)

const isSidebarColResizing = ref(false)

function setLayoutSlideDirection(direction: LayoutSlideDirection) {
  layoutSlideDirection.value = direction === layoutSlideDirection.value ? null : direction
}

provide(mediaQueryInjectionKey, {
  isMaxSm: breakpoints.smaller('sm'),
  isMaxMd: breakpoints.smaller('md'),
  isMaxLg: breakpoints.smaller('lg'),
  isMaxXl: breakpoints.smaller('xl'),
  isMax2Xl: breakpoints.smaller('2xl'),
})

provide(layoutInjectionKey, {
  shouldRefreshRoute,
  layoutSlideDirection,
  setLayoutSlideDirection,
  isSidebarColResizing,
  mobileLeftAsideWidth: ref(0),
  mobileRightAsideWidth: ref(0),
})
</script>

<template>
  <NConfigProvider v-bind="configProviderProps">
    <NGlobalStyle />
    <NEl>
      <NModalProvider>
        <NNotificationProvider placement="bottom-right">
          <NMessageProvider>
            <NDialogProvider>
              <RouterView />
              <NWatermark
                v-if="watermark.show"
                fullscreen
                v-bind="watermark"
              />
              <Noise v-if="noise.show" />
            </NDialogProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NModalProvider>
    </NEl>
  </NConfigProvider>
</template>
