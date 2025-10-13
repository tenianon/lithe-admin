<script setup lang="ts">
import {
  NColorPicker,
  NDivider,
  NDrawer,
  NDrawerContent,
  NSwitch,
  useModal,
  NSelect,
  NConfigProvider,
  NSlider,
  NInputNumber,
} from 'naive-ui'
import { h, ref } from 'vue'

import packageJson from '@/../package.json'
import { ButtonAnimation, ButtonAnimationProvider, CollapseTransitionTrigger } from '@/components'
import { useComponentThemeOverrides, useInjection } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'
import { usePreferencesStore, toRefsPreferencesStore } from '@/stores'
import { ccAPCA } from '@/utils/chromaHelper'
import twc from '@/utils/tailwindColor'

import LayoutThumbnail from './component/LayoutThumbnail.vue'
import WatermarkModal from './component/WatermarkModal.vue'

const { isMaxSm } = useInjection(mediaQueryInjectionKey)

const { overlayThemeOverrides } = useComponentThemeOverrides()

const { reset } = usePreferencesStore()

const { preferences, themeColor, sidebarMenu, isDark } = toRefsPreferencesStore()

const modal = useModal()

const showPreferencesDrawer = ref(false)

const colorSwatches = [
  twc.red[500],
  twc.orange[500],
  twc.amber[500],
  twc.yellow[500],
  twc.lime[500],
  twc.green[500],
  twc.emerald[500],
  twc.teal[500],
  twc.cyan[500],
  twc.sky[500],
  twc.blue[500],
  twc.indigo[500],
  twc.violet[500],
  twc.purple[500],
  twc.fuchsia[500],
  twc.pink[500],
]

