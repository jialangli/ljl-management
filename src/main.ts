import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'normalize.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/index.less'
import registerIcons from './global/register-icons'
import router from './router'
import { LoginByPwdSvc } from './service/modules/auth/auth'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(registerIcons)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

LoginByPwdSvc({
  username: 'admin',
  password: '123456',
})
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
