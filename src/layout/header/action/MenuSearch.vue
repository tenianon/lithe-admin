<script setup lang="ts">
import { h } from 'vue'

import { ButtonAnimation } from '@/components'
import { useDiscreteApi } from '@/composables/useDiscreteApi'

import MenuSearchModal from './component/MenuSearchModal.vue'

const { modal } = useDiscreteApi()

const handleMenuSearchClick = () => {
  const m = modal.create({
    transformOrigin: 'center',
    style: {
      marginTop: '80px',
    },
    render: () =>
      h(MenuSearchModal, {
        onNavigateToRoute: () => {
          m.style = {
            marginTop: '80px',
            transition: 'none',
          }
          m.destroy()
        },
      }),
  })
}
</script>
<template>
  <ButtonAnimation
    title="菜单搜索"
    :focusable="false"
    @click="handleMenuSearchClick"
  >
    <span class="iconify ph--magnifying-glass" />
  </ButtonAnimation>
</template>
