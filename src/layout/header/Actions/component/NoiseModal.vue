<script setup lang="ts">
import { NSlider, NInputNumber } from 'naive-ui'
import { reactive, ref, watchEffect } from 'vue'

import { useConfigureStore } from '@/stores/configure'

import type { SliderProps } from 'naive-ui'

const configureStore = useConfigureStore()

const opacity = ref(0)

const sliderRange = reactive({
  step: 0.001,
  min: 0,
  max: 0.1,
})

const onSliderUpdata: SliderProps['onUpdateValue'] = (opacity) => {
  configureStore.modify({
    noiseOpacity: opacity,
  })
}

watchEffect(() => {
  opacity.value = configureStore.configure.noiseOpacity
})
</script>
<template>
  <div class="flex flex-col gap-y-4 pt-6 pb-4">
    <NSlider
      v-model:value="opacity"
      v-bind="sliderRange"
      @update-value="onSliderUpdata"
    />
    <NInputNumber
      v-model:value="opacity"
      size="small"
      v-bind="sliderRange"
    />
  </div>
</template>
