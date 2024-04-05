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
  const res = await http.get('/admin/' + getUserId() + '/shortcut', {})
  if (undefined !== res.data) {
    return res.data.data
  } else return res
}
/**
 * 获取详情
 * @param id
 * @returns {Promise.<*>}
 */
export async function get(id) {
  const res = await http.get('/admin/' + getUserId() + '/shortcut/' + id, {})
  if (undefined !== res.data) {
    return res.data
  } else return res
}
/**
 * 添加
 * @param data
 * @returns {Promise.<*>}
 */
export async function add(data) {
  const res = await http.post('/admin/' + getUserId() + '/shortcut', data)
  if (undefined !== res.data) {
    return res.data
  } else return res
}
/**
 * 更新
 * @param id
 * @param data
 * @returns {Promise.<*>}
 */
export async function edit(id, data) {
  const res = await http.put('/admin/' + getUserId() + '/shortcut/' + id, data)
  if (undefined !== res.data) {
    return res.data
  } else return res
}
/**
 * statusDisplay
 * @param id
 * @returns {Promise.<*>}
 */
export async function statusDisplay(id) {
  const res = await http.put('/admin/' + getUserId() + '/shortcut/' + id + '/display', {})
  if (undefined !== res.data) {
    return res.data
  } else return res
}
/**
 * statusHidden
 * @param id
 * @returns {Promise.<*>}
 */
export async function statusHidden(id) {
  const res = await http.put('/admin/' + getUserId() + '/shortcut/' + id + '/hidden', {})
  if (undefined !== res.data) {
    return res.data
  } else return res
}
/**
 * 删除
 * @param id
 * @returns {Promise.<*>}
 */
export async function del(id) {
  const res = await http.delete('/admin/' + getUserId() + '/shortcut/' + id)
  if (undefined !== res.data) {
    return res.data
  } else return res
}
