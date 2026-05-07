/* oxlint-disable */
const DB_NAME = 'ProTableSettingsDB';
const DB_VERSION = 1;
const STORE_NAME = 'columnSettings';

export interface ColumnSettingItem {
  /** 列标识 */
  key: string;
  /** 是否显示 */
  visible: boolean;
  /** 排序序号 */
  order: number;
  /** 用户调整后的列宽 */
  width?: number;
  /** 用户设置的固定悬浮 */
  fixed?: 'left' | 'right' | false;
}

export interface ColumnSettingRecord {
  /** 主键: ${userId}_${tableId} */
  id: string;
  /** 列配置列表 */
  columns: ColumnSettingItem[];
  /** 更新时间 */
  updatedAt: number;
}

let dbInstance: IDBDatabase | null = null;

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('ProTableSettingsDB 打开失败:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveColumnSetting(
  id: string,
  columns: ColumnSettingItem[],
): Promise<void> {
  const record: ColumnSettingRecord = {
    id,
    columns: columns.map(({ key, visible, order, width, fixed }) => {
      const item: ColumnSettingItem = { key, visible, order };
      if (width !== undefined) item.width = width;
      if (fixed !== undefined) item.fixed = fixed;
      return item;
    }),
    updatedAt: Date.now(),
  };
  await withStore('readwrite', (store) => store.put(record));
}

export async function getColumnSetting(
  id: string,
): Promise<ColumnSettingItem[] | null> {
  const result = await withStore<ColumnSettingRecord | undefined>(
    'readonly',
    (store) => store.get(id),
  );
  return result?.columns ?? null;
}
