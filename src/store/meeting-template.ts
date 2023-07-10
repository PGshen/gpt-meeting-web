/*
 * @Descripttion: 会议相关操作
 * @version: 
 * @Date: 2023-05-09 13:15:35
 * @LastEditTime: 2023-07-09 21:15:25
 */
import { MeetingTemplate, TemplateNodeInfo } from '@/types/meeting-template';
import { defineStore } from 'pinia';


export const useMeetingTemplateStore = defineStore({
  id: 'meetingTemplate',
  state: () => {
    return {
      templateNodeMap: new Map<string, TemplateNodeInfo>(),     // 节点信息
      selectedNodeId: '',       // 当前选中的节点ID
      myTemplateMap: new Map<string, MeetingTemplate>() // 收藏的模版
    };
  },
  actions: {
    addNode(id: string, nodeInfo: TemplateNodeInfo): void {
      this.templateNodeMap.set(id, nodeInfo);
    },
    removeNode(id: string): void {
      this.templateNodeMap.delete(id);
    },
    getCurrentNode(): TemplateNodeInfo | undefined {
      return this.templateNodeMap.get(this.selectedNodeId);
    },
    setSelectedNodeId(nodeId: string) {
      this.selectedNodeId = nodeId;
    },
    unsetSelectedNodeId() {
      this.selectedNodeId = '';
    },
    resetTemplate() {   // 重置模版
      this.templateNodeMap.clear();
      this.selectedNodeId = '';
    },
    restoreTemplate(template: MeetingTemplate) { // 恢复模版数据
      const templateData = JSON.parse(template.templateData);
      const keys = Object.keys(templateData);
      keys.forEach(key => {
        const jsonNode = templateData[key];
        const nodeInfo: TemplateNodeInfo = {
          id: jsonNode['id'],
          nodeType: jsonNode['nodeType'],
          nodeName: jsonNode['nodeName'],
          characters: jsonNode['characters'],
          associationCharacters: jsonNode['associationCharacters'],
          quizCharacters: jsonNode['quizCharacters'],
          optimizationPrompt: jsonNode['optimizationPrompt'],
          prologuePrompt: jsonNode['prologuePrompt'],
          summaryPrompt: jsonNode['summaryPrompt'],
          processingPrompt: jsonNode['processingPrompt'],
          quizPrompt: jsonNode['quizPrompt'],
          quizRound: jsonNode['quizRound'],
          quizNum: jsonNode['quizNum'],
          replyRound: jsonNode['replyRound'],
          memberIds: jsonNode['memberIds']
        }
        // console.log(nodeInfo);
        this.addNode(key, nodeInfo);
      });
    },
    addMyTemplate(template: MeetingTemplate) {
      this.myTemplateMap.set(template.id, template);
    },
    removeMyTemplate(id: string) {
      this.myTemplateMap.delete(id);
    },
    getMyTemplateList() {
      const templateList: MeetingTemplate[] = [];
      this.myTemplateMap.forEach((value) => {
        templateList.push(value);
      })
      return templateList;
    }
  },
  persist: {
    paths: ['myTemplateMap']
  }
});

