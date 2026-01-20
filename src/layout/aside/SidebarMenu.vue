<script setup lang="ts">
import { NMenu, NScrollbar } from 'naive-ui'
import { ref, useTemplateRef, watch } from 'vue'

import router from '@/router'
import { resolveMenu } from '@/router/helper'
import { toRefsPreferencesStore, toRefsUserStore } from '@/stores'

import type { MenuInst } from 'naive-ui'

const { sidebarMenu } = toRefsPreferencesStore()

const { user } = toRefsUserStore()

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
      :options="resolveMenu(user.menu)"
      :dropdown-props="{
        size: 'medium',
        trigger: 'click',
      }"
    />
  </NScrollbar>
</template>
