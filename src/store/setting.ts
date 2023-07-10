/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-07-01 17:13:00
 * @LastEditTime: 2023-07-01 23:59:52
 */
import { Setting } from '@/types/setting'
import { defineStore } from 'pinia';

export const useSettingStore = defineStore({
  id: 'setting', // id必填，且需要唯一
  state: () => {
    return {
      setting: {} as Setting
    };
  },
  actions: {
    updateSetting(setting: Setting) {
      this.setting = setting
    },
    getSetting() {
      return this.setting
    },
    getSettingWithCors() {
      const headers = this.setting as Record<string, string>;
      headers['Content-Type'] = 'application/json';
      headers['Sec-Fetch-Mode'] = 'cors';
      headers['Sec-Fetch-Dest'] = 'empty';
      headers['Sec-Fetch-Site'] = 'same-site';
      return headers;
    }
  },
  persist: {
    paths: ['setting']
  }
});
