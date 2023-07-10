/*
 * @Descripttion: 
 * @version: 
 * @Date: 2023-04-29 22:27:47
 * @LastEditTime: 2023-06-24 20:18:45
 */
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const store = createPinia();
store.use(piniaPluginPersistedstate);

export default store;
