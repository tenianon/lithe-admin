<script setup lang="tsx">
import {
  NButton,
  NDataTable,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NPopconfirm,
  useMessage,
  useModal,
  NPagination,
  NButtonGroup,
  NDropdown,
  NTag,
  NNumberAnimation,
  NAlert,
} from 'naive-ui'
import { defineComponent, reactive, ref, useTemplateRef, nextTick } from 'vue'

import { ScrollContainer } from '@/components'
import { useInjection, useComponentModifier, useResettableReactive } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'

import ActionModal from './ActionModal.vue'

import type { DataTableColumns, PaginationProps, FormRules, DropdownProps } from 'naive-ui'
import type { PropType } from 'vue'

export interface UserInfo {
  address: string
  age: number | null
  company: string
  email: string
  fullName: string
  number: number
  id: number | string
  phone: string
  registerDate: null | null
  sex: string | null
  children: UserInfo[]
}

defineOptions({
  name: 'DataTable',
})

const { isMaxMd, isMaxLg } = useInjection(mediaQueryInjectionKey)

const formRef = useTemplateRef<InstanceType<typeof NForm>>('formRef')

const dataTableRef = useTemplateRef<InstanceType<typeof NDataTable>>('dataTableRef')

const message = useMessage()

const modal = useModal()

const { getPopconfirmModifier } = useComponentModifier()

const [form, , resetForm] = useResettableReactive<Partial<UserInfo>>({
  fullName: '',
  sex: null,
  phone: '',
  company: '',
})

const rules: FormRules = {
  sex: {
    required: true,
    message: '请选择性别',
  },
}

const sexOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
]

const isRequestLoading = ref(false)
const enableStriped = ref(false)
const enableScrollX = ref(true)
const enableSingleLine = ref(true)
const enableContextmenu = ref(true)
const showDropdown = ref(false)
const contextmenuId = ref<number | string | null>(null)

const dataList = ref<UserInfo[]>([])

const checkedRowKeys = ref<Array<number | string>>([])

const CellActions = (row: UserInfo) => (
  <div class='flex gap-2'>
    <NButton
      secondary
      type='primary'
      size='small'
      onClick={() => createOrEditData(row)}
    >
      编辑
    </NButton>
    <NPopconfirm
      {...getPopconfirmModifier()}
      positiveText='确定'
      negativeText='取消'
      onPositiveClick={() => {
        message.success('点击了删除')
      }}
    >
      {{
        default: () => '确认删除吗？',
        trigger: () => (
          <NButton
            secondary
            type='error'
            size='small'
          >
            删除
          </NButton>
        ),
      }}
    </NPopconfirm>
  </div>
)

const ShowOrEdit = defineComponent({
  name: 'ShowOrEdit',
  props: {
    value: {
      type: String,
      required: true,
    },
    onUpdateValue: {
      type: Function as PropType<(value: string) => void>,
    },
  },
  setup(props) {
    const isEdit = ref(false)
    const inputRef = ref<InstanceType<typeof NInput> | null>(null)
    const inputValue = ref(props.value)

    function onClick() {
      isEdit.value = true
      nextTick(() => {
        inputRef.value?.focus()
      })
    }

    function onBlur() {
      if (!inputValue.value.trim()) {
        message.error('为空就再也编辑不了了')
        inputValue.value = props.value
      }
      isEdit.value = false
      props.onUpdateValue?.(inputValue.value)
    }

    return () => (
      <div onClick={onClick}>
        {isEdit.value ? (
          <NInput
            ref={inputRef}
            value={inputValue.value}
            clearable
            onUpdateValue={(value) => {
              inputValue.value = value
            }}
            onBlur={onBlur}
          />
        ) : (
          <span>{props.value}</span>
        )}
      </div>
    )
  },
})

