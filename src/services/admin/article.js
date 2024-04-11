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
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(category_id, keyword, page, max) {
  return http.get('/admin/' + getUserId() + '/category/' + category_id + '/article', {
    keyword: keyword,
    page: page,
    max: max
  })
}
/**
 * 列表2
 * @param category_ids
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets2(category_ids, keyword, page, max) {
  return http.get('/admin/' + getUserId() + '/article', {
    category_ids: category_ids.join(','),
    keyword: keyword,
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
  return http.get('/admin/' + getUserId() + '/article/' + id, {})
}
/**
 * 添加
 * @param data
 * @returns {Promise.<*>}
 */
export async function add(data) {
  let category_id = data['category_id'] ?? 0
  delete data.category_id
  return http.post('/admin/' + getUserId() + '/category/' + category_id + '/article', data)
}
/**
 * statusDisplay
 * @param id
 * @returns {Promise.<*>}
 */
export async function statusDisplay(id) {
  return http.put('/admin/' + getUserId() + '/article/' + id + '/display', {})
}
/**
 * statusHidden
 * @param id
 * @returns {Promise.<*>}
 */
export async function statusHidden(id) {
  return http.put('/admin/' + getUserId() + '/article/' + id + '/hidden', {})
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
  return http.put('/admin/' + getUserId() + '/category/' + category_id + '/article/' + id, data)
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*>}
 */
export async function del(id) {
  return http.delete('/admin/' + getUserId() + '/article/' + id)
}
