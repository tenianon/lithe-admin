<script setup lang="ts">
import { NButton, NAlert } from 'naive-ui'
import { reactive } from 'vue'

import { ScrollContainer } from '@/components'
import router from '@/router'

import ErrorPage from './index.vue'

const errorState = reactive({
  code: 404,
  content: 'Not Found',
})

const changeStateCode500 = () => {
  errorState.code = 500
  errorState.content = 'Internal Server Error'
}

const changeStateCode200 = () => {
  errorState.code = 200
  errorState.content = 'OK'
}
</script>
<template>
  <ScrollContainer>
    <NAlert
      type="info"
      closable
      style="z-index: 10"
    >
      <div class="flex items-center gap-x-2">
        <span>这个错误码和错误内容可以自定义</span>
        <NButton
          size="small"
          type="warning"
          @click="changeStateCode500"
          >变成500</NButton
        >

        <NButton
          size="small"
          type="success"
          @click="changeStateCode200"
          >变成200</NButton
        >
      </div>
    </NAlert>
    <div
      class="absolute left-0 flex h-screen w-full items-center justify-center"
      style="padding-bottom: 240px"
    >
      <ErrorPage
        v-bind="errorState"
        :container-style="{
          maxWidth: '500px',
        }"
      >
        <NButton
          size="large"
          type="info"
          @click="router.push('/404')"
          >路由显示</NButton
        >
      </ErrorPage>
    </div>
  </ScrollContainer>
</template>
