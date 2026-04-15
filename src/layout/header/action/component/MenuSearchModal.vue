<script setup lang="tsx">
import { Icon } from '@iconify/vue'
import { onKeyStroke } from '@vueuse/core'
import { isString } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { NEl, NInput, NScrollbar, NConfigProvider } from 'naive-ui'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'

import { EmptyPlaceholder } from '@/components'
import { useComponentThemeOverrides } from '@/composables'
import { router } from '@/router'
import { useUserStore } from '@/stores'

import type { MenuMixedOptions, MenuOption } from '@/router/interface'
import type { Key } from '@/stores/tabs'
import type { PropType, VNodeChild } from 'vue'

type SearchTreeNode = {
  key: Key
  label: string
  type?: 'group'
  icon?: MenuOption['icon']
  name?: string
  disabled?: boolean
  children?: SearchTreeNode[]
}

const emits = defineEmits<{
  navigateToRoute: []
}>()

const userStore = useUserStore()

const { overlayThemeOverrides } = useComponentThemeOverrides()

const searchKeyword = ref('')

const normalizedSearchKeyword = computed(() => searchKeyword.value.trim().toLowerCase())

const activeNodeKey = ref<Key>()

const searchTree = computed(() =>
  normalizedSearchKeyword.value ? buildSearchTree(userStore.user.menu) : [],
)

const navigableSearchNodes = computed(() => flattenNavigableNodes(searchTree.value))

const activeNode = computed(() =>
  navigableSearchNodes.value.find((node) => node.key === activeNodeKey.value),
)

onKeyStroke(['ArrowUp', 'ArrowDown', 'Enter'], handleSearchKeyStroke, {
  dedupe: true,
})

function isNavigableNode(node: SearchTreeNode) {
  return !node.disabled && node.name !== undefined && isEmpty(node.children)
}

function buildSearchTree(
  options: MenuMixedOptions[],
  parentDisabled = false,
  includeAllDescendants = false,
): SearchTreeNode[] {
  const tree: SearchTreeNode[] = []

  options.forEach((item) => {
    if (item.type === 'divider') {
      return
    }

    const { children, key, name, path, label, icon, disabled } = item as MenuOption

    const menuLabel = isString(label) ? label.trim() : ''

    const isDisabled = parentDisabled || disabled

    const matchesKeyword =
      !normalizedSearchKeyword.value ||
      menuLabel.toLowerCase().includes(normalizedSearchKeyword.value)

    const childNodes =
      Array.isArray(children) && !isEmpty(children)
        ? buildSearchTree(children, isDisabled, includeAllDescendants || matchesKeyword)
        : []

    if (!menuLabel) {
      tree.push(...childNodes)
      return
    }

    if (!includeAllDescendants && !matchesKeyword && isEmpty(childNodes)) {
      return
    }

    const menu: SearchTreeNode = {
      key: key || (isString(name) ? name : undefined) || path || menuLabel,
      label: menuLabel,
      disabled: isDisabled,
    }

    if (item.type === 'group') {
      menu.type = 'group'
    } else {
      menu.icon = icon
      menu.name = name as string
    }

    if (!isEmpty(childNodes)) {
      menu.children = childNodes
    }

    tree.push(menu)
  })

  return tree
}

function renderMenuIcon(icon?: SearchTreeNode['icon']) {
  if (!icon) {
    return null
  }

  if (isString(icon)) {
    return icon.includes(':') ? (
      <Icon
        icon={icon}
        class='size-5 shrink-0'
      />
    ) : (
      <span class={[icon, 'size-5 shrink-0']} />
    )
  }

  return icon()
}

function renderHighlightedLabel(label: string) {
  if (!normalizedSearchKeyword.value) {
    return label
  }

  const nodes: VNodeChild[] = []
  const lowerLabel = label.toLowerCase()
  let start = 0
  let index = lowerLabel.indexOf(normalizedSearchKeyword.value)

  while (index !== -1) {
    if (index > start) {
      nodes.push(label.slice(start, index))
    }

    nodes.push(
      <span class='font-medium text-primary'>
        {label.slice(index, index + normalizedSearchKeyword.value.length)}
      </span>,
    )

    start = index + normalizedSearchKeyword.value.length
    index = lowerLabel.indexOf(normalizedSearchKeyword.value, start)
  }

  if (start < label.length) {
    nodes.push(label.slice(start))
  }

  return nodes
}

