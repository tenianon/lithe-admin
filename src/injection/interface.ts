import type { ComputedRef, Ref } from 'vue'

export interface MediaQueryProvider {
  isMaxSm: ComputedRef<boolean>
  isMaxMd: ComputedRef<boolean>
  isMaxLg: ComputedRef<boolean>
  isMaxXl: ComputedRef<boolean>
  isMax2Xl: ComputedRef<boolean>
}

export type LayoutSlideDirection = 'left' | 'right' | null

export interface LayoutProvider {
  shouldRefreshRoute: Ref<boolean>
  layoutSlideDirection: Ref<LayoutSlideDirection>
  setLayoutSlideDirection: (direction: LayoutSlideDirection) => void
  isSidebarColResizing: Ref<boolean>
  mobileLeftAsideWidth: Ref<number>
  mobileRightAsideWidth: Ref<number>
}
