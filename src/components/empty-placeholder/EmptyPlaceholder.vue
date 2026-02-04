<script setup lang="ts">
import { NEmpty } from 'naive-ui'

import type { EmptyPlaceholderProps } from './interface'

defineOptions({
  inheritAttrs: false,
})

const { show } = defineProps<EmptyPlaceholderProps>()
</script>
<template>
  <Transition
    type="transition"
    enter-active-class="transition-[opacity,scale]"
    enter-from-class="scale-50 opacity-0"
  >
    <div
      v-show="show"
      class="absolute inset-0 grid size-full place-items-center"
    >
      <NEmpty v-bind="$attrs">
        <template
          v-for="slot of $slots"
          :key="slot"
          #[slot]
        >
          <slot :name="slot" />
        </template>
      </NEmpty>
    </div>
  </Transition>
</template>
