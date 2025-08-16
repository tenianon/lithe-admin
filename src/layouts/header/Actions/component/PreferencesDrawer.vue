<script setup lang="ts">
import { throttle } from 'lodash-es'
import {
  NColorPicker,
  NDivider,
  NDrawer,
  NDrawerContent,
  NSwitch,
  useModal,
} from 'naive-ui'
import { h, ref } from 'vue'

import { ButtonAnimation } from '@/components'
import { usePersonalization } from '@/composable/usePersonalization'
import { usePreferencesStore } from '@/stores/preferences'
import { useSystemStore } from '@/stores/system'
import twColors from '@/utils/tailwindColor'

import NoiseModal from './NoiseModal.vue'

const preferencesStore = usePreferencesStore()
const systemStore = useSystemStore()

const { color, setColor } = usePersonalization()

const { modify, reset } = preferencesStore

const modal = useModal()

const showDrawer = ref(false)

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

const modifyColor = throttle((value: string) => {
  setColor(value)
}, 1000)

const showNoiseModal = () => {
  modal.create({
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
      @click="showDrawer = true"
      title="侧边栏"
    >
      <span class="iconify size-5 rotate-180 ph--sidebar-simple-duotone" />
    </ButtonAnimation>
    <NDrawer
      v-model:show="showDrawer"
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
              <span class="iconify size-5 ph--arrow-clockwise" />
            </ButtonAnimation>
          </div>
        </template>
        <div>
          <NDivider>主题颜色</NDivider>
          <NColorPicker
            v-bind="$attrs"
            :default-value="color"
            :swatches="colorSwatches"
            @update-value="(value) => modifyColor(value)"
          />
        </div>
        <div>
          <NDivider>布局相关</NDivider>
          <div class="flex flex-col gap-y-1.5">
            <div class="flex items-center justify-between">
              <span>展开侧边菜单</span>
              <NSwitch
                :value="preferencesStore.preferences.menu.collapsed"
                :checked-value="false"
                :unchecked-value="true"
                @update-value="
                  (value) =>
                    modify({
                      menu: {
                        collapsed: value,
                      },
                    })
                "
              />
            </div>
            <div class="flex items-center justify-between">
              <span>显示顶部加载条</span>
              <NSwitch
                :value="preferencesStore.preferences.showTopLoadingBar"
                @update-value="
                  (value) =>
                    modify({
                      showTopLoadingBar: value,
                    })
                "
              />
            </div>
            <div class="flex items-center justify-between">
              <span>显示Logo</span>
              <NSwitch
                :value="preferencesStore.preferences.showLogo"
                @update-value="
                  (value) =>
                    modify({
                      showLogo: value,
                    })
                "
              />
            </div>
            <div class="flex items-center justify-between">
              <span>显示导航按钮</span>
              <NSwitch
                :value="preferencesStore.preferences.showNavigation"
                @update-value="
                  (value) =>
                    modify({
                      showNavigation: value,
                    })
                "
              />
            </div>
            <div class="flex items-center justify-between">
              <span>显示面包屑</span>
              <NSwitch
                :value="preferencesStore.preferences.showBreadcrumb"
                @update-value="
                  (value) =>
                    modify({
                      showBreadcrumb: value,
                    })
                "
              />
            </div>
            <div class="flex items-center justify-between">
              <span>显示标签页</span>
              <NSwitch
                :value="preferencesStore.preferences.showTabs"
                @update-value="
                  (value) =>
                    modify({
                      showTabs: value,
                    })
                "
              />
            </div>
            <div class="flex items-center justify-between">
              <span>常显标签关闭按钮</span>
              <NSwitch
                :value="preferencesStore.preferences.showTabClose"
                @update-value="
                  (value) =>
                    modify({
                      showTabClose: value,
                    })
                "
              />
            </div>
            <div class="flex items-center justify-between">
              <span>显示底部</span>
              <NSwitch
                :value="preferencesStore.preferences.showFooter"
                @update-value="
                  (value) =>
                    modify({
                      showFooter: value,
                    })
                "
              />
            </div>
          </div>
        </div>
        <div>
          <NDivider>页面相关</NDivider>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-x-1">
              <span>显示磨砂效果</span>
              <ButtonAnimation
                size="small"
                @click="showNoiseModal"
                label="修改"
              >
                <span class="iconify size-4 ph--pencil-simple-line" />
              </ButtonAnimation>
            </div>
            <NSwitch
              :value="preferencesStore.preferences.showNoise"
              @update-value="
                (value) =>
                  modify({
                    showNoise: value,
                  })
              "
            />
          </div>
          <div class="flex flex-col gap-y-1.5">
            <div class="flex items-center justify-between">
              <span>启用导航过渡效果</span>
              <NSwitch
                :value="preferencesStore.preferences.enableNavigationTransition"
                @update-value="
                  (value) =>
                    modify({
                      enableNavigationTransition: value,
                    })
                "
              />
            </div>
            <div class="flex items-center justify-between">
              <span>文字可选中</span>
              <NSwitch
                :value="preferencesStore.preferences.enableTextSelect"
                @update-value="
                  (value) =>
                    modify({
                      enableTextSelect: value,
                    })
                "
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
            <span class="leading-4">{{ systemStore.systemInfo.version }}</span>
          </div>
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>
