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
 * @returns {Promise.<*>}
 */
export async function gets(type){
	const res = await http.get('/admin/'+getUserId()+'/category', {type:type});
	if(undefined!==res.data){
		return res.data.data;
	}else return res;
}
/**
 * 列表2(包含新闻和技术支持
 * @returns {Promise.<*>}
 */
export async function gets2(){
	const res = await http.get('/admin/'+getUserId()+'/category2', {});
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
	const res = await http.get('/admin/'+getUserId()+'/category/'+id, {});
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
	const res = await http.post('/admin/'+getUserId()+'/category', data);
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
	const res = await http.put('/admin/'+getUserId()+'/category/'+id, data);
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
	const res = await http.delete('/admin/'+getUserId()+'/category/'+id);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}