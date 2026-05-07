<!-- oxlint-disable -->
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';

import type {
  CascadeLoader,
  CascadeSource,
  CascadeTreeNode,
  CascadeValue,
} from './ProCascadeSelect.types';

import { computed, onMounted, ref, watch } from 'vue';

import { NSelect } from 'naive-ui';

import { useProFormContextSafe } from '../../context';

defineOptions({
  name: 'ProCascadeSelect',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /** tree-mode 专用：父节点的子数组字段名 */
    childrenField?: string;
    /** 是否可清空 */
    clearable?: boolean;
    /** 是否可搜索 */
    filterable?: boolean;
    keyField?: string;
    /** 字段名：和 naive-ui 一致，tree-mode / loader-mode 共用 */
    labelField?: string;
    /** 配合 `source` 使用的级数（2 或 3）；使用 `loaders` 时忽略 */
    levels?: number;
    /**
     * 方式 A：每级一个异步加载器，数组长度 = 级数。
     * 适合每级都要单独请求后端的场景。
     */
    loaders?: CascadeLoader[];
    /**
     * 把每级的值直接展平写回 form model 对应字段。数组顺序 = 级别顺序。
     * 例：`['type', 'fundType']` → level 0 → form.type，level 1 → form.fundType。
     * 设置后：组件初始化时从这些字段读初值，选择变化时把各级值写回对应字段；
     * 组件自身 v-model（一个数组）仍会同步输出，方便不走 form 的直连场景。
     * 仅在 ProField 包裹下生效（需要 form context）。
     */
    modelKeys?: string[];
    /** 每级占位文字 */
    placeholders?: string[];
    /** naive-ui NSelect size */
    size?: 'large' | 'medium' | 'small' | 'tiny';
    /**
     * 方式 B：一次性给整棵树（同步 / 异步）。内部按 `childrenField`
     * 逐级拿子项，不需要再写 loaders。用这条路必须配 `levels`。
     */
    source?: CascadeSource;
    /** 垂直排列（默认横向 flex） */
    vertical?: boolean;
  }>(),
  {
    loaders: undefined,
    source: undefined,
    levels: undefined,
    modelKeys: undefined,
    placeholders: () => [],
    labelField: 'label',
    keyField: 'value',
    childrenField: 'children',
    size: 'small',
    clearable: true,
    filterable: true,
    vertical: false,
  },
);

/**
 * v-model 绑定的是逐级值数组 `CascadeValue[]`，长度等于 loaders.length。
 * 用数组而不是用分隔符字符串是因为后端字段通常需要单独使用某一级的值，
 * 而不是整段字符串；数组形式也让 `transformIn/Out` 更好处理。
 */
const modelValue = defineModel<CascadeValue[] | null>({ default: null });

// 走 ProField 包装时能拿到 form context；直接 v-model 使用时为 null
const formContext = useProFormContextSafe();

/** 是否启用 modelKeys 展平模式：必须 modelKeys 有值 + 有 form context */
const useModelKeys = computed(
  () =>
    Array.isArray(props.modelKeys) &&
    props.modelKeys.length > 0 &&
    !!formContext,
);

function readFromModelKeys(): CascadeValue[] {
  if (!useModelKeys.value) return [];
  const keys = props.modelKeys!;
  return keys.map((key) => {
    const v = formContext!.getFieldValue(key);
    return v === undefined || v === '' ? null : (v as CascadeValue);
  });
}

function writeToModelKeys() {
  if (!useModelKeys.value) return;
  const keys = props.modelKeys!;
  keys.forEach((key, idx) => {
    formContext!.setFieldValue(key, values.value[idx] ?? null);
  });
}

/**
 * 把 source 包成 computed：数组直接用，函数每次重新调用。
 * getter 函数内部读到的响应式数据（pinia 字典 / ref / computed）都会被 computed
 * 自动追踪，字典加载完 / 被 patch 时 `treeSnapshot` 失效 → 触发下面的 watch 重载。
 */
const treeSnapshot = computed<CascadeTreeNode[]>(() => {
  const src = props.source;
  if (!src) return [];
  if (Array.isArray(src)) return src;
  const result = src();
  return Array.isArray(result) ? result : [];
});

