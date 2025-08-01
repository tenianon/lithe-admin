<script setup lang="ts">
import { NButton } from 'naive-ui'
import { ref } from 'vue'

import type { ButtonProps } from 'naive-ui'

type Animation = 'beat' | 'rotate' | 'shake'

interface ButtonAnimationProps extends /* @vue-ignore */ ButtonProps {
  duration?: number
  animation?: Animation | boolean
}

const { duration = 600, animation = 'beat' } = defineProps<ButtonAnimationProps>()

const isAnimating = ref(false)

const handleButtonClick = () => {
  if (isAnimating.value) return

  isAnimating.value = true

  setTimeout(() => {
    isAnimating.value = false
  }, duration)
}
</script>

<template>
  <NButton
    quaternary
    circle
    v-bind="$attrs"
    @click.stop="handleButtonClick"
  >
    <template #icon>
      <div
        class="grid place-items-center"
        :class="{
          'animate-beat': isAnimating && animation === 'beat',
          'animate-rotate': isAnimating && animation === 'rotate',
          'animate-shake': isAnimating && animation === 'shake',
        }"
        :style="{
          '--duration': `${duration}ms`,
        }"
      >
        <slot />
      </div>
    </template>
  </NButton>
</template>
<style scoped>
.animate-beat {
  animation: beat var(--duration) ease-in-out;
}

@keyframes beat {
  0%,
  50%,
  100% {
    scale: 1;
  }
  25% {
    scale: 1.1;
  }

  75% {
    scale: 1.2;
  }
}

.animate-rotate {
  animation: rotate var(--duration) ease-in-out;
}

@keyframes rotate {
  0% {
    rotate: 0;
  }
  100% {
    rotate: 360deg;
  }
}

.animate-shake {
  animation: shake var(--duration) ease-in-out;
}

@keyframes shake {
  10%,
  90% {
    translate: -1px;
  }

  20%,
  80% {
    translate: 2px;
  }

  30%,
  50%,
  70% {
    translate: -3px;
  }

  40%,
  60% {
    translate: 3px;
  }
}
</style>
