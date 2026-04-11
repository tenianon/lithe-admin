<script setup lang="tsx">
import { DragDropProvider } from '@dnd-kit/vue'
import { isSortable, useSortable } from '@dnd-kit/vue/sortable'
import { NAlert, NCard, NScrollbar, NButton } from 'naive-ui'
import { computed, defineComponent, ref, toRef } from 'vue'

import { ScrollContainer } from '@/components'
import { useInjection } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'

import type { DragEndEvent } from '@dnd-kit/vue'

defineOptions({
  name: 'DragDrop',
})

const { isMaxMd } = useInjection(mediaQueryInjectionKey)

const APP_NAME = import.meta.env.VITE_APP_NAME

const sortableList = ref(Array.from({ length: 30 }, (_, i) => i + 1))

const gridList = ref(Array.from({ length: 100 }, (_, i) => i + 1))

const sortableGameList = ref(createGame())

const isGameSortSuccess = computed(() =>
  sortableGameList.value.every(
    (item, index, list) => index === 0 || list[index - 1]!.height <= item.height,
  ),
)

const SortableItem = defineComponent({
  name: 'SortableItem',
  props: {
    id: {
      type: Number,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    group: {
      type: Number,
    },
  },
  setup(props, { slots }) {
    const id = toRef(props, 'id')
    const index = toRef(props, 'index')
    const group = toRef(props, 'group')
    const element = ref<HTMLDivElement | null>(null)

    const { isDropTarget } = useSortable({
      id,
      index,
      group,
      element,
      type: 'item',
      accept: ['item'],
    })

    return () => (
      <div
        ref={element}
        class={[
          'flex cursor-grabbing items-center justify-center rounded bg-neutral-500/8 p-3 transition-[background-color,box-shadow]',
          {
            'bg-primary/20 ring-1 ring-primary/30': isDropTarget.value,
          },
        ]}
      >
        {slots.default?.()}
      </div>
    )
  },
})

function onSortableDragEnd(event: DragEndEvent) {
  sortableList.value = reorderSortableList(sortableList.value, event)
}

function onGridDragEnd(event: DragEndEvent) {
  gridList.value = reorderSortableList(gridList.value, event)
}

function onGameDragEnd(event: DragEndEvent) {
  sortableGameList.value = reorderSortableList(sortableGameList.value, event)
}

function shuffleList<T>(list: T[]) {
  const nextList = [...list]

  for (let index = nextList.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const currentItem = nextList[index]
    nextList[index] = nextList[randomIndex]!
    nextList[randomIndex] = currentItem!
  }

  return nextList
}

function reorderSortableList<T>(list: T[], event: DragEndEvent) {
  if (event.canceled) return list

  const { source } = event.operation

  if (!isSortable(source)) return list

  const { initialIndex, index } = source

  const isInvalidIndex =
    initialIndex < 0 || index < 0 || initialIndex >= list.length || index >= list.length

  if (isInvalidIndex || initialIndex === index) return list

  const nextList = [...list]
  const [movedItem] = nextList.splice(initialIndex, 1)

  if (movedItem === undefined) return list

  nextList.splice(index, 0, movedItem)

  return nextList
}

function createGame() {
  const heights = Array.from({ length: 10 }, (_, index) => 60 + index * 12)

  return shuffleList(heights).map((height, index) => ({
    id: index + 1,
    height,
  }))
}

function resetGame() {
  sortableGameList.value = createGame()
}
</script>
<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <NAlert
      type="info"
      closable
    >
      {{ APP_NAME }} 的 Tabs 栏的拖放模块使用了 @dnd-kit/vue，dnd-kit
      是一个强大的拖放工具包，下面只演示了一些简单的例子，更多例子请参考
      <NButton
        text
        tag="a"
        href="https://dndkit.com"
        target="_blank"
        type="info"
        >dnd-kit 文档</NButton
      >
    </NAlert>
    <NCard
      title="Sortable 排序"
      :size="isMaxMd ? 'small' : undefined"
    >
      <NScrollbar :style="{ height: isMaxMd ? '580px' : '280px' }">
        <DragDropProvider @drag-end="onSortableDragEnd">
          <div class="flex flex-col gap-2 rounded bg-neutral-500/5 p-4 select-none">
            <SortableItem
              v-for="(id, index) in sortableList"
              :key="id"
              :id="id"
              :index="index"
              class="h-12"
            >
              {{ id }}
            </SortableItem>
          </div>
        </DragDropProvider>
      </NScrollbar>
    </NCard>
    <NCard
      title="Grid 网格排序"
      :size="isMaxMd ? 'small' : undefined"
    >
      <NScrollbar :style="{ height: isMaxMd ? '680px' : '280px' }">
        <DragDropProvider @drag-end="onGridDragEnd">
          <div class="grid grid-cols-10 gap-2 rounded bg-neutral-500/5 p-4 select-none">
            <SortableItem
              v-for="(id, index) in gridList"
              :key="id"
              :id="id"
              :index="index"
              class="h-12"
            >
              {{ id }}
            </SortableItem>
          </div>
        </DragDropProvider>
      </NScrollbar>
    </NCard>
    <NCard
      title="水平排序小游戏"
      :size="isMaxMd ? 'small' : undefined"
    >
      <template #header-extra>
        <div class="flex items-center gap-4">
          <span>把柱子从低到高的顺序</span>
          <NButton
            type="primary"
            @click="resetGame"
          >
            重新随机
          </NButton>
        </div>
      </template>

      <DragDropProvider @drag-end="onGameDragEnd">
        <div
          class="grid h-[200px] items-end gap-4 rounded bg-neutral-500/5 p-4 select-none"
          :style="`grid-template-columns: repeat(${sortableGameList.length}, minmax(0, 1fr));`"
        >
          <SortableItem
            v-for="(item, index) in sortableGameList"
            :key="item.id"
            :id="item.id"
            :index="index"
            class="transition-[height]"
            :style="{ height: `${item.height}px` }"
            :class="{
              'bg-primary/20 ring-1 ring-primary/30': isGameSortSuccess,
            }"
          >
          </SortableItem>
        </div>
      </DragDropProvider>
    </NCard>
  </ScrollContainer>
</template>
