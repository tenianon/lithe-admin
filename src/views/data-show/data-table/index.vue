<script setup lang="tsx">
import { useMutation, useQuery } from '@pinia/colada'
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
  NAlert,
} from 'naive-ui'
import { defineComponent, reactive, ref, useTemplateRef, nextTick, watch, computed } from 'vue'

import { getDataTable, deleteDataTable, deleteDataTableChildren, updateDataTable } from '@/api'
import { ScrollContainer } from '@/components'
import { useInjection, useComponentModifier, useResettableReactive } from '@/composables'
import { mediaQueryInjectionKey } from '@/injection'
import { toRefsUserStore } from '@/stores/user'

import ActionModal from './ActionModal.vue'

import type { DataTable, DataTableQuery } from '@/api'
import type { DataTableColumns, PaginationProps, FormRules, DropdownProps } from 'naive-ui'
import type { PropType } from 'vue'

defineOptions({
  name: 'DataTable',
})

const { isMaxMd, isMaxLg } = useInjection(mediaQueryInjectionKey)

const { token } = toRefsUserStore()

const formRef = useTemplateRef<InstanceType<typeof NForm>>('formRef')

const dataTableRef = useTemplateRef<InstanceType<typeof NDataTable>>('dataTableRef')

const message = useMessage()

const modal = useModal()

const { getPopconfirmModifier } = useComponentModifier()

const [form, , resetForm] = useResettableReactive<DataTableQuery>({
  fullName: '',
  sex: null,
  phone: '',
  company: '',
})

const rules: FormRules = {}

const sexOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
]

const enableStriped = ref(false)
const enableScrollX = ref(true)
const enableSingleLine = ref(true)
const enableContextmenu = ref(true)
const showDropdown = ref(false)
const contextmenuId = ref<number | string | null>(null)

const dataList = ref<DataTable[]>([])

const checkedRowKeys = ref<Array<number | string>>([])

const mergedLoading = computed(() => {
  return (
    deleteDataTableLoading.value ||
    deleteDataTableChildrenLoading.value ||
    getDataTableLoading.value ||
    updateDataTableLoading.value
  )
})

