<script setup lang="tsx">
import { isFunction } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { NDropdown, NEllipsis, NScrollbar, NPopover } from 'naive-ui'
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  Transition,
  TransitionGroup,
  useTemplateRef,
  watch,
} from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

import { ButtonAnimation } from '@/components'
import { useInjection } from '@/composables'
import { routerEventBus } from '@/event-bus'
import { layoutInjectionKey } from '@/injection'
import { useTabsStore, usePreferencesStore, toRefsTabsStore } from '@/stores'

import type { Tab, Key } from '@/stores'
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

const { tabs, tabActivePath } = toRefsTabsStore()

const preferences = usePreferencesStore()

const tabPinnedList = computed({
  get: () => tabs.value.filter((tab) => tab.pinned),
  set: (newPinnedTabs: Tab[]) => {
    const currentUnpinnedTabs = tabs.value.filter((tab) => !tab.pinned)
    setTabs([...newPinnedTabs, ...currentUnpinnedTabs])
  },
})

const tabUnPinnedList = computed({
  get: () => tabs.value.filter((tab) => !tab.pinned),
  set: (newUnpinnedTabs: Tab[]) => {
    const currentPinnedTabs = tabs.value.filter((tab) => tab.pinned)
    setTabs([...currentPinnedTabs, ...newUnpinnedTabs])
  },
})

const pendingActivePath = ref('')

const tabBackgroundTransitionClasses = reactive({
  leaveToClass: '',
  enterFromClass: '',
})

const isTabDragging = ref(false)

const showTabTooltip = ref(true)

const showTabDropdown = ref(false)

const tabContextMenu = ref<Tab | null>(null)

const tabDropdownOptions = computed<DropdownOption[]>(() => {
  const targetTab = tabContextMenu.value

  if (isEmpty(targetTab)) {
    return []
  }

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
      icon: () => (
        <span
          class={keepAlive ? 'icon-[hugeicons--database-02]' : 'icon-[hugeicons--database-locked]'}
        />
      ),
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
})

const dropdownPosition = reactive({
  x: 0,
  y: 0,
})

const handleTabClick = (path: string) => {
  setTabActivePath(path)
}

const handleTabCloseClick = (id: Key) => {
  removeTab(id)
}

const handleTabContextMenuClick = (e: MouseEvent, tab: Tab) => {
  e.preventDefault()
  tabContextMenu.value = tab
  showTabDropdown.value = false
  showTabTooltip.value = false

  nextTick(() => {
    showTabDropdown.value = true
    dropdownPosition.x = e.clientX
    dropdownPosition.y = e.clientY
  })
}

const onTabDropdownClickOutside = () => {
  showTabDropdown.value = false
  showTabTooltip.value = true
  tabContextMenu.value = null
}

const onTabDraggableStart = () => {
  showTabDropdown.value = false
  showTabTooltip.value = false
}

const onTabDraggableEnd = () => {
  showTabTooltip.value = true
}

const onTabDraggableChoose = () => {
  isTabDragging.value = true
}

const onTabDraggableUnchoose = () => {
  isTabDragging.value = false
}

const onTabDropdownSelected = (key: keyof ContextMenuActions) => {
  showTabDropdown.value = false
  showTabTooltip.value = true

  getTabContextMenuActions()?.[key]()
}

