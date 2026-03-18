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

type CodeToHtml = (
  code: string,
  options: { lang: string; themes: { dark: string; light: string } },
) => Promise<string>

const SHIKI_CDN_URL = 'https://esm.sh/shiki@3.22.0'
const shikiThemes = { dark: 'vitesse-dark', light: 'vitesse-light' }

let codeToHtml: CodeToHtml | null = null

const { isMaxMd } = useInjection(mediaQueryInjectionKey)

const APP_NAME = import.meta.env.VITE_APP_NAME

const { dependencies, devDependencies } = packageJson

const directoryStructureHighlight = ref('')
const dependenciesCodeHighlight = ref('')
const devDependenciesCodeHighlight = ref('')

const dir = `
├── 📁 .vscode
│   └── 📄 extensions.json
│   └── 📄 settings.json
├── 📁 public
│   ├── 📁 assets
│   │   └── 🎨 preloader.css
│   └── 📄 favicon.ico
├── 📁 src
│   ├── 📁 api
│   │   ├── 📄 dataForm.ts
│   │   ├── 📄 dataTable.ts
│   │   ├── 📄 index.ts
│   │   └── 📄 user.ts
│   ├── 📁 assets
│   │   ├── 🎨 main.css
│   │   ├── 🖼️ noise.png
│   │   ├── 🖼️ texture.png
│   │   └── 🖼️ topography.svg
│   ├── 📁 components
│   │   ├── 📁 button-animation
│   │   │   ├── 📄 ButtonAnimation.test.ts
│   │   │   ├── 📄 ButtonAnimation.vue
│   │   │   ├── 📄 ButtonAnimationProvider.vue
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 injection.ts
│   │   │   └── 📄 interface.ts
│   │   ├── 📁 collapse-transition
│   │   │   ├── 📄 CollapseTransition.test.ts
│   │   │   ├── 📄 CollapseTransition.vue
│   │   │   ├── 📄 CollapseTransitionTrigger.vue
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 interface.ts
│   │   ├── 📁 empty-placeholder
│   │   │   ├── 📄 EmptyPlaceholder.test.ts
│   │   │   ├── 📄 EmptyPlaceholder.vue
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 interface.ts
│   │   ├── 📁 hint-help
│   │   │   ├── 📄 HintHelp.test.ts
│   │   │   ├── 📄 HintHelp.vue
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 interface.ts
│   │   ├── 📁 scroll-container
│   │   │   ├── 📄 ScrollContainer.test.ts
│   │   │   ├── 📄 ScrollContainer.vue
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 interface.ts
│   │   ├── 📄 AppLogo.vue
│   │   ├── 📄 Noise.vue
│   │   ├── 📄 UserAvatar.vue
│   │   ├── 📄 UserDropdown.vue
│   │   └── 📄 index.ts
│   ├── 📁 composables
│   │   ├── 📄 index.ts
│   │   ├── 📄 useComponentModifier.ts
│   │   ├── 📄 useComponentThemeOverrides.ts
│   │   ├── 📄 useDiscreteApi.ts
│   │   ├── 📄 useInjection.ts
│   │   ├── 📄 useResettable.ts
│   │   └── 📄 useTheme.ts
│   ├── 📁 event-bus
│   │   ├── 📄 index.ts
│   │   ├── 📄 requestEvent.ts
│   │   └── 📄 routerEvent.ts
│   ├── 📁 injection
│   │   ├── 📄 index.ts
│   │   └── 📄 interface.ts
│   ├── 📁 layout
│   │   ├── 📁 aside
│   │   │   ├── 📄 SidebarMenu.vue
│   │   │   ├── 📄 SidebarUserPanel.vue
│   │   │   └── 📄 index.vue
│   │   ├── 📁 footer
│   │   │   └── 📄 index.vue
│   │   ├── 📁 header
│   │   │   ├── 📁 action
│   │   │   │   ├── 📁 component
│   │   │   │   │   ├── 📄 LayoutThumbnail.vue
│   │   │   │   │   └── 📄 WatermarkModal.vue
│   │   │   │   ├── 📄 AvatarDropdown.vue
│   │   │   │   ├── 📄 FullScreen.vue
│   │   │   │   ├── 📄 PreferencesDrawer.vue
│   │   │   │   ├── 📄 SignOut.vue
│   │   │   │   ├── 📄 ThemeModePopover.vue
│   │   │   │   └── 📄 index.vue
│   │   │   ├── 📁 logo
│   │   │   │   └── 📄 index.vue
│   │   │   ├── 📁 navigation
│   │   │   │   ├── 📄 Breadcrumb.vue
│   │   │   │   ├── 📄 HorizontalMenu.vue
│   │   │   │   ├── 📄 NavigationButton.vue
│   │   │   │   └── 📄 index.vue
│   │   │   └── 📄 index.vue
│   │   ├── 📁 main
│   │   │   └── 📄 index.vue
│   │   ├── 📁 mobile
│   │   │   ├── 📄 MobileHeader.vue
│   │   │   ├── 📄 MobileLeftAside.vue
│   │   │   └── 📄 MobileRightAside.vue
│   │   ├── 📁 tabs
│   │   │   └── 📄 index.vue
│   │   └── 📄 index.vue
│   ├── 📁 router
│   │   ├── 📄 guard.ts
│   │   ├── 📄 helper.ts
│   │   ├── 📄 index.ts
│   │   └── 📄 interface.ts
│   ├── 📁 stores
│   │   ├── 📄 index.ts
│   │   ├── 📄 preferences.ts
│   │   ├── 📄 tabs.ts
│   │   └── 📄 user.ts
│   ├── 📁 theme
│   │   ├── 📄 common.ts
│   │   ├── 📄 dark.ts
│   │   └── 📄 light.ts
│   ├── 📁 types
│   │   ├── 📄 api.d.ts
│   │   ├── 📄 env.d.ts
│   │   ├── 📄 vue-router.d.ts
│   │   └── 📄 window.d.ts
│   ├── 📁 utils
│   │   ├── 📄 checkVersion.ts
│   │   ├── 📄 colors.ts
│   │   └── 📄 request.ts
│   ├── 📁 views
│   │   ├── 📁 about
│   │   │   └── 📄 index.vue
│   │   ├── 📁 dashboard
│   │   │   └── 📄 index.vue
│   │   ├── 📁 data-show
│   │   │   ├── 📁 data-form
│   │   │   │   └── 📄 index.vue
│   │   │   └── 📁 data-table
│   │   │       ├── 📄 ActionModal.vue
│   │   │       └── 📄 index.vue
│   │   ├── 📁 drag-drop
│   │   │   └── 📄 index.vue
│   │   ├── 📁 dynamic-route
│   │   │   └── 📄 index.vue
│   │   ├── 📁 error-page
│   │   │   ├── 📄 404.vue
│   │   │   └── 📄 index.vue
│   │   ├── 📁 feedback
│   │   │   ├── 📄 discreteApi.ts
│   │   │   └── 📄 index.vue
│   │   ├── 📁 multi-level-menu
│   │   │   └── 📄 index.vue
│   │   └── 📁 sign-in
│   │       ├── 📁 component
│   │       │   ├── 📄 Illustration1.vue
│   │       │   ├── 📄 Illustration2.vue
│   │       │   ├── 📄 Illustration3.vue
│   │       │   └── 📄 ThemeColorPopover.vue
│   │       └── 📄 index.vue
│   ├── 📄 App.vue
│   └── 📄 main.ts
├── ⚙️ .editorconfig
├── ⚙️ .env
├── ⚙️ .gitattributes
├── ⚙️ .gitignore
├── ⚙️ .npmrc
├── ⚙️ .prettierrc.json
├── 📝 README.en_US.md
├── 📝 README.md
├── 📄 eslint.config.ts
├── 🌐 index.html
├── ⚙️ package.json
├── ⚙️ tsconfig.app.json
├── ⚙️ tsconfig.json
├── ⚙️ tsconfig.node.json
├── ⚙️ tsconfig.vitest.json
├── 📄 vite.config.ts
└── 📄 vitest.config.ts`

