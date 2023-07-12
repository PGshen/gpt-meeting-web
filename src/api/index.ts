/*
 * @Date: 2023-05-07 17:15:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-02 00:06:33
 * @FilePath: /gpt-meeting-service/Users/shen/Me/Code/plan/gpt-meeting-web/src/api/index.ts
 */
import * as index from './module/index';
import * as roleTemplate from './module/role-template';
import * as meetingTemplate from './module/meeting-template';
import * as meeting from './module/meeting'

export default Object.assign({}, index, roleTemplate, meetingTemplate, meeting);
