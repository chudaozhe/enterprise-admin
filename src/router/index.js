import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login'
import Admin from '@/components/admin'

import AdminList from '@/components/admin/index'
import AdminDetail from '@/components/admin/detail'

import FileList from '@/components/file/index'

import CaseList from '@/components/case/index'
import CaseDetail from '@/components/case/detail'

import CategoryList from '@/components/category/index'
import CategoryDetail from '@/components/category/detail'

import PageList from '@/components/page/index'
import PageDetail from '@/components/page/detail'

import ArticleList from '@/components/article/index'
import ArticleDetail from '@/components/article/detail'

import ShortcutList from '@/components/shortcut/index'
import ShortcutDetail from '@/components/shortcut/detail'

import FlashList from '@/components/flash/index'
import FlashDetail from '@/components/flash/detail'

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/', component: Login},
    {path:'/login',component:Login,},
    {path:'/admin', meta:{requireAuth:true}, component:Admin,
      children:[
        {path:'/admin', meta:{requireAuth:true}, component:AdminList,},
        {path:'/admin/create', meta:{requireAuth:true}, component:AdminDetail,},
        {path:'/admin/another/admin/:id', meta:{requireAuth:true}, component:AdminDetail,},

        {path:'/file', meta:{requireAuth:true}, component:FileList,},

        {path:'/case', meta:{requireAuth:true}, component:CaseList,},
        {path:'/case/create', meta:{requireAuth:true}, component:CaseDetail,},
        {path:'/case/:id', meta:{requireAuth:true}, component:CaseDetail,},

        {path:'/category', meta:{requireAuth:true}, component:CategoryList,},
        {path:'/category/create', meta:{requireAuth:true}, component:CategoryDetail,},
        {path:'/category/:id', meta:{requireAuth:true}, component:CategoryDetail,},

        {path:'/page', meta:{requireAuth:true}, component:PageList,},
        {path:'/page/create', meta:{requireAuth:true}, component:PageDetail,},
        {path:'/page/:id', meta:{requireAuth:true}, component:PageDetail,},

        {path:'/article/', meta:{requireAuth:true}, component:ArticleList,},
        {path:'/article/create', meta:{requireAuth:true}, component:ArticleDetail,},
        {path:'/article/:id', meta:{requireAuth:true}, component:ArticleDetail,},

        {path:'/shortcut', meta:{requireAuth:true}, component:ShortcutList,},
        {path:'/shortcut/create', meta:{requireAuth:true}, component:ShortcutDetail,},
        {path:'/shortcut/:id', meta:{requireAuth:true}, component:ShortcutDetail,},

        {path:'/flash/', meta:{requireAuth:true}, component:FlashList,},
        {path:'/flash/create', meta:{requireAuth:true}, component:FlashDetail,},
        {path:'/flash/:id', meta:{requireAuth:true}, component:FlashDetail,},
      ]
    },
  ]
})

