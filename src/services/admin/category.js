import http from '../../utils/axios'
import { useUserInfoStore } from '@/stores/store'

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
export async function gets(type) {
  return http.get('/admin/' + getUserId() + '/category', { type: type })
}
/**
 * 列表2(包含新闻和技术支持
 * @returns {Promise.<*>}
 */
export async function gets2() {
  return http.get('/admin/' + getUserId() + '/category2', {})
}
/**
 * 获取详情
 * @param id
 * @returns {Promise.<*>}
 */
export async function get(id) {
  return http.get('/admin/' + getUserId() + '/category/' + id, {})
}
/**
 * 添加
 * @param data
 * @returns {Promise.<*>}
 */
export async function add(data) {
  return http.post('/admin/' + getUserId() + '/category', data)
}
/**
 * 更新
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function edit(id, data) {
  return http.put('/admin/' + getUserId() + '/category/' + id, data)
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*>}
 */
export async function del(id) {
  return http.delete('/admin/' + getUserId() + '/category/' + id)
}
