import type { CustomRouteMeta } from '@/router/interface'

declare module 'vue-router' {
  interface RouteMeta extends CustomRouteMeta {}
}
