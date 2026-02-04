<script setup lang="tsx">
import { computed, ref } from 'vue'

import { useUserStore } from '@/stores'

type LoadState = 'success' | 'error' | 'loading'

const userStore = useUserStore()

const avatarUrl = computed(() => userStore.user.avatar)

const loadState = ref<LoadState>('loading')

function onImgLoad() {
  loadState.value = 'success'
}

function onImgError() {
  loadState.value = 'error'
}
</script>
<template>
  <div class="aspect-square size-full">
    <img
      v-if="avatarUrl && loadState !== 'error'"
      :src="avatarUrl"
      :class="{
        'size-full rounded-full object-fill': loadState === 'success',
      }"
      @error="onImgError"
      @load="onImgLoad"
    />

    <div
      v-if="avatarUrl && loadState === 'loading'"
      class="size-full animate-pulse rounded-full bg-neutral-250 dark:bg-neutral-750"
    ></div>
    <div v-if="!avatarUrl || loadState === 'error'">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        class="text-primary"
      >
        <defs>
          <clipPath id="a">
            <circle
              cx="320"
              cy="320"
              r="320"
              fill="none"
              stroke="#707070"
              transform="translate(626 151)"
            />
          </clipPath>
        </defs>
        <g transform="translate(-626 -151)">
          <circle
            cx="320"
            cy="320"
            r="320"
            fill="#fff"
            transform="translate(626 151)"
          />
          <g clip-path="url(#a)">
            <path
              fill="#ffb9b9"
              d="M900.5 416s13.9 104.4-7.4 116.1 126.8 12.8 126.8 12.8-33-90.6-18.1-118.3Z"
            />
            <circle
              cx="73.5"
              cy="73.5"
              r="73.5"
              fill="#ffb9b9"
              transform="translate(881.9 324.4)"
            />
            <path
              fill="currentColor"
              d="m1128 545.4-12.3 56.1-26 118.7-.8 6.5-9 75.3-6 50-4 33.5c-24.3 12.6-42 21.2-42 21.2s-1.5-7.6-4-17.3a372.9 372.9 0 0 1-75.6 15.3c9.8 10.9-141.1-266.1-146.9-303.2a3614.4 3614.4 0 0 1-9-61.4l112.4-49.7c8 18.6 45.3 24.1 45.3 24.1 30.9-2 55.1-18.4 55.1-18.4Z"
            />
            <path
              fill="#090814"
              d="m1017.8 328.4 13.7-5.5s-28.7-31.7-68.7-29l11.2-12.3s-27.5-11-52.5 17.9c-13 15.2-28.3 33-37.8 53.1H869l6.1 13.6-21.5 13.5 22.1-2.4a75.6 75.6 0 0 0-.6 22.4 29 29 0 0 0 10.6 19s17.1-35.3 17.1-40.8v13.8s13.7-12.4 13.7-20.7l7.5 9.7 3.8-15.2 46.2 15.2-7.5-12.4 28.8 4.1-11.3-15.1s32.5 17.9 33.8 33 10.8 29.5 10.8 29.5 25.4-70.8-10.8-91.4Z"
            />
            <path
              fill="currentColor"
              d="M1208 803.3c-7.5 8.2-26 20.4-48.5 33.6a2319.9 2319.9 0 0 1-89.5 48.6c-24.4 12.6-42.1 21.2-42.1 21.2s-1.5-7.6-4-17.3c-3.3-13-8.2-30-13.3-37.4l-.6-.8c-1.5-2-3-3-4.5-3L1080 802l32.2-20-23.2-55.3-29-69.4 17.5-55.8 17.6-56h33s11 23.8 25 57.1l6.5 15.5c28.7 70 64.6 167.8 48.5 185.2ZM875.5 851.3a47.8 47.8 0 0 0-8.1.7c-23 4-29.8 24.7-31.7 38.7a71.8 71.8 0 0 0-.7 12.8L814.7 888l-7.4-5.7a134.9 134.9 0 0 1-47.5-30.2 238.5 238.5 0 0 1-32-38 334.1 334.1 0 0 1-24.6-42.3 31.2 31.2 0 0 1-.5-26.5l25.2-56 36.7-82q.4-2.9 1-5.7c7.2-41.8 26.8-60.3 26.8-60.3h14.9l10 60.3 12.4 75L821 705l-20.1 65.4 19.2 20.9Z"
            />
            <path
              fill="#090814"
              d="M1147.2 629.7H980.8v-3.4h-75.5v3.4H738.2a11.3 11.3 0 0 0-11.3 11.3v228a11.3 11.3 0 0 0 11.3 11.2h409a11.3 11.3 0 0 0 11.3-11.3V641a11.3 11.3 0 0 0-11.3-11.3Z"
            />
            <circle
              cx="25"
              cy="25"
              r="25"
              fill="#fff"
              transform="translate(921.4 684.3)"
            />
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>