function flattenNavigableNodes(options: SearchTreeNode[]) {
  const nodes: SearchTreeNode[] = []

  options.forEach((item) => {
    if (isNavigableNode(item)) {
      nodes.push(item)
    }

    if (Array.isArray(item.children) && !isEmpty(item.children)) {
      nodes.push(...flattenNavigableNodes(item.children))
    }
  })

  return nodes
}

function moveActiveSelection(step: -1 | 1) {
  if (isEmpty(navigableSearchNodes.value)) return

  const activeIndex = navigableSearchNodes.value.findIndex(
    (node) => node.key === activeNodeKey.value,
  )

  if (activeIndex === -1) {
    activeNodeKey.value = navigableSearchNodes.value[0]?.key
    return
  }

  const nextIndex =
    step === 1
      ? activeIndex === navigableSearchNodes.value.length - 1
        ? 0
        : activeIndex + 1
      : activeIndex === 0
        ? navigableSearchNodes.value.length - 1
        : activeIndex - 1

  activeNodeKey.value = navigableSearchNodes.value[nextIndex]?.key

  scrollActiveNodeIntoView()
}

function scrollActiveNodeIntoView() {
  nextTick(() => {
    const activeElement = document.querySelector<HTMLElement>('.active-search-node')
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  })
}

function navigateToRoute(routeName?: string, openInNewTab = false) {
  if (!routeName) return

  if (openInNewTab) {
    const path = router.resolve({ name: routeName }).fullPath
    window.open(path, '_blank')
  } else {
    router.push({ name: routeName })
  }
  emits('navigateToRoute')
}

function isSearchModalFocused() {
  const activeElement = document.activeElement
  return activeElement instanceof Element && !!activeElement.closest('[data-menu-search-modal]')
}

function handleSearchKeyStroke(event: KeyboardEvent) {
  if (!isSearchModalFocused()) return
  if (event.isComposing) return

  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      moveActiveSelection(-1)
      break
    case 'ArrowDown':
      event.preventDefault()
      moveActiveSelection(1)
      break
    case 'Enter':
      event.preventDefault()
      navigateToRoute(activeNode.value?.name, event.altKey)
      break
  }
}

const SearchTree = defineComponent({
  name: 'SearchTree',
  props: {
    node: {
      type: Object as PropType<SearchTreeNode>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const { node } = props
      const { icon, label, type, disabled, children } = node

      const hasChildren = Array.isArray(node.children) && !isEmpty(node.children)
      const isActive = activeNodeKey.value === node.key
      const isNavigable = isNavigableNode(node)

      return (
        <div>
          <div
            class={[
              'rounded-naive p-2 transition-[background-color,color]',
              disabled ? 'cursor-not-allowed opacity-50' : isNavigable ? 'cursor-pointer' : '',
              isActive && 'active-search-node bg-naive-button2-hover',
              hasChildren && 'text-naive-text3',
            ]}
            onClick={(event) => {
              if (isNavigable) {
                navigateToRoute(node.name, event.altKey)
              }
            }}
            onMouseenter={() => {
              if (isNavigable) {
                activeNodeKey.value = node.key
              }
            }}
          >
            <div class='flex items-center justify-between'>
              <div class='flex items-center'>
                {renderMenuIcon(icon)}
                <span class={['truncate', type === 'group' && 'text-xs', icon ? 'ml-1.5' : 'ml-1']}>
                  {renderHighlightedLabel(label)}
                </span>
              </div>
              {isNavigable && <span class='iconify text-naive-text3 ph--caret-right'></span>}
            </div>
          </div>
          {hasChildren ? (
            <div
              class={[
                'my-1 ml-4 border-l-[1.5px] border-neutral-250 pl-2 dark:border-neutral-650',
                type === 'group' ? 'border-dashed' : 'border-solid',
              ]}
            >
              {children?.map((child) => (
                <SearchTree
                  key={child.key || child.label}
                  node={child}
                />
              ))}
            </div>
          ) : null}
        </div>
      )
    }
  },
})

