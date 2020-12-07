/**
 * indexedDB 工具类
 */
class IDBUtil {
	constructor(databaseName, version = 1) {
		this.openDBRequest = this.open(databaseName, version);
		this.db = null;

		this.openDBRequest.addEventListener('upgradeneeded', (event) => {
			console.log("[IDBUtil] 数据库创建成功！", event);
			this.db = event.target.result;
		});

		this.openDBRequest.addEventListener('success', (event) => {
			console.log("[IDBUtil] 数据库打开成功！", event);
			this.db = this.db ? this.db : this.openDBRequest.result;
		});

		this.openDBRequest.addEventListener('error', (event) => {
			console.error("[IDBUtil] 数据库打开失败！", event);
		});
	}

	open(databaseName, version) {
		return window.indexedDB.open(databaseName, version);
	}

	/**
	 * 插入数据
	 * @param {String|Array<String>} storeNames storeNames for transaction
	 * @param {String} storeName storeName in storeNames
	 * @param {*} data 待插入数据
	 * @param {String} [mode='readwrite'] 事务模式 (readwrite or readonly)
	 */
	add(storeNames, storeName, data, mode = 'readwrite') {
		let request = IDBUtil.db.transaction(storeNames, mode)
			.objectStore(storeName)
			.add(data);

		request.addEventListener('success', () => {
			console.log("[IDBUtil - add] 数据写入成功！");
		});

		request.addEventListener('error', () => {
			console.error("[IDBUtil - add] 数据写入失败！");
		});

		return request;
	}
}

export default IDBUtil;
