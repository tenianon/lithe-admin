<template>
  <div class="icon-picker w-full">
    <!-- 搜索框 -->
    <input
      v-model="search"
      type="text"
      placeholder="搜索图标"
      class="w-full mb-2 px-2 py-1 border rounded border-gray-200 focus:outline-none focus:ring focus:border-primary"
    />
    <!-- 图标列表 -->
    <div class="grid grid-cols-6 gap-2">
      <button
        v-for="icon in filteredIcons"
        :key="icon"
        class="bg-transparent border-none cursor-pointer p-1 rounded hover:bg-gray-100 flex items-center justify-center"
        @click="selectIcon(icon)"
        type="button"
      >
        <span :class="renderIconClass(icon)" class="text-2xl"></span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

/**
 * IconPicker 图标选择器组件
 * @description 支持 iconify 离线图标库，选中后返回 iconify-[前缀--图标名] 格式
 * @prop {string[]} icons - 图标名数组（不含前缀）
 * @prop {string} prefix - 图标库前缀（如 'mdi'）
 * @prop {string} [modelValue] - 当前选中图标名
 */
const props = defineProps<{
  modelValue?: string
  icons: string[]
  prefix: string
}>()
const emit = defineEmits(['update:modelValue'])

const search = ref('')
const filteredIcons = computed(() =>
  props.icons.filter(i => i.includes(search.value.trim()))
)

function selectIcon(icon: string) {
  emit('update:modelValue', `iconify-[${props.prefix}--${icon}]`)
}

function renderIconClass(icon: string) {
  return `iconify-[${props.prefix}--${icon}]`
}
</script>