const showWatermarkModal = () => {
  modal.create({
    autoFocus: false,
    title: '修改水印信息',
    preset: 'dialog',
    content: () => h(WatermarkModal),
    closable: true,
    draggable: true,
    showIcon: false,
    zIndex: 99999,
  })
}
</script>
<template>
  <div>
    <ButtonAnimation
      @click="showPreferencesDrawer = true"
      title="系统设定"
    >
      <span class="iconify ph--gear" />
    </ButtonAnimation>
    <ButtonAnimationProvider>
      <NConfigProvider :theme-overrides="overlayThemeOverrides">
        <NDrawer
          v-model:show="showPreferencesDrawer"
          :auto-focus="false"
          :width="320"
          :theme-overrides="{
            footerPadding: '14px 16px',
          }"
          :style="{
            '--primary-color': themeColor,
          }"
        >
          <NDrawerContent :native-scrollbar="false">
            <template #header>
              <div class="flex items-center gap-x-1">
                <span>系统设定</span>
                <ButtonAnimation
                  animation="rotate"
                  @click="reset"
                >
                  <span class="iconify ph--arrow-clockwise" />
                </ButtonAnimation>
              </div>
            </template>
            <div>
              <NDivider>主题颜色</NDivider>
              <NColorPicker
                v-bind="$attrs"
                v-model:value="themeColor"
                :swatches="colorSwatches"
              >
                <template #label="currentColor">
                  <span
                    :style="
                      currentColor && {
                        color: ccAPCA(
                          currentColor,
                          twc.neutral[150],
                          twc.neutral[950],
                          '#fff',
                          isDark,
                        ),
                      }
                    "
                    >{{ currentColor }}</span
                  >
                </template>
              </NColorPicker>
            </div>
            <div>
              <NDivider>导航模式</NDivider>
              <LayoutThumbnail />
            </div>
            <div>
              <NDivider>布局相关</NDivider>
              <div class="flex flex-col gap-y-1.5">
                <CollapseTransitionTrigger>
                  <template #trigger="{ collapsed }">
                    <div class="flex items-center">
                      <div
                        class="flex flex-1 items-center gap-x-1 transition-[color] hover:text-primary"
                      >
                        <span>展开侧边菜单</span>
                        <span
                          class="iconify transition-[rotate] ph--caret-right"
                          :class="{ 'rotate-90': collapsed }"
                        />
                      </div>
                      <NSwitch
                        v-model:value="sidebarMenu.collapsed"
                        :checked-value="false"
                        :unchecked-value="true"
                        :disabled="isMaxSm || preferences.navigationMode !== 'sidebar'"
                        @click.stop
                      />
                    </div>
                  </template>
                  <div class="flex flex-col gap-y-1 pt-1.5 pl-4">
                    <div class="flex items-center justify-between">
                      <span>侧边菜单宽度</span>
                      <NInputNumber
                        v-model:value="sidebarMenu.width"
                        size="small"
                        :min="sidebarMenu.minWidth"
                        :max="sidebarMenu.maxWidth"
                        :step="1"
                        :disabled="isMaxSm || preferences.navigationMode !== 'sidebar'"
                        :format="(value) => value!.toFixed(0)"
                        style="width: 100px"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <span>侧边菜单最大宽度</span>
                      <NInputNumber
                        v-model:value="sidebarMenu.maxWidth"
                        size="small"
                        :min="sidebarMenu.minWidth"
                        :step="1"
                        :disabled="isMaxSm || preferences.navigationMode !== 'sidebar'"
                        style="width: 100px"
                      />
                    </div>
                  </div>
                </CollapseTransitionTrigger>
                <CollapseTransitionTrigger>
                  <template #trigger="{ collapsed }">
                    <div class="flex items-center">
                      <div
                        class="flex flex-1 items-center gap-x-1 transition-[color] hover:text-primary"
                      >
                        <span>显示标签页</span>
                        <span
                          class="iconify transition-[rotate] ph--caret-right"
                          :class="{ 'rotate-90': collapsed }"
                        />
                      </div>
                      <NSwitch
                        v-model:value="preferences.tabs.show"
                        :disabled="isMaxSm"
                        @click.stop
                      />
                    </div>
                  </template>
                  <div class="flex flex-col gap-y-1 pt-1.5 pl-4">
                    <div class="flex items-center justify-between">
                      <span>常显标签关闭按钮</span>
                      <NSwitch
                        v-model:value="preferences.tabs.showTabClose"
                        :disabled="!preferences.tabs.show || isMaxSm"
                      />
                    </div>
                    <div class="flex items-center justify-between">
                      <span>激活标签边框位置</span>
                      <NSelect
                        v-model:value="preferences.tabs.tabBorderPosition"
                        :options="[
                          {
                            label: '顶部',
                            value: 'top',
                          },
                          {
                            label: '底部',
                            value: 'bottom',
                          },
                        ]"
                        :disabled="!preferences.tabs.show || isMaxSm"
                        size="small"
                        style="width: 80px"
                      />
                    </div>
                  </div>
                </CollapseTransitionTrigger>
                <CollapseTransitionTrigger>
                  <template #trigger="{ collapsed }">
                    <div class="flex items-center">
                      <div
                        class="flex flex-1 items-center gap-x-1 transition-[color] hover:text-primary"
                      >
                        <span>显示面包屑</span>
                        <span
                          class="iconify transition-[rotate] ph--caret-right"
                          :class="{ 'rotate-90': collapsed }"
                        />
                      </div>
                      <NSwitch
                        v-model:value="preferences.breadcrumb.show"
                        :disabled="isMaxSm || preferences.navigationMode !== 'sidebar'"
                        @click.stop
                      />
                    </div>
                  </template>

                  <div class="flex flex-col gap-y-1 pt-1.5 pl-4">
                    <div class="flex items-center justify-between">
                      <span>启用切换过渡效果</span>
                      <NSwitch
                        v-model:value="preferences.breadcrumb.enableTransition"
                        :disabled="
                          !preferences.breadcrumb.show ||
                          isMaxSm ||
                          preferences.navigationMode !== 'sidebar'
                        "
                      />
                    </div>
                  </div>
                </CollapseTransitionTrigger>

                <div class="flex items-center justify-between">
                  <span>显示顶部加载条</span>
                  <NSwitch v-model:value="preferences.showTopLoadingBar" />
                </div>
                <div class="flex items-center justify-between">
                  <span>显示Logo</span>
                  <NSwitch v-model:value="preferences.showLogo" />
                </div>
                <div class="flex items-center justify-between">
                  <span>显示导航按钮</span>
                  <NSwitch
                    v-model:value="preferences.showNavigationButton"
                    :disabled="isMaxSm || preferences.navigationMode !== 'sidebar'"
                  />
                </div>
                <div class="flex items-center justify-between">
                  <span>显示底部</span>
                  <NSwitch
                    v-model:value="preferences.showFooter"
                    :disabled="isMaxSm"
                  />
                </div>
                <CollapseTransitionTrigger>
                  <template #trigger="{ collapsed }">
                    <div class="flex items-center">
                      <div
                        class="flex flex-1 items-center gap-x-1 transition-[color] hover:text-primary"
                      >
                        <span>启用导航过渡效果</span>
                        <span
                          class="iconify transition-[rotate] ph--caret-right"
                          :class="{ 'rotate-90': collapsed }"
                        />
                      </div>
                      <NSwitch
                        v-model:value="preferences.navigationTransition.enable"
                        :disabled="isMaxSm"
                        @click.stop
                      />
                    </div>
                  </template>
                  <div class="flex flex-col gap-y-1 pt-1.5 pl-4">
                    <div class="flex items-center justify-between">
                      <span>过渡效果</span>
                      <NSelect
                        v-model:value="preferences.navigationTransition.effect"
                        :options="[
                          {
                            label: '左右滑动',
                            value: 'slider',
                          },
                          {
                            label: '缩放',
                            value: 'scale',
                          },
                          {
                            label: '淡现',
                            value: 'fade',
                          },
                          {
                            label: '左淡现',
                            value: 'fade-left',
                          },
                          {
                            label: '右淡现',
                            value: 'fade-right',
                          },
                        ]"
                        :disabled="!preferences.navigationTransition.enable || isMaxSm"
                        size="small"
                        style="width: 110px"
                      />
                    </div>
                  </div>
                </CollapseTransitionTrigger>
              </div>
            </div>
            <div>
              <NDivider>页面相关</NDivider>
              <div class="flex flex-col gap-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-x-1">
                    <span>显示水印</span>
                    <ButtonAnimation
                      size="small"
                      @click="showWatermarkModal"
                      label="修改"
                      :theme-overrides="{
                        heightSmall: '24px',
                      }"
                    >
                      <span class="iconify size-4 ph--pencil-simple-line" />
                    </ButtonAnimation>
                  </div>
                  <NSwitch v-model:value="preferences.watermark.show" />
                </div>

                <CollapseTransitionTrigger>
                  <template #trigger="{ collapsed }">
                    <div class="flex items-center">
                      <div
                        class="flex flex-1 items-center gap-x-1 transition-[color] hover:text-primary"
                      >
                        <span>显示磨砂效果</span>
                        <span
                          class="iconify transition-[rotate] ph--caret-right"
                          :class="{ 'rotate-90': collapsed }"
                        />
                      </div>
                      <NSwitch
                        v-model:value="preferences.noise.show"
                        @click.stop
                      />
                    </div>
                  </template>
                  <div class="flex flex-col gap-y-1 pt-1.5 pl-4">
                    <div class="flex items-center justify-between">
                      <span class="mr-4 shrink-0">透明度</span>
                      <NSlider
                        v-model:value="preferences.noise.opacity"
                        :min="0"
                        :max="100"
                        :step="1"
                      />
                    </div>
                  </div>
                </CollapseTransitionTrigger>
                <div class="flex items-center justify-between">
                  <span>文字可选中</span>
                  <NSwitch v-model:value="preferences.enableTextSelect" />
                </div>
              </div>
            </div>
            <template #footer>
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center gap-x-1">
                  <span class="iconify size-5 ph--gear-fine" />
                  <span class="leading-4">当前版本</span>
                </div>
                <span class="leading-4">{{ packageJson.version }}</span>
              </div>
            </template>
          </NDrawerContent>
        </NDrawer>
      </NConfigProvider>
    </ButtonAnimationProvider>
  </div>
</template>
