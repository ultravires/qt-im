import axios from 'axios';

const request = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8080/api' : 'http://127.0.0.1:8080/api',
	timeout: 5 * 1000,
	withCredentials: true
});

request.interceptors.request.use(config => {
	return config;
}, error => {
	return Promise.reject(error);
});

request.interceptors.response.use(response => {
	return response.data;
}, error => {
	return Promise.reject(error);
});

/**
 * 将 json 格式数据转为 form 表单数据
 * @param {String} data queryString
 */
export function transformRequest(data) {
	let ret = '';
	for (let it in data) {
		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
	}
	ret = ret.replace(/&$/, ''); // 去除最后一个 '&'
	return ret;
}

/**
 * 发送 FormData 请求
 * @param {String} url 接口地址
 * @param {*} data 接口参数
 * @param {Boolean} [needTransformRequest=false] 是否需要转换表单
 */
export function postFormData(url, data, needTransformRequest = false) {
	return request.post(url, data, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		transformRequest: needTransformRequest ? [transformRequest] : undefined
	})
}

/**
 * 发送 Payload 请求
 * @param {String} url 接口地址
 * @param {*} data 接口参数
 */
export function postPayload(url, data) {
	return request.post(url, data);
}

/**
 * 发送 get 请求
 * @param {String} url 接口地址
 * @param {*} params 接口参数
 */
export function get(url, params) {
	return request({
		url,
		method: 'GET',
		params
	});
}

export default request;
