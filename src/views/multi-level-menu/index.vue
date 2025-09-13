<script setup lang="ts">
import { useRoute } from 'vue-router'

import { ScrollContainer } from '@/components'

const route = useRoute()
</script>
<template>
  <ScrollContainer>
    <div class="flex h-96 items-center justify-center text-3xl">
      {{ route.meta.title }}
    </div>
  </ScrollContainer>
</template>
