import http from '../../util/axios'
import store from '../../store';
let user=store.state.entUser;

/**
 * 列表
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(keyword, page, max){
	const res = await http.get('/admin/'+user.id+'/admin', {'keyword':keyword, page:page, max:max});
	if(undefined!==res.data){
		return res.data.data;
	}else return res;
}
/**
 * 获取详情
 * @param id
 * @returns {Promise.<*>}
 */
export async function get(id){
	const res = await http.get('/admin/'+user.id+'/admin/'+id, {});
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * 添加
 * @param data
 * @returns {Promise.<*>}
 */
export async function add(data){
	const res = await http.post('/admin/'+user.id+'/admin', data);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * 更新
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function edit(id, data){
	const res = await http.put('/admin/'+user.id+'/admin/'+id, data);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*>}
 */
export async function del(id){
	const res = await http.delete('/admin/'+user.id+'/admin/'+id);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * 重置密码
 * @param id
 * @returns {Promise.<*>}
 */
export async function reset(id){
	const res = await http.put('/admin/'+user.id+'/admin/'+id+'/reset', {});
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * 禁用
 * @param id
 * @returns {Promise.<*>}
 */
export async function disable(id){
	const res = await http.put('/admin/'+user.id+'/admin/'+id+'/disable', {});
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * 启用
 * @param id
 * @returns {Promise.<*>}
 */
export async function enable(id){
	const res = await http.put('/admin/'+user.id+'/admin/'+id+'/enable', {});
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * 修改密码
 * @param password
 * @param new_password
 * @returns {Promise.<*>}
 */
export async function changePassword(password, new_password){
	const res = await http.put('/admin/'+user.id+'/password', {password:password, new_password:new_password});
	console.log('changePassword')
	console.log(res)
	if(undefined!==res.data){
		return res.data;
	}else return res;
}