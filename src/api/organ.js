import request from "@/utils/request";

/**
 * 获取组织机构树
 */
export function fetchOrganTree() {
	return request({
		url: '/imq/organ/tree',
		method: 'GET',
		timeout: 30 * 1000
	});
}
