import Emitter from './Emitter';

export default class {
	constructor(websocketUrl, options = {}) {
		this.format = options.format && options.format.toLowerCase();

		this.websocketUrl = websocketUrl;
		this.options = options;

		this.debug = this.options.debug || false;
		this.reconnection = this.options.reconnection || false;
		this.reconnectionAttempts = this.options.reconnectionAttempts || Infinity;
		this.reconnectionDelay = this.options.reconnectionDelay || 1000;
		this.reconnectionTimeoutId = 0;
		this.reconnectionCount = 0;

		this.connect(websocketUrl, options);
		this.onEvent();
	}

	connect(websocketUrl, options) {
		this.WebSocket = options.WebSocket || new WebSocket(websocketUrl);
		if (this.format === 'json') {
			if (!('sendObj' in this.WebSocket)) {
				this.WebSocket.sendObj = obj => this.WebSocket.send(JSON.stringify(obj));
			}
		}
		return this.WebSocket;
	}

	reconnect() {
		if (this.reconnectionCount <= this.reconnectionAttempts) {
			++this.reconnectionCount;
			clearTimeout(this.reconnectionTimeoutId);
			this.reconnectionTimeoutId = setTimeout(() => {
				this.connect(this.websocketUrl, this.options);
				this.onEvent();
			}, this.reconnectionDelay);
		}
	}

	onEvent () {
		['onmessage', 'onclose', 'onerror', 'onopen'].forEach((eventType) => {
			this.WebSocket[eventType] = (event) => {
				Emitter.emit(eventType, event);

				if (this.debug && eventType === 'onopen') {
					console.log('%c[websocket] 连接成功！', 'color:#67c23a');
				}

				if (this.debug && eventType === 'onclose') {
					console.log('[websocket] 断开连接！');
				}

				if (this.reconnection && eventType === 'onopen') {
					this.options.$setInstance(event.currentTarget);
					this.reconnectionCount = 0;
				}

				if (this.reconnection && eventType === 'onclose') {
					this.reconnect();
				}
			}
		})
	}
}
