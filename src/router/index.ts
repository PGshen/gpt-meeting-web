/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-09 18:29:19
 * @LastEditTime: 2023-06-25 13:21:31
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'IndexPage',
    meta: {
      title: '首页',
      keepAlive: true,
      requireAuth: true
    },
    component: () => import('@/pages/meeting/index.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    meta: {
      title: '信息设置',
      keepAlive: true,
      requireAuth: true
    },
    component: () => import('@/pages/setting/index.vue')
  },
  {
    path: '/meetingTemplate',
    name: 'MeetingTemplate',
    meta: {
      title: '会议模版',
      keepAlive: true,
      requireAuth: true
    },
    component: () => import('@/pages/meeting-template/index.vue')
  },
  {
    path: '/roleTemplate',
    name: 'RoleTemplate',
    meta: {
      title: '角色模版',
      keepAlive: true,
      requireAuth: true
    },
    component: () => import('@/pages/role-template/index.vue')
  },
  {
    path: '/meeting',
    name: 'Meeting',
    meta: {
      title: '会议管理',
      keepAlive: true,
      requireAuth: true
    },
    component: () => import('@/pages/meeting/index.vue')
  },
  {
    path: '/meeting/meeting',
    name: 'Meeting',
    meta: {
      title: '开会啦',
      keepAlive: true,
      requireAuth: true
    },
    component: () => import('@/pages/meeting/meeting.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
