<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton, NCheckbox, NCarousel } from 'naive-ui'
import { computed, onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue'

import topographySvg from '@/assets/topography.svg'
import { usePersonalization } from '@/composable/usePersonalization'
import ThemeDropdown from '@/layout/header/Actions/component/ThemeDropdown.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import twc from '@/utils/tailwindColor'

import Illustration1 from './component/Illustration1.vue'
import Illustration2 from './component/Illustration2.vue'
import Illustration3 from './component/Illustration3.vue'
import Illustration4 from './component/Illustration4.vue'
import ThemeColorPopover from './component/ThemeColorPopover.vue'

import type { FormItemRule } from 'naive-ui'

defineOptions({
  name: 'SignIn',
})

const { isDark } = usePersonalization()

const userStore = useUserStore()

const loading = ref(false)

const isRememberMed = ref(false)

const textureMaskParams = reactive({
  size: '666px 666px',
  x: 0,
  y: 0,
})

const textureStyle = computed(() => {
  return {
    filter: isDark.value ? 'invert(0.18)' : 'invert(0.86)',
    maskImage: `radial-gradient(circle 200px at ${textureMaskParams.x}px ${textureMaskParams.y}px, #f0f 0%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle 200px at ${textureMaskParams.x}px ${textureMaskParams.y}px, #f0f 0%, transparent 100%)`,
  }
})

const formRef = useTemplateRef<InstanceType<typeof NForm>>('formRef')

const signinForm = reactive({
  account: 'admin',
  password: '123456',
})

const rules: Record<string, FormItemRule[]> = {
  account: [{ required: true, message: '请输入账号', trigger: ['input'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['input'] }],
}

function toLayout() {
  const { r } = router.currentRoute.value.query

  setTimeout(() => {
    if (signinForm.account.includes('admin')) {
      userStore.setToken('admin')
    } else {
      userStore.setToken('user')
    }

    router.replace({
      path: (r as string) || '/',
    })

    loading.value = false
  }, 1000)
}

const handleSubmitClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true
      toLayout()
    }
  })
}

const updateTexturePosition = (e: MouseEvent) => {
  textureMaskParams.x = e.clientX
  textureMaskParams.y = e.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', updateTexturePosition)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', updateTexturePosition)
})
</script>
<template>
  <div class="relative flex h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900">
    <div
      class="absolute top-0 left-0 size-full bg-neutral-200/45 dark:bg-neutral-800/50"
      :style="{
        'mask-image': `url(${topographySvg})`,
        '-webkit-mask-image': `url(${topographySvg})`,
        'mask-repeat': 'repeat',
        'mask-size': textureMaskParams.size,
        '-webkit-mask-repeat': 'repeat',
        '-webkit-mask-size': textureMaskParams.size,
      }"
    />
    <div
      class="pointer-events-none absolute inset-0 z-10"
      :style="{
        'background-image': `url(${topographySvg})`,
        'background-size': textureMaskParams.size,
        '-webkit-mask-repeat': 'no-repeat',
        'mask-repeat': 'no-repeat',
        ...textureStyle,
      }"
    />
    <div class="relative z-50 flex h-[480px] w-[800px] rounded shadow-lg">
      <div class="flex-1 bg-neutral-50 py-6 pl-6 text-primary dark:bg-neutral-850">
        <NCarousel
          draggable
          :show-dots="false"
          :show-arrow="false"
          loop
          autoplay
        >
          <Illustration4 class="p-5" />
          <Illustration1 class="p-5" />
          <Illustration2 class="p-5" />
          <Illustration3 class="p-5" />
        </NCarousel>
      </div>
      <div class="relative flex w-[340px] flex-col bg-white px-10 py-12 dark:bg-neutral-800">
        <div class="absolute top-0 left-0 z-50 flex w-full items-center justify-end gap-x-4 p-4">
          <ThemeColorPopover />
          <ThemeDropdown />
        </div>
        <div>
          <div>
            <h2 class="text-2xl">登&nbsp;录</h2>
            <p class="text-neutral-400 dark:text-neutral-500">SIGN IN</p>
          </div>
          <div class="mt-12">
            <NForm
              ref="formRef"
              :model="signinForm"
              :show-require-mark="false"
              :rules="rules"
            >
              <NFormItem
                path="account"
                label="账号"
              >
                <NInput
                  v-model:value="signinForm.account"
                  placeholder="请输入账号"
                  clearable
                  :input-props="{
                    autocomplete: 'off',
                  }"
                >
                  <template #prefix>
                    <span class="mr-1.5 iconify size-5.5 ph--user-circle" />
                  </template>
                </NInput>
              </NFormItem>
              <NFormItem
                path="password"
                label="密码"
              >
                <NInput
                  v-model:value="signinForm.password"
                  placeholder="请输入密码"
                  type="password"
                  clearable
                  :input-props="{
                    autocomplete: 'off',
                  }"
                >
                  <template #prefix>
                    <span class="mr-1.5 iconify size-5.5 ph--lock-key" />
                  </template>
                </NInput>
              </NFormItem>
              <div class="flex justify-between">
                <NCheckbox
                  :theme-overrides="{
                    border: `1px solid ${twc.neutral[isDark ? 650 : 300]}`,
                  }"
                  v-model:checked="isRememberMed"
                  >记住我</NCheckbox
                >
                <NButton
                  text
                  size="small"
                  >忘记密码</NButton
                >
              </div>
              <div class="mt-4">
                <NButton
                  type="primary"
                  :loading="loading"
                  attr-type="button"
                  block
                  size="medium"
                  @click="handleSubmitClick()"
                >
                  登&nbsp;录
                </NButton>
              </div>
            </NForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
