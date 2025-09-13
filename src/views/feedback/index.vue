<script setup lang="ts">
import { NAlert, NCard, useMessage, NButton, useModal, NModal, useNotification } from 'naive-ui'
import { reactive } from 'vue'

import { ScrollContainer } from '@/components'

import type { ModalProps } from 'naive-ui'

defineOptions({
  name: 'Feedback',
})

const APP_NAME = import.meta.env.VITE_APP_NAME

const message = useMessage()

const modal = useModal()

import { useComponentModifier } from '@/composables'

import { useMessageDiscrete, useModalDiscrete, useNotificationDiscrete } from './discreteApi'

const { getModalModifier } = useComponentModifier()

const notification = useNotification()

const showModal = reactive({
  modal1: false,
  modal2: false,
  modal3: false,
  modal4: false,
})

const changeMessageState = () => {
  let counter = 5

  let timer: ReturnType<typeof setInterval> | null = null

  const messageInstance = message.create('5秒后 根据状态更换图标', {
    type: 'info',
    duration: 0,
    closable: true,
  })

  timer = setInterval(() => {
    counter -= 1
    if (counter <= 0) {
      if (timer) {
        clearInterval(timer)
      }
      messageInstance.type = 'error'
      messageInstance.content = '切换图标了'
      return
    }
    messageInstance.content = `${counter}秒后 根据状态更换图标`
  }, 1000)
}

