# ProComponents vs pro-naive-ui 对比分析

## 概述

本组件库已与 [pro-naive-ui](https://github.com/Zheng-Changfu/pro-naive-ui) 保持一致的设计理念。

| 特性 | ProComponents | pro-naive-ui |
| --- | --- | --- |
| 编写方式 | Vue SFC (.vue) | TSX (.tsx) |
| 类型系统 | 集中式 (`types/`) | 分散式 (每个组件目录下 `props.ts`, `slots.ts`) |
| Context 管理 | 集中式 (`context/`) | 分散式 (每个组件目录下 `context.ts`) |

## 组件覆盖

| 组件              | ProComponents | pro-naive-ui |
| ----------------- | :-----------: | :----------: |
| ProForm           |      ✅       |      ✅      |
| ProSearchForm     |      ✅       |      ✅      |
| ProDataTable      |      ✅       |      ✅      |
| ProEditDataTable  |      ✅       |      ✅      |
| ProField          |      ✅       |      ✅      |
| ProModalForm      |      ❌       |      ✅      |
| ProDrawerForm     |      ❌       |      ✅      |
| ProFormList       |      ❌       |      ✅      |
| ProCard           |      ❌       |      ✅      |
| ProConfigProvider |      ❌       |      ✅      |

---

## 设计原则

### 1. 表单控制器必需

```typescript
// 必须使用 createProForm 创建控制器
const form = createProForm({
  initialValues: { name: '', age: 0 }
})

// 传入组件
<ProForm :form="form">
  <ProField path="name" label="姓名" />
</ProForm>
```

### 2. 最小化 Props

组件只保留必要的 props，其余通过：

- 插槽 (slots) 自定义
- 控制器方法调用
- 原生组件属性透传

### 3. 事件驱动

不在组件内部处理业务逻辑（如数据请求），通过事件通知外部处理：

```typescript
// ProSearchForm
<ProSearchForm
  :form="searchForm"
  :columns="columns"
  @search="handleSearch"  // 外部处理搜索
  @reset="handleReset"    // 外部处理重置
/>
```

---

## ProForm

### Props

| 属性              | 类型                | 必需 | 说明         |
| ----------------- | ------------------- | :--: | ------------ |
| form              | CreateProFormReturn |  ✅  | 表单控制器   |
| loading           | boolean             |      | 加载状态     |
| validationTrigger | string \| string[]  |      | 验证触发时机 |
| readonly          | boolean             |      | 只读状态     |
| + NForm 原生属性  |                     |      | 透传         |

### 暴露方法

- `getFieldsValue()` - 获取表单值
- `setFieldsValue(values)` - 设置表单值
- `resetFields()` - 重置表单
- `validate()` - 验证表单
- `clearValidate()` - 清除验证

---

## ProSearchForm

### Props

| 属性 | 类型 | 必需 | 说明 |
| --- | --- | :-: | --- |
| form | CreateProSearchFormReturn | ✅ | 搜索表单控制器 |
| columns | ProSearchFormColumn[] |  | 列配置 |
| searchButtonProps | ButtonProps \| false |  | 搜索按钮 |
| resetButtonProps | ButtonProps \| false |  | 重置按钮 |
| collapseButtonProps | ButtonProps \| false |  | 折叠按钮 |
| showSuffixGridItem | boolean |  | 显示后缀区 |
| labelWidth | number \| string |  | 标签宽度 (默认 80) |
| labelPlacement | 'left' \| 'top' |  | 标签位置 (默认 'left') |
| xGap | number |  | 列间距 (默认 24) |
| cols | number \| string |  | 列数 (默认 '1 s:2 l:3') |
| responsive | 'self' \| 'screen' |  | 响应式模式 (默认 'screen') |
| collapsedRows | number |  | 折叠行数 (默认 1) |

### 事件

- `@search` - 搜索时触发
- `@reset` - 重置时触发
- `@collapse` - 折叠状态变化

---

## ProDataTable

### Props

| 属性                  | 类型               | 必需 | 说明             |
| --------------------- | ------------------ | :--: | ---------------- |
| columns               | ProColumn[]        |  ✅  | 列配置           |
| data                  | array              |      | 数据源           |
| loading               | boolean            |      | 加载状态         |
| title                 | string             |      | 标题             |
| tooltip               | string \| string[] |      | 标题提示         |
| tableCardProps        | object             |      | 卡片配置         |
| flexHeight            | boolean            |      | 弹性高度         |
| rowKey                | string \| function |      | 行键 (默认 'id') |
| dragSortOptions       | object             |      | 拖拽配置         |
| + NDataTable 原生属性 |                    |      | 透传             |

### 暴露方法 (同 NDataTable)

- `sort()` - 排序
- `page()` - 翻页
- `filter()` / `filters()` - 筛选
- `clearSorter()` - 清除排序
- `clearFilter()` / `clearFilters()` - 清除筛选
- `scrollTo()` - 滚动
- `downloadCsv()` - 导出 CSV

---

## 工厂函数

### createProForm

```typescript
const form = createProForm<FormValues>({
  initialValues: { name: '', age: 0 },
  onValuesChange: (changed, all) => {
    console.log('Changed:', changed);
  },
});
```

### createProSearchForm

```typescript
const searchForm = createProSearchForm({
  initialValues: { keyword: '' },
  onValuesChange: (changed, all) => {
    console.log('Changed:', changed);
  },
});

// 额外方法
searchForm.search(); // 执行搜索
searchForm.reset(); // 重置
searchForm.collapsed.value; // 折叠状态
searchForm.toggleCollapsed(); // 切换折叠
```

---

## ProCrudTable (项目封装)

基于纯净 ProComponents 封装的查询表格一体化组件，提供便捷的 CRUD 操作。

### Props

| 属性             | 类型                  | 必需 | 说明                   |
| ---------------- | --------------------- | :--: | ---------------------- |
| title            | string                |      | 标题                   |
| searchColumns    | ProSearchFormColumn[] |      | 搜索列配置             |
| columns          | ProColumn[]           |  ✅  | 表格列配置             |
| actionColumn     | CrudActionColumn      |      | 操作列配置             |
| request          | function              |  ✅  | 数据请求函数           |
| beforeRequest    | function              |      | 请求前处理             |
| afterRequest     | function              |      | 请求后处理             |
| rowKey           | string \| function    |      | 行键 (默认 'id')       |
| pagination       | object \| false       |      | 分页配置               |
| autoLoad         | boolean               |      | 自动加载 (默认 true)   |
| showSearch       | boolean               |      | 显示搜索 (默认 true)   |
| searchLabelWidth | number                |      | 搜索标签宽度 (默认 80) |
| searchCols       | string                |      | 搜索列数 (默认响应式)  |

### 暴露方法

- `reload(extraParams?)` - 重新加载 (保持当前页)
- `reset()` - 重置并加载 (回到第一页)
- `getDataSource()` - 获取数据
- `getSearchParams()` - 获取搜索参数
- `setSearchParams(params)` - 设置搜索参数
- `getSelectedRows()` - 获取选中行
- `getPagination()` - 获取分页信息

### 使用示例

```vue
<template>
  <ProCrudTable
    ref="tableRef"
    :title="t('system.whiteIp.title')"
    :search-columns="searchColumns"
    :columns="tableColumns"
    :action-column="actionColumn"
    :request="loadData"
  >
    <template #toolbar-left>
      <n-button type="primary" @click="handleAdd">
        <template #icon>
          <n-icon><PlusOutlined /></n-icon>
        </template>
        {{ t('common.add') }}
      </n-button>
    </template>
  </ProCrudTable>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ProCrudTable,
  type ProSearchFormColumn,
  type ProColumn,
  type CrudActionColumn,
} from '@/components/ProComponents';
import { TableAction } from '@/components/Table';
import { api } from '@/api';

const { t } = useI18n();
const tableRef = ref();

// 搜索列配置
const searchColumns: ProSearchFormColumn[] = [
  {
    path: 'ip',
    label: 'IP地址',
    valueType: 'text',
    componentProps: { placeholder: '请输入IP地址' },
  },
];

// 表格列配置
const tableColumns: ProColumn[] = [
  { key: 'id', title: 'ID', width: 100, align: 'center' },
  { key: 'ip', title: 'IP地址', align: 'center' },
  { key: 'remark', title: '备注', align: 'center' },
];

// 操作列配置
const actionColumn: CrudActionColumn = {
  width: 200,
  title: t('common.action'),
  render: (row) =>
    h(TableAction, {
      actions: [
        { label: t('common.edit'), onClick: () => handleEdit(row) },
        { label: t('common.delete'), onClick: () => handleDelete(row) },
      ],
    }),
};

// 加载数据
async function loadData(params) {
  const { data } = await api.system.getPageListWhiteIp(params);
  return data;
}

// 刷新表格 (回到第一页)
function reloadTable() {
  tableRef.value?.reset();
}

// 刷新表格 (保持当前页)
function refreshTable() {
  tableRef.value?.reload();
}
</script>
```

---

## 待实现

1. **ProModalForm** - 弹窗表单
2. **ProDrawerForm** - 抽屉表单
3. **ProFormList** - 动态表单列表
4. **ProConfigProvider** - 全局配置

---

## 使用示例

```vue
<template>
  <ProSearchForm
    :form="searchForm"
    :columns="searchColumns"
    @search="handleSearch"
    @reset="handleReset"
  />

  <ProDataTable :columns="tableColumns" :data="tableData" :loading="loading" />
</template>

<script setup>
import { ref } from 'vue'
import {
  ProSearchForm,
  ProDataTable,
  createProSearchForm,
  type ProSearchFormColumn,
  type ProColumn
} from '@/components/ProComponents'

// 创建搜索表单控制器
const searchForm = createProSearchForm({
  initialValues: { keyword: '' }
})

// 搜索列配置
const searchColumns: ProSearchFormColumn[] = [
  { path: 'keyword', label: '关键词', valueType: 'text' }
]

// 表格列配置
const tableColumns: ProColumn[] = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: '名称' }
]

// 数据
const tableData = ref([])
const loading = ref(false)

// 处理搜索
async function handleSearch(values) {
  loading.value = true
  try {
    tableData.value = await fetchData(values)
  } finally {
    loading.value = false
  }
}

// 处理重置
function handleReset() {
  handleSearch({})
}
</script>
```
