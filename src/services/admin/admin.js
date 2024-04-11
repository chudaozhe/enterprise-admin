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
 * @param keyword
 * @param page
 * @param max
 * @returns {Promise.<*>}
 */
export async function gets(keyword, page, max) {
  return http.get('/admin/' + getUserId() + '/admin', {
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
  return http.get('/admin/' + getUserId() + '/admin/' + id, {})
}
/**
 * 添加
 * @param data
 * @returns {Promise.<*>}
 */
export async function add(data) {
  return http.post('/admin/' + getUserId() + '/admin', data)
}
/**
 * 更新
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function edit(id, data) {
  return http.put('/admin/' + getUserId() + '/admin/' + id, data)
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*>}
 */
export async function del(id) {
  return http.delete('/admin/' + getUserId() + '/admin/' + id)
}
/**
 * 重置密码
 * @param id
 * @returns {Promise.<*>}
 */
export async function reset(id) {
  return http.put('/admin/' + getUserId() + '/admin/' + id + '/reset', {})
}
/**
 * 禁用
 * @param id
 * @returns {Promise.<*>}
 */
export async function disable(id) {
  return http.put('/admin/' + getUserId() + '/admin/' + id + '/disable', {})
}
/**
 * 启用
 * @param id
 * @returns {Promise.<*>}
 */
export async function enable(id) {
  return http.put('/admin/' + getUserId() + '/admin/' + id + '/enable', {})
}
/**
 * 修改密码
 * @param password
 * @param new_password
 * @returns {Promise.<*>}
 */
export async function changePassword(password, new_password) {
  return http.put('/admin/' + getUserId() + '/password', {
    password: password,
    new_password: new_password
  })
}
