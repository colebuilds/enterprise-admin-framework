<template>
  <div class="account-table">
    <div class="account-table__header">
      <span class="account-table__col account-table__col--seq">{{
        t('system.sysUser.create.seq')
      }}</span>
      <span class="account-table__col account-table__col--field"
        >{{ t('system.sysUser.create.account') }}
        <span class="text-[#d03050]">*</span></span
      >
      <span class="account-table__col account-table__col--field"
        >{{ t('system.sysUser.create.name') }}
        <span class="text-[#d03050]">*</span></span
      >
      <span class="account-table__col account-table__col--pwd"
        >{{ t('system.sysUser.create.password') }}
        <span class="text-[#d03050]">*</span></span
      >
      <span class="account-table__col account-table__col--action">{{
        t('common.action')
      }}</span>
    </div>
    <div v-for="(row, idx) in rows" :key="idx" class="account-table__row">
      <span class="account-table__col account-table__col--seq">{{
        idx + 1
      }}</span>
      <div class="account-table__col account-table__col--field">
        <n-input
          v-model:value="row.userName"
          size="small"
          :placeholder="t('system.sysUser.create.accountPlaceholder')"
        />
      </div>
      <div class="account-table__col account-table__col--field">
        <n-input
          v-model:value="row.nickName"
          size="small"
          :maxlength="50"
          :placeholder="t('system.sysUser.create.namePlaceholder')"
        />
      </div>
      <div class="account-table__col account-table__col--pwd">
        <div class="flex items-center gap-1">
          <n-select
            v-model:value="row.pwdMode"
            :options="idx === 0 ? firstRowPwdModeOptions : pwdModeOptions"
            :disabled="idx === 0"
            size="small"
            style="flex-shrink: 0; width: 80px"
          />
          <n-input
            v-if="row.pwdMode === 'input'"
            v-model:value="row.password"
            size="small"
            type="password"
            show-password-on="click"
            :placeholder="t('system.sysUser.create.passwordPlaceholder')"
            style="flex: 1"
          />
          <span v-else class="text-[12px] text-gray-400">{{
            t('system.sysUser.create.sameAsAbove')
          }}</span>
        </div>
      </div>
      <div class="account-table__col account-table__col--action">
        <div class="flex items-center justify-center gap-2">
          <n-button
            text
            type="error"
            size="small"
            :disabled="rows.length <= 1"
            @click="handleRemove(idx)"
          >
            {{ t('common.delete') }}
          </n-button>
          <n-button
            v-if="idx === rows.length - 1"
            text
            type="primary"
            size="small"
            :disabled="rows.length >= MAX_USERS"
            @click="handleAdd"
          >
            + {{ t('common.add') }}
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';

export interface AccountRow {
  userName: string;
  nickName: string;
  password: string;
  pwdMode: 'input' | 'same';
}

const { t } = useI18n();
const message = useMessage();

// 单次批量创建上限：避免一次性提交过多账号触发后端限流或表单超大
const MAX_USERS = 50;

const pwdModeOptions = computed(() => [
  { label: t('system.sysUser.create.pwdInput'), value: 'input' },
  { label: t('system.sysUser.create.pwdSame'), value: 'same' },
]);
// 第一行没有"上一行"可复用，强制只能选"输入"
const firstRowPwdModeOptions = computed(() => [
  { label: t('system.sysUser.create.pwdInput'), value: 'input' },
]);

const rows = reactive<AccountRow[]>([
  { userName: '', nickName: '', password: '', pwdMode: 'input' },
]);

function handleAdd() {
  if (rows.length >= MAX_USERS) {
    message.warning(
      t('system.sysUser.create.maxUsersLimit', { max: MAX_USERS }),
    );
    return;
  }
  rows.push({ userName: '', nickName: '', password: '', pwdMode: 'same' });
}

function handleRemove(idx: number) {
  rows.splice(idx, 1);
  // 新首行必须是 input 模式：首行没有"上一行"可复用；原 same 行没有自己的密码，清空让用户重填
  if (rows.length > 0 && rows[0].pwdMode !== 'input') {
    rows[0].pwdMode = 'input';
    rows[0].password = '';
  }
}

/** 解析最终密码：同上模式向上查找最近的输入密码 */
function resolvePassword(idx: number): string {
  const row = rows[idx];
  if (row.pwdMode === 'input') return row.password?.trim() || '';
  for (let i = idx - 1; i >= 0; i--) {
    if (rows[i].pwdMode === 'input' && rows[i].password?.trim()) {
      return rows[i].password.trim();
    }
  }
  return '';
}

/** 获取所有账号数据（密码已解析） */
function getUsers(): Array<{
  userName: string;
  nickName: string;
  password: string;
}> {
  return rows.map((_, idx) => ({
    userName: rows[idx].userName?.trim() || '',
    nickName: rows[idx].nickName?.trim() || '',
    password: resolvePassword(idx),
  }));
}

/** 校验：所有行必须填完且格式正确 */
function validate(): boolean {
  const users = getUsers();
  const accountRegex = /^[a-zA-Z0-9_]+$/;
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    const row = i + 1;
    if (!u.userName) {
      message.warning(
        `${t('system.sysUser.create.seq')} ${row}：${t('system.sysUser.create.accountRequired')}`,
      );
      return false;
    }
    if (!accountRegex.test(u.userName)) {
      message.warning(
        `${t('system.sysUser.create.seq')} ${row}：${t('system.sysUser.create.accountFormatError')}`,
      );
      return false;
    }
    if (u.userName.length < 6 || u.userName.length > 20) {
      message.warning(
        `${t('system.sysUser.create.seq')} ${row}：${t('system.sysUser.create.accountLengthError')}`,
      );
      return false;
    }
    if (!u.nickName) {
      message.warning(
        `${t('system.sysUser.create.seq')} ${row}：${t('system.sysUser.create.nameRequired')}`,
      );
      return false;
    }
    if (!u.password) {
      message.warning(
        `${t('system.sysUser.create.seq')} ${row}：${t('system.sysUser.create.passwordRequired')}`,
      );
      return false;
    }
    if (u.password.length < 8) {
      message.warning(
        `${t('system.sysUser.create.seq')} ${row}：${t('system.sysUser.create.passwordLengthError')}`,
      );
      return false;
    }
  }
  // 账号不能重复（不区分大小写），提示具体冲突的行号与账号
  const seen = new Map<string, number>();
  for (let i = 0; i < users.length; i++) {
    const key = users[i].userName.toLowerCase();
    if (seen.has(key)) {
      message.warning(
        t('system.sysUser.create.accountDuplicate', {
          userName: users[i].userName,
          row: i + 1,
          dup: (seen.get(key) as number) + 1,
        }),
      );
      return false;
    }
    seen.set(key, i);
  }
  return true;
}

defineExpose({ getUsers, validate, rows });
</script>

<style lang="less" scoped>
.account-table {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.account-table__header,
.account-table__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
}

.account-table__header {
  background: #fafafc;
  font-size: 12px;
  font-weight: 600;
  color: #333639;
  border-bottom: 1px solid #e5e7eb;
}

.account-table__row {
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.account-table__col {
  &--seq {
    width: 40px;
    flex-shrink: 0;
    text-align: center;
  }

  &--field {
    flex: 1;
    min-width: 0;
  }

  &--pwd {
    flex: 1.5;
    min-width: 0;
  }

  &--action {
    width: 120px;
    flex-shrink: 0;
    text-align: center;
  }
}
</style>
