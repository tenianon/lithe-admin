<script setup lang="ts">
import { NCard, NSplit, NButton, NScrollbar, NTag } from 'naive-ui'
import { onMounted, ref } from 'vue'

import packageJson from '@/../package.json'
import { ScrollContainer } from '@/components'
import { useInjection } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'

defineOptions({
  name: 'About',
})

let codeToHtml: any

const { isMaxMd } = useInjection(mediaQueryInjectionKey)

const APP_NAME = import.meta.env.VITE_APP_NAME

const { dependencies, devDependencies } = packageJson

const directoryStructureHighlight = ref('')
const dependenciesCodeHighlight = ref('')
const devDependenciesCodeHighlight = ref('')

const dir = ` 📂 lithe-admin
├── 📄 README.en_US.md
├── 📄 README.md
├── 📄 eslint.config.ts
├── 📄 index.html
├── 📄 package.json
├── 📄 pnpm-lock.yaml
└── 📂 public/
│  └── 📂 assets/
│    ├── 📄 preloader.css
│  ├── 📄 favicon.ico
└── 📂 src/
│  ├── 📄 App.vue
│  └── 📂 assets/
│    ├── 📄 base.css
│    ├── 📄 main.css
│    ├── 📄 noise.png
│    ├── 📄 texture.png
│    ├── 📄 topography.svg
│  └── 📂 components/
│    ├── 📄 AppLogo.vue
│    ├── 📄 Noise.vue
│    ├── 📄 UserAvatar.vue
│    ├── 📄 UserDropdown.vue
│    └── 📂 button-animation/
│      ├── 📄 ButtonAnimation.test.ts
│      ├── 📄 ButtonAnimation.vue
│      ├── 📄 ButtonAnimationProvider.vue
│      ├── 📄 index.ts
│      ├── 📄 injection.ts
│      ├── 📄 interface.ts
│    └── 📂 collapse-transition/
│      ├── 📄 CollapseTransition.test.ts
│      ├── 📄 CollapseTransition.vue
│    └── 📂 empty-placeholder/
│      ├── 📄 EmptyPlaceholder.test.ts
│      ├── 📄 EmptyPlaceholder.vue
│    └── 📂 hint-help/
│      ├── 📄 HintHelp.test.ts
│      ├── 📄 HintHelp.vue
│    ├── 📄 index.ts
│    └── 📂 scroll-container/
│      ├── 📄 ScrollContainer.test.ts
│      ├── 📄 ScrollContainer.vue
│  └── 📂 composables/
│    ├── 📄 index.ts
│    ├── 📄 useComponentModifier.ts
│    ├── 📄 useComponentThemeOverrides.ts
│    ├── 📄 useDiscreteApi.ts
│    ├── 📄 useInjection.ts
│    ├── 📄 useResettable.ts
│    ├── 📄 useTheme.ts
│  └── 📂 injection/
│    ├── 📄 index.ts
│    ├── 📄 interface.ts
│  └── 📂 layout/
│    └── 📂 aside/
│      ├── 📄 SidebarMenu.vue
│      ├── 📄 SidebarUserPanel.vue
│      ├── 📄 index.vue
│    └── 📂 footer/
│      ├── 📄 index.vue
│    └── 📂 header/
│      └── 📂 action/
│        ├── 📄 AvatarDropdown.vue
│        ├── 📄 FullScreen.vue
│        ├── 📄 PreferencesDrawer.vue
│        ├── 📄 SignOut.vue
│        ├── 📄 ThemeModePopover.vue
│        └── 📂 component/
│          ├── 📄 LayoutThumbnail.vue
│          ├── 📄 NoiseModal.vue
│          ├── 📄 WatermarkModal.vue
│        ├── 📄 index.vue
│      ├── 📄 index.vue
│      └── 📂 logo/
│        ├── 📄 index.vue
│      └── 📂 navigation/
│        ├── 📄 Breadcrumb.vue
│        ├── 📄 HorizontalMenu.vue
│        ├── 📄 NavigationButton.vue
│        ├── 📄 index.vue
│    ├── 📄 index.vue
│    └── 📂 main/
│      ├── 📄 index.vue
│    └── 📂 mobile/
│      ├── 📄 MobileHeader.vue
│      ├── 📄 MobileLeftAside.vue
│      ├── 📄 MobileRightAside.vue
│    └── 📂 tabs/
│      ├── 📄 index.vue
│  ├── 📄 main.ts
│  └── 📂 router/
│    ├── 📄 guard.ts
│    ├── 📄 helper.ts
│    ├── 📄 index.ts
│    ├── 📄 record.ts
│  └── 📂 stores/
│    ├── 📄 index.ts
│    ├── 📄 preferences.ts
│    ├── 📄 system.ts
│    ├── 📄 tabs.ts
│    ├── 📄 user.ts
│  └── 📂 theme/
│    ├── 📄 common.ts
│    ├── 📄 dark.ts
│    ├── 📄 light.ts
│  └── 📂 types/
│    ├── 📄 env.d.ts
│    ├── 📄 vue-router.d.ts
│    ├── 📄 window.d.ts
│  └── 📂 utils/
│    ├── 📄 chromaHelper.ts
│    ├── 📄 tailwindColor.test.ts
│    ├── 📄 tailwindColor.ts
│  └── 📂 views/
│    └── 📂 about/
│      ├── 📄 index.vue
│    └── 📂 dashboard/
│      ├── 📄 index.vue
│    └── 📂 data-show/
│      └── 📂 data-form/
│        ├── 📄 index.vue
│      └── 📂 data-table/
│        ├── 📄 ActionModal.vue
│        ├── 📄 index.vue
│    └── 📂 drag-drop/
│      ├── 📄 index.vue
│    └── 📂 dynamic-route/
│      ├── 📄 index.vue
│    └── 📂 error-page/
│      ├── 📄 404.vue
│      ├── 📄 index.vue
│    └── 📂 feedback/
│      ├── 📄 discreteApi.ts
│      ├── 📄 index.vue
│    └── 📂 multi-level-menu/
│      ├── 📄 index.vue
│    └── 📂 sign-in/
│      └── 📂 component/
│        ├── 📄 Illustration1.vue
│        ├── 📄 Illustration2.vue
│        ├── 📄 Illustration3.vue
│        ├── 📄 ThemeColorPopover.vue
│      ├── 📄 index.vue
├── 📄 tailwind.config.ts
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
├── 📄 tsconfig.vitest.json
├── 📄 vite.config.ts
└── 📄 vitest.config.ts`