const columns: DataTableColumns<UserInfo> = [
  {
    type: 'selection',
    options: [
      'all',
      'none',
      {
        label: '选中前 3 行可选数据',
        key: 'f2',
        onSelect: (pageData) => {
          checkedRowKeys.value = pageData
            .filter((row) => row.number < 500)
            .map((row) => row.id)
            .slice(0, 3)
        },
      },
    ],
    disabled: (row) => {
      return ['4', '5', '8', '9'].includes(String(row.number)[0])
    },
  },
  {
    key: 'number',
    title: '编号',
    width: 100,
  },
  {
    key: 'fullName',
    width: 160,
    title: () => {
      return (
        <div class='flex items-center gap-x-2'>
          <span>姓名</span>
          <span class='iconify ph--pencil-simple-line' />
        </div>
      )
    },
    render: (row, index) => (
      <ShowOrEdit
        value={row.fullName}
        onUpdateValue={(value) => {
          dataList.value[index].fullName = value
        }}
      />
    ),
  },
  {
    key: 'sex',
    title: '性别',
    width: 100,
    render: (row) => {
      const isMale = row.sex === '男'
      return (
        <div>
          <span
            class={
              isMale
                ? 'iconify text-sky-500 ph--gender-male'
                : 'iconify text-pink-500 ph--gender-female'
            }
          />
        </div>
      )
    },
  },
  {
    key: 'age',
    title: '年龄',
    width: 100,
    render: (row) => {
      const age = row.age ?? 0

      return (
        <NTag
          bordered={false}
          size='small'
          type={age > 50 ? 'error' : age > 40 ? 'warning' : age > 30 ? 'info' : 'success'}
        >
          {row.age}
        </NTag>
      )
    },
  },
  {
    key: 'email',
    title: '邮箱',
  },
  {
    key: 'phone',
    title: '电话',
  },
  {
    key: 'address',
    title: '地址',
  },
  {
    key: 'company',
    title: '公司',
  },
  {
    key: 'registerDate',
    title: '注册日期',
  },
  {
    width: 140,
    key: 'actions',
    align: 'center',
    title: '操作',
    fixed: 'right',
    render: (row) => <CellActions {...row} />,
  },
]

function rowProps(row: UserInfo) {
  return {
    onContextmenu: (e: MouseEvent) => {
      e.preventDefault()
      showDropdown.value = false
      nextTick().then(() => {
        contextmenuId.value = row.number
        showDropdown.value = true
        dropdownOptions.x = e.clientX
        dropdownOptions.y = e.clientY
      })
    },
  }
}

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  itemCount: 0,
  showQuickJumper: true,
  showQuickJumpDropdown: true,
  onUpdatePage: (page: number) => {
    pagination.page = page
    getDataList()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    getDataList()
  },
})

const prevUserListTotal = ref(0)

const paginationPrefix: PaginationProps['prefix'] = (info) => {
  const { itemCount } = info
  return (
    itemCount && (
      <div>
        <span>总&nbsp;</span>
        <NNumberAnimation
          from={prevUserListTotal.value}
          to={itemCount}
          onFinish={() => {
            prevUserListTotal.value = itemCount
          }}
        />
        <span>&nbsp;条</span>
      </div>
    )
  )
}

const dropdownOptions = reactive<DropdownProps>({
  x: 0,
  y: 0,
  options: [
    {
      label: '编辑',
      key: 'edit',
    },
    {
      label: () => <span class='text-red-500'>删除</span>,
      key: 'delete',
    },
  ],
  onClickoutside: () => {
    showDropdown.value = false
  },
  onSelect: () => {
    message.info(`id: ${contextmenuId.value}`)
    showDropdown.value = false
  },
})

async function request(pageSize: number): Promise<{ data: UserInfo[]; total: number }> {
  return fetch(`https://lithe-admin-serverless.havenovelgod.com/api/faker?limit=${pageSize}`, {
    method: 'GET',
  }).then((res) => res.json())
}

function inputOnlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value)
}

function createOrEditData(data?: UserInfo) {
  const title = data ? '编辑数据' : '新增数据'

  const handleSubmitClick = () => {
    message.success('点击了提交')
    m.destroy()
  }

  function handleUpdateClick() {
    message.info('点击了更新')
    m.destroy()
  }

  function handleCancelClick() {
    m.destroy()
  }

  const m = modal.create({
    autoFocus: false,
    title,
    preset: 'card',
    draggable: true,
    style: {
      width: '500px',
      ...(isMaxMd.value ? { marginInline: '16px' } : {}),
    },
    content: () => (
      <ActionModal
        data={data || {}}
        onSubmit={handleSubmitClick}
        onUpdate={handleUpdateClick}
        onCancel={handleCancelClick}
      />
    ),
  })
}

const handleQueryClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      getDataList()
    }
  })
}

function handleDownloadCsvClick() {
  if (!dataTableRef.value) return
  dataTableRef.value.downloadCsv()
}

async function getDataList() {
  isRequestLoading.value = true
  const pageSize = pagination.pageSize || 10
  const res = await request(pageSize).finally(() => {
    isRequestLoading.value = false
  })

  dataList.value = res.data
  pagination.itemCount = 300
}

