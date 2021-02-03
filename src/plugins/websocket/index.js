import Emitter from "./Emitter";
import Observer from "./Observer";

export default {
	install(Vue, websocketUrl, options = {}) {
		if (!websocketUrl || typeof websocketUrl !== 'string') {
			throw new Error('[websocket] error websocket url!');
		}

		options.$setInstance = (wsInstance) => {
			Vue.prototype.$socket = wsInstance;
		};

		let observer = new Observer(websocketUrl, options);
		Vue.prototype.$socket = observer.WebSocket;

		const hasProxy = typeof Proxy !== 'undefined' && typeof Proxy === 'function' && /native code/.test(Proxy.toString());

		Vue.mixin({
			created () {
				let vm = this;
				let sockets = this.$options['sockets'];

				if (hasProxy) {
					this.$options.sockets = new Proxy({}, {
						set (target, key, value) {
							Emitter.addListener(key, value, vm);
							target[key] = value;
							return true;
						},
						deleteProperty (target, key) {
							Emitter.removeListener(key, vm.$options.sockets[key], vm);
							delete target.key;
							return true;
						}
					})
					if (sockets) {
						Object.keys(sockets).forEach((key) => {
							this.$options.sockets[key] = sockets[key];
						});
					}
				} else {
					Object.seal(this.$options.sockets);

					// if !hasProxy need addListener
					if (sockets) {
						Object.keys(sockets).forEach(key => {
							Emitter.addListener(key, sockets[key], vm);
						});
					}
				}
			},
			beforeDestroy () {
				if (hasProxy) {
					let sockets = this.$options['sockets'];

					if (sockets) {
						Object.keys(sockets).forEach((key) => {
							delete this.$options.sockets[key];
						});
					}
				}
			}
		})
	}
}
