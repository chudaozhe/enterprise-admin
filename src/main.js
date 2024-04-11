// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import promiseRejectionEvent from './utils/promiseRejectionEvent'
import errorHandler from './utils/errorHandler'

const app = createApp(App)

const pinia = createPinia()
const persist = createPersistedState()
pinia.use(persist)
app.use(pinia)
app.use(router)

app.use(ElementPlus)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(mavonEditor)
// 用于为应用内抛出的未捕获错误指定一个全局处理函数。
app.config.errorHandler = errorHandler
// 全局统一处理Promise异常
window.addEventListener('unhandledrejection', promiseRejectionEvent)
app.mount('#app')
