import request from '../utils/request'

/**
 * 获取偏好设置
 */
export function fetchPreference() {
	return request({
		url: '/imq/pref/loadSystemPref',
		method: 'GET'
	});
}

/**
 * 保存用户偏好设置
 * @param {Object} data 偏好设置
 * @param {String=} data.theme 主题皮肤
 * @param {String=} data.sign 用户个性签名
 * @param {String=} data.audio 消息提示音
 * @param {Boolean=} data.sendWithCtrl 发送消息方式（0: Enter, 1: Ctrl + Enter）
 * @param {Number=} data.closeBtnMode 关闭按钮模式（1: 退出程序，2: 最小化）
 * @param {Boolean} data.closeAlwaysAlert 关闭前是否总是弹窗提示
 */
export function saveUserPreference(data) {
	return request({
		url: '/imq/pref/saveSystemPref',
		method: 'POST',
		data
	});
}
