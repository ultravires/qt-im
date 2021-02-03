import Vue from 'vue';
import Websocket from '@/plugins/websocket';

import '@/styles/common.css'
import 'normalize.css';
import 'element-ui/lib/theme-chalk/index.css';

// element-ui 样式覆盖
import '@/styles/element-ui/index.css';

import MainPanel from './MainPanel.vue';

import QtBridge from '../../plugins/bridge';
import { isQtClient } from '@/utils/util';

Vue.config.productionTip = process.env.NODE_ENV === 'development';

// class WebsocketWorker {
// 	constructor(url, options) {
// 		let worker = new Worker('websocket.worker.js', {
// 			name: ''
// 		});
// 		worker.postMessage({
// 			method: 'init',
// 			params: [url, options]
// 		});
// 		return worker;
// 	}
// }

// Vue.prototype.websocketWorker = new WebsocketWorker('ws://127.0.0.1:16188', {
// 	debug: true,
// 	reconnection: true,
// 	reconnectionAttempts: 3,
// 	reconnectionDelay: 1000
// });

Vue.use(QtBridge, {
	el: '#app',
	render: h => h(MainPanel)
});

Vue.use(Websocket, 'ws://127.0.0.1:16188', {
	debug: true, // 是否启用日志
	reconnection: true, // 自动断线重连
	reconnectionAttempts: 2, // 断线重连次数
	reconnectionDelay: 5000 // 断线重连延时
});

// 非Qt客户端时方便界面调试
!isQtClient ? new Vue({
	render: h => h(MainPanel)
}).$mount('#app') : undefined;
