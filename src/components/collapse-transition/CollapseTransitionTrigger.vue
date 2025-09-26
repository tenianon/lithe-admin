<script setup lang="ts">
import { computed } from 'vue'

import CollapseTransition from './CollapseTransition.vue'

import type { CollapseTransitionTriggerProps, CollapseTransitionTriggerSlot } from './interface'

const {
  defaultCollapsed,
  direction = 'horizontal',
  type = 'transition',
  displayDirective = 'show',
  contentTag = 'div',
  renderContent = true,
  ...props
} = defineProps<CollapseTransitionTriggerProps>()

defineSlots<CollapseTransitionTriggerSlot>()

const collapsed = defineModel<boolean>({ default: undefined })

defineOptions({
  inheritAttrs: false,
})

const mergedCollapsed = computed(() => collapsed.value ?? defaultCollapsed)

const handleTriggerClick = () => {
  collapsed.value = !collapsed.value
}
</script>
<template>
  <div>
    <div
      class="cursor-pointer"
      @click="handleTriggerClick"
    >
      <slot
        name="trigger"
        :collapsed="mergedCollapsed"
      />
    </div>
    <CollapseTransition
      v-bind="{
        direction,
        type,
        displayDirective,
        contentTag,
        renderContent,
        ...props,
      }"
      :display="mergedCollapsed"
      ><slot name="default"
    /></CollapseTransition>
  </div>
</template>
