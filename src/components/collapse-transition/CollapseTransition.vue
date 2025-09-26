<script setup lang="ts">
import type { CollapseTransitionProps } from './interface'

defineOptions({
  inheritAttrs: false,
})

const {
  direction = 'vertical',
  type = 'transition',
  displayDirective = 'if',
  display,
  duration,
  contentTag = 'div',
  renderContent = true,
  contentClass,
  contentStyle,
  containerClass,
  containerStyle,
} = defineProps<CollapseTransitionProps>()

const DIRECTION_CLASSES_MAP = {
  vertical: {
    activeClass: 'transition-[grid-template-columns] overflow-hidden',
    fromClass: 'grid-cols-[0fr]',
    toClass: 'grid-cols-[1fr]',
    contentClass: 'min-w-0',
  },
  horizontal: {
    activeClass: 'transition-[grid-template-rows] overflow-hidden',
    fromClass: 'grid-rows-[0fr]',
    toClass: 'grid-rows-[1fr]',
    contentClass: 'min-h-0',
  },
}
</script>
<template>
  <Transition
    :type="type"
    :enter-active-class="DIRECTION_CLASSES_MAP[direction].activeClass"
    :leave-active-class="DIRECTION_CLASSES_MAP[direction].activeClass"
    :enter-from-class="DIRECTION_CLASSES_MAP[direction].fromClass"
    :leave-to-class="DIRECTION_CLASSES_MAP[direction].fromClass"
    :enter-to-class="DIRECTION_CLASSES_MAP[direction].toClass"
    :leave-from-class="DIRECTION_CLASSES_MAP[direction].toClass"
    v-bind="$attrs"
  >
    <div
      v-if="displayDirective === 'if' ? display : true"
      v-show="displayDirective === 'show' ? display : true"
      class="grid"
      :class="containerClass"
      :style="[
        typeof duration === 'number' && {
          transitionDuration: `${duration}ms`,
        },
        containerStyle,
      ]"
    >
      <component
        v-if="renderContent"
        :is="contentTag"
        :class="[DIRECTION_CLASSES_MAP[direction].contentClass, contentClass]"
        :style="contentStyle"
      >
        <slot />
      </component>
      <slot v-else />
    </div>
  </Transition>
</template>
