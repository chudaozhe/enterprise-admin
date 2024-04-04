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
 * @param category_id
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(category_id, keyword, page, max){
	const res = await http.get('/admin/'+getUserId()+'/category/'+category_id+'/case', {keyword:keyword, page:page, max:max});
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
	const res = await http.get('/admin/'+getUserId()+'/case/'+id, {});
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
	let category_id=data['category_id']??0;
	delete data.category_id;
	const res = await http.post('/admin/'+getUserId()+'/category/'+category_id+'/case', data);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * statusDisplay
 * @param id
 * @returns {Promise.<*>}
 */
export async function statusDisplay(id){
	const res = await http.put('/admin/'+getUserId()+'/case/'+id+'/display', {});
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * statusHidden
 * @param id
 * @returns {Promise.<*>}
 */
export async function statusHidden(id){
	const res = await http.put('/admin/'+getUserId()+'/case/'+id+'/hidden', {});
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
	let category_id=data['category_id']??0;
	delete data.category_id;
	const res = await http.put('/admin/'+getUserId()+'/category/'+category_id+'/case/'+id, data);
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
	const res = await http.delete('/admin/'+getUserId()+'/case/'+id);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}