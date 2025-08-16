<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { NScrollbar } from 'naive-ui'

import texturePng from '@/assets/texture.png'
import { EmptyPlaceholder } from '@/components'
import { usePreferencesStore } from '@/stores/preferences'
import { useTabsStore } from '@/stores/tabs'

import AsideLayout from './aside/index.vue'
import Tabs from './component/Tabs.vue'
import FooterLayout from './footer/index.vue'
import HeaderLayout from './header/index.vue'
import MainLayout from './main/index.vue'

defineOptions({
  name: 'Layout',
})

const tabsStore = useTabsStore()
const preferencesStore = usePreferencesStore()
</script>
<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <div
      class="border-b border-naive-border bg-naive-card transition-[background-color,border-color]"
    >
      <HeaderLayout />
    </div>
    <div class="flex flex-1 overflow-hidden">
      <AsideLayout />
      <div class="relative flex flex-1 flex-col overflow-x-hidden">
        <Transition
          type="transition"
          enter-active-class="transition-[grid-template-rows]"
          leave-active-class="transition-[grid-template-rows]"
          enter-from-class="grid-rows-[0fr]"
          leave-to-class="grid-rows-[0fr]"
          enter-to-class="grid-rows-[1fr]"
          leave-from-class="grid-rows-[1fr]"
        >
          <div
            v-if="!isEmpty(tabsStore.tabs) && preferencesStore.preferences.showTabs"
            class="grid shrink-0 items-baseline overflow-hidden"
          >
            <Tabs />
          </div>
        </Transition>
        <NScrollbar
          container-class="main-container"
          :container-style="{
            backgroundImage: `url(${texturePng})`,
          }"
        >
          <MainLayout />
        </NScrollbar>
        <EmptyPlaceholder
          :show="isEmpty(tabsStore.tabs)"
          description="空标签页"
          size="huge"
        >
          <template #icon>
            <div class="flex items-center justify-center">
              <span class="iconify ph--rectangle" />
            </div>
          </template>
        </EmptyPlaceholder>
        <Transition
          type="transition"
          enter-active-class="transition-[grid-template-rows]"
          leave-active-class="transition-[grid-template-rows]"
          enter-from-class="grid-rows-[0fr]"
          leave-to-class="grid-rows-[0fr]"
          enter-to-class="grid-rows-[1fr]"
          leave-from-class="grid-rows-[1fr]"
        >
          <div
            v-if="preferencesStore.preferences.showFooter"
            class="grid shrink-0 items-baseline overflow-hidden"
          >
            <FooterLayout />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
