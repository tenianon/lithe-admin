<script setup lang="ts">
// @ts-ignore
import { codeToHtml } from 'https://cdn.jsdelivr.net/npm/shiki@3.7.0/+esm'
import { NCard, NSplit, NButton, NScrollbar, NTag } from 'naive-ui'
import { ref, watch } from 'vue'

import packageJson from '@/../package.json'
import { usePersonalization } from '@/composable/usePersonalization'

defineOptions({
  name: 'About',
})

const APP_NAME = import.meta.env.VITE_APP_NAME

const { isDark } = usePersonalization()

const { dependencies, devDependencies } = packageJson

const directoryStructureHighlight = ref('')
const dependenciesCodeHighlight = ref('')
const devDependenciesCodeHighlight = ref('')

const dir = `📂 lithe-admin
├── 📄 .editorconfig
├── 📄 .env.development
├── 📄 .env.production
├── 📄 .gitattributes
├── 📄 .gitignore
├── 📄 .prettierrc.json
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
│    ├── 📄 Avatar.vue
│    ├── 📄 ButtonAnimation.vue
│    ├── 📄 HintHelp.vue
│    ├── 📄 Noise.vue
│    ├── 📄 EmptyPlaceholder.vue
│    └── 📂 __tests__/
│      ├── 📄 comp.test.ts
│    ├── 📄 index.ts
│  └── 📂 composable/
│    └── 📂 comp/
│      ├── 📄 useComponentModifier.ts
│      ├── 📄 useComponentThemeOverrides.ts
│      ├── 📄 useDataTable.ts
│    ├── 📄 useDiscreteApi.ts
│    ├── 📄 usePersonalization.ts
│    ├── 📄 useResettable.ts
│    ├── 📄 useTheme.ts
│  └── 📂 injection/
│    ├── 📄 index.ts
│    ├── 📄 interface.ts
│  └── 📂 layout/
│    └── 📂 aside/
│      └── 📂 component/
│        ├── 📄 Menu.vue
│        ├── 📄 UserCard.vue
│      ├── 📄 index.vue
│    └── 📂 component/
│      ├── 📄 Tabs.vue
│    └── 📂 footer/
│      ├── 📄 index.vue
│    └── 📂 header/
│      └── 📂 Actions/
│        └── 📂 component/
│          ├── 📄 ConfigureDrawer.vue
│          ├── 📄 FullScreen.vue
│          ├── 📄 NoiseModal.vue
│          ├── 📄 SignOut.vue
│          ├── 📄 ThemeDropdown.vue
│          ├── 📄 WatermarkModal.vue
│        ├── 📄 index.vue
│      ├── 📄 Breadcrumb.vue
│      ├── 📄 Logo.vue
│      ├── 📄 Navigation.vue
│      ├── 📄 index.vue
│    ├── 📄 index.vue
│    └── 📂 main/
│      ├── 📄 index.vue
│  ├── 📄 main.ts
│  └── 📂 router/
│    ├── 📄 guard.ts
│    ├── 📄 helper.ts
│    ├── 📄 index.ts
│    ├── 📄 record.ts
│  └── 📂 stores/
│    ├── 📄 configure.ts
│    ├── 📄 tabs.ts
│    ├── 📄 user.ts
│  └── 📂 theme/
│    ├── 📄 common.ts
│    ├── 📄 dark.ts
│    ├── 📄 light.ts
│  └── 📂 typings/
│    ├── 📄 env.d.ts
│    ├── 📄 vue-router.d.ts
│    ├── 📄 window.d.ts
│  └── 📂 utils/
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
│        ├── 📄 ModalData.vue
│        ├── 📄 index.vue
│    └── 📂 draggable/
│      ├── 📄 index.vue
│    └── 📂 feedback/
│      ├── 📄 discreteApi.ts
│      ├── 📄 index.vue
│    └── 📂 multi-level-menu/
│      ├── 📄 index.vue
│    └── 📂 not-found/
│      ├── 📄 404.vue
│      ├── 📄 index.vue
│    └── 📂 sign-in/
│      └── 📂 component/
│        ├── 📄 Illustration1.vue
│        ├── 📄 Illustration2.vue
│        ├── 📄 Illustration3.vue
│        ├── 📄 Illustration4.vue
│        ├── 📄 ThemeColorPopover.vue
│      ├── 📄 index.vue
├── 📄 tailwind.config.ts
├── 📄 tsconfig.app.json
├── 📄 tsconfig.json
├── 📄 tsconfig.node.json
├── 📄 tsconfig.vitest.json
├── 📄 vite.config.ts
└── 📄 vitest.config.ts`

watch(
  isDark,
  async (isDark) => {
    directoryStructureHighlight.value = await codeToHtml(dir, {
      lang: 'markdown',
      theme: isDark ? 'dark-plus' : 'min-light',
    })

    dependenciesCodeHighlight.value = await codeToHtml(JSON.stringify(dependencies, null, 2), {
      lang: 'json',
      theme: isDark ? 'dark-plus' : 'min-light',
    })

    devDependenciesCodeHighlight.value = await codeToHtml(
      JSON.stringify(devDependencies, null, 2),
      {
        lang: 'json',
        theme: isDark ? 'dark-plus' : 'min-light',
      },
    )
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <div class="flex flex-col gap-y-4 p-4">
    <NCard :title="`关于 ${APP_NAME}`">
      <p class="text-base">
        {{ APP_NAME }} 是一个基于
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
        构建的极简而优雅的后台管理模板，主题配色基于 TailwindCSS 的色彩体系设计。
      </p>
    </NCard>
    <div class="flex gap-x-2">
      <NCard title="目录结构">
        <NScrollbar container-style="max-height: 1100px;">
          <div v-html="directoryStructureHighlight"></div>
        </NScrollbar>
      </NCard>
      <NCard title="依赖信息">
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
            <div class="h-px w-full cursor-col-resize bg-neutral-200 dark:bg-neutral-700"></div>
          </template>
        </NSplit>
      </NCard>
    </div>
  </div>
</template>
