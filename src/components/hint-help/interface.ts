import type { PopoverProps } from 'naive-ui'
import type { HTMLAttributes, SVGAttributes, VNodeChild } from 'vue'

export interface HintHelpProps {
  content?: (() => VNodeChild) | string
  iconProps?: SVGAttributes
  label?: string
  labelProps?: HTMLAttributes
  popoverProps?: PopoverProps
}
