
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 导入 Element Plus 的消息提示组件
import { ElMessage } from 'element-plus';
import App from './App.vue';
import router from './router';
import store from './store'

import axios from 'axios';
import { createPinia } from 'pinia'
import { LoginByPwdSvc } from './service/modules/auth/auth';
import { getUserListSvc } from './service/modules/user/user';

// 配置axios默认值
axios.defaults.baseURL = 'http://47.115.160.54:28080';
axios.defaults.timeout = 30000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// 请求拦截器
axios.interceptors.request.use(
config => {
const token = store.state.user.token;
if (token) {
config.headers.Authorization = token;
}
return config;
},
error => {
return Promise.reject(error);
}
);

// 响应拦截器
axios.interceptors.response.use(
response => response,
error => {
if (error.response?.status === 401) {
store.dispatch('user/logout');
router.push('/login');
ElMessage.error('登录已过期，请重新登录'); // 使用 Element Plus 的消息提示
console.error('认证失败:', error); // 方便调试
}
return Promise.reject(error);
}
);

// 创建Vue应用实例
const app = createApp(App);
const pinia = createPinia() // 创建 Pinia 实例

// 挂载应用
app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.use(store)

app.mount('#app');

// 测试登录接口访问
LoginByPwdSvc({
username: 'admin',
password: 'admin123'
}).then((res) => {
console.log(res);
});