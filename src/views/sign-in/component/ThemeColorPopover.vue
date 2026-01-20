<script setup lang="ts">
import { NPopover } from 'naive-ui'

import { ButtonAnimation } from '@/components'
import { toRefsPreferencesStore } from '@/stores'
import { twColor } from '@/utils/colors'

const { themeColor } = toRefsPreferencesStore()

const colorSwatches = [
  twColor('red', 500),
  twColor('orange', 500),
  twColor('amber', 500),
  twColor('yellow', 500),
  twColor('lime', 500),
  twColor('green', 500),
  twColor('emerald', 500),
  twColor('teal', 500),
  twColor('cyan', 500),
  twColor('sky', 500),
  twColor('blue', 500),
  twColor('indigo', 500),
  twColor('violet', 500),
  twColor('purple', 500),
  twColor('fuchsia', 500),
  twColor('pink', 500),
]
</script>
<template>
  <NPopover
    trigger="click"
    placement="bottom"
    :to="false"
  >
    <template #trigger>
      <ButtonAnimation>
        <span class="iconify ph--palette" />
      </ButtonAnimation>
    </template>
    <div class="grid grid-cols-6 gap-1.5">
      <div
        v-for="color in colorSwatches"
        :key="color"
        class="size-5 cursor-pointer rounded-full"
        :class="{
          'ring-3 ring-primary/30': color === themeColor,
        }"
        :style="{ backgroundColor: color }"
        @click="themeColor = color"
      />
    </div>
  </NPopover>
</template>
