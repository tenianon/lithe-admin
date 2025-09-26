<script setup lang="ts">
import { usePreferencesStore } from '@/stores'

const { preferences } = usePreferencesStore()
</script>
<template>
  <div class="flex justify-center gap-6">
    <div
      class="flex h-16 w-20 cursor-pointer flex-col rounded border border-neutral-350 outline-offset-4 transition-[outline] max-sm:pointer-events-none max-sm:opacity-50 dark:border-neutral-650"
      :class="
        preferences.navigationMode === 'sidebar'
          ? 'outline-2 outline-primary/50'
          : 'outline-2 outline-transparent hover:outline-primary/30'
      "
      @click="preferences.navigationMode = 'sidebar'"
    >
      <div class="flex h-2.5">
        <div class="h-full w-5 shrink-0 border-r border-neutral-350 dark:border-neutral-650"></div>
        <div
          class="flex w-full items-center justify-between border-b border-neutral-350 p-0.5 dark:border-neutral-650"
        >
          <div class="flex items-center gap-x-[1px]">
            <div
              v-for="i in 2"
              :key="i"
              class="size-1 rounded-full border border-primary"
            />
            <div class="h-1 w-2 border border-primary" />
          </div>
          <div class="flex items-center gap-x-[1px]">
            <div
              v-for="i in 4"
              :key="i"
              class="size-1 rounded-full border border-neutral-350 dark:border-neutral-650"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-1">
        <div class="flex w-5 flex-col border-r border-neutral-350 p-0.5 dark:border-neutral-650">
          <div class="mb-0.5 h-2 w-full flex-1 rounded-xs border border-primary" />
          <div class="h-2 w-full rounded-xs border border-primary" />
        </div>
        <div class="flex flex-1">
          <div class="h-1 w-full border-b border-neutral-350 dark:border-neutral-650"></div>
        </div>
      </div>
    </div>
    <div
      class="flex h-16 w-20 cursor-pointer flex-col rounded border border-neutral-350 outline-offset-4 transition-[outline] duration-300 max-sm:pointer-events-none max-sm:opacity-50 dark:border-neutral-650"
      :class="
        preferences.navigationMode === 'horizontal'
          ? 'outline-2 outline-primary/50'
          : 'outline-2 outline-transparent hover:outline-primary/30'
      "
      @click="preferences.navigationMode = 'horizontal'"
    >
      <div class="flex h-2.5 border-b border-neutral-350 dark:border-neutral-650">
        <div class="h-full w-3 shrink-0"></div>
        <div class="flex w-full items-center justify-between p-0.5">
          <div class="flex items-center gap-x-[1px]">
            <div
              v-for="i in 5"
              :key="i"
              class="h-1 w-1.5 border border-primary"
            />
          </div>
          <div class="flex items-center gap-x-[1px]">
            <div
              v-for="i in 3"
              :key="i"
              class="size-1 rounded-full border border-neutral-350 dark:border-neutral-650"
            />
            <div class="size-1 rounded-full bg-primary" />
          </div>
        </div>
      </div>
      <div class="flex flex-1">
        <div class="flex flex-1">
          <div class="h-1 w-full border-b border-neutral-350 dark:border-neutral-650"></div>
        </div>
      </div>
    </div>
  </div>
</template>
