// class Emitter {
// 	constructor() {
// 		this.listeners = new Map();
// 	}

// 	static get instance() {
// 		return new Emitter();
// 	}

// 	addListener(label, cb, vm) {
// 		if (typeof cb === 'function') {
// 			this.listeners.has(label) || this.listeners.set(label, []);
// 			this.listeners.get(label).push({ cb, vm });
// 			return true;
// 		}
// 		return false;
// 	}

// 	removeListener(label, cb, vm) {
// 		let listeners = this.listeners.get(label);
// 		if (listeners && listeners.length > 0) {
// 			let index = listeners.reduce((i, listener, index) => {
// 				if (typeof listener.cb === 'function' && listener.cb === cb && listener.vm === vm) {
// 					i = index;
// 				}
// 				return i;
// 			}, -1);
// 			if (index > -1) {
// 				listeners.splice(index, 1);
// 				this.listeners.set(label, listeners);
// 				return true;
// 			}
// 		}
// 		return false;
// 	}

// 	emit(label, ...args) {
// 		let listeners = this.listeners.get(label);
// 		if (listeners && listeners.length > 0) {
// 			listeners.forEach(listener => {
// 				listener.cb.call(listener.vm, ...args);
// 			});
// 			return true;
// 		}
// 		return false;
// 	}
// }

// class Observer {
// 	constructor(websocketUrl, options = {}) {
// 		this.format = options.format && options.format.toLowerCase();

// 		this.websocketUrl = websocketUrl;
// 		this.options = options;

// 		this.debug = this.options.debug || false;
// 		this.reconnection = this.options.reconnection || false;
// 		this.reconnectionAttempts = this.options.reconnectionAttempts || Infinity;
// 		this.reconnectionDelay = this.options.reconnectionDelay || 1000;
// 		this.reconnectionTimeoutId = 0;
// 		this.reconnectionCount = 0;

// 		this.connect(websocketUrl, options);
// 		this.onEvent();
// 	}

// 	connect(websocketUrl, options) {
// 		this.WebSocket = options.WebSocket || new WebSocket(websocketUrl);
// 		if (this.format === 'json') {
// 			if (!('sendObj' in this.WebSocket)) {
// 				this.WebSocket.sendObj = obj => this.WebSocket.send(JSON.stringify(obj));
// 			}
// 		}
// 		return this.WebSocket;
// 	}

// 	reconnect() {
// 		if (this.reconnectionCount <= this.reconnectionAttempts) {
// 			++this.reconnectionCount;
// 			clearTimeout(this.reconnectionTimeoutId);
// 			this.reconnectionTimeoutId = setTimeout(() => {
// 				this.connect(this.websocketUrl, this.options);
// 				this.onEvent();
// 			}, this.reconnectionDelay);
// 		}
// 	}

// 	onEvent () {
// 		['onmessage', 'onclose', 'onerror', 'onopen'].forEach((eventType) => {
// 			this.WebSocket[eventType] = (event) => {
// 				emitter.emit(eventType, event);

// 				if (this.debug && eventType === 'onopen') {
// 					console.log('%c[websocket] 连接成功！', 'color:#67c23a');
// 				}

// 				if (this.debug && eventType === 'onclose') {
// 					console.log('%c[websocket] 断开连接！', 'color:#333333');
// 				}

// 				if (this.reconnection && eventType === 'onopen') {
// 					this.options.$setInstance(event.currentTarget);
// 				}

// 				if (this.reconnection && eventType === 'onclose') {
// 					this.reconnect();
// 				}
// 			}
// 		})
// 	}
// }

// let emitter = Emitter.instance;

// self.methods = {
// 	_initWebsocket(url, options = {}) {
// 		if (!url || typeof url !== 'string') {
// 			throw new Error('[websocket] 错误的 websocket 地址！');
// 		}

// 		options.$setInstance = (instance) => {
// 			self.$socket = instance;
// 		}

// 		let observer = new Observer(url, options);
// 		this.$socket = observer.WebSocket;

// 		const hasProxy = typeof Proxy !== 'undefined' && typeof Proxy === 'function' && /native code/.test(Proxy.toString());

// 		if (!this.$options) this.$options = {};
// 		let vm = this;
// 		let sockets = this.$options['sockets'];

// 		if (hasProxy) {
// 			this.$options.sockets = new Proxy({}, {
// 				set (target, key, value) {
// 					emitter.addListener(key, value, vm);
// 					target[key] = value;
// 					return true;
// 				},
// 				deleteProperty (target, key) {
// 					emitter.removeListener(key, vm.$options.sockets[key], vm);
// 					delete target.key;
// 					return true;
// 				}
// 			})
// 			if (sockets) {
// 				Object.keys(sockets).forEach((key) => {
// 					this.$options.sockets[key] = sockets[key];
// 				});
// 			}
// 		} else {
// 			Object.seal(this.$options.sockets);

// 			// if !hasProxy need addListener
// 			if (sockets) {
// 				Object.keys(sockets).forEach(key => {
// 					emitter.addListener(key, sockets[key], vm);
// 				});
// 			}
// 		}
// 	},

// 	init(url, options) {
// 		this.methods._initWebsocket.call(self, url, options);

// 		this.$options.sockets.onopen = () => {
// 			this.postMessage({ event: 'open' });
// 		}

// 		this.$options.sockets.onmessage = message => {
// 			this.postMessage({ event: 'message', params: message });
// 		}
// 	},

// 	doWebsocketCertification() {
// 		if (self.$socket.readyState === self.$socket.OPEN) {
// 			const certify = {
// 				uid: `${this.user.id}@${this.user.domain}`,
// 				password: 'test',
// 				type: 'user'
// 			};
// 			this.emit('', 'login', certify);
// 		}
// 	},

// 	heartbeatPackage() {
// 		this.heartbeatTimer = setInterval(() => {
// 			if (this.$socket.readyState === this.$socket.CLOSED) {
// 				clearInterval(this.heartbeatTimer);
// 			}
// 			this.emit('', 'heartbeat', '');
// 		}, this.heartbeatInterval);
// 	},

// 	emit(to, event, body) {
// 		let msg = 'FROM:' + this.user.id + '@' + this.user.domain + '\r\n';
// 		msg += 'TO:' + to + '\r\n';
// 		msg += 'EVENT:' + event + '\r\n';
// 		msg += '----\r\n';
// 		if (typeof body == 'object') {
// 			msg += JSON.stringify(body);
// 		} else {
// 			msg += body;
// 		}
// 		self.$socket.send(msg);
// 	}
// };

// self.onmessage = function(event) {
// 	let data = event.data;

// 	if (data.method) {
// 		self.methods[data.method] && self.methods[data.method].apply(self, data.params);
// 	}
// }
