<script setup lang="tsx">
import { DragDropProvider } from '@dnd-kit/vue'
import { useSortable, isSortable } from '@dnd-kit/vue/sortable'
import { Icon } from '@iconify/vue'
import { isString } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { NDropdown, NEllipsis, NScrollbar, NPopover } from 'naive-ui'
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRef,
  Transition,
  useTemplateRef,
  watch,
} from 'vue'

import { ButtonAnimation } from '@/components'
import { useInjection } from '@/composables'
import { routerEventBus } from '@/event-bus'
import { layoutInjectionKey } from '@/injection'
import { useTabsStore, usePreferencesStore, toRefsTabsStore } from '@/stores'

import type { Tab, Key } from '@/stores'
import type { DragEndEvent } from '@dnd-kit/vue'
import type { DropdownOption } from 'naive-ui'
import type { PropType } from 'vue'

type ContextMenuActions = {
  close: () => void
  closeAll: () => void
  closeLeft: () => void
  closeOther: () => void
  closeRight: () => void
  pin: () => void
  keepalive: () => void
  lock: () => void
}

defineOptions({
  name: 'Tabs',
})

const { shouldRefreshRoute } = useInjection(layoutInjectionKey)

const scrollbarRef = useTemplateRef<InstanceType<typeof NScrollbar>>('scrollbarRef')

const {
  setTabActivePath,
  getTab,
  removeTab,
  updateTab,
  setTabs,
  getRemovableIdsBefore,
  getRemovableIdsAfter,
  getRemovableIdsOther,
  getRemovableIds,
} = useTabsStore()

const preferences = usePreferencesStore()

const { tabs, tabActivePath } = toRefsTabsStore()

const emptyTabs: Tab[] = []

const tabGroups = computed(() => splitTabGroups(tabs.value))

const pendingActivePath = ref('')

const tabBackgroundTransitionClasses = reactive({
  leaveToClass: '',
  enterFromClass: '',
})

const showTabTooltip = ref(true)

const showTabDropdown = ref(false)

const tabContextMenu = ref<Tab | null>(null)

const tabDropdownOptions = computed<DropdownOption[]>(() => {
  const targetTab = tabContextMenu.value

  if (isEmpty(targetTab)) {
    return []
  }

  return createTabDropdownOptions(targetTab)
})

const dropdownPosition = reactive({
  x: 0,
  y: 0,
})

function createTabDropdownOptions(targetTab: Tab): DropdownOption[] {
  const { id, componentName } = targetTab

  const { pinned, locked, keepAlive } = getTab(id) ?? {}

  return [
    {
      key: 'close',
      icon: () => <span class='iconify ph--x' />,
      label: '关闭',
      disabled: locked,
    },
    {
      key: 'closeOther',
      icon: () => <span class='iconify ph--arrows-out-line-horizontal' />,
      label: '关闭其他',
      disabled: isEmpty(getRemovableIdsOther(id)),
    },
    {
      key: 'closeLeft',
      icon: () => <span class='iconify ph--arrow-line-left' />,
      label: '关闭左侧',
      disabled: isEmpty(getRemovableIdsBefore(id)),
    },
    {
      key: 'closeRight',
      icon: () => <span class='iconify ph--arrow-line-right' />,
      label: '关闭右侧',
      disabled: isEmpty(getRemovableIdsAfter(id)),
    },
    {
      key: 'closeAll',
      icon: () => <span class='iconify ph--arrows-horizontal' />,
      label: '关闭所有',
      disabled: isEmpty(getRemovableIds()),
    },
    {
      key: 'pin',
      icon: () => (
        <span
          class={pinned ? 'iconify ph--push-pin-simple-slash' : 'iconify ph--push-pin-simple'}
        />
      ),
      label: pinned ? '取消固定' : '固定标签页',
    },
    {
      key: 'keepalive',
      icon: () => <span class={keepAlive ? 'iconify ph--file-text' : 'iconify ph--file-lock'} />,
      label: keepAlive ? '取消缓存' : '缓存标签页',
      disabled: isEmpty(componentName),
    },
    {
      key: 'lock',
      icon: () => (
        <span class={locked ? 'iconify ph--lock-simple-open' : 'iconify ph--lock-simple'} />
      ),
      label: locked ? '取消锁定' : '锁定标签页',
      disabled: pinned,
    },
  ]
}