onMounted(async () => {
  if (!codeToHtml) {
    // @ts-ignore
    const shiki = await import('https://cdn.jsdelivr.net/npm/shiki@3.7.0/+esm')
    codeToHtml = shiki.codeToHtml
  }

  codeToHtml(dir, {
    lang: 'markdown',
    themes: {
      light: 'min-light',
      dark: 'dark-plus',
    },
  })
    .then((result: string) => (directoryStructureHighlight.value = result))
    .catch(() => (directoryStructureHighlight.value = dir))

  codeToHtml(JSON.stringify(dependencies, null, 2), {
    lang: 'json',
    themes: {
      light: 'min-light',
      dark: 'dark-plus',
    },
  })
    .then((result: string) => (dependenciesCodeHighlight.value = result))
    .catch(() => (dependenciesCodeHighlight.value = JSON.stringify(dependencies, null, 2)))

  codeToHtml(JSON.stringify(devDependencies, null, 2), {
    lang: 'json',
    themes: {
      light: 'min-light',
      dark: 'dark-plus',
    },
  })
    .then((result: string) => (devDependenciesCodeHighlight.value = result))
    .catch(() => (devDependenciesCodeHighlight.value = JSON.stringify(devDependencies, null, 2)))
})
</script>
<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <NCard
      :title="`关于 ${APP_NAME}`"
      :size="isMaxMd ? 'small' : undefined"
    >
      <p class="text-base">
        {{ APP_NAME }} 是一个轻盈而优雅的后台管理模板，主要技术栈由
        <a
          href="https://vuejs.org/"
          target="_blank"
        >
          <NButton
            strong
            secondary
            size="small"
            color="#42b883"
          >
            Vue3
          </NButton>
        </a>
        <a
          href="https://www.naiveui.com/"
          target="_blank"
        >
          <NButton
            strong
            secondary
            color="#75B93F"
            size="small"
            style="margin-left: 4px"
          >
            Naive UI
          </NButton>
        </a>
        <a
          href="https://vitejs.dev/"
          target="_blank"
        >
          <NButton
            strong
            secondary
            color="#9499ff"
            size="small"
            style="margin-left: 4px"
          >
            Vite7
          </NButton>
        </a>
        <a
          href="https://tailwindcss.com/"
          target="_blank"
        >
          <NButton
            strong
            secondary
            color="#00bcff"
            size="small"
            class="ml-1!"
          >
            TailwindCSS4
          </NButton>
        </a>
        和
        <NButton
          strong
          secondary
          size="small"
        >
          TypeScript
        </NButton>
        构建。
      </p>
    </NCard>
    <div class="flex gap-x-2 max-lg:flex-col">
      <NCard
        title="目录结构"
        :size="isMaxMd ? 'small' : undefined"
      >
        <NScrollbar container-style="max-height: 1100px;">
          <div v-html="directoryStructureHighlight"></div>
        </NScrollbar>
      </NCard>
      <NCard
        title="依赖信息"
        :size="isMaxMd ? 'small' : undefined"
      >
        <NSplit
          direction="vertical"
          pane1-class="pb-4"
          pane2-class="pt-4"
          default-size="2"
        >
          <template #1>
            <NTag
              class="mb-4"
              :bordered="false"
              type="info"
              size="small"
              >dependencies</NTag
            >
            <NScrollbar>
              <div v-html="dependenciesCodeHighlight"></div>
            </NScrollbar>
          </template>

          <template #2>
            <NTag
              class="mb-4"
              :bordered="false"
              type="info"
              size="small"
              >devDependencies</NTag
            >
            <NScrollbar>
              <div v-html="devDependenciesCodeHighlight"></div>
            </NScrollbar>
          </template>
          <template #resize-trigger>
            <div
              class="h-px w-full cursor-col-resize bg-neutral-200 transition-[background-color] dark:bg-neutral-700"
            ></div>
          </template>
        </NSplit>
      </NCard>
    </div>
  </ScrollContainer>
</template>
