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
  NEl,
  NScrollbar,
  NConfigProvider,
} from 'naive-ui'

import { HintHelp } from '@/components'
import { useComponentThemeOverrides } from '@/composables'
import { toRefsPreferencesStore } from '@/stores'

const { watermark } = toRefsPreferencesStore()

const { overlayThemeOverrides } = useComponentThemeOverrides()
</script>
<template>
  <NConfigProvider :theme-overrides="overlayThemeOverrides">
    <NEl>
      <NScrollbar
        style="max-height: 400px"
        contentClass="pr-3 py-2"
      >
        <NForm
          :label-width="80"
          :model="watermark"
          :show-feedback="false"
          class="space-y-4"
        >
          <NFormItem
            label="水印内容"
            path="content"
          >
            <NInput
              type="textarea"
              v-model:value="watermark.content"
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
                v-model:value="watermark.fontSize"
                :min="8"
                :max="32"
              />
            </NFormItem>
            <NFormItem
              label="文字颜色"
              path="fontColor"
              class="w-full"
            >
              <NColorPicker v-model:value="watermark.fontColor" />
            </NFormItem>
            <NFormItem
              label="字体风格"
              path="fontStyle"
              class="w-full"
            >
              <NSelect
                v-model:value="watermark.fontStyle"
                :options="[
                  { label: '正常', value: 'normal' },
                  { label: '斜体', value: 'italic' },
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
                v-model:value="watermark.lineHeight"
                :min="1"
              />
            </NFormItem>
            <NFormItem
              label="字重"
              path="fontWeight"
              class="w-full"
            >
              <NInputNumber
                v-model:value="watermark.fontWeight"
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
                v-model:value="watermark.width"
                class="w-full"
                :min="1"
              />
            </NFormItem>
            <NFormItem
              label="高度"
              path="height"
            >
              <NInputNumber
                v-model:value="watermark.height"
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
                v-model:value="watermark.xGap"
                class="w-full"
              />
            </NFormItem>
            <NFormItem
              label="Y轴间隔"
              path="yGap"
            >
              <NInputNumber
                v-model:value="watermark.yGap"
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
                v-model:value="watermark.xOffset"
                class="w-full"
              />
            </NFormItem>
            <NFormItem
              label="Y轴偏移"
              path="yGap"
            >
              <NInputNumber
                v-model:value="watermark.yOffset"
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
                v-model:value="watermark.rotate"
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
                v-model:value="watermark.globalRotate"
                :min="-180"
                :max="180"
              />
            </NFormItem>
            <NFormItem
              label="跨越边界"
              path="cross"
              class="w-full"
            >
              <NSwitch v-model:value="watermark.cross" />
            </NFormItem>
          </div>
          <NFormItem
            label="图像地址"
            path="image"
          >
            <NInput
              type="textarea"
              v-model:value="watermark.image"
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
                <NInputNumber
                  v-model:value="watermark.imageWidth"
                  :disabled="!watermark.image"
                />
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
                <NInputNumber
                  v-model:value="watermark.imageHeight"
                  :disabled="!watermark.image"
                />
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
                  v-model:value="watermark.imageOpacity"
                  :min="0"
                  :max="1"
                  :step="0.01"
                  class="mt-2"
                  :disabled="!watermark.image"
                />
              </div>
            </NFormItem>
          </div>
        </NForm>
      </NScrollbar>
    </NEl>
  </NConfigProvider>
</template>
