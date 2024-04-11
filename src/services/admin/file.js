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
 * @param cid
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(cid, keyword, page, max) {
  return http.get('/admin/' + getUserId() + '/filegroup/0/file', {
    cid: cid,
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
  return http.get('/admin/' + getUserId() + '/file/' + id, {})
}
/**
 * 添加
 * @param data
 * @returns {Promise.<*>}
 */
export async function add(data) {
  return http.post('/admin/' + getUserId() + '/filegroup/' + getUserId() + '/file', data)
}
/**
 * 更新(未使用
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function edit(id, data) {
  return http.put('/admin/' + getUserId() + '/filegroup/' + getUserId() + '/file/' + id, data)
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*>}
 */
export async function del(id) {
  return http.delete('/admin/' + getUserId() + '/file/' + id)
}
