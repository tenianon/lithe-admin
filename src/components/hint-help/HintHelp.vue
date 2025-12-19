<script setup lang="ts">
import { isFunction } from 'es-toolkit'
import { NButton, NPopover } from 'naive-ui'
import { isVNode } from 'vue'

import type { ButtonProps, PopoverProps } from 'naive-ui'
import type { AllowedComponentProps, HTMLAttributes, SVGAttributes, VNodeChild } from 'vue'

export interface HintHelpProps {
  buttonProps?: AllowedComponentProps & ButtonProps
  content?: (() => VNodeChild) | string
  iconProps?: SVGAttributes
  label?: string
  labelProps?: HTMLAttributes
  popoverProps?: PopoverProps
}

defineOptions({
  inheritAttrs: false,
})

const { label, popoverProps, buttonProps, iconProps, content } = defineProps<HintHelpProps>()
</script>
<template>
  <div class="flex items-center gap-x-0.5">
    <span>{{ label }}</span>
    <NPopover v-bind="popoverProps">
      <template #trigger>
        <NButton
          quaternary
          circle
          size="small"
          v-bind="buttonProps"
        >
          <template #icon>
            <span
              class="iconify ph--question"
              v-bind="iconProps"
            />
          </template>
        </NButton>
      </template>

      <component
        v-if="isFunction(content) && isVNode(content())"
        :is="content"
      />
      <span v-else>{{ content }}</span>
    </NPopover>
  </div>
</template>
