<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { NScrollbar } from 'naive-ui'
import { provide, reactive, ref } from 'vue'

import texturePng from '@/assets/texture.png'
import { EmptyPlaceholder } from '@/components'
import { useComponentThemeOverrides } from '@/composable/comp/useComponentThemeOverrides'
import { menuInjectionKey, tabsInjectionKey } from '@/injection'
import { useConfigureStore } from '@/stores/configure'
import { useTabsStore } from '@/stores/tabs'

import AsideLayout from './aside/index.vue'
import Tabs from './component/Tabs.vue'
import FooterLayout from './footer/index.vue'
import HeaderLayout from './header/index.vue'
import MainLayout from './main/index.vue'

import type { TabsInjection } from '@/injection'

defineOptions({
  name: 'Layout',
})

const tabsStore = useTabsStore()
const configureStore = useConfigureStore()
const { scrollbarInMainLayout } = useComponentThemeOverrides()

const shouldRefresh = ref(false)

const menuCollapse = reactive({
  width: 64,
  maxWidth: 272,
})

const doRefresh: TabsInjection['doRefresh'] = (value) => {
  shouldRefresh.value = value
}

provide(menuInjectionKey, {
  collapse: menuCollapse,
})

provide(tabsInjectionKey, {
  shouldRefresh,
  doRefresh,
})
</script>
<template>
  <div class="flex h-dvh flex-col overflow-hidden">
    <div
      class="border-b border-naive-border bg-naive-card transition-[background-color,border-color] duration-300 ease-naive-bezier"
    >
      <HeaderLayout />
    </div>
    <div class="flex flex-1 overflow-hidden">
      <AsideLayout />
      <div class="relative flex flex-1 flex-col overflow-x-hidden">
        <Transition
          enter-active-class="transition-[grid-template-rows] duration-300 ease-naive-bezier"
          leave-active-class="transition-[grid-template-rows] duration-300 ease-naive-bezier"
          enter-from-class="grid-rows-[0fr]"
          leave-to-class="grid-rows-[0fr]"
          enter-to-class="grid-rows-[1fr]"
          leave-from-class="grid-rows-[1fr]"
        >
          <div
            v-if="!isEmpty(tabsStore.tabs) && configureStore.configure.showTabs"
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
          :theme-overrides="scrollbarInMainLayout"
        >
          <MainLayout />
        </NScrollbar>
        <EmptyPlaceholder
          :show="isEmpty(tabsStore.tabs)"
          description="空标签页"
          size="huge"
        >
          <template #icon>
            <div class="grid place-items-center">
              <span class="iconify ph--rectangle" />
            </div>
          </template>

          <template #content>
            <Transition
              enter-active-class="transition-[grid-template-rows] duration-300 ease-naive-bezier"
              leave-active-class="transition-[grid-template-rows] duration-300 ease-naive-bezier"
              enter-from-class="grid-rows-[0fr]"
              leave-to-class="grid-rows-[0fr]"
              enter-to-class="grid-rows-[1fr]"
              leave-from-class="grid-rows-[1fr]"
            >
              <div
                v-if="configureStore.configure.showFooter"
                class="grid shrink-0 items-baseline overflow-hidden"
              >
                <FooterLayout />
              </div>
            </Transition>
          </template>
        </EmptyPlaceholder>
      </div>
    </div>
  </div>
</template>
