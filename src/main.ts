import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import { createPinia } from 'pinia'

// 创建Vue应用实例
const app = createApp(App)
const pinia = createPinia() // 创建 Pinia 实例

// 挂载应用
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.use(store)

app.mount('#app')