function handleTabClick(path: string) {
  setTabActivePath(path)
}

function handleTabCloseClick(id: Key) {
  removeTab(id)
}

function handleTabContextMenuClick(event: MouseEvent, tab: Tab) {
  event.preventDefault()
  tabContextMenu.value = tab
  showTabDropdown.value = false
  showTabTooltip.value = false

  nextTick(() => {
    showTabDropdown.value = true
    dropdownPosition.x = event.clientX
    dropdownPosition.y = event.clientY
  })
}

function onTabDropdownClickOutside() {
  showTabDropdown.value = false
  showTabTooltip.value = true
  tabContextMenu.value = null
}

function onTabDragStart() {
  showTabDropdown.value = false
  showTabTooltip.value = false
}

function onTabDragEnd(event: DragEndEvent, group: 'pinned' | 'unpinned') {
  showTabTooltip.value = true

  if (event.canceled) return

  const { source } = event.operation

  if (isSortable(source)) {
    const { initialIndex, index } = source

    if (initialIndex === index) return
    if (initialIndex < 0 || index < 0) return

    const { pinned, unpinned } = tabGroups.value
    const currentGroupTabs = group === 'pinned' ? pinned : unpinned
    const nextGroupTabs = reorderTabs(currentGroupTabs, initialIndex, index)

    if (!nextGroupTabs) return

    setTabs(group === 'pinned' ? [...nextGroupTabs, ...unpinned] : [...pinned, ...nextGroupTabs])
  }
}

function onTabDropdownSelected(key: keyof ContextMenuActions) {
  showTabDropdown.value = false
  showTabTooltip.value = true

  getTabContextMenuActions()?.[key]()
}

function onScrollbarWheeled(event: WheelEvent) {
  if (!scrollbarRef.value) return

  scrollbarRef.value.scrollBy({
    left: (event.deltaY || event.deltaX) * 3,
    behavior: 'smooth',
  })
}

function handleTabRefreshClick() {
  shouldRefreshRoute.value = true
}

function splitTabGroups(allTabs: Tab[]) {
  const firstUnPinnedIndex = allTabs.findIndex((tab) => !tab.pinned)

  if (firstUnPinnedIndex === -1) {
    return {
      pinned: allTabs,
      unpinned: emptyTabs,
    }
  }

  if (firstUnPinnedIndex === 0) {
    return {
      pinned: emptyTabs,
      unpinned: allTabs,
    }
  }

  return {
    pinned: allTabs.slice(0, firstUnPinnedIndex),
    unpinned: allTabs.slice(firstUnPinnedIndex),
  }
}

function reorderTabs(list: Tab[], initialIndex: number, targetIndex: number) {
  const nextTabs = [...list]
  const [movedTab] = nextTabs.splice(initialIndex, 1)

  if (!movedTab) return null

  nextTabs.splice(targetIndex, 0, movedTab)

  return nextTabs
}

function getTabContextMenuActions(): ContextMenuActions | null {
  const targetTab = tabContextMenu.value

  if (!targetTab) {
    return null
  }

  const { id } = targetTab

  const { locked, keepAlive, pinned } = getTab(id) ?? {}

  return {
    close: () => {
      removeTab(id)
    },
    closeOther: () => {
      removeTab(getRemovableIdsOther(id))
    },
    closeLeft: () => {
      removeTab(getRemovableIdsBefore(id))
    },
    closeRight: () => {
      removeTab(getRemovableIdsAfter(id))
    },
    closeAll: () => {
      removeTab(getRemovableIds())
    },
    pin: () => {
      updateTab(id, { pinned: !pinned })
    },
    keepalive: () => {
      updateTab(id, { keepAlive: !keepAlive })
    },
    lock: () => {
      updateTab(id, { locked: !locked })
    },
  }
}

