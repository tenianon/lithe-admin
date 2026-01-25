<script setup lang="ts">
import { useMutation } from '@pinia/colada'
import { NForm, NFormItem, NInput, NButton, NCheckbox, NCarousel } from 'naive-ui'
import {
  computed,
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  useTemplateRef,
} from 'vue'

import topographySvg from '@/assets/topography.svg'
import { useInjection } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'
import ThemeModePopover from '@/layout/header/action/ThemeModePopover.vue'
import router from '@/router'
import { toRefsPreferencesStore, useUserStore } from '@/stores'
import { twColor } from '@/utils/colors'

import ThemeColorPopover from './component/ThemeColorPopover.vue'

import type { FormItemRule } from 'naive-ui'

defineOptions({
  name: 'SignIn',
})

const { isMaxSm } = useInjection(mediaQueryInjectionKey)

const { isDark } = toRefsPreferencesStore()

const { userSignIn } = useUserStore()

const illustrations = [
  defineAsyncComponent(() => import('./component/Illustration1.vue')),
  defineAsyncComponent(() => import('./component/Illustration2.vue')),
  defineAsyncComponent(() => import('./component/Illustration3.vue')),
]

const isNavigating = ref(false)
const isRememberMed = ref(false)

const textureMaskParams = reactive({
  size: '666px 666px',
  x: 0,
  y: 0,
})

const textureStyle = computed(() => {
  return {
    filter: isDark.value ? 'invert(0.18)' : 'invert(0.9)',
    maskImage: `radial-gradient(circle 200px at ${textureMaskParams.x}px ${textureMaskParams.y}px, #f0f 0%, transparent 100%)`,
    WebkitMaskImage: `radial-gradient(circle 200px at ${textureMaskParams.x}px ${textureMaskParams.y}px, #f0f 0%, transparent 100%)`,
  }
})

const signInFormRef = useTemplateRef<InstanceType<typeof NForm>>('signInFormRef')

const signInForm = reactive({
  account: 'admin',
  password: '123456',
})

const signInFormRules: Record<string, FormItemRule[]> = {
  account: [{ required: true, message: '请输入账号', trigger: ['input'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['input'] }],
}

const { isLoading: isSignInLoading, mutate: signInMutation } = useMutation({
  mutation: userSignIn,
  onSuccess: () => {
    toLayout()
  },
})

const mergedLoading = computed(() => isSignInLoading.value || isNavigating.value)

function toLayout() {
  const { r } = router.currentRoute.value.query

  isNavigating.value = true
  router
    .replace({
      path: (r as string) || '/',
    })
    .finally(() => {
      isNavigating.value = false
    })
}

const handleSubmitClick = () => {
  signInFormRef.value?.validate((errors) => {
    if (!errors) {
      signInMutation({ account: signInForm.account, password: signInForm.password })
    }
  })
}

const handleQuickLogin = (account: 'admin' | 'user' | 'guest') => {
  switch (account) {
    case 'admin':
      signInMutation({ account: 'admin', password: '123456' })
      break
    case 'user':
      signInMutation({ account: 'user', password: '123456' })
      break
    case 'guest':
      signInMutation({ account: 'guest', password: '123456' })
      break
    default:
      break
  }
}

function updateTexturePosition(x: number, y: number) {
  textureMaskParams.x = x
  textureMaskParams.y = y
}

function onMouseMove(e: MouseEvent) {
  updateTexturePosition(e.clientX, e.clientY)
}

function onTouchMove(e: TouchEvent) {
  if (!e.touches[0]) return
  updateTexturePosition(e.touches[0].clientX, e.touches[0].clientY)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
})
</script>
<template>
  <div
    class="relative flex h-svh items-center justify-center overflow-hidden bg-neutral-25 p-6 transition-[background-color] dark:bg-neutral-900"
  >
    <div
      class="absolute top-0 left-0 size-full bg-neutral-200/45 transition-[background-color] dark:bg-neutral-800/50"
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
      class="pointer-events-none absolute inset-0 z-10 transition-[filter]"
      :style="{
        'background-image': `url(${topographySvg})`,
        'background-size': textureMaskParams.size,
        '-webkit-mask-repeat': 'no-repeat',
        'mask-repeat': 'no-repeat',
        ...textureStyle,
      }"
    />
    <div class="relative z-50 flex h-[480px] w-[800px] justify-center rounded shadow-lg">
      <div
        v-if="!isMaxSm"
        class="flex-1 bg-neutral-35 py-6 pl-6 text-primary transition-[background-color] dark:bg-neutral-825"
      >
        <NCarousel
          draggable
          :show-dots="false"
          :show-arrow="false"
          loop
          autoplay
        >
          <div
            v-for="(illustration, index) in illustrations"
            :key="index"
            class="flex h-full items-center p-5"
          >
            <component :is="illustration" />
          </div>
        </NCarousel>
      </div>
      <div
        class="relative flex w-full flex-col bg-white px-10 py-12 transition-[background-color] sm:w-[340px] dark:bg-neutral-800"
      >
        <div class="absolute top-0 left-0 z-50 flex w-full items-center justify-end gap-x-4 p-4">
          <ThemeColorPopover />
          <ThemeModePopover />
        </div>
        <div>
          <div>
            <h2 class="text-2xl">登&nbsp;录</h2>
            <p class="text-neutral-400 transition-[color] dark:text-neutral-500">SIGN IN</p>
          </div>
          <div class="mt-12">
            <NForm
              ref="signInFormRef"
              :model="signInForm"
              :show-require-mark="false"
              :rules="signInFormRules"
            >
              <NFormItem
                path="account"
                label="账号"
              >
                <NInput
                  v-model:value="signInForm.account"
                  placeholder="请输入账号"
                  clearable
                  :theme-overrides="
                    isDark
                      ? {
                          color: twColor('neutral', 750),
                          border: `1px solid ${twColor('neutral', 700)}`,
                        }
                      : undefined
                  "
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
                  v-model:value="signInForm.password"
                  placeholder="请输入密码"
                  type="password"
                  clearable
                  :theme-overrides="
                    isDark
                      ? {
                          color: twColor('neutral', 750),
                          border: `1px solid ${twColor('neutral', 700)}`,
                        }
                      : undefined
                  "
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
                <NCheckbox v-model:checked="isRememberMed">记住我</NCheckbox>
                <NButton
                  text
                  size="small"
                  >忘记密码</NButton
                >
              </div>
              <div class="mt-4">
                <NButton
                  type="primary"
                  :loading="mergedLoading"
                  :disabled="mergedLoading"
                  attr-type="button"
                  block
                  size="medium"
                  class="bg-red-400"
                  @click="handleSubmitClick"
                >
                  登&nbsp;录
                </NButton>
              </div>
              <div class="mt-6 flex items-center justify-center">
                <NButton
                  text
                  :disabled="mergedLoading"
                  size="tiny"
                  @click="handleQuickLogin('admin')"
                >
                  管理员登录
                </NButton>
                <span
                  class="mx-2 h-3 border-r border-neutral-300 transition-[border-color] dark:border-neutral-650"
                ></span>
                <NButton
                  text
                  :disabled="mergedLoading"
                  size="tiny"
                  @click="handleQuickLogin('user')"
                >
                  普通用户登录
                </NButton>
                <span
                  class="mx-2 h-3 border-r border-neutral-300 transition-[border-color] dark:border-neutral-650"
                ></span>
                <NButton
                  text
                  :disabled="mergedLoading"
                  size="tiny"
                  @click="handleQuickLogin('guest')"
                >
                  访客登录
                </NButton>
              </div>
            </NForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
