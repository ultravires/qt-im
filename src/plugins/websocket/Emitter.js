class Emitter {
	constructor() {
		this.listeners = new Map();
	}

	addListener(label, cb, vm) {
		if (typeof cb === 'function') {
			this.listeners.has(label) || this.listeners.set(label, []);
			this.listeners.get(label).push({ cb, vm });
			return true;
		}
		return false;
	}

	removeListener(label, cb, vm) {
		let listeners = this.listeners.get(label);
		if (listeners && listeners.length > 0) {
			let index = listeners.reduce((i, listener, index) => {
				if (typeof listener.cb === 'function' && listener.cb === cb && listener.vm === vm) {
					i = index;
				}
				return i;
			}, -1);
			if (index > -1) {
				listeners.splice(index, 1);
				this.listeners.set(label, listeners);
				return true;
			}
		}
		return false;
	}

	emit(label, ...args) {
		let listeners = this.listeners.get(label);
		if (listeners && listeners.length > 0) {
			listeners.forEach(listener => {
				listener.cb.call(listener.vm, ...args);
			});
			return true;
		}
		return false;
	}
}

export default new Emitter();
