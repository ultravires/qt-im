import request from '../utils/request';

/**
 * 从远程获取消息记录
 * @param {Object} params 
*/
export function fetchMessages(params) {
	return request({
		baseURL: 'http://127.0.0.1:3000/api',
		url: '/v1/message/remote/list',
		method: 'GET',
		params
	});
}

/**
 * 从本地获取消息记录
 * @param {Object} params 
 */
export function queryMessages(params) {
	return request({
		baseURL: 'http://127.0.0.1:3000/api',
		url: '/v1/message/local/list',
		method: 'GET',
		params
	});
}