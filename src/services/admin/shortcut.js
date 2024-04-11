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
export async function gets() {
  return http.get('/admin/' + getUserId() + '/shortcut', {})
}
/**
 * 获取详情
 * @param id
 * @returns {Promise.<*>}
 */
export async function get(id) {
  return http.get('/admin/' + getUserId() + '/shortcut/' + id, {})
}
/**
 * 添加
 * @param data
 * @returns {Promise.<*>}
 */
export async function add(data) {
  return http.post('/admin/' + getUserId() + '/shortcut', data)
}
/**
 * 更新
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function edit(id, data) {
  return http.put('/admin/' + getUserId() + '/shortcut/' + id, data)
}
/**
 * statusDisplay
 * @param id
 * @returns {Promise.<*>}
 */
export async function statusDisplay(id) {
  return http.put('/admin/' + getUserId() + '/shortcut/' + id + '/display', {})
}
/**
 * statusHidden
 * @param id
 * @returns {Promise.<*>}
 */
export async function statusHidden(id) {
  return http.put('/admin/' + getUserId() + '/shortcut/' + id + '/hidden', {})
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*>}
 */
export async function del(id) {
  return http.delete('/admin/' + getUserId() + '/shortcut/' + id)
}
