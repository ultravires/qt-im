/**
 * 验证用户名
 * @param {string} username 用户名
 * @return {Boolean} true: valid; false: invalid
 */
export function validateUsername(username) {
	username = username || '';
	return ( username.trim().length > 0 );
}

/**
 * 验证密码
 * @param {String} password 密码
 */
export function validatePassword(password) {
	password = password || '';
	return ( password.trim().length > 0 );
}