function highlightCode(code: string, lang: string) {
  return (
    codeToHtml?.(code, { lang, themes: shikiThemes }).catch(() => code) ?? Promise.resolve(code)
  )
}

onMounted(async () => {
  codeToHtml ??= ((await import(/* @vite-ignore */ SHIKI_CDN_URL)) as { codeToHtml: CodeToHtml })
    .codeToHtml

  const dependenciesCode = JSON.stringify(dependencies, null, 2)
  const devDependenciesCode = JSON.stringify(devDependencies, null, 2)

  ;[
    directoryStructureHighlight.value,
    dependenciesCodeHighlight.value,
    devDependenciesCodeHighlight.value,
  ] = await Promise.all([
    highlightCode(dir, 'markdown'),
    highlightCode(dependenciesCode, 'json'),
    highlightCode(devDependenciesCode, 'json'),
  ])
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
          rel="noopener noreferrer"
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
          class="ml-1!"
          rel="noopener noreferrer"
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
          rel="noopener noreferrer"
        >
          <NButton
            strong
            secondary
            color="#9499ff"
            size="small"
            style="margin-left: 4px"
          >
            Vite8
          </NButton>
        </a>
        <a
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noopener noreferrer"
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
<style>
@layer shiki {
  html.dark .shiki,
  html.dark .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--n-color) !important;

    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
    transition: background-color var(--default-transition-duration)
      var(--default-transition-timing-function);
  }
  pre.shiki {
    transition: background-color var(--default-transition-duration)
      var(--default-transition-timing-function);
  }
}
</style>