getDataList()
</script>
<template>
  <ScrollContainer
    wrapper-class="flex flex-col gap-y-2"
    :scrollable="isMaxLg"
  >
    <NAlert
      type="info"
      closable
    >
      一个数据表格的例子，不算复杂，也许对你有帮助
    </NAlert>
    <NCard
      :size="isMaxMd ? 'small' : undefined"
      class="flex-1"
      content-class="flex flex-col"
    >
      <div class="mb-2 flex justify-end gap-x-4 max-xl:mb-4 max-xl:flex-wrap">
        <NForm
          ref="formRef"
          :model="form"
          :rules="rules"
          :inline="!isMaxLg"
          label-placement="left"
          class="max-lg:w-full max-lg:flex-col"
          :label-width="isMaxLg ? 70 : undefined"
        >
          <NFormItem
            label="姓名"
            path="fullName"
          >
            <NInput
              v-model:value="form.fullName"
              clearable
            />
          </NFormItem>
          <NFormItem
            label="性别"
            path="sex"
          >
            <NSelect
              v-model:value="form.sex"
              :options="sexOptions"
              style="min-width: 88px"
              clearable
            />
          </NFormItem>
          <NFormItem
            label="联系方式"
            path="phone"
          >
            <NInput
              v-model:value="form.phone"
              clearable
              :allow-input="inputOnlyAllowNumber"
            />
          </NFormItem>
          <NFormItem
            label="公司"
            path="company"
          >
            <NInput
              v-model:value="form.company"
              clearable
            />
          </NFormItem>
        </NForm>
        <div class="flex gap-2">
          <NButton
            type="success"
            @click="createOrEditData()"
          >
            <template #icon>
              <span class="iconify ph--plus-circle" />
            </template>
            新增数据
          </NButton>
          <NButton
            type="info"
            @click="handleQueryClick"
            :loading="isRequestLoading"
            :disabled="isRequestLoading"
          >
            <template #icon>
              <span class="iconify ph--magnifying-glass" />
            </template>
            查询
          </NButton>
          <NButton
            type="warning"
            @click="resetForm"
          >
            <template #icon>
              <span class="iconify ph--arrow-clockwise" />
            </template>
            重置
          </NButton>
        </div>
      </div>
      <div class="flex flex-1 flex-col">
        <NDataTable
          class="flex-1"
          ref="dataTableRef"
          v-model:checked-row-keys="checkedRowKeys"
          :remote="true"
          :flex-height="!isMaxLg"
          :scroll-x="enableScrollX ? 1800 : 0"
          :columns="columns"
          :data="dataList"
          :row-key="(row) => row.id"
          :loading="isRequestLoading"
          :striped="enableStriped"
          :row-props="rowProps"
          :single-line="enableSingleLine"
        />
        <div class="mt-3 flex items-end justify-between max-xl:flex-col max-xl:gap-y-2">
          <div class="flex items-center justify-between gap-x-3">
            <span>已选择&nbsp;{{ checkedRowKeys.length }}&nbsp; 条</span>
            <NButtonGroup
              size="small"
              :ghost="true"
            >
              <NButton
                @click="enableStriped = !enableStriped"
                :type="enableStriped ? 'primary' : 'default'"
                secondary
              >
                条纹风格
              </NButton>
              <NButton
                @click="enableSingleLine = !enableSingleLine"
                :type="!enableSingleLine ? 'primary' : 'default'"
                secondary
              >
                单线风格
              </NButton>
              <NButton
                @click="enableScrollX = !enableScrollX"
                :type="enableScrollX ? 'primary' : 'default'"
                secondary
              >
                横向滚动
              </NButton>

              <NButton
                v-show="!isMaxMd"
                @click="enableContextmenu = !enableContextmenu"
                :type="enableContextmenu ? 'primary' : 'default'"
                secondary
              >
                右键菜单
              </NButton>
              <NButton
                v-show="!isMaxMd"
                @click="handleDownloadCsvClick"
                secondary
                type="info"
              >
                下载为Csv
              </NButton>
            </NButtonGroup>
          </div>
          <NPagination
            v-bind="pagination"
            :prefix="paginationPrefix"
            :page-slot="isMaxMd ? 5 : undefined"
            :show-quick-jump-dropdown="!isMaxMd"
            :show-quick-jumper="!isMaxMd"
            :show-size-picker="!isMaxMd"
          />
        </div>
      </div>
    </NCard>
    <NDropdown
      placement="bottom-start"
      trigger="manual"
      v-bind="dropdownOptions"
      :show="enableContextmenu && showDropdown"
    />
  </ScrollContainer>
</template>
