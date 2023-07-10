/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-05-11 17:32:21
 * @LastEditTime: 2023-07-09 21:14:43
 */
import { Cell } from '@antv/x6';

// 节点类型
export enum NodeType {
  Input = 'Input', // 主题/目标输入
  Thinking = 'Thinking', // 联想思考
  Discussion = 'Discussion', // 主题讨论
  Processing = 'Processing', // 通用
  Output = 'Output', // 结论输出
}

/**
 * 会议模版基础信息
 */
export interface TemplateBaseInfo {
  avatar: string;
  templateName: string;
  description: string;
  example: string;
}

/**
 * 节点信息
 */
export interface TemplateNodeInfo {
  id: string;
  nodeType: string;
  nodeName?: string;
  characters?: string;     // 人设
  associationCharacters?: string;  // 联想AI人设 [thinking专用]
  quizCharacters?: string;  // 提问AI人设 [thinking专用]
  optimizationPrompt?: string;  // 优化 [input]
  prologuePrompt?: string;  // 开场 [thinking,discussion]
  summaryPrompt?: string; // 总结 [output,thinking,discussion]
  processingPrompt?: string;  // 处理 [processing]
  quizPrompt?: string;  // 提问 [thinking]
  quizRound?: number; // 轮次 [thinking]
  quizNum?: number; // 次数 [thinking]
  replyRound?: number;  // 回答轮次 [discussion]
  memberIds?: string[];  // 成员角色ID列表 [thinking]
}

/**
 * 会议模版
 */
export class MeetingTemplate {
  id?: string;
  avatar!: string;
  name!: string;
  description?: string;
  example?: string;
  templateFlow?: string;   // 流程图信息
  templateData?: string;   // 节点信息
  starCount?: number;
  createdBy?: string;

  constructor() { }

  setAvatar(avatar: string) {
    this.avatar = avatar;
  }

  setTemplateName(templateName: string) {
    this.name = templateName;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setExample(example: string) {
    this.example = example;
  }

  setTemplateData(templateData: Map<string, TemplateNodeInfo>) {
    console.log(templateData);
    const obj: any = {};
    templateData.forEach((value, key) => {
      obj[key] = value;
    });
    this.templateData = JSON.stringify(obj);
  }

  setTemplateFlow(templateFlow: { cells: Cell.Properties[] }) {
    this.templateFlow = JSON.stringify(templateFlow);
  }

  setStarCount(starCount: number) {
    this.starCount = starCount;
  }

  setCreatedBy(createdBy: string) {
    this.createdBy = createdBy
  }

  check(obj): string[] {
    const emptyProperty = [];
    const propertyNames = Object.getOwnPropertyNames(obj);
    propertyNames.forEach((propertyName) => {
      if (propertyName === 'starCount' || propertyName == 'id') {
        return;
      }
      if(obj[propertyName] === undefined || obj[propertyName] === '') {
        emptyProperty.push(propertyName);
      }
    })
    console.log(propertyNames);
    console.log(emptyProperty);
    return emptyProperty;
  }

}

export interface MeetingTemplateList {
  total: number;
  data: MeetingTemplate[];
}

export interface BoolReply {
  ok: boolean
}

export interface Query {
  id?: string;
  templateName: string;
  pageNum?: number;
  pageSize?: number;
}