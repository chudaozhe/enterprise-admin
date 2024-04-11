import http from '../../utils/axios'

/**
 * 登录
 * @param username
 * @param password
 * @returns {Promise.<*>}
 */
export async function doLogin(username, password) {
  return http.post('/admin/login', { username: username, password: password })
}
