<script setup lang="ts">
import { isFunction } from 'es-toolkit'
import { NPopover } from 'naive-ui'
import { isVNode } from 'vue'

import type { PopoverProps } from 'naive-ui'
import type { HTMLAttributes, SVGAttributes, VNodeChild } from 'vue'

export interface HintHelpProps {
  content?: (() => VNodeChild) | string
  iconProps?: SVGAttributes
  label?: string
  labelProps?: HTMLAttributes
  popoverProps?: PopoverProps
}

defineOptions({
  inheritAttrs: false,
})

const { label, popoverProps, iconProps, content } = defineProps<HintHelpProps>()
</script>
<template>
  <div class="flex items-center gap-x-0.5">
    <span>{{ label }}</span>
    <NPopover v-bind="popoverProps">
      <template #trigger>
        <div
          class="grid cursor-pointer place-items-center rounded-full p-0.75 transition-[background-color] hover:bg-naive-button2-hover"
        >
          <span
            class="iconify ph--question"
            v-bind="iconProps"
          />
        </div>
      </template>

      <component
        v-if="isFunction(content) && isVNode(content())"
        :is="content"
      />
      <span v-else>{{ content }}</span>
    </NPopover>
  </div>
</template>
