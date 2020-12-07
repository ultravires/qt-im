import QWebChannel from '@/utils/qwebchannel';
import { assert, isQtClient, createVue, __DEV__ } from '@/utils/util';

export default {
	install(Vue, options) {
		if (!__DEV__) {
			assert(window && window.qt && window.qt.webChannelTransport, '"qt" or "qt.webChannelTransport" should be initialized(injected) by QtWebEngine');
		}

		// 在浏览器端开发时，模拟 Qt 注入行为
		if (__DEV__ && !isQtClient) {
			window.qt = {
				webChannelTransport: {
					send() {
						console.log('QWebChannel simulator activted!');
					}
				}
			}
		}

		new QWebChannel(window.qt.webChannelTransport, (channel) => {
			const qtContext = channel.objects.bridge;
			if (!qtContext) {
				new Error('Failed get channel.object.bridge!');
			}
			qtContext && typeof qtContext.ready === 'function' && qtContext.ready();
			window._qtContext = Vue.prototype.$_bridge = qtContext;
			// qt bridge proxy
			window._qtBridge = Vue.prototype.$qtBridge = {
				open: function(options) {
					let { key, url, caption, width, height, left, top } = options;
					left = Number(left);
					top = Number(top);
					if (key && typeof key === 'string') {
						(isNaN(left) || isNaN(top)) ? qtContext.openWindow3(key, url, caption, width, height) : qtContext && qtContext.openWindow4(key, url, caption, width, height, left, top);
					} else {
						(isNaN(left) || isNaN(top)) ? qtContext.openWindow1(url, caption, width, height) : qtContext.openWindow2(url, caption, width, height, left, top);
					}
				},
				close: function() {
					qtContext.closeWindow();
				},
				quit: function() {
					qtContext.quit();
				},
				resize: function(width = 0, height = 0) {
					width = Number(width);
					height = Number(height);
					if ((isNaN(width) || isNaN(height))) {
						console.error('[resize] 错误的宽或高！');
						return;
					}
					qtContext.resize(width, height);
				},
				setMinimumSize: function(width = 0, height = 0) {
					qtContext.setMinimumSize(width, height);
				},
				minimize: function() {
					qtContext.minimize();
				},
				maximize: function() {
					qtContext.maxmize(); // fix maxmize to maximize
				},
				restore: function() {
					qtContext.restore();
				},
				fullScreen: function() {
					qtContext.fullScreen();
				},
				openDirectory: function(path) {
					qtContext.openFilePath(path);
				},
				openFile: function(path) {
					qtContext.openFile(path);
				},
				showSystemTray: function(isShowSystemTray) {
					qtContext.showSystemTray(isShowSystemTray);
				},
				showTaskIcon: function(isShowTaskIcon = true) {
					qtContext.showTaskIcon(isShowTaskIcon);
				},
				hideTaskIcon: function() {
					qtContext.showTaskIcon(false);
				},
				flashSystemTray: function(isFlash) {
					qtContext.toggleSystemTrayIcon(isFlash);
				},
				hide: function() {
					qtContext.hide();
				},
				show: function() {
					qtContext.show();
				},
				popup: function (url, width, height, left, top) {
					qtContext.popup(url, width, height, left, top);
				},
				topWindow: function(isTopWindow = true) {
					qtContext.topMode(isTopWindow);
				},
				geometry: function(left = 0, top = 0, width = 0, height = 0) {
					left = Number(left);
					top = Number(top);
					width = Number(width);
					height = Number(height);
					if (isNaN(left) || isNaN(top) || isNaN(width) || isNaN(height)) {
						console.error("[geometry] 错误的参数！");
					}
					qtContext.geometry(left, top, width, height);
				},
				clearCacheAndCookies: function() {
					qtContext.clearCacheAndCookies();
				},
				existsDownloadFile(id) {
					return qtContext.existsDownloadFile(id);
				},
				existsWindow: function (windowKey, callback) {
					qtContext.existsWindow(windowKey, function(isExists) {
						if (typeof callback == 'function') {
							callback(isExists);
						}
					});
				},
				// 当打开了很多个窗口后，可以通过此方法关闭所有窗口，保留一个入口
				entry: function(url, caption, width, height) {
					qtContext.logout(url, caption, width, height);
				},
				invokeJs: function (windowKey, funName, params) {
					if (windowKey && funName) {
						qtContext.invokeJs(windowKey, funName, params);
					}
				},
				openTabBrowser: function(url) {
					qtContext.openTabBrowser(url);
				},
				getConfig: function(caption, key, callback) {
					qtContext.getConfig(caption, key, function(r) {
						if (typeof callback == 'function') {
							callback(r);
						}
					});
				}
			}
			// 确保实例化Vue前QWebChannel已被实例化 （Qt 方法是异步的缘故）
			typeof options === 'object' && createVue(options);
		});
	}
};
