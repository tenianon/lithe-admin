<script setup lang="ts">
import { useMessage, NDropdown } from 'naive-ui'
import { h } from 'vue'

import { useUserStore } from '@/stores'

import type { DropdownProps } from 'naive-ui'

interface UserDropdownProps extends /** @vue-ignore */ DropdownProps {}

defineProps<UserDropdownProps>()

defineOptions({
  inheritAttrs: false,
})

const { cleanup } = useUserStore()

const message = useMessage()

const userDropdownOptions = [
  {
    icon: () => h('span', { class: 'iconify ph--user size-5' }),
    key: 'user',
    label: '个人中心',
  },
  {
    icon: () => h('span', { class: 'iconify ph--sign-out size-5' }),
    key: 'signOut',
    label: '退出登录',
  },
]

const onUserDropdownSelected = (key: string) => {
  switch (key) {
    case 'user':
      message.info('点击了个人中心')
      break
    case 'signOut':
      cleanup()
      break
    default:
      break
  }
}
</script>
<template>
  <NDropdown
    trigger="click"
    :options="userDropdownOptions"
    show-arrow
    @select="onUserDropdownSelected"
    v-bind="$attrs"
  >
    <slot />
  </NDropdown>
</template>
