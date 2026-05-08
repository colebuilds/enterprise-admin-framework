---
title: 字典 Slash Commands 速查手册
type: guide
status: stable
created: 2026-05-08
scope: apps/web-ar-admin
applies_to: human, ai-agent
---

# 字典 Slash Commands 速查手册

## 两个命令

| 命令 | 用途 | 类比 |
| --- | --- | --- |
| `/dict <关键词>` | 查 key、查 source、查字段映射 | 字典版 grep |
| `/dict-sync` | 全量同步（重跑脚本 + 更新代码 + 更新文档） | 字典版 gen:api |

---

## /dict — 查字典 key

### 使用场景

- 不知道某个业务数据对应哪个字典 key
- 忘了 key 属于哪个 source（是不是歧义 key）
- 想确认 dynamic key 的 label/value 字段名

### 用法

```
/dict 商户
/dict 提现大类
/dict withdrawCategory
/dict enableState
```

### 输出示例

```
搜索"商户"，匹配到 3 个 key：

key: tenantList
source: dynamic（自动推断）
用法: useDictOptions('tenantList')
字段: label=tenantName, value=tenantId
含义: 商户列表，平台侧商户选择器

key: tenantStateList
source: common（自动推断）
用法: useDictOptions('tenantStateList')
含义: 商户状态

key: tenantPayChannelList
source: dynamic（自动推断）
用法: useDictOptions('tenantPayChannelList')
字段: label=customName, value=tenantChannelId
含义: 商户支付通道
```

### 输出"歧义 key"时

```
key: countryList
⚠️ 歧义 key，存在于多个 source（common / platform），必须指定 source：

useDictOptions('countryList', 'platform')  // 平台基础数据（国家代码）
useDictOptions('countryList', 'common')    // 后台自定义国家
```

---

## /dict-sync — 全量同步

### 使用场景

- 后端新增了字典 key（不知道加了什么，全量跑一遍）
- 后端修改了某个字典的字段名
- 运行时 `useDictOptions` 返回空数组，怀疑 registry 不是最新的

### 前置条件

- 已登录 SIT（脚本需要调接口）
- 本地 `.env.sit` 配置正确

### 执行步骤（命令自动完成）

1. 运行 `dict-snapshot.ts` 脚本 → 更新 `registry.ts` + `dict-snapshot.json`
2. 检测新增 dynamic key → 更新 `ALL_DYNAMIC_KEYS`
3. 根据 `dict-snapshot.json` 的 `samples` → 更新 `DYNAMIC_FIELDS`
4. 更新 `spec-dict-keys.md`
5. 输出变更摘要

### ⚠️ 注意

- `registry.ts` 是生成产物，`/dict-sync` 后禁止手改
- 新增 dynamic key 时，DYNAMIC_FIELDS 字段名以 `dict-snapshot.json` 的 `samples` 为准，**不要参考 gen-api 生成的 TS 类型**（gen-api 把 DynamicDictionaryKeyEnum 错误生成为中文字面量）

---

## 命令实现文件

- `/dict` 实现：`.claude/commands/dict.md`
- `/dict-sync` 实现：`.claude/commands/dict-sync.md`

---

## 常见问题

**Q: `useDictOptions('xxx')` 返回空数组，但数据库有数据**

1. 先 `/dict xxx` 确认 key 是否在 registry 中
2. 如果不在 → 运行 `/dict-sync` 重跑脚本
3. 如果在但还是空 → 检查 dynamic key 是否在 `ALL_DYNAMIC_KEYS` 中

**Q: 不知道该用哪个 key**

运行 `/dict <业务关键词>`，用中文或英文均可。

**Q: 新增了一个 dynamic key，要做哪些事**

直接运行 `/dict-sync`，命令会自动检测并引导完成所有步骤。
