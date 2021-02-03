!(function(global) {
	const IMAppication = Object.freeze({
		name: '即时通讯',
		version: '1.0.0.1',
		author: '<x555666777@qq.com> ultravires 向成渝'
	});

	const IMPanel = {
		LoginPanel: {
			url: 'login.html',
			name: '登录',
			width: 600,
			height: 480,
			resizable: false
		},
		MainPanel: {
			url: 'main.html',
			name: '即时通讯',
			width: 300,
			height: 710,
			resizable: true
		}
	};

	global.IMAppication = IMAppication;
	global.IMPanel = IMPanel;
})(this);