/** source 模式自动生成的 loaders：每级从 treeSnapshot 的相应层取子项 */
const treeLoaders = computed<CascadeLoader[]>(() => {
  if (!props.source || !props.levels) return [];
  const levels = Math.max(1, props.levels);
  const keyField = props.keyField;
  const childrenField = props.childrenField;
  return Array.from({ length: levels }, (_, level) => async (ctx) => {
    let items: CascadeTreeNode[] = treeSnapshot.value;
    for (let i = 0; i < level; i++) {
      const parentVal = ctx.values[i];
      if (parentVal === null || parentVal === undefined) return [];
      const match = items.find(
        (item) => String(item[keyField]) === String(parentVal),
      );
      const next = match
        ? (match[childrenField] as CascadeTreeNode[] | undefined)
        : undefined;
      items = Array.isArray(next) ? next : [];
    }
    return items as SelectOption[];
  });
});

// tree-mode 下 source 变化（例如字典异步加载完）自动重载当前已展开的级别
watch(treeSnapshot, () => {
  if (!props.source || props.loaders) return;
  void reloadFrom(0);
});

/** 实际生效的 loaders：优先用户传的 `loaders`，否则走 source 推导 */
const effectiveLoaders = computed<CascadeLoader[]>(
  () => props.loaders ?? treeLoaders.value,
);

const levelCount = computed(() => effectiveLoaders.value.length);
const values = ref<CascadeValue[]>(createBlankValues(levelCount.value));
const levelOptions = ref<SelectOption[][]>(
  createBlankOptionList(levelCount.value),
);
const levelLoadings = ref<boolean[]>(createBlankLoadings(levelCount.value));

/**
 * 每级独立的请求序号：同一级发出多次加载时，只有最后一次返回写入 state，
 * 避免旧请求 late-return 覆盖新结果（切父级再切回会触发）。
 */
const loaderSeqs = ref<number[]>(
  createBlankLoadings(levelCount.value).map(() => 0),
);

function createBlankValues(count: number): CascadeValue[] {
  return Array.from({ length: count }, () => null);
}
function createBlankOptionList(count: number): SelectOption[][] {
  return Array.from({ length: count }, () => [] as SelectOption[]);
}
function createBlankLoadings(count: number): boolean[] {
  return Array.from({ length: count }, () => false);
}

function resolvePlaceholder(level: number): string {
  return props.placeholders[level] ?? '';
}

/** 子级禁用条件：level > 0 且父级未选 */
function resolveDisabled(level: number): boolean {
  if (level === 0) return false;
  return (
    values.value[level - 1] === null || values.value[level - 1] === undefined
  );
}

async function loadLevel(level: number) {
  if (level >= levelCount.value) return;
  const parentValue = level === 0 ? null : (values.value[level - 1] ?? null);
  if (level > 0 && parentValue === null) {
    // 父级未选，直接清空当前级选项，不发请求
    levelOptions.value[level] = [];
    return;
  }

  const loader = effectiveLoaders.value[level];
  if (!loader) return;
  const seq = ++loaderSeqs.value[level];
  levelLoadings.value[level] = true;
  try {
    const opts = await loader({
      level,
      parentValue,
      values: [...values.value],
    });
    // 竞态保护：如果在请求期间父级又变了，直接丢弃本次结果
    if (seq !== loaderSeqs.value[level]) return;
    levelOptions.value[level] = Array.isArray(opts) ? opts : [];
  } catch (error) {
    if (seq !== loaderSeqs.value[level]) return;
    console.error('[ProCascadeSelect] loader error', { level, error });
    levelOptions.value[level] = [];
  } finally {
    if (seq === loaderSeqs.value[level]) {
      levelLoadings.value[level] = false;
    }
  }
}

/**
 * 用户切换某一级：写入当前级，清掉所有子级的值和选项，然后触发子级加载。
 * 为什么清子级 options：避免残留旧父级的选项在 UI 上闪现，语义更干净。
 */
function handleLevelChange(level: number, val: CascadeValue) {
  values.value[level] = val ?? null;
  for (let i = level + 1; i < levelCount.value; i++) {
    values.value[i] = null;
    levelOptions.value[i] = [];
    loaderSeqs.value[i]++; // 失效正在飞的下级请求
  }
  emitModel();
  if (val !== null && val !== undefined && level + 1 < levelCount.value) {
    void loadLevel(level + 1);
  }
}

function emitModel() {
  if (useModelKeys.value) {
    // modelKeys 模式：只写展平字段，不再同步自己的数组 v-model。
    // 目的是让 form state 里就不存在"operationType 聚合数组"，外层业务拿 getSearchParams
    // 的时候直接 spread 就是接口字段，不用再 destructure 掉脏字段
    writeToModelKeys();
    return;
  }
  modelValue.value = [...values.value];
}

