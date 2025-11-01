<script setup lang="ts">
import { NMenu, NScrollbar } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref, useTemplateRef, watch } from 'vue'

import router from '@/router'
import { toRefsPreferencesStore, useUserStore } from '@/stores'

import type { MenuInst } from 'naive-ui'

const { sidebarMenu } = toRefsPreferencesStore()

const { menuList } = storeToRefs(useUserStore())

const menuRef = useTemplateRef<MenuInst>('menuRef')

const menuActiveKey = ref('')

watch(
  () => router.currentRoute.value,
  (newRoute) => {
    menuActiveKey.value = newRoute.name as string
    menuRef.value?.showOption(menuActiveKey.value)
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <NScrollbar>
    <NMenu
      ref="menuRef"
      :collapsed-width="sidebarMenu.minWidth"
      :collapsed="sidebarMenu.collapsed"
      :collapsed-icon-size="20"
      :value="menuActiveKey"
      :options="menuList"
      :dropdown-props="{
        size: 'medium',
        trigger: 'click',
      }"
    />
  </NScrollbar>
</template>
