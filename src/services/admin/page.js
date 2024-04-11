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
 * @param category_id
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(category_id, page, max) {
  return http.get('/admin/' + getUserId() + '/category/' + category_id + '/page', {
    page: page,
    max: max
  })
}
/**
 * 获取详情
 * @param id
 * @returns {Promise.<*>}
 */
export async function get(id) {
  return http.get('/admin/' + getUserId() + '/page/' + id, {})
}
/**
 * 添加
 * @param data
 * @returns {Promise.<*>}
 */
export async function add(data) {
  let category_id = data['category_id'] ?? 0
  delete data.category_id
  return http.post('/admin/' + getUserId() + '/category/' + category_id + '/page', data)
}
/**
 * 更新
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function edit(id, data) {
  let category_id = data['category_id'] ?? 0
  delete data.category_id
  return http.put('/admin/' + getUserId() + '/category/' + category_id + '/page/' + id, data)
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*>}
 */
export async function del(id) {
  return http.delete('/admin/' + getUserId() + '/page/' + id)
}
