/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-06-07 13:37:47
 * @LastEditTime: 2023-07-05 00:28:40
 */
import { FlowItem } from '@/types/meeting';
import { defineStore } from 'pinia';

export const useMeetingStore = defineStore({
  id: 'meeting',
  state: () => {
    return {
      nowStatus: '',
      flowMap: new Map<string, FlowItem>(),
      nowMeetingId: ''
    }
  },
  actions: {
    addFlowItem(id: string, flowInfo: FlowItem): void {
      this.flowMap.set(id, flowInfo);
    },
    getFlowItem(id: string): FlowItem | undefined {
      return this.flowMap.get(id);
    },
    setNowMeetingId(meetingId: string) {
      this.nowMeetingId = meetingId;
    },
    getNowMeetingId(): string {
      return this.nowMeetingId;
    }
  }
})