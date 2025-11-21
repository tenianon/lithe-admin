<script setup lang="ts">
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NUploadDragger,
  NUpload,
  NSwitch,
  NCheckbox,
  NCheckboxGroup,
  NSplit,
  NDatePicker,
  NAutoComplete,
  NAlert,
  NScrollbar,
  NInputNumber,
  NRadio,
  useMessage,
} from 'naive-ui'
import { computed, ref, useTemplateRef, watch } from 'vue'

import { ScrollContainer } from '@/components'
import { useInjection, useResettableReactive } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'

import type { FormRules } from 'naive-ui'

interface BaseForm {
  name: string
  age: number | null
  sex: string
  hobby: Array<string | number>
  phones: Array<{ phone: string }>
  email: string
  dateBirth: number | null
  job: string | null
  address: string
}

defineOptions({
  name: 'DataForm',
})

let codeToHtml: any

const { isMaxMd, isMaxLg, isMaxXl } = useInjection(mediaQueryInjectionKey)

const message = useMessage()

const formRef = useTemplateRef<InstanceType<typeof NForm>>('formRef')

const [form, setForm, reset] = useResettableReactive<BaseForm>({
  name: '',
  age: null,
  sex: '',
  hobby: [],
  phones: [
    {
      phone: '',
    },
  ],
  email: '',
  dateBirth: null,
  job: null,
  address: '',
})

const formCodeHighlight = ref()

const rulesCodeHighlight = ref()

const formDisabled = ref(false)

const isRequestLoading = ref(false)

const rules: FormRules = {
  name: { required: true, message: '请输入用户名' },
}

const hobbyOptions = [
  {
    value: '唱',
    label: '唱',
  },
  {
    value: '跳',
    label: '跳',
  },
  {
    value: 'Rap',
    label: 'Rap',
  },
  {
    value: '篮球',
    label: '篮球',
  },
]

const jobSelectOptions = [
  {
    label: '前端工程师',
    value: '前端工程师',
  },
  {
    label: '后端工程师',
    value: '后端工程师',
  },
  {
    label: '全栈工程师',
    value: '全栈工程师',
  },
  {
    label: '产品经理',
    value: '产品经理',
  },
  {
    label: 'UI设计师',
    value: 'UI设计师',
  },
  {
    label: '测试工程师',
    value: '测试工程师',
  },
  {
    label: '运维工程师',
    value: '运维工程师',
  },
  {
    label: '数据分析师',
    value: '数据分析师',
  },
  {
    label: '项目经理',
    value: '项目经理',
  },
  {
    label: '其他',
    value: '其他',
  },
]

const emailOptions = computed(() => {
  return ['@gmail.com', '@outlook.com', '@hotmail.com', '@163.com', '@qq.com'].map((suffix) => {
    const prefix = form.email.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    }
  })
})

function inputOnlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value)
}

function generateRandomForm() {
  isRequestLoading.value = true
  fetch('https://lithe-admin-serverless.havenovelgod.com/api/faker')
    .then((res) => res.json())
    .then((res) => {
      setForm(res.data)
    })
    .finally(() => {
      isRequestLoading.value = false
    })
}

function handleSubmitClick() {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      message.success('通过验证')
    }
  })
}

function addPhoneField() {
  form.phones.push({
    phone: '',
  })
}

function removePhoneField(index: number) {
  form.phones.splice(index, 1)
}

