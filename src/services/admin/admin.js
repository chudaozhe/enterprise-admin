import http from '../../utils/axios'
import { useUserInfoStore } from "@/stores/store";

/**
 * 获取用户id
 */
const getUserId = () => {
	const { userInfo: user } = useUserInfoStore()
	return user.id
}
/**
 * 列表
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(keyword, page, max){
	const res = await http.get('/admin/'+getUserId()+'/admin', {'keyword':keyword, page:page, max:max});
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
	const res = await http.get('/admin/'+getUserId()+'/admin/'+id, {});
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
	const res = await http.post('/admin/'+getUserId()+'/admin', data);
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
	const res = await http.put('/admin/'+getUserId()+'/admin/'+id, data);
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
	const res = await http.delete('/admin/'+getUserId()+'/admin/'+id);
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
	const res = await http.put('/admin/'+getUserId()+'/admin/'+id+'/reset', {});
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
	const res = await http.put('/admin/'+getUserId()+'/admin/'+id+'/disable', {});
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
	const res = await http.put('/admin/'+getUserId()+'/admin/'+id+'/enable', {});
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
	const res = await http.put('/admin/'+getUserId()+'/password', {password:password, new_password:new_password});
	console.log('changePassword')
	console.log(res)
	if(undefined!==res.data){
		return res.data;
	}else return res;
}