const onScrollbarWheeled = (e: WheelEvent) => {
  if (!scrollbarRef.value) return

  scrollbarRef.value.scrollBy({
    left: (e.deltaY || e.deltaX) * 3,
    behavior: 'smooth',
  })
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

function handleTabRefreshClick() {
  shouldRefreshRoute.value = true
}

routerEventBus.on((event) => {
  if (event.type === 'afterEach') {
    nextTick(() => {
      pendingActivePath.value = tabActivePath.value
    })
  }
})

const TabList = defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<Tab[]>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => (
      <VueDraggable
        class='flex h-10.5'
        modelValue={props.modelValue}
        animation={150}
        easing='cubic-bezier(0, 0, 1, 1)'
        direction='horizontal'
        scrollSensitivity={100}
        ghostClass='bg-primary/20'
        onStart={onTabDraggableStart}
        onEnd={onTabDraggableEnd}
        onChoose={onTabDraggableChoose}
        onUnchoose={onTabDraggableUnchoose}
        {...{
          'onUpdate:modelValue': (value: Tab[]) => emit('update:modelValue', value),
        }}
      >
        <TransitionGroup
          duration={300}
          type='transition'
          enterFromClass='max-w-0'
          leaveToClass='max-w-0'
          onAfterEnter={() => scrollToActiveTab('smooth')}
        >
          {props.modelValue.map((tab) => (
            <div
              key={tab.id}
              class={[
                'relative cursor-pointer overflow-hidden border-r border-r-naive-border transition-[background-color,border-color,max-width] hover:bg-primary/6 [&:not(.max-w-0)]:max-w-48',
                {
                  'tab-active': tab.path === pendingActivePath.value,
                  group: !tab.locked && !preferences.tabs.showTabClose,
                },
              ]}
              onClick={() => handleTabClick(tab.path)}
              onContextmenu={(e) => handleTabContextMenuClick(e, tab)}
            >
              <Transition
                type='transition'
                leaveActiveClass='transition-[opacity,scale,translate]'
                enterActiveClass='transition-[opacity,scale,translate]'
                leaveToClass={tabBackgroundTransitionClasses.leaveToClass}
                enterFromClass={tabBackgroundTransitionClasses.enterFromClass}
                onAfterEnter={() => {
                  scrollToActiveTab('smooth')
                }}
              >
                {tab.path === pendingActivePath.value && (
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
                class={['relative flex h-full items-center pl-4', tab.pinned ? 'pr-4' : 'pr-2.5']}
              >
                <div
                  class={[
                    'flex flex-1 items-center overflow-hidden transition-[translate]',
                    {
                      'translate-x-2.5':
                        !tab.pinned && (tab.locked || !preferences.tabs.showTabClose),
                      'group-hover:translate-x-0':
                        !tab.pinned && !tab.locked && !preferences.tabs.showTabClose,
                    },
                  ]}
                >
                  <div class='mr-2 grid shrink-0 place-items-center overflow-hidden'>
                    {tab.icon && isFunction(tab.icon) ? (
                      tab.icon()
                    ) : (
                      <span
                        class={[
                          'size-4.5',
                          tab.icon,
                          {
                            'text-primary': tab.componentName && getTab(tab.id)?.keepAlive,
                          },
                        ]}
                      />
                    )}
                  </div>
                  <NEllipsis tooltip={showTabTooltip.value}>
                    {tab.title && isFunction(tab.title) ? tab.title() : <span>{tab.title}</span>}
                  </NEllipsis>
                </div>
                {!tab.pinned && (
                  <div
                    class={[
                      'ml-1 flex overflow-hidden rounded-full p-1 transition-[background-color,opacity,scale] hover:bg-naive-button2-hover',
                      {
                        'scale-0 opacity-0': tab.locked || !preferences.tabs.showTabClose,
                        'group-hover:scale-100 group-hover:opacity-100':
                          !tab.locked && !preferences.tabs.showTabClose,
                      },
                    ]}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTabCloseClick(tab.id)
                    }}
                  >
                    <span class='icon-[line-md--close] size-3.5' />
                  </div>
                )}
              </div>
            </div>
          ))}
        </TransitionGroup>
      </VueDraggable>
    )
  },
})

watch(
  [() => tabs.value, () => tabActivePath.value],
  ([newTabs, newTabActivePath], [oldTabs, oldTabActivePath]) => {
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
    <TabList v-model="tabPinnedList" />
    <NScrollbar
      ref="scrollbarRef"
      x-scrollable
      @wheel.passive="onScrollbarWheeled"
    >
      <TabList v-model="tabUnPinnedList" />
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
