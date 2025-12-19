<script setup lang="ts">
import { isEmpty } from 'es-toolkit/compat'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'

import { useInjection } from '@/composables'
import { mediaQueryInjectionKey, layoutInjectionKey } from '@/injection'
import router from '@/router'
import { toRefsPreferencesStore, useTabsStore, toRefsTabsStore } from '@/stores'

import type { Tab } from '@/stores'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

defineOptions({
  name: 'MainLayout',
})

const { isMaxSm } = useInjection(mediaQueryInjectionKey)

const { shouldRefreshRoute, layoutSlideDirection, setLayoutSlideDirection } =
  useInjection(layoutInjectionKey)

const { navigationTransition } = toRefsPreferencesStore()

const { createTab, setTabActivePath } = useTabsStore()

const { tabs, tabActivePath } = toRefsTabsStore()

const isMounted = ref(false)

const navigationTransitionName = ref('scale')

const layoutRouteRedirect = router.getRoutes().find((item) => item.name === 'layout')?.redirect

const keepAliveTabs = computed(() => {
  return tabs.value.filter((tab) => tab.keepAlive).map((tab) => tab.componentName ?? '')
})

let oldTabs: Tab[] = []

function createTabFromRoute(route: RouteLocationNormalizedLoaded) {
  const {
    icon = 'iconify ph--browser',
    title = '未命名标签',
    renderTabTitle,
    componentName,
    pinned,
  } = route.meta

  const { fullPath, name, params } = route

  const renderTitle = renderTabTitle ? renderTabTitle(params) : title

  createTab({
    path: fullPath,
    icon,
    title: renderTitle,
    name,
    componentName,
    pinned,
  })
}

watch(
  [() => tabs.value, () => tabActivePath.value],
  ([newTabs, newTabActivePath], [, oldTabActivePath]) => {
    if (
      newTabActivePath &&
      newTabActivePath !== oldTabActivePath &&
      newTabActivePath !== router.currentRoute.value.fullPath
    ) {
      if (
        layoutRouteRedirect &&
        layoutRouteRedirect === router.currentRoute.value.path &&
        newTabActivePath === '/'
      ) {
        router.go(0)
      } else {
        router.push(newTabActivePath)
      }
    }

    if (!navigationTransition.value.enable || isMaxSm.value) return

    if (navigationTransition.value.effect === 'slider') {
      const oldActiveIndex = oldTabs.findIndex((item) => item.path === oldTabActivePath)
      const newActiveIndex = newTabs.findIndex((item) => item.path === newTabActivePath)

      if (oldTabs.length < newTabs.length || oldActiveIndex === -1 || newActiveIndex === -1) {
        navigationTransitionName.value = 'scale'
      } else if (oldTabs.length > newTabs.length) {
        navigationTransitionName.value =
          oldActiveIndex > newActiveIndex ? 'scale-slider-left' : 'scale-slider-right'
      } else if (oldTabActivePath !== newTabActivePath) {
        navigationTransitionName.value =
          oldActiveIndex > newActiveIndex ? 'slider-left' : 'slider-right'
      }

      oldTabs = [...newTabs]

      return
    }

    navigationTransitionName.value = navigationTransition.value.effect
  },
)

watch(
  () => shouldRefreshRoute.value,
  (shouldRefresh) => {
    if (shouldRefresh) {
      navigationTransitionName.value = 'shake'
      nextTick(() => {
        shouldRefreshRoute.value = false
      })
    }
  },
)

