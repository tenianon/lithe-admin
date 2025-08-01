<script setup lang="ts">
// @ts-ignore
import { codeToHtml } from 'https://cdn.jsdelivr.net/npm/shiki@3.7.0/+esm'
import { NAlert, NCard, NSplit, NScrollbar, NButton } from 'naive-ui'
import { ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

import { EmptyPlaceholder } from '@/components'
import { usePersonalization } from '@/composable/usePersonalization'

import type { UseDraggableReturn } from 'vue-draggable-plus'

defineOptions({
  name: 'DragDrop',
})

const APP_NAME = import.meta.env.VITE_APP_NAME

const { isDark } = usePersonalization()

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
  [baseList, gridList, cloneTaskList, isDark],
  async (newVal) => {
    const [baseList, gridList, cloneList2, isDark] = newVal
    baseListCodeHighlight.value = await codeToHtml(JSON.stringify(baseList, null, 2), {
      lang: 'json',
      theme: isDark ? 'dark-plus' : 'min-light',
    })
    gridListCodeHighlight.value = await codeToHtml(JSON.stringify(gridList, null, 2), {
      lang: 'json',
      theme: isDark ? 'dark-plus' : 'min-light',
    })
    cloneList2CodeHighlight.value = await codeToHtml(JSON.stringify(cloneList2, null, 2), {
      lang: 'json',
      theme: isDark ? 'dark-plus' : 'min-light',
    })
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <div class="flex flex-col gap-y-2 p-4">
    <NAlert
      type="info"
      closable
    >
      {{ APP_NAME }} 的 Tabs 栏的拖拽模块使用了
      vue-draggable-plus，在一些拖拽的场景下，它也许可以帮助到你
    </NAlert>
    <NCard title="基础使用">
      <NSplit
        direction="horizontal"
        pane1-class="pr-8"
        pane2-class="pl-8"
        style="height: 280px"
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
                v-for="item in baseList"
                :key="item.id"
                class="flex h-14 cursor-move items-center justify-center rounded bg-neutral-500/8 p-3"
              >
                {{ item.name }}
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
          <div class="h-full w-px cursor-col-resize bg-neutral-200 dark:bg-neutral-700"></div>
        </template>
      </NSplit>
    </NCard>
    <NCard title="网格布局">
      <template #header-extra>
        <div>
          你可以把<span class="text-primary">网格布局</span>的元素拖进<span class="text-primary"
            >基础使用</span
          >中，它们可以相互拖放
        </div>
      </template>
      <NSplit
        direction="horizontal"
        pane1-class="pr-8"
        pane2-class="pl-8"
        style="height: 280px"
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
              class="m-auto grid grid-cols-8 gap-2 rounded bg-neutral-500/5 p-4 select-none"
            >
              <div
                v-for="item in gridList"
                :key="item.id"
                class="flex h-14 cursor-move items-center justify-center rounded bg-neutral-500/8 p-3"
              >
                {{ item.name }}
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
          <div class="h-full w-px cursor-col-resize bg-neutral-200 dark:bg-neutral-700"></div>
        </template>
      </NSplit>
    </NCard>
    <NCard title="克隆使用">
      <NSplit
        direction="horizontal"
        pane1-class="pr-8"
        pane2-class="pl-8"
        style="height: 300px"
        :default-size="0.7"
      >
        <template #1>
          <div class="flex h-full gap-x-4">
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
                  v-for="item in taskList"
                  :key="item.id"
                  class="flex h-14 cursor-move items-center justify-center rounded bg-neutral-500/8 p-3"
                >
                  {{ item.name }}
                </div>
              </VueDraggable>
            </NScrollbar>
            <NScrollbar>
              <EmptyPlaceholder
                :show="cloneTaskList.length <= 0"
                description="把左边的任务拖拽到这里"
              >
                <template #content>
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
                </template>
              </EmptyPlaceholder>
            </NScrollbar>
          </div>
        </template>
        <template #2>
          <NScrollbar>
            <div v-html="cloneList2CodeHighlight"></div>
          </NScrollbar>
        </template>
        <template #resize-trigger>
          <div class="h-full w-px cursor-col-resize bg-neutral-200 dark:bg-neutral-700"></div>
        </template>
      </NSplit>
    </NCard>
  </div>
</template>
