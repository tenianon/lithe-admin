<script setup lang="ts">
import { defineAsyncComponent, h } from 'vue'

import { ButtonAnimation } from '@/components'
import { useInjection } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'
import { toRefsPreferencesStore } from '@/stores'

import FullScreen from './FullScreen.vue'
import PreferencesDrawer from './PreferencesDrawer.vue'
import SignOut from './SignOut.vue'
import ThemeModePopover from './ThemeModePopover.vue'
defineOptions({
  name: 'Actions',
})

const AsyncAvatarDropdown = defineAsyncComponent({
  loader: () => import('./AvatarDropdown.vue'),
  loadingComponent: () => h('div', { style: { width: '34px', marginLeft: '4px' } }),
  delay: 0,
})

const { isMaxSm } = useInjection(mediaQueryInjectionKey)
const { navigationMode } = toRefsPreferencesStore()
</script>
<template>
  <div class="flex items-center">
    <ButtonAnimation
      :animation="false"
      tag="a"
      href="https://github.com/tenianon/lithe-admin"
      target="_blank"
    >
      <span class="icon-[mdi--github]" />
    </ButtonAnimation>
    <FullScreen />
    <ThemeModePopover />
    <PreferencesDrawer />
    <SignOut />
    <AsyncAvatarDropdown v-if="!isMaxSm && navigationMode === 'horizontal'" />
  </div>
</template>
