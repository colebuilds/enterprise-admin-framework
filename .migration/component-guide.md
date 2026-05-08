# 组件使用规范

> 迁移时每写一个页面都参考此表，不拍脑袋决策。

## 选择优先级

```
1. vben 内置组件（@vben/common-ui、@vben-core/xxx）
2. ProComponents（#/components/pro/）— 老页面直接用，新页面不推荐
3. naive-ui 原生组件（NButton、NInput 等）
4. 自建组件（#/components/xxx）— 必须遵循主题变量
```

## 场景对照表

| 场景 | 推荐组件 | 备注 |
| --- | --- | --- |
| 搜索表单 + 数据表格 | `ProCrudTable`（搬入版） | 老页面直接用；新页面可用 vxe-table |
| 新数据表格（新页面） | `useVbenVxeGrid` | vben + vxe-table 方案 |
| 表单 | `useVbenForm` | vben 封装，支持 schema 配置 |
| 弹窗 | `VbenModal` / `NModal` | 复杂内容用 VbenModal，简单确认用 NModal |
| 抽屉 | `VbenDrawer` |  |
| 数字滚动 | `CountTo` | `@vben/common-ui` |
| 图片裁剪 | `Cropper` | `@vben/common-ui` |
| 字典下拉 | `DictSelect`（搬入版） | #/components/dict-select/ |
| 权限控制 | `v-permission="[...]"` | 指令名不变，44处用法不改 |
| 图标 | `@vben/icons` | 不直接引 @vicons/antd |
| 富文本 | `Tiptap`（搬入版） | #/components/tiptap/ |
| 代码编辑器 | `CodeEditor`（搬入版） | #/components/code-editor/ |
| 图表 | echarts + `Chart`（搬入版） | #/components/chart/ |

## 主题变量规范

```css
/* ✅ 使用 CSS 变量 */
color: var(--primary-color);
background: var(--card-color);
border: 1px solid var(--border-color);

/* ❌ 禁止硬编码颜色 */
color: #1890ff;
background: #ffffff;
```

## 禁止事项

- 禁止引入 element-plus、ant-design-vue 等额外 UI 库
- 禁止修改 packages/ 下 vben 核心包
- 禁止在组件里直接 import axios（只能用 requestClient）
- 禁止用 Less 变量硬编码颜色（改用 naive-ui CSS 变量或 Tailwind）
