<script setup lang="ts">
import { isEmpty } from 'es-toolkit/compat'
import { computed, defineAsyncComponent, h, watch } from 'vue'

import texturePng from '@/assets/texture.png'
import { CollapseTransition, EmptyPlaceholder } from '@/components'
import { useInjection } from '@/composables'
import { mediaQueryInjectionKey, layoutInjectionKey } from '@/injection'
import { DEFAULT_PREFERENCES_OPTIONS, toRefsPreferencesStore, toRefsTabsStore } from '@/stores'

import FooterLayout from './footer/index.vue'
import HeaderLayout from './header/index.vue'
import MainLayout from './main/index.vue'
import Tabs from './tabs/index.vue'

defineOptions({
  name: 'Layout',
})

const {
  preferences,
  sidebarMenu,
  navigationMode,
  showFooter,
  tabs: tabsOptions,
} = toRefsPreferencesStore()

const AsyncMobileHeader = defineAsyncComponent(() => import('./mobile/MobileHeader.vue'))
const AsyncMobileLeftAside = defineAsyncComponent(() => import('./mobile/MobileLeftAside.vue'))
const AsyncMobileRightAside = defineAsyncComponent(() => import('./mobile/MobileRightAside.vue'))
const AsyncAsideLayout = defineAsyncComponent({
  loader: () => import('./aside/index.vue'),
  loadingComponent: () => {
    const { minWidth, width, collapsed } = sidebarMenu.value
    const { minWidth: defaultMinWidth, width: defaultWidth } =
      DEFAULT_PREFERENCES_OPTIONS.sidebarMenu
    const mergedMinWidth = minWidth || defaultMinWidth
    const mergedWidth = width || defaultWidth
    const finalWidth = collapsed ? mergedMinWidth : mergedWidth

    return h('div', {
      style: {
        width: `${finalWidth + 1}px`,
      },
    })
  },
  delay: 0,
})

const { tabs } = toRefsTabsStore()

const { isMaxSm } = useInjection(mediaQueryInjectionKey)

const {
  layoutSlideDirection,
  setLayoutSlideDirection,
  mobileLeftAsideWidth,
  mobileRightAsideWidth,
} = useInjection(layoutInjectionKey)

const layoutTranslateOffset = computed(() => {
  return layoutSlideDirection.value === 'right'
    ? mobileLeftAsideWidth.value || 0
    : layoutSlideDirection.value === 'left'
      ? -(mobileRightAsideWidth.value || 0)
      : 0
})

watch(isMaxSm, (isMaxSm) => {
  if (isMaxSm) {
    preferences.value.sidebarMenu.collapsed = false
    setLayoutSlideDirection(null)
  }
})
</script>
<template>
  <div
    class="relative h-svh overflow-hidden"
    :style="{ backgroundImage: `url(${texturePng})` }"
  >
    <AsyncMobileLeftAside v-if="isMaxSm" />

    <div
      class="relative flex h-full flex-col max-sm:bg-naive-card/50"
      :class="{
        'border-naive-border transition-[background-color,border-color,rounded,transform]': isMaxSm,
        'rounded-xl border pb-2': isMaxSm && layoutTranslateOffset,
      }"
      :style="
        isMaxSm &&
        layoutSlideDirection && {
          transform: `translate(${layoutTranslateOffset}px) scale(0.88)`,
        }
      "
    >
      <HeaderLayout v-if="!isMaxSm" />
      <AsyncMobileHeader v-else />
      <div class="flex flex-1 overflow-hidden">
        <CollapseTransition
          v-if="!isMaxSm"
          :display="navigationMode === 'sidebar'"
          content-class="min-h-0"
        >
          <AsyncAsideLayout />
        </CollapseTransition>
        <div
          class="relative flex flex-1 flex-col overflow-hidden border-t border-naive-border transition-[border-color]"
        >
          <CollapseTransition
            v-if="!isMaxSm"
            :display="!isEmpty(tabs) && tabsOptions.show"
            direction="horizontal"
            :render-content="false"
          >
            <Tabs />
          </CollapseTransition>
          <main class="relative flex-1 overflow-hidden">
            <MainLayout />
          </main>
          <EmptyPlaceholder
            :show="isEmpty(tabs)"
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
            v-if="!isMaxSm"
            :display="showFooter"
            direction="horizontal"
            :render-content="false"
          >
            <FooterLayout />
          </CollapseTransition>
        </div>
      </div>
      <div
        v-if="isMaxSm && layoutSlideDirection"
        class="absolute inset-0"
        style="z-index: 9997"
        @click="setLayoutSlideDirection(null)"
      />
    </div>
    <AsyncMobileRightAside v-if="isMaxSm" />
  </div>
</template>