watch(
  navigableSearchNodes,
  (nodes) => {
    if (isEmpty(nodes)) {
      activeNodeKey.value = undefined
      return
    }

    if (!nodes.some((node) => node.key === activeNodeKey.value)) {
      activeNodeKey.value = nodes[0]?.key
    }
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <NConfigProvider :theme-overrides="overlayThemeOverrides">
    <NEl>
      <div
        data-menu-search-modal
        class="w-[90vw] rounded-naive bg-naive-modal sm:w-[560px]"
      >
        <div class="px-3.5 pt-3.5">
          <NInput
            v-model:value="searchKeyword"
            size="large"
            placeholder="搜索菜单项"
            clearable
          >
            <template #prefix>
              <span class="iconify size-4.5 ph--magnifying-glass" />
            </template>
          </NInput>
        </div>
        <div class="relative mt-3 min-h-32 pr-1.5 pb-3 pl-3.5">
          <NScrollbar
            class="max-h-[60vh] pr-2"
            trigger="none"
          >
            <div>
              <SearchTree
                v-for="menu in searchTree"
                :key="menu.key || menu.label"
                :node="menu"
              />
            </div>
          </NScrollbar>
          <EmptyPlaceholder
            :show="isEmpty(searchTree)"
            description="没有菜单数据"
          />
        </div>
        <div
          class="flex gap-x-4 border-t border-neutral-250 px-4 py-3.5 max-sm:hidden dark:border-neutral-650"
        >
          <div class="flex items-center gap-1.5">
            <kbd
              class="flex h-4.5 items-center justify-center rounded-naive border border-neutral-300 bg-neutral-200 px-1.25 dark:border-neutral-625 dark:bg-neutral-725"
            >
              <span class="iconify size-3 ph--arrow-up"></span>
            </kbd>
            <kbd
              class="flex h-4.5 items-center justify-center rounded-naive border border-neutral-300 bg-neutral-200 px-1.25 dark:border-neutral-625 dark:bg-neutral-725"
            >
              <span class="iconify size-3 ph--arrow-down"></span>
            </kbd>
            <span class="ml-0.5 text-xs">导航</span>
          </div>
          <div class="flex items-center gap-1.5">
            <kbd
              class="flex h-4.5 items-center justify-center rounded-naive border border-neutral-300 bg-neutral-200 px-1.25 dark:border-neutral-625 dark:bg-neutral-725"
            >
              <span class="iconify size-3 ph--arrow-elbow-down-left"></span>
            </kbd>
            <span class="ml-0.5 text-xs">进入</span>
          </div>
          <div class="flex items-center">
            <kbd
              class="flex h-4.5 items-center justify-center rounded-naive border border-neutral-300 bg-neutral-200 px-1.25 dark:border-neutral-625 dark:bg-neutral-725"
            >
              <span class="text-xs">Alt</span>
            </kbd>
            <kbd
              class="ml-1.5 flex h-4.5 items-center justify-center rounded-naive border border-neutral-300 bg-neutral-200 px-1.25 dark:border-neutral-625 dark:bg-neutral-725"
            >
              <span class="iconify size-3 ph--option"></span>
            </kbd>
            <span class="mx-1.5 iconify size-3 ph--plus"></span>
            <kbd
              class="flex h-4.5 items-center justify-center rounded-naive border border-neutral-300 bg-neutral-200 px-1.25 dark:border-neutral-625 dark:bg-neutral-725"
            >
              <span class="iconify size-3 ph--arrow-elbow-down-left"></span>
            </kbd>
            <span class="ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                class="text-naive-text3"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M12.658 2.026a.5.5 0 0 1 .317.632l-5 15a.5.5 0 1 1-.95-.316l5-15a.5.5 0 0 1 .633-.316"
                />
              </svg>
            </span>
            <span class="iconify size-4 ph--mouse-left-click"></span>
            <span class="ml-1.5 text-xs">新窗口</span>
          </div>
          <div class="ml-auto flex items-center gap-1.5">
            <kbd
              class="flex h-4.5 items-center justify-center rounded-naive border border-neutral-300 bg-neutral-200 px-1.25 dark:border-neutral-625 dark:bg-neutral-725"
            >
              <span class="text-xs">Esc</span>
            </kbd>
            <span class="ml-0.5 text-xs">退出</span>
          </div>
        </div>
      </div>
    </NEl>
  </NConfigProvider>
</template>
