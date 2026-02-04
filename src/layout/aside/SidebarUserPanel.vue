<script setup lang="ts">
import { useMessage } from 'naive-ui'

import { ButtonAnimation } from '@/components'
import UserAvatar from '@/components/UserAvatar.vue'
import UserDropdown from '@/components/UserDropdown.vue'
import { toRefsPreferencesStore, toRefsUserStore } from '@/stores'

const { sidebarMenu } = toRefsPreferencesStore()

const { user } = toRefsUserStore()

const message = useMessage()

const handleUserPanelClick = () => {
  message.info('你可以把它设计成有背景的User Card')
}
</script>
<template>
  <div
    class="flex cursor-pointer items-center transition-[background-color,border-radius,margin,padding] hover:bg-neutral-185 dark:hover:bg-neutral-775"
    :class="
      sidebarMenu.collapsed
        ? 'mx-2 rounded-naive px-2 py-1.5'
        : 'mx-4 rounded-xl bg-neutral-150 py-3.5 pr-2.5 pl-3.5 dark:bg-neutral-800'
    "
    @click="handleUserPanelClick"
  >
    <UserDropdown
      placement="right-end"
      :disabled="!sidebarMenu.collapsed"
    >
      <div
        class="grid aspect-square place-items-center overflow-hidden rounded-full transition-[margin]"
        :class="{
          'mr-2': !sidebarMenu.collapsed,
        }"
      >
        <div
          class="flex items-center justify-center overflow-hidden transition-[height,width]"
          :class="sidebarMenu.collapsed ? 'w-8' : 'w-10'"
        >
          <UserAvatar />
        </div>
      </div>
    </UserDropdown>
    <Transition
      type="transition"
      enter-active-class="transition-[grid-template-columns] duration-150"
      leave-active-class="transition-[grid-template-columns] duration-150"
      enter-from-class="grid-cols-[0fr]"
      leave-to-class="grid-cols-[0fr]"
      enter-to-class="grid-cols-[1fr]"
      leave-from-class="grid-cols-[1fr]"
    >
      <div
        class="flex flex-1 items-center justify-between overflow-hidden"
        v-show="!sidebarMenu.collapsed"
      >
        <div class="flex flex-col gap-y-px overflow-hidden">
          <span class="truncate text-sm">
            {{ user.name }}
          </span>
          <span class="truncate text-xs text-neutral-450 dark:text-neutral-500">
            这里或许可以写点什么
          </span>
        </div>

        <UserDropdown placement="top">
          <ButtonAnimation
            animation="rotate"
            title="设置"
          >
            <span class="iconify text-neutral-500 ph--gear dark:text-neutral-450" />
          </ButtonAnimation>
        </UserDropdown>
      </div>
    </Transition>
  </div>
</template>
