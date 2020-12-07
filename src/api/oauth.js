import request, { transformRequest } from "../utils/request";

/**
 * 登录接口
 * @param {Object} data
 * @param {String} data.username 账户
 * @param {String} data.password 密码
 */
export function login(data) {
	return request({
		url: '/imq/login',
		method: 'POST',
		data,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		transformRequest: [ transformRequest ]
	});
}

/**
 * 登出接口
 */
export function logout() {
	return request({
		url: '/imq/logout',
		method: 'GET'
	});
}