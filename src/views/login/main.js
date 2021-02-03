import Vue from 'vue';
import VueCookies from 'vue-cookies';

import '@/styles/common.css'
import 'normalize.css';
import 'element-ui/lib/theme-chalk/index.css';

import LoginPanel from './LoginPanel.vue';

import QtBridge from '../../plugins/bridge';
import { isQtClient } from '@/utils/util';

Vue.config.productionTip = process.env.NODE_ENV === 'development';

Vue.use(VueCookies);
Vue.use(QtBridge, {
	el: '#app',
	render: h => h(LoginPanel)
});

// 非Qt客户端时方便界面调试
!isQtClient ? new Vue({
	render: h => h(LoginPanel)
}).$mount('#app') : undefined;
