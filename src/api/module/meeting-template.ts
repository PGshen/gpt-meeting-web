/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-05-11 18:18:12
 * @LastEditTime: 2023-05-11 18:19:57
 */
import request from '@/utils/axios';
import { IResponseType } from '.';
import { BoolReply, MeetingTemplate, Query } from '@/types/meeting-template';

export const createMeetingTemplate = (data: MeetingTemplate) => {
  return request<IResponseType<BoolReply>>({
    url: '/api/template/meeting',
    method: 'post',
    data: data
  });
}

export const updateMeetingTemplate = (data: MeetingTemplate) => {
  return request<IResponseType<BoolReply>>({
    url: '/api/template/meeting',
    method: 'post',
    data: data
  });
}

export const getMeetingTemplateList = (data: Query) => {
  return request({
    url: '/api/template/meeting',
    method: 'get',
    params: data
  }).then(function(response) {
    return response
  });
}