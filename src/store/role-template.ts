/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-05-02 22:09:36
 * @LastEditTime: 2023-06-24 20:44:24
 */
import { RoleInfo } from '@/types/role-template';
import { defineStore } from 'pinia';

export const useRoleTemplateStore = defineStore({
  id: 'roleTemplate', // id必填，且需要唯一
  state: () => {
    return {
      myTemplateMap: new Map<string, RoleInfo>()
    };
  },
  actions: {
    addMyTemplate(role: RoleInfo) {
      this.myTemplateMap.set(role.id, role);
    },
    removeMyTemplate(id: string) {
      this.myTemplateMap.delete(id);
    },
    getMyTemplateList() {
      const roleList:RoleInfo[] = []
      if (this.myTemplateMap.size > 0) {
        this.myTemplateMap.forEach((value) => {
          roleList.push(value)
        })
      }
      return roleList
    }
  },
  persist: {
    paths: ['myTemplateMap']
  }
});
