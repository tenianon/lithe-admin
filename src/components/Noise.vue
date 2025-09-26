<script setup lang="ts">
import noisePng from '@/assets/noise.png'
import { toRefsPreferencesStore } from '@/stores'

const { noise } = toRefsPreferencesStore()
</script>
<template>
  <div
    class="pointer-events-none fixed inset-0 z-[99998] size-full"
    :style="{
      backgroundImage: `url(${noisePng})`,
      opacity: noise.opacity / 1000,
    }"
  />
</template>
