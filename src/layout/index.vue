<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { computed, defineAsyncComponent, watch } from 'vue'

import texturePng from '@/assets/texture.png'
import { CollapseTransition, EmptyPlaceholder } from '@/components'
import { useInjection } from '@/composables'
import { mediaQueryInjectionKey, layoutInjectionKey } from '@/injection'
import { usePreferencesStore, useTabsStore } from '@/stores'

import AsideLayout from './aside/index.vue'
import Tabs from './component/Tabs.vue'
import FooterLayout from './footer/index.vue'
import HeaderLayout from './header/index.vue'
import MainLayout from './main/index.vue'

defineOptions({
  name: 'Layout',
})

const AsyncMobileHeader = defineAsyncComponent(() => import('./mobile/MobileHeader.vue'))
const AsyncMobileLeftAside = defineAsyncComponent(() => import('./mobile/MobileLeftAside.vue'))
const AsyncMobileRightAside = defineAsyncComponent(() => import('./mobile/MobileRightAside.vue'))

const tabsStore = useTabsStore()

const preferencesStore = usePreferencesStore()

const { isSmallScreen } = useInjection(mediaQueryInjectionKey)

const { layoutSlideDirection, setLayoutSlideDirection } = useInjection(layoutInjectionKey)

const layoutTranslateOffset = computed(() => {
  return layoutSlideDirection.value === 'right'
    ? preferencesStore.preferences.sidebarMenu.maxWidth || 0
    : layoutSlideDirection.value === 'left'
      ? -(preferencesStore.preferences.sidebarMenu.width || 0)
      : 0
})

watch(isSmallScreen, (isSmallScreen) => {
  if (isSmallScreen) {
    preferencesStore.modify({
      sidebarMenu: {
        collapsed: false,
      },
    })
    setLayoutSlideDirection(null)
  }
})
</script>
<template>
  <div
    class="relative flex h-svh overflow-hidden"
    :style="{ backgroundImage: `url(${texturePng})` }"
  >
    <AsyncMobileLeftAside v-if="isSmallScreen" />

    <div
      class="relative flex h-full w-full flex-col max-sm:bg-naive-card/50"
      :class="{
        'border-naive-border transition-[background-color,border-color,rounded,transform]':
          isSmallScreen,
        'rounded-xl border pb-2': isSmallScreen && layoutTranslateOffset,
      }"
      :style="
        isSmallScreen &&
        layoutSlideDirection && {
          transform: `translate(${layoutTranslateOffset}px) scale(0.88)`,
        }
      "
    >
      <HeaderLayout v-if="!isSmallScreen" />
      <AsyncMobileHeader v-else />
      <div class="flex flex-1 overflow-hidden">
        <CollapseTransition
          v-if="!isSmallScreen"
          :display="preferencesStore.preferences.navigationMode === 'sidebar'"
          content-class="min-h-0"
        >
          <AsideLayout />
        </CollapseTransition>

        <div class="relative flex flex-1 flex-col overflow-hidden">
          <CollapseTransition
            v-if="!isSmallScreen"
            :display="!isEmpty(tabsStore.tabs) && preferencesStore.preferences.showTabs"
            direction="horizontal"
            :render-content="false"
          >
            <Tabs />
          </CollapseTransition>
          <div class="relative flex-1 overflow-hidden">
            <MainLayout />
          </div>
          <EmptyPlaceholder
            :show="isEmpty(tabsStore.tabs)"
            description="空标签页"
            size="huge"
          >
            <template #icon>
              <div class="flex items-center justify-center">
                <span class="iconify ph--rectangle" />
              </div>
            </template>
          </EmptyPlaceholder>
          <CollapseTransition
            v-if="!isSmallScreen"
            :display="preferencesStore.preferences.showFooter"
            direction="horizontal"
            :render-content="false"
          >
            <FooterLayout />
          </CollapseTransition>
        </div>
      </div>
      <div
        v-if="isSmallScreen && layoutSlideDirection"
        class="absolute inset-0"
        style="z-index: 9997"
        @click="setLayoutSlideDirection(null)"
      />
    </div>
    <AsyncMobileRightAside v-if="isSmallScreen" />
  </div>
</template>