watch(
  form,
  async (newForm) => {
    if (!codeToHtml) {
      // @ts-ignore
      const shiki = await import('https://cdn.jsdelivr.net/npm/shiki@3.7.0/+esm')
      codeToHtml = shiki.codeToHtml
    }

    codeToHtml(JSON.stringify(newForm, null, 2), {
      lang: 'json',
      themes: {
        dark: 'dark-plus',
        light: 'min-light',
      },
    })
      .then((result: string) => (formCodeHighlight.value = result))
      .catch(() => (formCodeHighlight.value = JSON.stringify(newForm, null, 2)))

    codeToHtml(JSON.stringify(rules, null, 2), {
      lang: 'json',
      themes: {
        dark: 'dark-plus',
        light: 'min-light',
      },
    })
      .then((result: string) => (rulesCodeHighlight.value = result))
      .catch(() => (rulesCodeHighlight.value = JSON.stringify(rules, null, 2)))
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <ScrollContainer wrapper-class="flex flex-col gap-y-2">
    <NAlert
      type="info"
      closable
    >
      一个数据表单的例子，做了一些验证的限制，右边是规则和表单的数据，你可以拖动它们之间的分割线
    </NAlert>
    <NCard :size="isMaxMd ? 'small' : undefined">
      <NSplit
        :pane1-class="isMaxLg ? 'pb-4' : 'pr-8'"
        :pane2-class="isMaxLg ? 'pt-4' : 'pl-8'"
        :default-size="0.6"
        :direction="isMaxXl ? 'vertical' : 'horizontal'"
      >
        <template #1>
          <NScrollbar>
            <NForm
              ref="formRef"
              :model="form"
              :rules="rules"
              label-placement="left"
              :label-width="78"
              :disabled="formDisabled"
            >
              <div class="flex gap-x-8 p-1 max-lg:flex-col">
                <div class="flex-1">
                  <NFormItem
                    label="姓名"
                    path="name"
                  >
                    <NInput
                      v-model:value="form.name"
                      clearable
                      class="w-full"
                      placeholder="请输入姓名"
                    />
                  </NFormItem>
                  <NFormItem
                    label="年龄"
                    path="age"
                  >
                    <NInputNumber
                      v-model:value="form.age"
                      clearable
                      class="w-full"
                      placeholder="请输入年龄"
                    />
                  </NFormItem>
                  <NFormItem
                    label="性别"
                    path="sex"
                  >
                    <NRadio
                      :checked="form.sex === '男'"
                      value="男"
                      name="basic-demo"
                      @change="form.sex = '男'"
                    >
                      男
                    </NRadio>
                    <NRadio
                      :checked="form.sex === '女'"
                      value="女"
                      name="basic-demo"
                      @change="form.sex = '女'"
                    >
                      女
                    </NRadio>
                  </NFormItem>
                  <NFormItem
                    label="出生日期"
                    path="dateBirth"
                  >
                    <NDatePicker
                      v-model:value="form.dateBirth"
                      type="datetime"
                      clearable
                      class="w-full"
                    />
                  </NFormItem>
                  <NFormItem
                    v-for="(item, index) in form.phones"
                    :key="index"
                    :label="`手机号${index + 1}`"
                    :path="`phones[${index}].phone`"
                    :rule="{
                      required: true,
                      trigger: ['input'],
                      validator: (_, value: string) => {
                        if (!value) {
                          return new Error('请输入手机号')
                        }
                        if (!/^[1]+[3,8]+\d{9}$/.test(value)) {
                          return new Error('请输入1[3-8]开头的手机号')
                        }
                        return true
                      },
                    }"
                  >
                    <NInput
                      v-model:value="item.phone"
                      clearable
                      :allow-input="inputOnlyAllowNumber"
                      maxlength="11"
                      class="mr-1 w-full"
                      placeholder="请输入手机号"
                    />
                    <NButton
                      type="warning"
                      secondary
                      @click="removePhoneField(index)"
                    >
                      删除
                    </NButton>
                  </NFormItem>
                  <NFormItem
                    label="邮箱"
                    path="email"
                  >
                    <NAutoComplete
                      v-model:value="form.email"
                      :input-props="{
                        autocomplete: 'disabled',
                      }"
                      :options="emailOptions"
                      clearable
                      class="w-full"
                      placeholder="请输入邮箱"
                    />
                  </NFormItem>

                  <NFormItem
                    label="职业"
                    path="job"
                  >
                    <NSelect
                      v-model:value="form.job"
                      :options="jobSelectOptions"
                    />
                  </NFormItem>
                  <NFormItem
                    label="爱好"
                    path="hobby"
                  >
                    <NCheckboxGroup v-model:value="form.hobby">
                      <div>
                        <NCheckbox
                          v-for="{ value, label } in hobbyOptions"
                          :key="value"
                          :value="value"
                          :label="label"
                        />
                      </div>
                    </NCheckboxGroup>
                  </NFormItem>
                  <NFormItem
                    label="住址"
                    path="address"
                  >
                    <NInput
                      type="textarea"
                      v-model:value="form.address"
                      clearable
                      class="w-full"
                      placeholder="请输入地址"
                    />
                  </NFormItem>
                </div>
                <div class="flex-1">
                  <NFormItem
                    label="一个头像"
                    path="avatar"
                    label-placement="top"
                  >
                    <NUpload
                      :default-file-list="[]"
                      list-type="image-card"
                      :max="1"
                    >
                      点击上传
                    </NUpload>
                  </NFormItem>
                  <NFormItem
                    label="多个图像"
                    path="image"
                    label-placement="top"
                  >
                    <NUpload
                      action="#"
                      :default-file-list="[
                        {
                          id: 'c',
                          name: '我是自带url的图片.png',
                          status: 'finished',
                          url: 'https://avatars.githubusercontent.com/u/147876815?s=400&u=586cf97ad6f4c788ffae93441d7fcedc6de89d2c&v=4',
                        },
                      ]"
                      list-type="image-card"
                      multiple
                    >
                    </NUpload>
                  </NFormItem>
                  <NFormItem
                    label="文件上传"
                    path="file"
                    label-placement="top"
                  >
                    <NUpload
                      action="#"
                      :default-file-list="[
                        {
                          id: 'c',
                          name: '我是自带url的图片.png',
                          status: 'finished',
                          url: 'https://avatars.githubusercontent.com/u/147876815?s=400&u=586cf97ad6f4c788ffae93441d7fcedc6de89d2c&v=4',
                        },
                      ]"
                      multiple
                    >
                      <NButton type="primary">选择文件</NButton>
                    </NUpload>
                  </NFormItem>
                  <NFormItem
                    label="拖拽上传"
                    path="dragUpload"
                    label-placement="top"
                  >
                    <NUpload
                      multiple
                      directory-dnd
                      action="#"
                      :max="3"
                    >
                      <NUploadDragger>
                        <div style="margin-bottom: 12px">
                          <div>
                            <span class="iconify text-3xl ph--upload"></span>
                          </div>
                          <p>点击或者拖动文件到该区域来上传</p>
                          <p class="text-xs text-neutral-400 dark:text-neutral-500">
                            请不要上传隐私的文件数据
                          </p>
                        </div>
                      </NUploadDragger>
                    </NUpload>
                  </NFormItem>
                </div>
              </div>
            </NForm>
            <div class="flex items-center max-lg:flex-col">
              <NFormItem
                label="禁用表单"
                label-placement="left"
                :show-feedback="false"
              >
                <NSwitch v-model:value="formDisabled" />
              </NFormItem>

              <div class="flex gap-4 max-md:flex-wrap max-md:gap-2 md:ml-8">
                <NButton
                  type="success"
                  :disabled="formDisabled"
                  @click="handleSubmitClick"
                >
                  提交表单
                </NButton>
                <NButton
                  type="warning"
                  :disabled="formDisabled"
                  @click="reset"
                >
                  重置表单
                </NButton>
                <NButton
                  type="info"
                  :disabled="formDisabled || isRequestLoading"
                  @click="generateRandomForm"
                  :loading="isRequestLoading"
                >
                  随机填充表单
                </NButton>
                <NButton
                  type="primary"
                  :disabled="formDisabled"
                  @click="addPhoneField"
                >
                  添加手机号
                </NButton>
              </div>
            </div>
          </NScrollbar>
        </template>
        <template #2>
          <NSplit
            direction="vertical"
            pane1-class="pb-4"
            pane2-class="pt-4"
          >
            <template #1>
              <NScrollbar>
                <div v-html="formCodeHighlight"></div>
              </NScrollbar>
            </template>
            <template #2>
              <NScrollbar>
                <div v-html="rulesCodeHighlight"></div>
              </NScrollbar>
            </template>
            <template #resize-trigger>
              <div
                class="h-px w-full cursor-col-resize bg-neutral-200 transition-[background-color] dark:bg-neutral-700"
              ></div>
            </template>
          </NSplit>
        </template>
        <template #resize-trigger>
          <div
            class="h-full w-px cursor-col-resize bg-neutral-200 transition-[background-color] max-lg:h-px max-lg:w-full dark:bg-neutral-700"
          ></div>
        </template>
      </NSplit>
    </NCard>
  </ScrollContainer>
</template>
