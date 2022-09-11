// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import './config'

//ES6
import vuePictureManager from 'vue-picture-manager'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(vuePictureManager)

router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
		if (!isEmptyObject(store.state.entUser)) {  // 通过vuex state获取当前的token是否存在
			next();
		}else {
			next({
				path: '/login',
				query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
			})
		}
	}else {
		next();
	}
});

/**
 * 是否空对象
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
	for (var key in obj) {
		return false;
	}
	return true;
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  template: '<App/>',
  components: { App }
})
