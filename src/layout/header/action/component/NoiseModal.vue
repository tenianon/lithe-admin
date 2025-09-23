<script setup lang="ts">
import { NSlider, NInputNumber } from 'naive-ui'
import { reactive, ref } from 'vue'

import { toRefsPreferencesStore } from '@/stores'

import type { SliderProps } from 'naive-ui'

const { preferences, noiseOpacity } = toRefsPreferencesStore()

const opacity = ref(noiseOpacity.value)

const sliderRange = reactive({
  step: 0.001,
  min: 0,
  max: 0.1,
})

const onSliderUpdate: SliderProps['onUpdateValue'] = (value) => {
  preferences.value.noiseOpacity = value
}
</script>
<template>
  <div class="flex flex-col gap-y-4 pt-6 pb-4">
    <NSlider
      v-model:value="opacity"
      v-bind="sliderRange"
      @update-value="onSliderUpdate"
    />
    <NInputNumber
      v-model:value="opacity"
      v-bind="sliderRange"
    />
  </div>
</template>
