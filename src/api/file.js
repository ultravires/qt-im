import request from '../utils/request';

/**
 * 单文件上传
 */
export function uploadFile(data, params) {
	return request({
		url: '/imq/file/upload',
		method: 'POST',
		data,
		params,
		headers: {
			'Content-Type': 'multipart/form-data;charset=utf-8'
		}
	});
}

/**
 * 文件夹上传
 */
export function uploadDirectory(data, params, req) {
	return request({
		url: '/imq/file/uploadDir',
		method: 'POST',
		data,
		params,
		headers: {
			'Content-Type': 'multipart/form-data;charset=utf-8'
		},
		timeout: Infinity,
		onUploadProgress(progressEvent) {
			const percentage = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
			req.onProgress(percentage);
		}
	});
}
