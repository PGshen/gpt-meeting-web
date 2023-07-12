/*
 * @Date: 2023-05-30 23:07:17
 * @LastEditors: peng pgs1108pgs@126.com
 * @LastEditTime: 2023-06-04 21:47:31
 * @FilePath: /gpt-meeting-service/Users/shen/Me/Code/plan/gpt-meeting-web/src/utils/index.ts
 */

/**
 * @description: 随机字符串
 * @return {*}
 */
export function genRandomString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * @description: 时间戳格式化
 * @param {number} timestamp
 * @return {*}
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear();
  const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
  const D = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds(); 
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
}