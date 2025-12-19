<script setup lang="tsx">
import { isFunction } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { NDropdown } from 'naive-ui'
import { computed, defineComponent, h } from 'vue'

import router from '@/router'
import { toRefsPreferencesStore } from '@/stores'

import type { DropdownProps } from 'naive-ui'
import type { PropType } from 'vue'
import type { RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router'

const { breadcrumb } = toRefsPreferencesStore()

const routeBreadcrumbList = computed(() => {
  return router.currentRoute.value.matched.filter((item) => item.name !== 'layout')
})

const currentRouteName = computed(() => {
  return router.currentRoute.value.name as string
})

const renderIcon: DropdownProps['renderIcon'] = (option) => {
  return isFunction(option.icon)
    ? h(option.icon, {
        class: 'ml-1.5 size-5',
      })
    : null
}

const onDropdownSelected: DropdownProps['onSelect'] = (key) => {
  router.push({ name: key })
}

function isCurrentRoute(name: RouteRecordNameGeneric) {
  return name === currentRouteName.value
}

function resolveDropdownOptions(route: RouteRecordRaw[] | undefined): DropdownProps['options'] {
  if (!route) return []

  return route.map((item) => ({
    label: item.meta?.title || item.meta?.label,
    key: (item.name as string) || item.path,
    icon: item.meta?.icon ? () => h('span', { class: `${item.meta?.icon} size-5` }) : undefined,
    children:
      Array.isArray(item.children) && !isEmpty(item.children)
        ? resolveDropdownOptions(item.children)
        : undefined,
  }))
}

const BreadcrumbNode = defineComponent({
  name: 'BreadcrumbNode',
  props: {
    meta: {
      type: Object as PropType<RouteRecordRaw['meta']>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class='flex shrink-0 items-center gap-x-1.5 rounded px-1.5 py-1'>
        {props.meta?.icon && isFunction(props.meta?.icon) ? (
          props.meta.icon()
        ) : (
          <span class={`${props.meta?.icon} size-5`} />
        )}
        {props.meta?.title && isFunction(props.meta?.title) ? (
          props.meta.title()
        ) : (
          <span>{props.meta?.title}</span>
        )}
      </div>
    )
  },
})

const BreadcrumbItem = defineComponent({
  name: 'BreadcrumbItem',
  props: {
    meta: {
      type: Object as PropType<RouteRecordRaw['meta']>,
    },
    children: {
      type: Array as PropType<RouteRecordRaw['children']>,
    },
    name: {
      type: String as PropType<RouteRecordRaw['name']>,
    },
  },
  setup(props) {
    const { children, meta, name } = props

    return () => (
      <div class='flex min-w-0 items-center'>
        {isEmpty(children) ? (
          <BreadcrumbNode meta={meta} />
        ) : (
          <NDropdown
            options={resolveDropdownOptions(children)}
            disabled={isEmpty(children)}
            value={currentRouteName.value}
            renderIcon={renderIcon}
            onSelect={onDropdownSelected}
          >
            <BreadcrumbNode
              meta={meta}
              class='cursor-pointer transition-[background-color,color] not-hover:text-naive-text3 hover:bg-naive-button2-hover'
            />
          </NDropdown>
        )}
        {!isCurrentRoute(name) && (
          <span class='icon-[fluent--slash-forward-20-regular] w-3.5 text-naive-text3' />
        )}
      </div>
    )
  },
})
</script>
<template>
  <TransitionGroup
    v-if="breadcrumb.enableTransition"
    :duration="300"
    tag="ul"
    class="flex"
    type="transition"
    enter-active-class="transition-[grid-template-columns]"
    leave-active-class="transition-[grid-template-columns]"
    enter-from-class="grid-cols-[0fr]"
    leave-to-class="grid-cols-[0fr]"
    enter-to-class="grid-cols-[1fr]"
    leave-from-class="grid-cols-[1fr]"
  >
    <li
      v-for="{ path, ...rest } in routeBreadcrumbList"
      :key="path"
      class="grid overflow-hidden"
    >
      <BreadcrumbItem
        v-bind="rest"
        class="min-w-0"
      />
    </li>
  </TransitionGroup>
  <ul
    v-else
    class="flex"
  >
    <li
      v-for="{ path, ...rest } in routeBreadcrumbList"
      :key="path"
      class="grid overflow-hidden"
    >
      <BreadcrumbItem
        v-bind="rest"
        class="min-w-0"
      />
    </li>
  </ul>
</template>
