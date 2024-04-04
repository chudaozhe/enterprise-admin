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

app.mount('#app')



