// TODO: Phase 1.3 — full implementation with auth actions, dict loading, merchant list
import { defineStore } from 'pinia';

export const useAppUserStore = defineStore('app-user', {
  state: () => ({
    userInfo: null as any,
    dictionary: null as any,
    groupData: null as any,
    platformDic: null as any,
    v1Dictionary: null as any,
    merchantList: [] as any[],
  }),
  getters: {
    getUserInfo: (state) => state.userInfo,
    getDictionaryList: (state) => state.dictionary,
    getGropuData: (state) => state.groupData,
    getPlatformDic: (state) => state.platformDic,
    getV1Dictionary: (state) => state.v1Dictionary,
  },
  actions: {
    setUserInfo(info: any) {
      this.userInfo = info;
    },
    clearUserInfo() {
      this.userInfo = null;
      this.dictionary = null;
    },
  },
});