// ─── 初始化 ─────────────────────────────────────────────
// 挂载时先拉第 0 级；初值优先从 modelKeys 对应的 form 字段读（展平模式），
// 否则从组件自身 v-model 数组读；然后逐级 apply + 拉下一级
onMounted(async () => {
  await loadLevel(0);
  const initial = useModelKeys.value
    ? readFromModelKeys()
    : (Array.isArray(modelValue.value)
      ? modelValue.value
      : []);
  for (let i = 0; i < levelCount.value; i++) {
    const v = initial[i] ?? null;
    if (v === null) break;
    values.value[i] = v;
    if (i + 1 < levelCount.value) {
      await loadLevel(i + 1);
    }
  }
});

// ─── 外部值变化同步 ──────────────────────────────────────
// 场景：父组件通过 reset / setFieldValue 改了整段值，组件要重新 apply + reload
//
// 两种模式都要监听，但订阅源不同：
// - 非 modelKeys 模式：看自己的数组 v-model
// - modelKeys 模式：看 form 里每个 key 的值（reset 时 form 会把这些 key 清成 undefined/null）
const externalSnapshot = computed<CascadeValue[] | null>(() => {
  if (useModelKeys.value) return readFromModelKeys();
  return Array.isArray(modelValue.value) ? modelValue.value : null;
});

watch(
  externalSnapshot,
  (next) => {
    if (!next) return;
    let firstDiff = -1;
    for (let i = 0; i < levelCount.value; i++) {
      const extV = next[i] ?? null;
      if (extV !== values.value[i]) {
        firstDiff = i;
        break;
      }
    }
    if (firstDiff === -1) return;

    for (let i = 0; i < levelCount.value; i++) {
      values.value[i] = next[i] ?? null;
    }
    void reloadFrom(firstDiff);
  },
  { deep: true },
);

async function reloadFrom(level: number) {
  for (let i = level; i < levelCount.value; i++) {
    if (i === 0 || values.value[i - 1] !== null) {
      await loadLevel(i);
    } else {
      levelOptions.value[i] = [];
    }
  }
}

// ─── loaders 数量变化时重置 state（外部动态传 loaders 场景）───────
watch(levelCount, (count, prev) => {
  if (count === prev) return;
  values.value = createBlankValues(count);
  levelOptions.value = createBlankOptionList(count);
  levelLoadings.value = createBlankLoadings(count);
  loaderSeqs.value = createBlankLoadings(count).map(() => 0);
  void loadLevel(0);
});

defineExpose({
  reload: () => reloadFrom(0),
  reset: () => {
    values.value = createBlankValues(levelCount.value);
    levelOptions.value[0] = levelOptions.value[0]; // keep root options
    for (let i = 1; i < levelCount.value; i++) {
      levelOptions.value[i] = [];
    }
    emitModel();
  },
});
</script>

<template>
  <div
    class="pro-cascade-select"
    :class="{ 'pro-cascade-select--vertical': vertical }"
  >
    <NSelect
      v-for="(_, idx) in effectiveLoaders"
      :key="idx"
      :value="values[idx] ?? null"
      :options="levelOptions[idx]"
      :loading="levelLoadings[idx]"
      :placeholder="resolvePlaceholder(idx)"
      :disabled="resolveDisabled(idx)"
      :clearable="clearable"
      :filterable="filterable"
      :size="size"
      :label-field="labelField"
      :value-field="keyField"
      class="pro-cascade-select__item"
      @update:value="handleLevelChange(idx, $event)"
    />
  </div>
</template>

<style lang="less">
.pro-cascade-select {
  display: flex;
  flex-direction: row;
  width: 100%;

  &--vertical {
    flex-direction: column;
  }
}

.pro-cascade-select__item {
  flex: 1 1 0;
  // 保底宽度：避免外部容器被极度压缩时，两个下拉的 placeholder / 选中值被截成单字
  min-width: 120px;

  // 合并中间双线：从第二项开始用 -1px margin 把边框和前一项叠在同一像素上
  &:not(:first-child) {
    margin-left: -1px;
  }

  // hover / focus 状态下，高亮边框要浮到相邻灰色边框之上，否则会被遮住半边
  &:hover,
  &:focus-within {
    position: relative;
    z-index: 1;
  }

  &:first-child .n-base-selection {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:last-child .n-base-selection {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
