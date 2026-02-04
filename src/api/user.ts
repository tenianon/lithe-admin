import request from '@/utils/request'

import type { MenuMixedOptions } from '@/router/interface'

export interface UserInfo {
  avatar: string
  id: number
  name: string
  role: 'admin' | 'user' | 'guest'
  token: string | null
  menu: MenuMixedOptions[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const menu: MenuMixedOptions[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    icon: 'icon-[mage--dashboard-chart]',
    label: '仪表板',
    meta: {
      componentName: 'Dashboard',
      pinned: true,
      showTab: true,
    },
    component: 'dashboard/index',
  },
  {
    path: 'data-show',
    name: 'dataShow',
    label: '数据展示',
    icon: 'icon-[fluent--data-area-32-regular]',
    redirect: 'data-show/data-table',
    children: [
      {
        path: 'data-table',
        name: 'dataTable',
        icon: 'iconify ph--table',
        label: '数据表格',
        meta: {
          componentName: 'DataTable',
          title: '数据表格',
          showTab: true,
        },
        component: 'data-show/data-table/index',
      },
      {
        path: 'data-form',
        name: 'dataForm',
        icon: 'iconify ph--article',
        label: '数据表单',
        meta: {
          componentName: 'DataForm',
          title: '数据表单',
          showTab: true,
        },
        component: 'data-show/data-form/index',
      },
    ],
  },
  {
    path: 'multi-level-menu',
    redirect: 'multi-level-menu/level-1',
    name: 'multiLevelMenu',
    icon: 'iconify ph--list',
    label: '多级菜单',
    children: [
      {
        path: 'level-2-1',
        key: 'level-2-1',
        name: 'level-2-1',
        icon: 'iconify ph--squares-four',
        label: '图标菜单',
        component: 'multi-level-menu/index',
        meta: {
          showTab: true,
        },
      },
      {
        path: 'level-2-2',
        key: 'level-2-2',
        name: 'level-2-2',
        label: '无图标菜单',
        component: 'multi-level-menu/index',
        meta: {
          showTab: true,
        },
      },
      {
        type: 'group',
        key: 'group-1',
        label: '分组',
        children: [
          {
            path: 'level-2-3',
            key: 'level-2-3',
            name: 'level-2-3',
            icon: 'iconify ph--squares-four',
            label: '菜单2-3',
            component: 'multi-level-menu/index',
            meta: {
              showTab: true,
            },
          },
          {
            type: 'divider',
            key: 'divider-1',
          },
          {
            path: 'level-2-4',
            key: 'level-2-4',
            name: 'level-2-4',
            icon: 'iconify ph--squares-four',
            label: '不创建tab',
            component: 'multi-level-menu/index',
          },
        ],
      },
      {
        path: 'level-2-5',
        key: 'level-2-5',
        name: 'level-2-5',
        redirect: 'level-2-5/level-2-1',
        icon: 'iconify ph--squares-four',
        label: '三级菜单',
        children: [
          {
            path: 'level-3-1',
            key: 'level-3-1',
            name: 'level-3-1',
            icon: 'iconify ph--squares-four',
            label: '菜单3-1',
            component: 'multi-level-menu/index',
            meta: {
              showTab: true,
            },
          },
          {
            type: 'divider',
            key: 'divider-2',
          },
          {
            type: 'group',
            key: 'group-2',
            label: '分组',
            children: [
              {
                type: 'divider',
                key: 'divider-3',
              },
            ],
          },
          {
            path: 'level-3-2',
            key: 'level-3-2',
            name: 'level-3-2',
            label: '菜单3-2',
            icon: 'iconify ph--squares-four',
            component: 'multi-level-menu/index',
            meta: {
              showTab: true,
            },
          },
          {
            path: 'level-3-3',
            key: 'level-3-3',
            name: 'level-3-3',
            label: '禁用菜单',
            icon: 'iconify ph--squares-four',
            component: 'multi-level-menu/index',
            disabled: true,
            meta: {
              showTab: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: 'dynamic-route/:id?/:name?',
    name: 'dynamicRoute',
    label: '动态路由',
    icon: 'icon-[material-symbols--dynamic-feed]',
    meta: {
      componentName: 'DynamicRoute',
      showTab: true,
      enableMultiTab: true,
      renderTabTitle({ id, name }) {
        return `动态路由${id ? `-${id}` : ''}${name ? `-${name}` : ''}`
      },
    },
    component: 'dynamic-route/index',
  },
  {
    path: 'feedback',
    name: 'feedback',
    icon: 'iconify ph--messenger-logo',
    label: '反馈组件',
    meta: {
      componentName: 'Feedback',
      showTab: true,
    },
    component: 'feedback/index',
  },
  {
    path: 'drag-drop',
    name: 'dragDrop',
    icon: 'icon-[pixelarticons--drag-and-drop]',
    label: '拖拽模块',
    meta: {
      componentName: 'DragDrop',
      showTab: true,
    },
    component: 'drag-drop/index',
  },
  {
    path: 'not-found-page-404',
    name: 'notfoundPage',
    icon: 'icon-[streamline-freehand--server-error-404-not-found]',
    label: '404页面',
    meta: {
      componentName: 'notfoundPage404',
    },
    component: 'error-page/404',
  },
  {
    path: '/about',
    key: 'about',
    name: 'about',
    icon: 'iconify ph--info',
    label: '关于项目',
    component: 'about/index',
    meta: {
      showTab: true,
    },
  },
]

export async function signIn(data: { account: string; password: string }) {
  return request({
    url: '/user/sign-in',
    method: 'post',
    data,
  })
}
