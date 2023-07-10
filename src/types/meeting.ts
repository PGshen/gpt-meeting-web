/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-05-31 13:13:14
 * @LastEditTime: 2023-07-09 21:14:57
 */

import { TemplateNodeInfo } from './meeting-template';

export interface ThinkingTree {
  id: string;
  parentId?: string;
  question: string;
  answer: string;
  width: number;
  height: number;
  collapsed: boolean;
  children?: ThinkingTree[];
}

export interface SimpleConversation {
  id: string,
  question: string,
  answer: string,
}

export interface Message {
  index: number,
  id: string,
  text: string
	member: Member,
  isSelf: boolean
  time: number
}

// 状态
export enum MeetingStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  DONE = 'done'
}


export interface Meeting {
  id: string;
  name: string;
  templateId: string;
  topicGoal: string;
  overview: string;
  conclusion: string;
  tokenCnt: number;
  createdBy: string;
  createdTime: number;
}
export interface Query {
  createdBy?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface MeetingList {
  total: number;
  data: Meeting[];
}

export interface NewMeeting {
  name: string;
  templateId: string;
  createdBy: string;
}

export interface FlowItem {
  nodeInfo: TemplateNodeInfo;
  upstream: string[];
  status: string;
}

export interface NewMeetingReply {
  meetingId: string;
  meetingFlow: FlowItem[];
}

export interface ProgressReply {
  meetingId: string;
  meetingName: string;
  nowStatus: string;
  nowFlowItem: FlowItem;
  nextFlowItem: FlowItem;
  progress: FlowItem[];
}

export interface UpdateStatus {
  meetingId: string;
  flowItemId: string;
}

export interface MeetingFlowItemReq {
  meetingId: string,
  flowItemId: string,
  text: string
}

export interface Member {
  memberId: string
  memberName: string
  description: string
  color?: string
}

export interface ThinkingData {
  presets: ThinkingPresets
  thinking: ThinkingThinking
  summary: ThinkingSummary
}

export interface ThinkingPresets {
  meetingId: string
  flowItemId: string
  associationCharacters: Member
  quizCharacters: Member
  background: string
  curFlowItemName: string
  prologuePrompt: string
  quizPrompt: string
  quizRound: number
  quizNum: number
  summaryCharacters: Member
  summaryPrompt: string
}

export interface ThinkingThinking {
  conversationMap: Map<string, SimpleConversation>
  thinkingTree: ThinkingTree
}

export interface ThinkingSummary {
  summaryText: string
}

export interface DiscussionData {
  presets: DiscussionPresets
  discussion: DiscussionDiscussion
  summary: DiscussionSummary
}

export interface DiscussionPresets {
  meetingId: string
  flowItemId: string
  background: string
  curFlowItemName: string
  memberList: Member[]
  prologuePrompt: string
  replyRound: number
  summaryCharacters: Member
  summaryPrompt: string
}

export interface DiscussionDiscussion {
  chatList: Message[]
}

export interface DiscussionSummary {
  summaryText: string
}

export interface ProcessingData {
  presets: ProcessingPresets
  output: string
}

export interface ProcessingPresets {
  meetingId: string
  flowItemId: string
  characters: Member
  background: string
  curFlowItemName: string
  processingPrompt: string
}

export interface InputPresets {
  meetingId: string
  flowItemId: string
  characters: Member
  curFlowItemName: string
  optimizationPrompt: string
}

export interface InputData {
  presets: InputPresets
  input: string
  output: string
}

export interface OutputPresets {
  meetingId: string
  flowItemId: string
  characters: Member
  curFlowItemName: string
  summaryPrompt: string
}

export interface OutputData {
  presets: OutputPresets
  output: string
}