import http from '../../utils/axios'

/**
 * 登录
 * @param username
 * @param password
 * @returns {Promise.<*>}
 */
export async function doLogin(username, password) {
  const res = await http.post('/admin/login', { username: username, password: password })
  if (undefined !== res.data) {
    return res.data.data
  } else return res
}
