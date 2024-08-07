# 企业展示型小程序 - 管理员端

Vue3 + Element Plus

- [Vue3](https://github.com/vuejs/core)
- [Element Plus](https://github.com/element-plus/element-plus)
- [Vite](https://github.com/vitejs/vite)
- [Pinia](https://github.com/vuejs/pinia)
- [mavonEditor](https://github.com/hinesboy/mavonEditor)
- [axios](https://github.com/axios/axios)
- [vue-router](https://github.com/vuejs/router)
- [sass](https://github.com/sass/sass)

如果需要`服务端`或`小程序端`，请移步： https://github.com/chudaozhe/gin-vue-weapp

## 在线体验
[个人服务器](https://ent.uqiantu.com/console/)

体验账号
```
用户名：admin
密码：123456
```

### 流行的静态网站托管平台

- [GitHub Pages](https://pages.github.com/) -> https://chudaozhe.github.io/enterprise-admin
- [Vercel](https://www.vercel.com/) -> https://enterprise-admin-five.vercel.app
- [Netlify](https://www.netlify.com/) -> https://enterprise-admin.netlify.app
- [Render](https://www.render.com/) -> https://enterprise-admin.onrender.com/
- [Railway](https://railway.app/)
- [Heroku](https://www.heroku.com/)


### GitHub Pages
首先不推荐这种方式，因为它不支持 history 路由模式，如果一定要使用请改为hash路由。部署步骤如下：

1. 安装`gh-pages`, `npm install gh-pages --save-dev`
2. 修改`package.json`中的`scripts`下面增加`"deploy": "gh-pages -d web"`
3. 临时修改项目的路由模式为`hash`：修改特定的 env 文件，比如`env.production`中的`VITE_ROUTER_MODE`为`hash`
4. 部署到子目录，需要修改特定的 env 文件，比如`env.production`中的`VITE_PUBLIC_BASE_PATH`为`./`或者`/enterprise-admin/`
5. 打包，`npm run build`
6. 部署，`npm run deploy`
7. 把`3`和`4`改回去

### Render
默认也不支持 history 路由模式，但可以在平台上配置。在站点的 `Redirects/Rewrites` 设置中添加以下改写规则：
```
Source: /*
Destination: /index.html
Status: Rewrite
```

### 更多平台
https://vitejs.dev/guide/static-deploy.html

## 配置
修改接口前缀
```
src/config.js
```

## 截图

![11.jpg](https://ent.uqiantu.com/data/screenshots/admin/11.jpg)
![22.jpg](https://ent.uqiantu.com/data/screenshots/admin/22.jpg)
![33.jpg](https://ent.uqiantu.com/data/screenshots/admin/33.jpg)

## 运行

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
#运行开发环境
npm run dev
#运行测试环境
npm run test
#运行预发布环境
npm run stage
#运行生产环境
npm run prod
```

### Compile and Minify for Production

```sh
#生产环境打包（等价于npm run build:prod）
npm run build
#开发环境打包
npm run build:dev
#测试环境打包
npm run build:test
#预发布环境打包
npm run build:stage
#生产环境打包
npm run build:prod
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```