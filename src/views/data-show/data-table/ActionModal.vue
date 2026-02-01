<script setup lang="ts">
import { useMutation, useQuery } from '@pinia/colada'
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NInputNumber,
  NDatePicker,
  NConfigProvider,
  NSpin,
} from 'naive-ui'
import { computed, useTemplateRef, watch } from 'vue'

import { createDataTable, getDataTableById, updateDataTable } from '@/api'
import { useComponentThemeOverrides, useResettableReactive } from '@/composables'

import type { DataTable } from '@/api'
import type { FormRules } from 'naive-ui'

const { id, action } = defineProps<{
  id?: number
  action: 'create' | 'update'
}>()

const emits = defineEmits<{
  submit: []
  update: []
  cancel: []
}>()

const formRef = useTemplateRef<InstanceType<typeof NForm>>('formRef')

const { overlayThemeOverrides } = useComponentThemeOverrides()

const [form, setUserForm, reset, updateInitialState] = useResettableReactive<DataTable>({
  id: -1,
  number: -1,
  rowKey: '',
  fullName: '',
  age: null,
  company: '',
  email: '',
  address: '',
  sex: null,
  phone: '',
  registerDate: null,
  children: [],
})

const rules: FormRules = {
  fullName: { required: true, message: '请输入姓名', trigger: ['input', 'blur`'] },
  age: [{ required: true, message: '请输入年龄', type: 'number', trigger: ['change'] }],
  company: { required: true, message: '请输入公司', trigger: ['input', 'blur'] },
  email: { required: true, message: '请输入邮箱', trigger: ['input', 'blur'] },
  address: { required: true, message: '请输入地址', trigger: ['input', 'blur'] },
  sex: { required: true, message: '请选择性别', trigger: ['input', 'blur'] },
  phone: { required: true, message: '请输入手机号', trigger: ['input', 'blur'] },
  registerDate: { required: true, message: '请选择注册日期', trigger: ['input', 'blur'] },
  jobTitle: { required: true, message: '请输入职位', trigger: ['input', 'blur'] },
}

const sexSelectOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
]

const { isLoading: getDataTableByIdLoading, data } = useQuery({
  key: () => ['dataTableById', id ?? -1],
  query: () => getDataTableById(id ?? -1),
  enabled: () => action === 'update' && id !== undefined,
})

const { isLoading: createDataTableLoading, mutate: mutateCreateDataTable } = useMutation({
  mutation: createDataTable,
  onSuccess: () => emits('submit'),
})

const { isLoading: updateDataTableLoading, mutate: mutateUpdateDataTable } = useMutation({
  mutation: updateDataTable,
  onSuccess: () => emits('update'),
})

const mergedLoading = computed(() => {
  return createDataTableLoading.value || updateDataTableLoading.value
})

const handleSubmitClick = () => {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      switch (action) {
        case 'create':
          mutateCreateDataTable(form)
          break
        case 'update': {
          if (id && id > 0) {
            mutateUpdateDataTable({ ...form, id })
          }
          break
        }
        default:
          break
      }
    }
  })
}

function onlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value)
}

watch(
  data,
  (newData) => {
    if (newData) {
      setUserForm(newData.data)
      updateInitialState(newData.data)
    }
  },
  { immediate: true },
)
</script>
<template>
  <NConfigProvider :theme-overrides="overlayThemeOverrides">
    <div class="p-2">
      <NSpin :show="getDataTableByIdLoading">
        <NForm
          :model="form"
          :rules="rules"
          label-placement="left"
          style="width: 100%"
          ref="formRef"
          label-width="88px"
        >
          <NFormItem
            label="姓名"
            path="fullName"
          >
            <NInput v-model:value="form.fullName" />
          </NFormItem>
          <div class="flex gap-x-2">
            <NFormItem
              label="性别"
              path="sex"
              class="flex-1"
            >
              <NSelect
                v-model:value="form.sex"
                :options="sexSelectOptions"
              />
            </NFormItem>
            <NFormItem
              label="年龄"
              path="age"
              class="flex-1"
              label-width="60px"
            >
              <NInputNumber
                min="1"
                v-model:value="form.age"
              />
            </NFormItem>
          </div>
          <NFormItem
            label="邮箱"
            path="email"
          >
            <NInput v-model:value="form.email" />
          </NFormItem>
          <NFormItem
            label="手机号"
            path="phone"
          >
            <NInput
              v-model:value="form.phone"
              :allow-input="onlyAllowNumber"
            />
          </NFormItem>
          <NFormItem
            label="注册日期"
            path="registerDate"
          >
            <NDatePicker
              v-model:formatted-value="form.registerDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              clearable
              style="width: 100%"
            />
          </NFormItem>
          <NFormItem
            label="公司"
            path="company"
          >
            <NInput
              type="textarea"
              v-model:value="form.company"
            />
          </NFormItem>

          <NFormItem
            label="地址"
            path="address"
          >
            <NInput
              type="textarea"
              v-model:value="form.address"
            />
          </NFormItem>
        </NForm>
        <div class="flex justify-end gap-x-4">
          <NButton
            secondary
            @click="emits('cancel')"
          >
            取消
          </NButton>
          <NButton
            secondary
            type="warning"
            @click="
              () => {
                reset()
                formRef?.restoreValidation()
              }
            "
          >
            重置
          </NButton>
          <NButton
            type="success"
            @click="handleSubmitClick"
            :loading="mergedLoading"
            :disabled="mergedLoading"
          >
            确定
          </NButton>
        </div>
      </NSpin>
    </div>
  </NConfigProvider>
</template>
