<script setup lang="ts">
import { useDialog } from 'naive-ui'

import { ButtonAnimation } from '@/components'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const dialog = useDialog()

const handleSignOutClick = () => {
  dialog.info({
    title: '退出登录',
    content: '确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: cleanupUserInfo,
  })
}

function cleanupUserInfo() {
  userStore.cleanup()
}
</script>
<template>
  <ButtonAnimation @click="handleSignOutClick">
    <span class="iconify size-5 ph--sign-out" />
  </ButtonAnimation>
</template>
