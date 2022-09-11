import http from '../../util/axios'
import store from '../../store';
let user=store.state.entUser;

/**
 * 列表
 * @param cid
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(cid, keyword, page, max){
	const res = await http.get('/admin/'+user.id+'/filegroup/0/file', {'cid':cid, 'keyword':keyword, page:page, 'max':max});
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
	const res = await http.get('/admin/'+user.id+'/file/'+id, {});
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
	const res = await http.post('/admin/'+user.id+'/filegroup/'+user.id+'/file', data);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
/**
 * 更新(未使用
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function edit(id, data){
	const res = await http.put('/admin/'+user.id+'/filegroup/'+user.id+'/file/'+id, data);
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
	const res = await http.delete('/admin/'+user.id+'/file/'+id);
	if(undefined!==res.data){
		return res.data;
	}else return res;
}
