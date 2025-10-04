<script setup lang="ts">
import { DEFAULT_ICON_LIST, DEFAULT_ICON_SET, IconPicker, ScrollContainer } from '@/components'
import { computed, ref } from 'vue'

const selectedIcon = ref()
const selectedPrefix = ref(DEFAULT_ICON_SET[0]) // 默认选中第一个前缀

// 只展示当前选中前缀的图标名
const iconNames = computed(() => {
  return DEFAULT_ICON_LIST
    .filter(icon => icon.startsWith(`iconify-[${selectedPrefix.value}--`))
    .map(icon => icon.replace(new RegExp(`^iconify-\\[${selectedPrefix.value}--`), '').replace(/\]$/, ''))
})
</script>

<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <div class="mb-2 flex gap-2 items-center">
      <label>图标库：</label>
      <select v-model="selectedPrefix" class="border rounded px-2 py-1">
        <option v-for="prefix in DEFAULT_ICON_SET" :key="prefix" :value="prefix">{{ prefix }}</option>
      </select>
    </div>
    <IconPicker v-model="selectedIcon" :icons="iconNames" :prefix="selectedPrefix" />
    <div>当前选中图标：{{ selectedIcon }}</div>
  </ScrollContainer>
</template>

<style scoped>

</style>
