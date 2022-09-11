import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	entUser:{}
}

/* 从本地存储读取数据 */
for(var item in state){
	localStorage.getItem(item)?
		state[item] = JSON.parse(localStorage.getItem(item)): false;
}

const mutations = {
	setToken(state, payload) {
		Object.assign(state.entUser, payload);
		localStorage.setItem('entUser',JSON.stringify(payload));
	}
}

export default  new Vuex.Store({
	state,
	mutations
})