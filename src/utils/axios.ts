/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-29 22:27:47
 * @LastEditTime: 2023-07-01 20:33:32
 */
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import { useSettingStore } from '@/store/setting';

const setting = useSettingStore().getSetting();

axios.defaults.headers.common['apiKey'] = setting.apiKey;
axios.defaults.headers.common['model'] = setting.model;
axios.defaults.headers.common['temperature'] = setting.temperature;
axios.defaults.headers.common['presencePenalty'] = setting.presencePenalty;

const service = axios.create();

// Request interceptors
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // do something
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

// Response interceptors
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    console.log(response);
    if (response.status != 200) {
      ElMessage.error('Request error!');
    }
    const data = response.data
    if (data.code != 200) {
      ElMessage.error(data.msg);
    }

    return response;
    // do something
  },
  (error: any) => {
    // do something
    return Promise.reject(error);
  }
);

export default service;