watch(
  () => router.currentRoute.value,
  (newRoute, oldRoute) => {
    if (layoutSlideDirection.value) {
      setLayoutSlideDirection(null)
    }

    if (newRoute.fullPath !== oldRoute?.fullPath) {
      const { showTab, enableMultiTab } = newRoute.meta
      const targetPath = enableMultiTab ? newRoute.fullPath : newRoute.path

      const findTab = tabs.value.find((item) => item.path === targetPath)

      if (!isEmpty(findTab)) {
        setTabActivePath(findTab.path)
      } else if (showTab) {
        createTabFromRoute(newRoute)
      } else {
        setTabActivePath('')
      }
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  oldTabs = [...tabs.value]
  isMounted.value = true
})
</script>
<template>
  <RouterView
    v-if="navigationTransition.enable"
    v-slot="{ Component, route }"
  >
    <Transition
      :type="navigationTransitionName === 'shake' ? 'animation' : 'transition'"
      :name="navigationTransitionName"
    >
      <KeepAlive :include="keepAliveTabs">
        <component
          :is="Component"
          v-if="isMounted && !shouldRefreshRoute"
          :key="route.path + JSON.stringify(route.query)"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
  <RouterView v-else />
</template>
<style scoped>
.slider-left-enter-active,
.slider-right-enter-active,
.slider-left-leave-active,
.slider-right-leave-active {
  position: absolute;
  width: 100%;
  transition: translate 500ms var(--cubic-bezier-ease-in-out) 75ms;
}

.slider-left-enter-from,
.slider-right-leave-to {
  translate: -100%;
}

.slider-left-leave-to,
.slider-right-enter-from {
  translate: 100%;
}

.slider-left-enter-to,
.slider-left-leave-from,
.slider-right-enter-to,
.slider-right-leave-from {
  translate: 0;
}

.scale-slider-left-enter-active,
.scale-slider-left-leave-active,
.scale-slider-right-enter-active,
.scale-slider-right-leave-active {
  position: absolute;
  width: 100%;
  transition:
    scale 500ms var(--cubic-bezier-ease-in-out) 75ms,
    translate 500ms var(--cubic-bezier-ease-in-out) 75ms,
    opacity 300ms var(--cubic-bezier-ease-in-out) 75ms;
}

.scale-slider-left-leave-to,
.scale-slider-right-leave-to {
  scale: 0.5;
  opacity: 0;
}

.scale-slider-left-enter-from {
  translate: -100%;
}

.scale-slider-right-enter-from {
  translate: 100%;
}

.scale-enter-active,
.scale-leave-active {
  position: absolute;
  width: 100%;
  transition:
    scale 300ms var(--cubic-bezier-ease-in-out) 75ms,
    opacity 300ms var(--cubic-bezier-ease-in-out) 75ms;
}

.scale-enter-from,
.scale-leave-to {
  scale: 0.5;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  position: absolute;
  width: 100%;
  transition: opacity 300ms var(--cubic-bezier-ease-in-out) 75ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-left-enter-active,
.fade-left-leave-active,
.fade-right-enter-active,
.fade-right-leave-active {
  position: absolute;
  width: 100%;
}

.fade-left-enter-active,
.fade-right-enter-active {
  transition:
    opacity 300ms var(--cubic-bezier-ease-in-out) 300ms,
    translate 300ms var(--cubic-bezier-ease-in-out) 300ms;
}

.fade-left-leave-active,
.fade-right-leave-active {
  transition:
    opacity 250ms var(--cubic-bezier-ease-in-out) 50ms,
    translate 250ms var(--cubic-bezier-ease-in-out) 50ms;
}

.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  translate: -10%;
}

.fade-left-enter-to,
.fade-left-leave-from,
.fade-right-enter-to,
.fade-right-leave-from {
  opacity: 1;
  translate: 0;
}

.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  translate: 10%;
}

.shake-enter-active {
  animation: shake var(--cubic-bezier-ease-in-out) 500ms;
}

@keyframes shake {
  0% {
    translate: 0 0;
    rotate: 0deg;
  }
  8% {
    translate: -2px -1px;
    rotate: -0.6deg;
  }
  16% {
    translate: 1px -2px;
    rotate: 0.9deg;
  }
  24% {
    translate: -1px 2px;
    rotate: -0.5deg;
  }
  32% {
    translate: 2px -1px;
    rotate: 0.7deg;
  }
  40% {
    translate: -1px -2px;
    rotate: -0.8deg;
  }
  48% {
    translate: 1px 2px;
    rotate: 0.4deg;
  }
  56% {
    translate: -2px 1px;
    rotate: -0.7deg;
  }
  64% {
    translate: 2px -1px;
    rotate: 0.8deg;
  }
  72% {
    translate: -1px -1px;
    rotate: -0.5deg;
  }
  80% {
    translate: 2px 1px;
    rotate: 0.6deg;
  }
  88% {
    translate: -1px 1px;
    rotate: -0.4deg;
  }
  96% {
    translate: 1px -1px;
    rotate: 0.3deg;
  }
  100% {
    translate: 0 0;
    rotate: 0deg;
  }
}
</style>
