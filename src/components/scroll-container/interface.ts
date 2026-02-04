import type { ScrollbarProps } from 'naive-ui'
import type { CSSProperties } from 'vue'

export interface ContentWrapperProps extends /* @vue-ignore */ ScrollbarProps {
  scrollable?: boolean
  wrapperClass?: string
  wrapperStyle?: CSSProperties
}
