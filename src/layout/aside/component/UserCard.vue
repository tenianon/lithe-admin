<script setup lang="ts">
import { useMessage, NDropdown, NAvatar } from 'naive-ui'
import { h } from 'vue'

import { ButtonAnimation } from '@/components'
import DefaultAvatar from '@/components/Avatar.vue'
import { useConfigureStore } from '@/stores/configure'
import { useUserStore } from '@/stores/user'

const configureStore = useConfigureStore()
const userStore = useUserStore()
const message = useMessage()

const userDropdownOptions = [
  {
    icon: () => h('span', { class: 'iconify ph--user size-5' }),
    key: 'user',
    label: '个人中心',
  },
  {
    icon: () => h('span', { class: 'iconify ph--sign-out size-5' }),
    key: 'signout',
    label: '退出登录',
  },
]

const handleUserCardClick = () => {
  message.info('你可以把它设计成有背景的User Card')
}

const onUserDropdownSelected = (key: string) => {
  switch (key) {
    case 'user':
      message.info('点击了个人中心')
      break
    case 'signout':
      userStore.cleanup()
      break
  }
}
</script>
<template>
  <div
    class="mb-4 flex cursor-pointer items-center transition-[background-color,border-radius,margin,padding] duration-300 hover:bg-neutral-200/90 dark:hover:bg-neutral-750/65"
    :class="
      configureStore.configure.menuCollapsed
        ? 'mx-2 rounded'
        : 'mx-4 rounded-xl bg-neutral-150 py-3.5 pr-2.5 pl-3.5 dark:bg-neutral-800'
    "
    @click="handleUserCardClick"
  >
    <NDropdown
      :options="userDropdownOptions"
      show-arrow
      @select="onUserDropdownSelected"
      placement="right-end"
      :disabled="!configureStore.configure.menuCollapsed"
    >
      <div
        class="grid place-items-center overflow-hidden rounded-full transition-[margin,padding] duration-300 ease-naive-bezier"
        :class="configureStore.configure.menuCollapsed ? 'mr-0 px-2 py-1.5' : 'mr-2'"
      >
        <div
          class="flex items-center justify-center overflow-hidden transition-[height,width] duration-300 ease-naive-bezier"
          :class="configureStore.configure.menuCollapsed ? 'size-8' : 'size-10'"
        >
          <NAvatar
            round
            src="src path"
            size="large"
            class="aspect-square"
            style="height: unset"
          >
            <template #fallback>
              <DefaultAvatar class="text-primary" />
            </template>
          </NAvatar>
        </div>
      </div>
    </NDropdown>
    <Transition
      enter-active-class="transition-[grid-template-columns] duration-150 ease-naive-bezier"
      leave-active-class="transition-[grid-template-columns] duration-150 ease-naive-bezier"
      enter-from-class="grid-cols-[0fr]"
      leave-to-class="grid-cols-[0fr]"
      enter-to-class="grid-cols-[1fr]"
      leave-from-class="grid-cols-[1fr]"
    >
      <div
        class="grid flex-1 overflow-hidden"
        v-show="!configureStore.configure.menuCollapsed"
      >
        <div class="flex min-w-0 items-center overflow-hidden">
          <div class="flex flex-1 flex-col gap-y-px">
            <span class="truncate text-sm">
              {{ userStore.user.name }}
            </span>
            <span class="truncate text-xs text-neutral-450 dark:text-neutral-500">
              这里应该写点什么
            </span>
          </div>

          <NDropdown
            trigger="click"
            :options="userDropdownOptions"
            show-arrow
            @select="onUserDropdownSelected"
            placement="top"
          >
            <ButtonAnimation
              animation="rotate"
              title="设置"
            >
              <span class="iconify text-neutral-500 ph--gear dark:text-neutral-450" />
            </ButtonAnimation>
          </NDropdown>
        </div>
      </div>
    </Transition>
  </div>
</template>
