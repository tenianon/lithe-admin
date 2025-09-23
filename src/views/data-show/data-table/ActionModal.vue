<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NInputNumber,
  NDatePicker,
  NConfigProvider,
} from 'naive-ui'
import { onMounted, useTemplateRef } from 'vue'

import { useComponentThemeOverrides, useResettableReactive } from '@/composables'

import type { UserInfo } from './index.vue'
import type { FormRules } from 'naive-ui'

const { data } = defineProps<{
  data: Partial<UserInfo>
}>()

const emits = defineEmits<{
  (e: 'submit' | 'update', value: Partial<UserInfo>): void
  (e: 'cancel'): void
}>()

const formRef = useTemplateRef<InstanceType<typeof NForm>>('formRef')

const { inModal } = useComponentThemeOverrides()

const [form, setUserForm, reset, updateInitialState] = useResettableReactive<Partial<UserInfo>>({
  fullName: '',
  age: null,
  company: '',
  email: '',
  address: '',
  sex: null,
  phone: '',
  registerDate: null,
})

const rules: FormRules = {
  fullName: { required: true, message: '请输入姓名', trigger: ['input'] },
  age: [{ required: true, message: '请输入年龄', type: 'number', trigger: ['change'] }],
  company: { required: true, message: '请输入公司', trigger: ['input'] },
  email: { required: true, message: '请输入邮箱', trigger: ['input'] },
  address: { required: true, message: '请输入地址', trigger: ['input'] },
  sex: { required: true, message: '请选择性别', trigger: ['input'] },
  phone: { required: true, message: '请输入手机号', trigger: ['input'] },
  registerDate: { required: true, message: '请选择注册日期', trigger: ['input'] },
  jobTitle: { required: true, message: '请输入职位', trigger: ['input'] },
}

const sexSelectOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
]

const handleSubmitClick = () => {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      if (form.number) {
        emits('update', form)
      } else {
        emits('submit', form)
      }
    }
  })
}

onMounted(() => {
  if (data.number) {
    setUserForm({ ...data })
    updateInitialState({ ...data })
  }
})
</script>
<template>
  <NConfigProvider :theme-overrides="inModal">
    <div class="p-2">
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
            <NInputNumber v-model:value="form.age" />
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
          <NInput v-model:value="form.phone" />
        </NFormItem>
        <NFormItem
          label="注册日期"
          path="registerDate"
        >
          <NDatePicker
            v-model:formatted-value="form.registerDate"
            value-format="yyyy-MM-dd"
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
          @click="reset"
        >
          重置
        </NButton>
        <NButton
          type="success"
          @click="handleSubmitClick"
        >
          确定
        </NButton>
      </div>
    </div>
  </NConfigProvider>
</template>
