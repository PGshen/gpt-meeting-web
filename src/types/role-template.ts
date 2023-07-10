/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-05-11 17:41:11
 * @LastEditTime: 2023-06-24 21:11:17
 */

export interface RoleInfo {
  id: string;
  avatar: string;
  summary: string;
  description: string;
  example: string;
  starCount: number;
  createdBy: string;
  createdTime: number;
}

export interface RoleList {
  total: number;
  data: RoleInfo[];
}

export interface CreateRole {
  avatar: string;
  summary: string;
  description: string;
  example: string;
  createdBy: string;
}

export interface UpdateRole {
  id: string;
  avatar: string;
  summary: string;
  description: string;
  example: string;
  createdBy: string;
}

export interface BoolReply {
  ok: boolean
}

export interface Query {
  id?: string;
  summary?: string;
  pageNum?: number;
  pageSize?: number;
}