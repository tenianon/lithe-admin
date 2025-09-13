<script setup lang="ts">
import { NAlert, NCard, NSplit, NScrollbar, NButton } from 'naive-ui'
import { ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

import { ScrollContainer, EmptyPlaceholder } from '@/components'
import { useInjection } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'

import type { UseDraggableReturn } from 'vue-draggable-plus'

defineOptions({
  name: 'DragDrop',
})

let codeToHtml: any

const { isMaxMd } = useInjection(mediaQueryInjectionKey)

const APP_NAME = import.meta.env.VITE_APP_NAME

const baseListCodeHighlight = ref()

const gridListCodeHighlight = ref()

const cloneList2CodeHighlight = ref()

const baseList = ref(
  Object.keys(Array.from({ length: 4 }).fill(0)).map((item, index) => ({
    name: item,
    id: index,
  })),
)

const gridList = ref(
  Object.keys(Array.from({ length: 50 }).fill(0)).map((item, index) => ({
    name: Number(item) + 4,
    id: index + 4,
  })),
)

const taskList = ref(
  Object.keys(Array.from({ length: 5 }).fill(0)).map((item) => ({
    name: `任务-${item}`,
    id: `任务-${item}`,
  })),
)

const cloneTaskList = ref<{ name: string; id: string; key: string }[]>([])

const baseDragRef = ref<UseDraggableReturn>()
const gridDragRef = ref<UseDraggableReturn>()
const taskDragRef = ref<UseDraggableReturn>()
const cloneTaskListDragRef = ref<UseDraggableReturn>()

function cloneTask(element: Record<'name' | 'id', string>) {
  return {
    name: `${element.name}`,
    id: `${element.id}`,
    key: element.name + new Date().getTime(),
  }
}

function removeTask(element: Record<'name' | 'id' | 'key', string>) {
  const find = cloneTaskList.value.find((item) => item.key === element.key)
  if (find) {
    cloneTaskList.value = cloneTaskList.value.filter((item) => item.key !== element.key)
  }
}

watch(
  [baseList, gridList, cloneTaskList],
  async (newVal) => {
    const [baseList, gridList, cloneList2] = newVal

    if (!codeToHtml) {
      // @ts-ignore
      const shiki = await import('https://cdn.jsdelivr.net/npm/shiki@3.7.0/+esm')
      codeToHtml = shiki.codeToHtml
    }

    codeToHtml(JSON.stringify(baseList, null, 2), {
      lang: 'json',
      themes: {
        dark: 'dark-plus',
        light: 'min-light',
      },
    })
      .then((result: string) => (baseListCodeHighlight.value = result))
      .catch(() => (baseListCodeHighlight.value = JSON.stringify(baseList, null, 2)))

    codeToHtml(JSON.stringify(gridList, null, 2), {
      lang: 'json',
      themes: {
        dark: 'dark-plus',
        light: 'min-light',
      },
    })
      .then((result: string) => (gridListCodeHighlight.value = result))
      .catch(() => (gridListCodeHighlight.value = JSON.stringify(gridList, null, 2)))

    codeToHtml(JSON.stringify(cloneList2, null, 2), {
      lang: 'json',
      themes: {
        dark: 'dark-plus',
        light: 'min-light',
      },
    })
      .then((result: string) => (cloneList2CodeHighlight.value = result))
      .catch(() => (cloneList2CodeHighlight.value = JSON.stringify(cloneList2, null, 2)))
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <NAlert
      type="info"
      closable
    >
      {{ APP_NAME }} 的 Tabs 栏的拖拽模块使用了
      vue-draggable-plus，在一些拖拽的场景下，它也许可以帮助到你
    </NAlert>
    <NCard
      title="基础使用"
      :size="isMaxMd ? 'small' : undefined"
    >
      <NSplit
        :direction="isMaxMd ? 'vertical' : 'horizontal'"
        :pane1-class="isMaxMd ? 'pb-4' : 'pr-8'"
        :pane2-class="isMaxMd ? 'pt-4' : 'pl-8'"
        :style="{
          height: isMaxMd ? '580px' : '280px',
        }"
      >
        <template #1>
          <NScrollbar>
            <VueDraggable
              ref="baseDragRef"
              v-model="baseList"
              :animation="150"
              :scrollSensitivity="100"
              ghostClass="ghost"
              group="drag1"
              class="flex flex-col gap-2 rounded bg-neutral-500/5 p-4 select-none"
            >
              <div
                v-for="{ id, name } in baseList"
                :key="id"
                class="flex h-14 cursor-move items-center justify-center rounded bg-neutral-500/8 p-3"
              >
                {{ name }}
              </div>
            </VueDraggable>
          </NScrollbar>
        </template>
        <template #2>
          <NScrollbar>
            <div v-html="baseListCodeHighlight"></div>
          </NScrollbar>
        </template>
        <template #resize-trigger>
          <div
            class="h-full w-px cursor-col-resize bg-neutral-200 transition-[background-color] max-lg:h-px max-lg:w-full dark:bg-neutral-700"
          ></div>
        </template>
      </NSplit>
    </NCard>
    <NCard
      title="网格布局"
      :size="isMaxMd ? 'small' : undefined"
    >
      <div class="mb-4">
        你可以把<span class="text-primary">网格布局</span>的元素拖进<span class="text-primary"
          >基础使用</span
        >中，它们可以相互拖放
      </div>
      <NSplit
        :direction="isMaxMd ? 'vertical' : 'horizontal'"
        :pane1-class="isMaxMd ? 'pb-4' : 'pr-8'"
        :pane2-class="isMaxMd ? 'pt-4' : 'pl-8'"
        :style="{
          height: isMaxMd ? '680px' : '280px',
        }"
        :default-size="0.7"
      >
        <template #1>
          <NScrollbar>
            <VueDraggable
              ref="gridDragRef"
              v-model="gridList"
              :animation="150"
              ghostClass="ghost"
              group="drag1"
              class="m-auto grid grid-cols-8 gap-2 rounded bg-neutral-500/5 p-4 select-none max-lg:grid-cols-4"
            >
              <div
                v-for="{ id, name } in gridList"
                :key="id"
                class="flex h-14 cursor-move items-center justify-center rounded bg-neutral-500/8 p-3"
              >
                {{ name }}
              </div>
            </VueDraggable>
          </NScrollbar>
        </template>
        <template #2>
          <NScrollbar>
            <div v-html="gridListCodeHighlight"></div>
          </NScrollbar>
        </template>
        <template #resize-trigger>
          <div
            class="h-full w-px cursor-col-resize bg-neutral-200 transition-[background-color] max-lg:h-px max-lg:w-full dark:bg-neutral-700"
          ></div>
        </template>
      </NSplit>
    </NCard>
    <NCard
      title="克隆使用"
      :size="isMaxMd ? 'small' : undefined"
    >
      <NSplit
        :direction="isMaxMd ? 'vertical' : 'horizontal'"
        :pane1-class="isMaxMd ? 'pb-4' : 'pr-8'"
        :pane2-class="isMaxMd ? 'pt-4' : 'pl-8'"
        :style="{
          height: isMaxMd ? '780px' : '280px',
        }"
        :default-size="0.7"
      >
        <template #1>
          <div class="flex h-full gap-4 max-lg:flex-col">
            <NScrollbar>
              <VueDraggable
                ref="taskDragRef"
                v-model="taskList"
                :animation="150"
                :scrollSensitivity="100"
                ghostClass="ghost"
                :group="{ name: 'clone', pull: 'clone', put: false }"
                class="flex flex-col gap-2 rounded bg-neutral-500/5 p-4 select-none"
                :clone="cloneTask"
              >
                <div
                  v-for="{ id, name } in taskList"
                  :key="id"
                  class="flex h-14 cursor-move items-center justify-center rounded bg-neutral-500/8 p-3"
                >
                  {{ name }}
                </div>
              </VueDraggable>
            </NScrollbar>
            <NScrollbar>
              <EmptyPlaceholder
                :show="cloneTaskList.length <= 0"
                :description="`把${isMaxMd ? '上' : '左'}边的任务拖拽到这里`"
              />
              <VueDraggable
                ref="cloneTaskListDragRef"
                v-model="cloneTaskList"
                :animation="150"
                :scrollSensitivity="100"
                ghostClass="ghost"
                group="clone"
                class="flex h-full flex-col gap-2 rounded bg-neutral-500/5 p-4 select-none"
                style="min-height: 300px"
              >
                <div
                  v-for="item in cloneTaskList"
                  :key="item.key"
                  class="flex h-14 cursor-move items-center justify-between rounded bg-neutral-500/8 px-4 py-3"
                >
                  <span>{{ item.name }}</span>
                  <NButton
                    quaternary
                    circle
                    size="small"
                    @click="removeTask(item)"
                  >
                    <template #icon>
                      <span class="iconify ph--x"></span>
                    </template>
                  </NButton>
                </div>
              </VueDraggable>
            </NScrollbar>
          </div>
        </template>
        <template #2>
          <NScrollbar>
            <div v-html="cloneList2CodeHighlight"></div>
          </NScrollbar>
        </template>
        <template #resize-trigger>
          <div
            class="h-full w-px cursor-col-resize bg-neutral-200 transition-[background-color] dark:bg-neutral-700"
          ></div>
        </template>
      </NSplit>
    </NCard>
  </ScrollContainer>
</template>
