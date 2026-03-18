import type { CSSProperties, TransitionProps, VNodeChild } from 'vue'

export interface CollapseTransitionProps extends TransitionProps {
  displayDirective?: 'if' | 'show'
  display?: boolean
  direction?: 'vertical' | 'horizontal'
  containerClass?: string
  containerStyle?: CSSProperties
  renderContent?: boolean
  contentTag?: string
  contentClass?: string
  contentStyle?: CSSProperties
}

export type CollapseTransitionTriggerProps = Omit<CollapseTransitionProps, 'display'> & {
  defaultCollapsed?: boolean
}

export interface CollapseTransitionTriggerSlots {
  default(): VNodeChild
  trigger(props: { collapsed: boolean }): VNodeChild
}