function scrollToActiveTab(behavior: ScrollBehavior = 'auto') {
  nextTick(() => {
    document.querySelector('.tab-active')?.scrollIntoView({
      behavior,
    })
  })
}

function renderTabIcon(tab: Tab) {
  const { icon } = tab
  if (!icon) return null

  const highlightKeepAlive = Boolean(tab.componentName && tab.keepAlive)

  if (isString(icon)) {
    return icon.includes(':') ? (
      <Icon
        icon={icon}
        class={[
          'size-4.5',
          {
            'text-primary': highlightKeepAlive,
          },
        ]}
      />
    ) : (
      <span
        class={[
          'size-4.5',
          icon,
          {
            'text-primary': highlightKeepAlive,
          },
        ]}
      />
    )
  }

  return null
}

const TabItem = defineComponent({
  name: 'TabItem',
  props: {
    tab: {
      type: Object as PropType<Tab>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const tab = toRef(props, 'tab')
    const index = toRef(props, 'index')
    const element = ref<HTMLDivElement | null>(null)

    const { isDropTarget } = useSortable({
      id: computed(() => tab.value.id ?? tab.value.path),
      index,
      element,
    })

    const currentTab = tab.value

    return () => (
      <div
        ref={element}
        class={[
          'relative cursor-pointer overflow-hidden border-r border-r-naive-border transition-[background-color,border-color,max-width] hover:bg-primary/6 [&:not(.max-w-0)]:max-w-48',
          {
            'tab-active': currentTab.path === pendingActivePath.value,
            group: !currentTab.locked && !preferences.tabs.showTabClose,
            'bg-primary/10 ring-1 ring-primary/30': isDropTarget.value,
          },
        ]}
        onClick={() => handleTabClick(currentTab.path)}
        onContextmenu={(e) => handleTabContextMenuClick(e, currentTab)}
      >
        <Transition
          type='transition'
          leaveActiveClass='transition-[opacity,scale,translate]'
          enterActiveClass='transition-[opacity,scale,translate]'
          leaveToClass={tabBackgroundTransitionClasses.leaveToClass}
          enterFromClass={tabBackgroundTransitionClasses.enterFromClass}
          onAfterEnter={() => scrollToActiveTab('smooth')}
        >
          {currentTab.path === pendingActivePath.value && (
            <div
              class={[
                'absolute inset-0 size-full border-primary bg-primary/6',
                preferences.tabs.tabBorderPosition === 'top'
                  ? 'border-t-[1.5px]'
                  : 'border-b-[1.5px]',
              ]}
            />
          )}
        </Transition>
        <div
          class={['relative flex h-full items-center pl-4', currentTab.pinned ? 'pr-4' : 'pr-2.5']}
        >
          <div
            class={[
              'flex flex-1 items-center overflow-hidden transition-[translate]',
              {
                'translate-x-2.5':
                  !currentTab.pinned && (currentTab.locked || !preferences.tabs.showTabClose),
                'group-hover:translate-x-0':
                  !currentTab.pinned && !currentTab.locked && !preferences.tabs.showTabClose,
              },
            ]}
          >
            <div class='mr-2 grid shrink-0 place-items-center overflow-hidden'>
              {renderTabIcon(currentTab)}
            </div>
            <NEllipsis tooltip={showTabTooltip.value}>
              <span>{currentTab.title}</span>
            </NEllipsis>
          </div>
          {!currentTab.pinned && (
            <div
              class={[
                'ml-1 flex overflow-hidden rounded-full p-1 transition-[background-color,opacity,scale] hover:bg-naive-button2-hover',
                {
                  'scale-0 opacity-0': currentTab.locked || !preferences.tabs.showTabClose,
                  'group-hover:scale-100 group-hover:opacity-100':
                    !currentTab.locked && !preferences.tabs.showTabClose,
                },
              ]}
              onClick={(e) => {
                e.stopPropagation()
                handleTabCloseClick(currentTab.id)
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='14'
                height='14'
                viewBox='0 0 24 24'
              >
                <path
                  fill='none'
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7'
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    )
  },
})

routerEventBus.on((event) => {
  if (event.type === 'afterEach') {
    nextTick(() => {
      pendingActivePath.value = tabActivePath.value
    })
  }
})

watch(
  [() => tabs.value, () => tabActivePath.value],
  ([newTabs, newTabActivePath], [oldTabs, oldTabActivePath]) => {
    if (newTabActivePath === oldTabActivePath) return

    if (!newTabActivePath) {
      tabBackgroundTransitionClasses.leaveToClass = 'scale-0 opacity-0'
      return
    }

    if (!oldTabActivePath) {
      tabBackgroundTransitionClasses.enterFromClass = 'scale-0 opacity-0'
      return
    }

    const oldActiveIndex = oldTabs.findIndex((item) => item.path === oldTabActivePath)
    const newActiveIndex = newTabs.findIndex((item) => item.path === newTabActivePath)

    if (oldActiveIndex > newActiveIndex && newActiveIndex !== -1) {
      tabBackgroundTransitionClasses.leaveToClass = '-translate-x-full'
      tabBackgroundTransitionClasses.enterFromClass = 'translate-x-full'
    } else {
      tabBackgroundTransitionClasses.leaveToClass = 'translate-x-full'
      tabBackgroundTransitionClasses.enterFromClass = '-translate-x-full'
    }
  },
)

onMounted(() => {
  scrollToActiveTab()
  pendingActivePath.value = tabActivePath.value
  tabBackgroundTransitionClasses.enterFromClass = 'scale-0 opacity-0'
})
</script>
<template>
  <div
    class="flex min-h-0 overflow-hidden border-b border-naive-border bg-naive-card transition-[background-color,border-color] select-none"
  >
    <DragDropProvider
      @dragEnd="(event) => onTabDragEnd(event, 'pinned')"
      @drag-start="onTabDragStart"
    >
      <TransitionGroup
        tag="div"
        class="flex h-10.5"
        :duration="300"
        type="transition"
        enterFromClass="max-w-0"
        leaveToClass="max-w-0"
        @after-enter="scrollToActiveTab('smooth')"
      >
        <TabItem
          v-for="(tab, index) in tabGroups.pinned"
          :key="tab.id"
          :tab="tab"
          :index="index"
        />
      </TransitionGroup>
    </DragDropProvider>
    <NScrollbar
      ref="scrollbarRef"
      x-scrollable
      @wheel.passive="onScrollbarWheeled"
    >
      <DragDropProvider
        @dragEnd="(event) => onTabDragEnd(event, 'unpinned')"
        @drag-start="onTabDragStart"
      >
        <TransitionGroup
          tag="div"
          class="flex h-10.5"
          :duration="300"
          type="transition"
          enterFromClass="max-w-0"
          leaveToClass="max-w-0"
          @after-enter="scrollToActiveTab('smooth')"
        >
          <TabItem
            v-for="(tab, index) in tabGroups.unpinned"
            :key="tab.id"
            :tab="tab"
            :index="index"
          />
        </TransitionGroup>
      </DragDropProvider>
    </NScrollbar>
    <div class="flex items-center px-3">
      <NPopover
        placement="bottom-start"
        :disabled="preferences.navigationTransition.enable"
      >
        <template #trigger>
          <ButtonAnimation
            title="刷新"
            @click="handleTabRefreshClick"
            animation="rotate"
            :disabled="!preferences.navigationTransition.enable"
          >
            <span class="iconify size-5 ph--arrows-clockwise"></span>
          </ButtonAnimation>
        </template>
        <div>
          <span>需要开启&nbsp;系统设定 - 启用导航过渡效果</span>
        </div>
      </NPopover>
    </div>
    <NDropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownPosition.x"
      :y="dropdownPosition.y"
      :options="tabDropdownOptions"
      :show="showTabDropdown"
      @clickoutside="onTabDropdownClickOutside"
      @select="onTabDropdownSelected"
    >
    </NDropdown>
  </div>
</template>
