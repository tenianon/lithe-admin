import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/sign-in', name: 'signIn', component: () => import('@/views/sign-in/index.vue') },
  {
    path: '/:pathMatch(.*)*',
    name: 'errorPage',
    component: () => import('@/views/error-page/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  strict: true,
})

export default router
