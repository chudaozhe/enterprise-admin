import { createRouter, createWebHistory } from 'vue-router'
import { useUserInfoStore } from "@/stores/store";

import {ElMessage} from "element-plus";

import Login from '@/views/login.vue'
import Admin from '@/views/admin.vue'

import AdminList from '@/views/admin/index.vue'
import AdminDetail from '@/views/admin/detail.vue'

import FileList from '@/views/file/index.vue'

import CaseList from '@/views/case/index.vue'
import CaseDetail from '@/views/case/detail.vue'

import CategoryList from '@/views/category/index.vue'
import CategoryDetail from '@/views/category/detail.vue'

import PageList from '@/views/page/index.vue'
import PageDetail from '@/views/page/detail.vue'

import ArticleList from '@/views/article/index.vue'
import ArticleDetail from '@/views/article/detail.vue'

import ShortcutList from '@/views/shortcut/index.vue'
import ShortcutDetail from '@/views/shortcut/detail.vue'

import FlashList from '@/views/flash/index.vue'
import FlashDetail from '@/views/flash/detail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Login },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/admin',
      meta: { requireAuth: true },
      component: Admin,
      children: [
        {path: '/admin', name: 'admin', meta: { requireAuth: true }, component: AdminList,},
        {path: '/admin/create', name: 'adminCreate', meta: { requireAuth: true }, component: AdminDetail,},
        {path: '/admin/another/admin/:id', name: 'adminDetail', meta: { requireAuth: true }, component: AdminDetail,},

        {path: '/file', name: 'file', meta: { requireAuth: true }, component: FileList,},

        {path:'/case', name:'case', meta:{requireAuth:true}, component:CaseList,},
        {path:'/case/create', name:'caseCreate', meta:{requireAuth:true}, component:CaseDetail,},
        {path:'/case/:id', name:'caseDetail', meta:{requireAuth:true}, component:CaseDetail,},

        {path:'/category', name:'category', meta:{requireAuth:true}, component:CategoryList,},
        {path:'/category/create', name:'categoryCreate', meta:{requireAuth:true}, component:CategoryDetail,},
        {path:'/category/:id', name:'categoryDetail', meta:{requireAuth:true}, component:CategoryDetail,},

        {path:'/page', name:'page', meta:{requireAuth:true}, component:PageList,},
        {path:'/page/create', name:'pageCreate', meta:{requireAuth:true}, component:PageDetail,},
        {path:'/page/:id', name:'pageDetail', meta:{requireAuth:true}, component:PageDetail,},

        {path: '/article/', name: 'article', meta: { requireAuth: true }, component: ArticleList,},
        {path: '/article/create', name: 'articleCreate', meta: { requireAuth: true }, component: ArticleDetail,},
        {path: '/article/:id', name: 'articleDetail', meta: { requireAuth: true }, component: ArticleDetail,},

        {path:'/shortcut', name:'shortcut', meta:{requireAuth:true}, component:ShortcutList,},
        {path:'/shortcut/create', name:'shortcutCreate', meta:{requireAuth:true}, component:ShortcutDetail,},
        {path:'/shortcut/:id', name:'shortcutDetail', meta:{requireAuth:true}, component:ShortcutDetail,},

        {path:'/flash/', name:'flash', meta:{requireAuth:true}, component:FlashList,},
        {path:'/flash/create', name:'flashCreate', meta:{requireAuth:true}, component:FlashDetail,},
        {path:'/flash/:id', name:'flashDetail', meta:{requireAuth:true}, component:FlashDetail,},
      ],
    },
  ]
})

router.beforeEach((to, from, next) => {
  const {userInfo} = useUserInfoStore()
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (userInfo?.token) {  // 通过vuex state获取当前的token是否存在
      next();
    }else {
      ElMessage({
        showClose: true,
        message: "无权限，请重新登录！",
        type: "error",
      });
      next({
        name: 'login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }else {
    next();
  }
})
export default router
