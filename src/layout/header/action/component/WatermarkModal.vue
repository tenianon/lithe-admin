<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NColorPicker,
  NSlider,
  NSwitch,
  NSelect,
  NScrollbar,
  NConfigProvider,
} from 'naive-ui'

import { HintHelp } from '@/components'
import { useComponentThemeOverrides } from '@/composables'
import { toRefsPreferencesStore } from '@/stores'

const { watermarkOptions } = toRefsPreferencesStore()

const { inModal } = useComponentThemeOverrides()
</script>
<template>
  <NConfigProvider :theme-overrides="inModal">
    <NScrollbar
      style="max-height: 400px"
      contentClass="pr-3 py-6"
    >
      <NForm
        :label-width="80"
        :model="watermarkOptions"
        :show-feedback="false"
        class="space-y-4"
      >
        <NFormItem
          label="水印内容"
          path="content"
        >
          <NInput
            type="textarea"
            v-model:value="watermarkOptions.content"
            clearable
          />
        </NFormItem>

        <div class="flex gap-x-4">
          <NFormItem
            label="字体大小"
            path="fontSize"
            class="w-full"
          >
            <NInputNumber
              v-model:value="watermarkOptions.fontSize"
              :min="8"
              :max="32"
            />
          </NFormItem>
          <NFormItem
            label="文字颜色"
            path="fontColor"
            class="w-full"
          >
            <NColorPicker v-model:value="watermarkOptions.fontColor" />
          </NFormItem>
          <NFormItem
            label="字体风格"
            path="fontStyle"
            class="w-full"
          >
            <NSelect
              v-model:value="watermarkOptions.fontStyle"
              :options="[
                { label: '正常', value: 'normal' },
                { label: '斜体', value: 'italic' },
                { label: '倾斜', value: 'oblique' },
                { label: '粗体', value: 'bold' },
                { label: '细体', value: 'thin' },
                { label: '超细体', value: 'extralight1' },
                { label: '超细体', value: 'extralight2' },
                { label: '超细体', value: 'extralight3' },
                { label: '超细体', value: 'extralight4' },
                { label: '超细体', value: 'extralight5' },
                { label: '超细体', value: 'extralight6' },
                { label: '超细体', value: 'extralight7' },
                { label: '超细体', value: 'extralight8' },
                { label: '超细体', value: 'extralight9' },
                { label: '超细体', value: 'extralight10' },
              ]"
            />
          </NFormItem>
        </div>

        <div class="flex gap-x-4">
          <NFormItem
            label="行高"
            path="lineHeight"
            class="w-full"
          >
            <NInputNumber
              v-model:value="watermarkOptions.lineHeight"
              :min="1"
            />
          </NFormItem>
          <NFormItem
            label="字重"
            path="fontWeight"
            class="w-full"
          >
            <NInputNumber
              v-model:value="watermarkOptions.fontWeight"
              :min="100"
              :max="900"
              :step="100"
            />
          </NFormItem>
        </div>
        <div class="flex gap-x-4">
          <NFormItem
            label="宽度"
            path="width"
          >
            <NInputNumber
              v-model:value="watermarkOptions.width"
              class="w-full"
              :min="1"
            />
          </NFormItem>
          <NFormItem
            label="高度"
            path="height"
          >
            <NInputNumber
              v-model:value="watermarkOptions.height"
              class="w-full"
              :min="1"
            />
          </NFormItem>
        </div>

        <div class="flex gap-x-4">
          <NFormItem
            label="X轴间隔"
            path="xGap"
          >
            <NInputNumber
              v-model:value="watermarkOptions.xGap"
              class="w-full"
            />
          </NFormItem>
          <NFormItem
            label="Y轴间隔"
            path="yGap"
          >
            <NInputNumber
              v-model:value="watermarkOptions.yGap"
              class="w-full"
            />
          </NFormItem>
        </div>
        <div class="flex gap-x-4">
          <NFormItem
            label="X轴偏移"
            path="xoffset"
          >
            <NInputNumber
              v-model:value="watermarkOptions.xOffset"
              class="w-full"
            />
          </NFormItem>
          <NFormItem
            label="Y轴偏移"
            path="yGap"
          >
            <NInputNumber
              v-model:value="watermarkOptions.yOffset"
              class="w-full"
            />
          </NFormItem>
        </div>
        <div class="flex gap-x-4">
          <NFormItem
            label="旋转角度"
            path="rotate"
            class="w-full"
          >
            <NSlider
              v-model:value="watermarkOptions.rotate"
              :min="-90"
              :max="90"
            />
          </NFormItem>
          <NFormItem
            label="整体旋转"
            path="globalRotate"
            class="w-full"
          >
            <NSlider
              v-model:value="watermarkOptions.globalRotate"
              :min="-180"
              :max="180"
            />
          </NFormItem>
          <NFormItem
            label="跨越边界"
            path="cross"
            class="w-full"
          >
            <NSwitch v-model:value="watermarkOptions.cross" />
          </NFormItem>
        </div>
        <NFormItem
          label="图像地址"
          path="image"
        >
          <NInput
            type="textarea"
            v-model:value="watermarkOptions.image"
            clearable
          />
        </NFormItem>

        <div class="flex gap-x-4">
          <NFormItem
            path="imageWidth"
            class="w-full"
            :show-label="false"
          >
            <div>
              <HintHelp
                label="图像宽度"
                content="修改后需重新打开水印"
                class="pb-1.5"
              />
              <NInputNumber v-model:value="watermarkOptions.imageWidth" />
            </div>
          </NFormItem>
          <NFormItem
            path="imageHeight"
            class="w-full"
            :show-label="false"
          >
            <div>
              <HintHelp
                label="图像高度"
                content="修改后需重新打开水印"
                class="pb-1.5"
              />
              <NInputNumber v-model:value="watermarkOptions.imageHeight" />
            </div>
          </NFormItem>

          <NFormItem
            path="imageOpacity"
            class="w-full"
            :show-label="false"
          >
            <div class="flex h-full flex-col">
              <HintHelp
                label="图像透明度"
                content="修改后需重新打开水印"
                class="pb-1.5"
              />
              <NSlider
                v-model:value="watermarkOptions.imageOpacity"
                :min="0"
                :max="1"
                :step="0.01"
                class="mt-2"
              />
            </div>
          </NFormItem>
        </div>
      </NForm>
    </NScrollbar>
  </NConfigProvider>
</template>
