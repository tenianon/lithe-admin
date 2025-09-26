<script setup lang="ts">
import { onMounted } from 'vue'

import { useInjection } from '@/composables'
import { layoutInjectionKey } from '@/injection'
import { toRefsPreferencesStore } from '@/stores'

import SidebarMenu from '../aside/SidebarMenu.vue'
import SidebarUserPanel from '../aside/SidebarUserPanel.vue'
import Logo from '../header/logo/index.vue'

const { layoutSlideDirection, mobileLeftAsideWidth } = useInjection(layoutInjectionKey)

const { sidebarMenu } = toRefsPreferencesStore()

onMounted(() => {
  mobileLeftAsideWidth.value = sidebarMenu.value.mobileWidth
})
</script>
<template>
  <div
    :style="{
      width: `${sidebarMenu.mobileWidth}px`,
    }"
    class="absolute top-0 left-0 flex h-svh flex-col gap-y-4 pt-6 pb-4 transition-[translate]"
    :class="{
      '-translate-x-full': layoutSlideDirection !== 'right',
    }"
  >
    <Logo />
    <SidebarMenu />
    <SidebarUserPanel />
  </div>
</template>
