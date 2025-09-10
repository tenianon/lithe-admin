<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

import { ButtonAnimationProvider } from '@/components'
import { useInjection } from '@/composables'
import { layoutInjectionKey } from '@/injection'

import Action from '../header/action/index.vue'

const { layoutSlideDirection, mobileRightAsideWidth } = useInjection(layoutInjectionKey)

const mobileRightAsideRef = useTemplateRef<HTMLElement>('mobileRightAside')

onMounted(() => {
  if (mobileRightAsideRef.value) {
    mobileRightAsideWidth.value = mobileRightAsideRef.value.clientWidth
  }
})
</script>
<template>
  <div
    ref="mobileRightAside"
    class="absolute top-0 right-0 h-svh py-4 pr-4 transition-[translate]"
    :class="{
      'translate-x-full': layoutSlideDirection !== 'left',
    }"
  >
    <div class="flex h-full items-center justify-between">
      <ButtonAnimationProvider
        size="large"
        :circle="false"
      >
        <Action class="flex-col justify-center gap-y-4" />
      </ButtonAnimationProvider>
    </div>
  </div>
</template>
