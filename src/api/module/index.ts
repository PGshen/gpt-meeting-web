/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-29 22:27:47
 * @LastEditTime: 2023-07-02 00:03:30
 */
import { useSettingStore } from "@/store/setting";
export interface IResponseType<P = {}> {
  code?: number;
  msg?: string;
  data?: P;
}

/**
 * 获取设置
 * @returns 
 */
export function getSettingWithCors() {
  const headers = useSettingStore().getSetting() as Record<string, string>;
  headers['Content-Type'] = 'application/json';
  headers['Sec-Fetch-Mode'] = 'cors';
  headers['Sec-Fetch-Dest'] = 'empty';
  headers['Sec-Fetch-Site'] = 'same-site';
  return headers;
}