const CellActions = (row: DataTable) => (
  <div class='flex justify-end gap-2'>
    {!row.parentId && (
      <NButton
        secondary
        type='primary'
        size='small'
        onClick={() => createOrEditData('update', row.id)}
      >
        编辑
      </NButton>
    )}
    <NPopconfirm
      {...getPopconfirmModifier()}
      positiveText='确定'
      negativeText='取消'
      onPositiveClick={() => {
        if (row.parentId) {
          mutateDeleteDataTableChildren(row.id)
        } else {
          mutateDeleteDataTable(row.id)
        }
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
        message.error('不能为空')
        inputValue.value = props.value
      } else if (inputValue.value !== props.value) {
        props.onUpdateValue?.(inputValue.value)
      }
      isEdit.value = false
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

const PaginationPrefix: PaginationProps['prefix'] = (info) => {
  const { itemCount } = info
  return (
    itemCount && (
      <div>
        <span>总数&nbsp;</span>
        {itemCount}
        <span>&nbsp;条</span>
      </div>
    )
  )
}

const baseColumns: DataTableColumns<DataTable> = [
  {
    type: 'selection',
    options: ['all', 'none'],
  },
  {
    key: 'id',
    title: 'ID',
    titleAlign: 'center',
    render: (row) => <span>{row.rowKey || row.id}</span>,
    width: 140,
  },
  {
    key: 'number',
    title: '编号',
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
    render: (row) => (
      <ShowOrEdit
        value={row.fullName}
        onUpdateValue={(value) => {
          mutateUpdateDataTable({ ...row, fullName: value })
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
]

const columns = computed<DataTableColumns<DataTable>>(() => {
  if (token.value === 'admin') {
    return [
      ...baseColumns,
      {
        width: 140,
        key: 'actions',
        align: 'center',
        title: '操作',
        fixed: 'right',
        render: (row) => <CellActions {...row} />,
      },
    ]
  }
  return baseColumns
})

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  itemCount: 0,
  showQuickJumper: true,
  showQuickJumpDropdown: true,
  onUpdatePage: (page) => {
    pagination.page = page
    refetch()
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    refetch()
  },
})

const dropdownOptions = reactive<DropdownProps>({
  x: 0,
  y: 0,
  options: [
    {
      label: '编辑',
      key: 'edit',
    },
    {
      label: () => <span class='text-rose-500'>删除</span>,
      key: 'delete',
    },
  ],
  onClickoutside: () => {
    showDropdown.value = false
  },
  onSelect: (v) => {
    switch (v) {
      case 'edit':
        if (contextmenuId.value) {
          createOrEditData('update', contextmenuId.value as number)
        }
        break
      case 'delete':
        if (contextmenuId.value) {
          mutateDeleteDataTable(contextmenuId.value as number)
        }
        break
    }

    showDropdown.value = false
  },
})

const {
  data,
  isLoading: getDataTableLoading,
  refetch,
} = useQuery({
  key: () => ['dataTable', pagination.page ?? 1, pagination.pageSize ?? 10],
  query: () =>
    getDataTable({
      page: pagination.page ?? 1,
      pageSize: pagination.pageSize ?? 10,
      query: form,
    }),
  staleTime: 0,
})

const { isLoading: deleteDataTableLoading, mutate: mutateDeleteDataTable } = useMutation({
  mutation: deleteDataTable,
  onSuccess: () => refetch(),
})

const { isLoading: deleteDataTableChildrenLoading, mutate: mutateDeleteDataTableChildren } =
  useMutation({
    mutation: deleteDataTableChildren,
    onSuccess: () => refetch(),
  })

const { isLoading: updateDataTableLoading, mutate: mutateUpdateDataTable } = useMutation({
  mutation: updateDataTable,
  onSuccess: () => refetch(),
})

const handleQueryClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      pagination.page = 1
      refetch()
    }
  })
}

function rowProps(row: DataTable) {
  return {
    onContextmenu: (e: MouseEvent) => {
      e.preventDefault()
      showDropdown.value = false
      nextTick().then(() => {
        contextmenuId.value = row.id
        showDropdown.value = true
        dropdownOptions.x = e.clientX
        dropdownOptions.y = e.clientY
      })
    },
  }
}

function createOrEditData(action: 'create' | 'update', id?: number) {
  const title = action === 'create' ? '新增数据' : '编辑数据'

  function onSubmit() {
    pagination.page = 1
    refetch()
    m.destroy()
  }

  function onUpdate() {
    pagination.page = 1
    refetch()
    m.destroy()
  }

  function onCancel() {
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
        id={id}
        action={action}
        onSubmit={onSubmit}
        onUpdate={onUpdate}
        onCancel={onCancel}
      />
    ),
  })
}

const handleDownloadCsvClick = () => {
  if (!dataTableRef.value) return
  dataTableRef.value.downloadCsv()
}

function inputOnlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value)
}

watch(data, (newData) => {
  if (newData) {
    dataList.value = newData.data.list
    pagination.itemCount = newData.data.total
  }
})
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
            label="电话"
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
            @click="createOrEditData('create')"
          >
            <template #icon>
              <span class="iconify ph--plus-circle" />
            </template>
            新增数据
          </NButton>
          <NButton
            type="info"
            @click="handleQueryClick"
            :loading="getDataTableLoading"
            :disabled="getDataTableLoading"
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
          children-key="children"
          :data="dataList"
          :row-key="(row) => row.rowKey || row.id"
          :loading="mergedLoading"
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
            :prefix="PaginationPrefix"
            :page-slot="isMaxMd ? 5 : undefined"
            :show-quick-jump-dropdown="!isMaxMd"
            :show-quick-jumper="!isMaxMd"
            :show-size-picker="!isMaxMd"
            :disabled="mergedLoading"
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
