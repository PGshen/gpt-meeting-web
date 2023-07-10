/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-05-01 19:13:03
 * @LastEditTime: 2023-07-02 16:29:09
 */
import request from '@/utils/axios';
import { IResponseType } from '.';
import { BoolReply, CreateRole, UpdateRole, Query } from '@/types/role-template';

export const createRole = (data: CreateRole) => {
  return request<IResponseType<BoolReply>>({
    url: '/api/template/role',
    method: 'post',
    data: data
  });
}


export const updateRole = (data: UpdateRole) => {
  return request<IResponseType<BoolReply>>({
    url: '/api/template/role',
    method: 'put',
    data: data
  });
}

export const deleteRole = (id: string) => {
  return request<IResponseType<BoolReply>>({
    url: '/api/template/role?id=' + id,
    method: 'delete'
  });
}

export const getRoleList = (data: Query) =>  {
  return request({
    url: '/api/template/role',
    method: 'get',
    params: data
  }).then(function(response) {
    return response
  });
}