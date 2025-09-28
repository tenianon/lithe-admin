<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'

import Logo from '@/components/AppLogo.vue'
import { useInjection } from '@/composables'
import { layoutInjectionKey } from '@/injection'
import { toRefsPreferencesStore, DEFAULT_PREFERENCES_OPTIONS } from '@/stores'

defineOptions({
  name: 'Logo',
})

const APP_NAME = import.meta.env.VITE_APP_NAME

const { minWidth: defaultMinWidth, width: defaultWidth } = DEFAULT_PREFERENCES_OPTIONS.sidebarMenu

const { isSidebarColResizing } = useInjection(layoutInjectionKey)

const { navigationMode, sidebarMenu: sidebarMenu, showLogo } = toRefsPreferencesStore()

const logoWrapperRef = useTemplateRef<HTMLElement>('logoWrapper')

const collapseWidth = ref(0)

watch(
  [() => navigationMode.value, () => sidebarMenu.value],
  ([navigationMode, { collapsed, width, minWidth }]) => {
    if (navigationMode === 'horizontal') {
      nextTick(() => {
        collapseWidth.value = logoWrapperRef.value?.clientWidth ?? 0
      })
    } else {
      const mergedMinWidth = minWidth || defaultMinWidth
      const mergedWidth = width || defaultWidth

      collapseWidth.value = collapsed ? mergedMinWidth : mergedWidth
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>
<template>
  <div
    class="shrink-0"
    :class="{
      'transition-[width]': !isSidebarColResizing,
    }"
    :style="
      collapseWidth > 0 && {
        width: `${collapseWidth}px`,
      }
    "
  >
    <div
      ref="logoWrapper"
      class="flex h-full items-center transition-[opacity,padding]"
      :class="[
        sidebarMenu.collapsed ? 'px-3' : 'px-4',
        {
          'opacity-0': !showLogo,
          'w-fit': navigationMode === 'horizontal',
        },
      ]"
    >
      <div class="size-10">
        <Logo />
      </div>
      <div
        class="flex flex-1 overflow-hidden transition-[margin-left,max-width]"
        :class="sidebarMenu.collapsed ? 'ml-0 max-w-0' : 'ml-4 max-w-44'"
      >
        <h1 class="truncate text-xl">
          {{ APP_NAME }}
        </h1>
      </div>
    </div>
  </div>
</template>