const createDialogApi = (type: ModalProps['type'] = 'success') => {
  const title = {
    success: '成功的Dialog',
    warning: '警告的Dialog',
    error: '失败的Dialog',
    info: '信息的Dialog',
    default: '默认的Dialog',
  } as const

  modal.create({
    ...getModalModifier(),
    title: `命令式${title[type]}`,
    content: `命令式${title[type]}`,
    preset: 'dialog',
    type,
    positiveText: '确认',
    negativeText: '算了',
  })
}
</script>
<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <NAlert
      type="info"
      closable
    >
      {{ APP_NAME }} 修饰了一些反馈组件的默认设计，这似乎还不错
    </NAlert>
    <NAlert
      type="success"
      closable
    >
      {{ APP_NAME }} 修饰了一些反馈组件的默认设计，这似乎还不错
    </NAlert>
    <NAlert
      type="error"
      closable
    >
      {{ APP_NAME }} 修饰了一些反馈组件的默认设计，这似乎还不错
    </NAlert>
    <NAlert
      type="warning"
      closable
    >
      {{ APP_NAME }} 修饰了一些反馈组件的默认设计，这似乎还不错
    </NAlert>
    <NCard title="Message 消息">
      <div class="flex flex-wrap gap-4">
        <NButton
          type="success"
          @click="message.success('成功Message', { closable: true })"
        >
          成功Message
        </NButton>
        <NButton
          type="warning"
          secondary
          @click="message.warning('警告Message', { closable: true })"
        >
          警告Message
        </NButton>
        <NButton
          type="error"
          tertiary
          @click="message.error('失败Message', { closable: true })"
        >
          失败Message
        </NButton>
        <NButton
          type="info"
          dashed
          @click="message.info('信息Message', { closable: true })"
        >
          信息Message
        </NButton>
        <NButton
          type="primary"
          ghost
          @click="message.loading('加载Message', { closable: true })"
        >
          加载Message
        </NButton>
        <NButton @click="changeMessageState"> 根据状态切换图标 </NButton>
        <NCard
          size="small"
          title="Setup 外使用"
          :bordered="false"
        >
          <div class="flex flex-wrap gap-4">
            <NButton
              type="success"
              @click="useMessageDiscrete('success')"
              size="small"
            >
              成功Message
            </NButton>
            <NButton
              type="warning"
              secondary
              @click="useMessageDiscrete('warning')"
              size="small"
            >
              警告Message
            </NButton>
            <NButton
              type="error"
              tertiary
              @click="useMessageDiscrete('error')"
              size="small"
            >
              Message失败
            </NButton>
            <NButton
              type="info"
              dashed
              @click="useMessageDiscrete('info')"
              size="small"
            >
              信息Message
            </NButton>
            <NButton
              type="primary"
              ghost
              @click="useMessageDiscrete('loading')"
              size="small"
            >
              加载Message
            </NButton>
          </div>
        </NCard>
      </div>
    </NCard>
    <NCard title="Modal 模态框">
      <div class="flex flex-wrap gap-4">
        <NCard
          size="small"
          title="Dialog 预设"
          :bordered="false"
        >
          <div class="flex flex-wrap gap-4">
            <NButton
              type="success"
              secondary
              @click="showModal.modal1 = true"
            >
              成功Dialog
            </NButton>
            <NButton
              type="warning"
              tertiary
              @click="showModal.modal2 = true"
            >
              警告Dialog
            </NButton>
            <NButton
              type="error"
              dashed
              @click="showModal.modal3 = true"
            >
              失败Dialog
            </NButton>
            <NButton
              type="info"
              ghost
              @click="showModal.modal4 = true"
            >
              信息Dialog
            </NButton>
          </div>
        </NCard>
        <NCard
          size="small"
          title="命令式 Dialog 预设"
          :bordered="false"
        >
          <div class="flex flex-wrap gap-4">
            <NButton
              type="success"
              size="small"
              secondary
              @click="createDialogApi('success')"
            >
              成功Dialog
            </NButton>
            <NButton
              type="warning"
              size="small"
              tertiary
              @click="createDialogApi('warning')"
            >
              警告Dialog
            </NButton>
            <NButton
              type="error"
              size="small"
              dashed
              @click="createDialogApi('error')"
            >
              失败Dialog
            </NButton>
            <NButton
              type="info"
              size="small"
              ghost
              @click="createDialogApi('info')"
            >
              信息Dialog
            </NButton>
          </div>
        </NCard>
        <NCard
          size="small"
          title="Setup 外使用 Dialog 预设"
          :bordered="false"
        >
          <div class="flex flex-wrap gap-4">
            <NButton
              type="success"
              size="small"
              secondary
              @click="useModalDiscrete('success')"
            >
              成功Dialog
            </NButton>
            <NButton
              type="warning"
              size="small"
              tertiary
              @click="useModalDiscrete('warning')"
            >
              警告Dialog
            </NButton>
            <NButton
              type="error"
              size="small"
              dashed
              @click="useModalDiscrete('error')"
            >
              失败Dialog
            </NButton>
            <NButton
              type="info"
              size="small"
              ghost
              @click="useModalDiscrete('info')"
            >
              信息Dialog
            </NButton>
          </div>
        </NCard>
      </div>
    </NCard>
    <NCard title="Notification 通知">
      <div class="flex flex-wrap gap-4">
        <NButton
          type="success"
          @click="
            notification.success({
              content: '说点啥呢',
              meta: '我不到啊',
              duration: 5000,
            })
          "
        >
          成功Notification
        </NButton>
        <NButton
          type="warning"
          secondary
          @click="
            notification.warning({
              content: '说点啥呢',
              meta: '我不到啊',
              duration: 5000,
            })
          "
        >
          警告Notification
        </NButton>
        <NButton
          type="error"
          tertiary
          @click="
            notification.error({
              content: '说点啥呢',
              meta: '我不到啊',
              duration: 5000,
            })
          "
        >
          错误Notification
        </NButton>
        <NButton
          type="info"
          ghost
          @click="
            notification.info({
              content: '说点啥呢',
              meta: '我不到啊',
              duration: 5000,
            })
          "
        >
          信息Notification
        </NButton>
      </div>
      <NCard
        size="small"
        :bordered="false"
        title="Setup 外使用 Notification 通知"
      >
        <div class="flex flex-wrap gap-4">
          <NButton
            type="success"
            size="small"
            secondary
            @click="useNotificationDiscrete('success')"
          >
            成功Notification
          </NButton>
          <NButton
            type="warning"
            secondary
            size="small"
            @click="useNotificationDiscrete('warning')"
          >
            警告Notification
          </NButton>
          <NButton
            type="error"
            tertiary
            size="small"
            @click="useNotificationDiscrete('error')"
          >
            错误Notification
          </NButton>
          <NButton
            type="info"
            ghost
            size="small"
            @click="useNotificationDiscrete('info')"
          >
            信息Notification
          </NButton>
        </div>
      </NCard>
    </NCard>
    <NModal
      v-bind="
        getModalModifier({
          type: 'success',
        })
      "
      v-model:show="showModal.modal1"
      preset="dialog"
      title="确认"
      content="你确认?"
      positive-text="确认"
      negative-text="算了"
    >
    </NModal>
    <NModal
      v-bind="
        getModalModifier({
          type: 'info',
        })
      "
      v-model:show="showModal.modal2"
      preset="dialog"
      title="确认"
      content="你确认?"
      positive-text="确认"
      negative-text="算了"
    >
    </NModal>
    <NModal
      v-bind="
        getModalModifier({
          type: 'error',
        })
      "
      v-model:show="showModal.modal3"
      type="error"
      preset="dialog"
      title="确认"
      content="你确认?"
      positive-text="确认"
      negative-text="算了"
    >
    </NModal>
    <NModal
      v-bind="
        getModalModifier({
          type: 'info',
        })
      "
      v-model:show="showModal.modal4"
      preset="dialog"
      title="确认"
      content="你确认?"
      positive-text="确认"
      negative-text="算了"
    >
    </NModal>
  </ScrollContainer>
</template>
