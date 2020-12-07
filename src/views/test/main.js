import Vue from 'vue';
import TestPage from './TestPage.vue';
import { isQtClient } from '@/utils/util';

Vue.config.productionTip = process.env.NODE_ENV === 'development';

// 非Qt客户端时方便界面调试
!isQtClient ? new Vue({
	render: h => h(TestPage)
}).$mount('#app') : undefined;
