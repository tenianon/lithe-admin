<script setup lang="ts">
import { NScrollbar } from 'naive-ui'
import { getCurrentInstance } from 'vue'

import { useComponentThemeOverrides } from '@/composables/useComponentThemeOverrides'

import type { ScrollbarProps } from 'naive-ui'
import type { CSSProperties, ComponentPublicInstance } from 'vue'

export interface ContentWrapperProps extends /* @vue-ignore */ ScrollbarProps {
  scrollable?: boolean
  wrapperClass?: string
  wrapperStyle?: CSSProperties
}

defineOptions({
  inheritAttrs: false,
})

const { scrollable = true, wrapperClass, wrapperStyle } = defineProps<ContentWrapperProps>()

const { scrollbarInMainLayout } = useComponentThemeOverrides()

const instance = getCurrentInstance()

function forwardRef(ref: Element | ComponentPublicInstance | null) {
  if (instance) {
    instance.exposed = ref || {}
    instance.exposeProxy = ref || {}
  }
}
</script>
<template>
  <div class="h-full">
    <NScrollbar
      v-if="scrollable"
      :ref="forwardRef"
      :theme-overrides="scrollbarInMainLayout"
      v-bind="$attrs"
    >
      <div
        class="p-4 max-sm:p-2"
        :class="wrapperClass"
        :style="wrapperStyle"
      >
        <slot />
      </div>
    </NScrollbar>
    <div
      v-else
      class="h-full p-4 max-sm:p-2"
      :class="wrapperClass"
      :style="wrapperStyle"
    >
      <slot />
    </div>
  </div>
</template>
