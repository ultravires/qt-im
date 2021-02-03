import Vue from 'vue';

import '@/styles/index.css'
import 'normalize.css';
import 'element-ui/lib/theme-chalk/index.css';

import ChatPanel from './ChatPanel.vue';

import QtBridge from '../../plugins/bridge';
import { isQtClient } from '@/utils/util';

import { Container, Upload, Dialog, Main, Footer, Row, Button, Input, Image, Avatar } from 'element-ui';

Vue.component(Image.name, Image);
Vue.component(Avatar.name, Avatar);
Vue.component(Container.name, Container);
Vue.component(Upload.name, Upload);
Vue.component(Dialog.name, Dialog);
Vue.component(Main.name, Main);
Vue.component(Footer.name, Footer);
Vue.component(Row.name, Row);
Vue.component(Button.name, Button);
Vue.component(Input.name, Input);

Vue.config.productionTip = process.env.NODE_ENV === 'development';

Vue.use(QtBridge, {
	el: '#app',
	render: h => h(ChatPanel)
});

// 非Qt客户端时方便界面调试
!isQtClient ? new Vue({
	render: h => h(ChatPanel)
}).$mount('#app') : undefined;
