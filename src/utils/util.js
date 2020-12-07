import Vue from 'vue';

/**
 * 获取地址栏参数
 */
export function queryLocation() {
	let search = window.location.search.slice(1);
	let params = {};
	search.split('&').forEach(item => {
		let key = item.split('=')[0];
		let value = item.split('=')[1];
		params[key] = value;
	});
	return params;
}

/**
 * 是否是 Qt 客户端
 */
export const isQtClient = (function() {
	return navigator.userAgent.includes('QtWebEngine');
})();

/**
 * 当前运行平台
 */
export const platform = (function() {
	let platform = navigator.platform.toLowerCase();
	return platform.includes('win32')
		? 'windows' : platform.includes('linux')
		? 'linux' : 'unknown-platform';
})();

/**
 * 断言函数
 * @param {*} condition 条件表达式
 * @param {String} msg 条件表达式为 falsy 时的输出信息
 */
export function assert(condition, msg) {
	// falsy is not only 'false' value.
	if (!condition) {
		throw new Error(msg || `[ASSERT]: ${condition} is a falsy value.`);
	}
}

/**
 * 是否是开发环境
 */
export const __DEV__ = process.env.NODE_ENV === 'development';

/**
 * channel.objects.bridge Proxy
 */
export function qtBridge(bridge) {
	if (!bridge || typeof bridge !== 'object') return {};
}

export function createVue(options) {
	return new Vue(options);
}

export function dataURL2Blob(dataURL) {
	let array = dataURL.split(',');
	let mime = array[0].match(/:(.+);/)[1];
	let bstr = atob(array[1]);
	let bstr_length = bstr.length;
	let u8array = new Uint8Array(bstr_length);
	while (bstr_length--) {
		u8array[bstr_length] = bstr.charCodeAt(bstr_length);
	}
	return new Blob([u8array], { type: mime });
}
