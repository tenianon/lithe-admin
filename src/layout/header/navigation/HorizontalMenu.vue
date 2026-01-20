<script setup lang="ts">
import { useElementSize, watchThrottled, useTemplateRefsList } from '@vueuse/core'
import { isFunction } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { NDropdown } from 'naive-ui'
import { h, computed, ref, watch, onBeforeUnmount, reactive, useTemplateRef, onMounted } from 'vue'

import router from '@/router'
import { useUserStore } from '@/stores'

import type { DropdownProps } from 'naive-ui'

type Key = string | number | undefined

const MENU = {
  MORE_BUTTON_WIDTH: 44,
  ITEM_COLUMN_GAP: 4,
  BOUNDARY_OFFSET: 1,
}

const userStore = useUserStore()

const navigationContainerRef = ref<HTMLElement | null>(null)

const { width: containerWidth, stop: stopObserveContainerSize } =
  useElementSize(navigationContainerRef)

const menuActiveKey = ref('')

const navigationWrapperRef = useTemplateRef<HTMLElement>('navigationWrapper')

const menuRefsList = useTemplateRefsList<HTMLDivElement>()

const threshold = ref(Number.POSITIVE_INFINITY)

const menuRightBoundMap = reactive(new Map<Key, number>())

const moreDropdownOptions = computed<DropdownProps['options']>(() => {
  return userStore.userMenu.filter((item) => {
    if (item.type) return false
    const menuRightBound = menuRightBoundMap.get(item.key) ?? 0
    return menuRightBound > threshold.value
  })
})

const shouldShowMore = computed(
  () => Array.isArray(moreDropdownOptions.value) && !isEmpty(moreDropdownOptions.value),
)

function hasActiveChild(children: unknown) {
  if (!Array.isArray(children)) return false
  const stack = [...children]
  while (stack.length) {
    const node = stack.pop()
    if (node?.key === menuActiveKey.value) return true
    if (Array.isArray(node?.children)) {
      stack.push(...node.children)
    }
  }
  return false
}

const renderIcon: DropdownProps['renderIcon'] = (option) => {
  return isFunction(option.icon)
    ? h(option.icon, {
        class: 'ml-1.5 size-5',
      })
    : null
}

function updateMenuVisibility(containerWidth: number) {
  if (containerWidth <= 0) return

  containerWidth += MENU.BOUNDARY_OFFSET

  const widthWithoutMore = containerWidth
  const widthWithMore = containerWidth - MENU.MORE_BUTTON_WIDTH

  let needsMore = false
  for (const rightBound of menuRightBoundMap.values()) {
    if (rightBound > widthWithoutMore) {
      needsMore = true
      break
    }
  }

  threshold.value = needsMore ? widthWithMore : widthWithoutMore
}

function isMenuVisibleByKey(key: Key) {
  const menuRightBound = menuRightBoundMap.get(key) ?? 0
  return menuRightBound <= threshold.value
}

function calculateMenuRightBound() {
  const wrapperElementBoundLeft = navigationWrapperRef.value?.getBoundingClientRect().left ?? 0

  const reverseMenuRefsList = [...menuRefsList.value].reverse()

  reverseMenuRefsList.forEach((menuElement) => {
    const menuElementBoundRight =
      menuElement.getBoundingClientRect().right - wrapperElementBoundLeft
    const menuElementKey = menuElement.dataset.key

    menuRightBoundMap.set(menuElementKey, menuElementBoundRight + MENU.ITEM_COLUMN_GAP)
  })
}

watch(
  () => router.currentRoute.value,
  (newRoute) => {
    menuActiveKey.value = newRoute.name as string
  },
  {
    immediate: true,
  },
)

watchThrottled(
  containerWidth,
  (containerWidth) => {
    updateMenuVisibility(containerWidth)
  },
  {
    throttle: 100,
  },
)

onMounted(() => {
  navigationContainerRef.value = navigationWrapperRef.value?.closest('nav') as HTMLElement
  calculateMenuRightBound()
})

onBeforeUnmount(() => {
  stopObserveContainerSize()
})
</script>
<template>
  <div
    ref="navigationWrapper"
    class="relative flex items-center overflow-hidden"
    :style="{
      columnGap: `${MENU.ITEM_COLUMN_GAP}px`,
    }"
  >
    <template
      v-for="{ disabled, key, type, label, icon, children } in userStore.userMenu"
      :key="key"
    >
      <div
        v-if="!type"
        :ref="menuRefsList.set"
        v-show="isMenuVisibleByKey(key)"
        :data-key="key"
        class="shrink-0 rounded-naive transition-[background-color,color]"
        :class="[
          {
            'relative flex items-center px-2.5 py-2': isEmpty(children),
          },
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          menuActiveKey === key || hasActiveChild(children)
            ? 'bg-primary/15 text-primary'
            : 'hover:bg-neutral-150 dark:hover:bg-neutral-800',
        ]"
      >
        <template v-if="Array.isArray(children) && !isEmpty(children)">
          <NDropdown
            :options="children"
            :value="menuActiveKey"
            :disabled="!!disabled"
            :render-icon="renderIcon"
          >
            <div class="flex items-center py-2 pr-2 pl-2.5">
              <component
                v-if="icon"
                :is="icon"
                class="mr-2 size-5"
              />
              <span class="leading-4">{{ label }}</span>
              <span class="ml-1.5 iconify ph--caret-down" />
            </div>
          </NDropdown>
        </template>
        <template v-else>
          <component
            v-if="icon"
            :is="icon"
            class="mr-2 size-5"
          />
          <component
            v-if="isFunction(label)"
            :is="label"
            class="leading-4 before:absolute before:inset-0 before:size-full before:content-['']"
          />
          <span
            v-else
            class="leading-4"
            >{{ label }}</span
          >
        </template>
      </div>
    </template>

    <NDropdown
      :options="moreDropdownOptions"
      :value="menuActiveKey"
      :disabled="!shouldShowMore"
      :render-icon="renderIcon"
    >
      <div
        v-show="shouldShowMore"
        class="flex shrink-0 cursor-pointer items-center rounded-naive px-3 py-2 leading-4 font-medium transition-[background-color,color]"
        :class="[
          hasActiveChild(moreDropdownOptions)
            ? 'bg-primary/15 text-primary'
            : 'hover:bg-neutral-150 dark:hover:bg-neutral-800',
        ]"
      >
        <span class="iconify size-5 ph--dots-three-circle-vertical" />
      </div>
    </NDropdown>
  </div>
</template>
