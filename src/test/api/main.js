import Vue from 'vue';
import Websocket from '@/plugins/websocket';

import Test from './Test.vue';

import { isQtClient } from '@/utils/util';

Vue.use(Websocket, 'ws://oa.hczy.top:16188', {
	debug: true, // 是否启用日志
	reconnection: true, // 自动断线重连
	reconnectionAttempts: Infinity, // 断线重连次数
	reconnectionDelay: 1000 // 断线重连延时
});

Vue.config.productionTip = process.env.NODE_ENV === 'development';

// 非Qt客户端时方便界面调试
!isQtClient ? new Vue({
	render: h => h(Test)
}).$mount('#app') : undefined;
