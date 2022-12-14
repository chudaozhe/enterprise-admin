import http from '../../util/axios'
import store from '../../store';
let user=store.state.entUser;

/**
 * 列表
 * @param category_id
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(category_id, page, max){
	const res = await http.get('/admin/'+user.id+'/category/'+category_id+'/page', {page:page, max:max});
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
	const res = await http.get('/admin/'+user.id+'/page/'+id, {});
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
	const res = await http.post('/admin/'+user.id+'/category/'+category_id+'/page', data);
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
	const res = await http.put('/admin/'+user.id+'/category/'+category_id+'/page/'+id, data);
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
	const res = await http.delete('/admin/'+user.id+'/page/'+id);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}