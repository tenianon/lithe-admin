<script setup lang="ts">
import {
  NColorPicker,
  NDivider,
  NDrawer,
  NDrawerContent,
  NSwitch,
  useModal,
  NScrollbar,
} from 'naive-ui'
import { h, ref } from 'vue'

import { ButtonAnimation, ButtonAnimationProvider } from '@/components'
import { useComponentThemeOverrides, useInjection } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'
import { usePreferencesStore, useSystemStore, toRefsPreferencesStore } from '@/stores'
import { ccAPCA } from '@/utils/chromaHelper'
import twColors from '@/utils/tailwindColor'
import twc from '@/utils/tailwindColor'

import LayoutThumbnail from './component/LayoutThumbnail.vue'
import NoiseModal from './component/NoiseModal.vue'
import WatermarkModal from './component/WatermarkModal.vue'

const { isMaxSm } = useInjection(mediaQueryInjectionKey)

const { reset } = usePreferencesStore()

const {
  preferences,
  themeColor,
  enableNavigationTransition,
  enableTextSelect,
  navigationMode,
  showTopLoadingBar,
  showLogo,
  showNavigationButton,
  showBreadcrumb,
  showTabs,
  showTabClose,
  showFooter,
  showWatermark,
  showNoise,
  sidebarMenu,
} = toRefsPreferencesStore()

const systemStore = useSystemStore()

const modal = useModal()

const { scrollbarInModal } = useComponentThemeOverrides()

const showPreferencesDrawer = ref(false)

const colorSwatches = [
  twColors.red[500],
  twColors.orange[500],
  twColors.amber[500],
  twColors.yellow[500],
  twColors.lime[500],
  twColors.green[500],
  twColors.emerald[500],
  twColors.teal[500],
  twColors.cyan[500],
  twColors.sky[500],
  twColors.blue[500],
  twColors.indigo[500],
  twColors.violet[500],
  twColors.purple[500],
  twColors.fuchsia[500],
  twColors.pink[500],
]

const showWatermarkModal = () => {
  modal.create({
    autoFocus: false,
    title: '修改水印信息',
    preset: 'dialog',
    content: () =>
      h(
        NScrollbar,
        {
          themeOverrides: scrollbarInModal.value,
          style: {
            maxHeight: '400px',
          },
          contentClass: 'pr-3 py-6',
        },
        {
          default: () => h(WatermarkModal),
        },
      ),
    closable: true,
    draggable: true,
    showIcon: false,
    zIndex: 99999,
  })
}

const showNoiseModal = () => {
  modal.create({
    autoFocus: false,
    title: '修改磨砂细腻度',
    preset: 'dialog',
    content: () => h(NoiseModal),
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
      title="侧边栏"
    >
      <span class="iconify rotate-180 ph--sidebar-simple-duotone" />
    </ButtonAnimation>
    <ButtonAnimationProvider>
      <NDrawer
        v-model:show="showPreferencesDrawer"
        :auto-focus="false"
        :width="320"
        :theme-overrides="{
          footerPadding: '14px 16px',
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
              :value="themeColor"
              :swatches="colorSwatches"
              @update-value="(color) => (themeColor = color)"
            >
              <template #label="currentColor">
                <span
                  :style="
                    currentColor && {
                      color: ccAPCA(currentColor, twc.neutral[150], twc.neutral[950], '#fff'),
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
              <div class="flex items-center justify-between">
                <span>展开侧边菜单</span>
                <NSwitch
                  :value="sidebarMenu.collapsed"
                  :checked-value="false"
                  :unchecked-value="true"
                  :disabled="isMaxSm || navigationMode !== 'sidebar'"
                  @update-value="(value) => (preferences.sidebarMenu.collapsed = value)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>显示顶部加载条</span>
                <NSwitch
                  :value="showTopLoadingBar"
                  @update-value="(value) => (preferences.showTopLoadingBar = value)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>显示Logo</span>
                <NSwitch
                  :value="showLogo"
                  @update-value="(value) => (preferences.showLogo = value)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>显示导航按钮</span>
                <NSwitch
                  :value="showNavigationButton"
                  :disabled="isMaxSm || navigationMode !== 'sidebar'"
                  @update-value="(value) => (preferences.showNavigationButton = value)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>显示面包屑</span>
                <NSwitch
                  :value="showBreadcrumb"
                  :disabled="isMaxSm || navigationMode !== 'sidebar'"
                  @update-value="(value) => (preferences.showBreadcrumb = value)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>显示标签页</span>
                <NSwitch
                  :value="showTabs"
                  :disabled="isMaxSm"
                  @update-value="(value) => (preferences.showTabs = value)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>常显标签关闭按钮</span>
                <NSwitch
                  :value="showTabClose"
                  :disabled="isMaxSm"
                  @update-value="(value) => (preferences.showTabClose = value)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>显示底部</span>
                <NSwitch
                  :value="showFooter"
                  :disabled="isMaxSm"
                  @update-value="(value) => (preferences.showFooter = value)"
                />
              </div>
            </div>
          </div>
          <div>
            <NDivider>页面相关</NDivider>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-x-1">
                <span>显示水印</span>
                <ButtonAnimation
                  size="small"
                  @click="showWatermarkModal"
                  label="修改"
                >
                  <span class="iconify size-4 ph--pencil-simple-line" />
                </ButtonAnimation>
              </div>
              <NSwitch
                :value="showWatermark"
                @update-value="(value) => (preferences.showWatermark = value)"
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-x-1">
                <span>显示磨砂效果</span>
                <ButtonAnimation
                  size="small"
                  :duration="3000"
                  @click="showNoiseModal"
                  label="修改"
                >
                  <span class="iconify size-4 ph--pencil-simple-line" />
                </ButtonAnimation>
              </div>
              <NSwitch
                :value="showNoise"
                @update-value="(value) => (preferences.showNoise = value)"
              />
            </div>
            <div class="flex flex-col gap-y-1.5">
              <div class="flex items-center justify-between">
                <span>启用导航过渡效果</span>
                <NSwitch
                  :value="enableNavigationTransition"
                  :disabled="isMaxSm"
                  @update-value="(value) => (preferences.enableNavigationTransition = value)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>文字可选中</span>
                <NSwitch
                  :value="enableTextSelect"
                  @update-value="(value) => (preferences.enableTextSelect = value)"
                />
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex w-full items-center justify-between">
              <div class="flex items-center gap-x-1">
                <span class="iconify size-5 ph--gear-fine" />
                <span class="leading-4">当前版本</span>
              </div>
              <span class="leading-4">{{ systemStore.version }}</span>
            </div>
          </template>
        </NDrawerContent>
      </NDrawer>
    </ButtonAnimationProvider>
  </div>
</template>
