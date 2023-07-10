/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-29 22:27:47
 * @LastEditTime: 2023-07-05 13:37:04
 */
import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router/index';
import elementPlus from './plugin/el-comp';
import 'element-plus/theme-chalk/base.css';
import 'element-plus/theme-chalk/el-overlay.css';
import '@/utils/serialization'

// 创建vue实例
const app = createApp(App);

app.use(store);
app.use(router);
elementPlus(app);

// 挂载实例
app.mount('#app');
