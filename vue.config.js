const path = require('path')
const defaultConfigs = require('./src/setting.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultConfigs.title || '即时IM' // page title

// https://cli.vuejs.org/zh/config/
module.exports = {
	// https://cli.vuejs.org/zh/config/#publicpath
	publicPath: process.env.NODE_ENV === 'production' ? '/im' : '/',

	outputDir: 'dist',

	assetsDir: 'static',

	lintOnSave: process.env.NODE_ENV !== 'production',

	productionSourceMap: true,

	runtimeCompiler: true,

	pages: {
		login: {
			entry: 'src/views/login/main.js',
			template: 'public/index.html',
			filename: 'login.html',
			title: '登录'
		},
		index: {
			entry: 'src/views/main/main.js',
			template: 'public/index.html',
			filename: 'index.html',
			title: '即时通讯'
		},
		chat: {
			entry: 'src/views/chat/main.js',
			template: 'public/index.html',
			filename: 'chat.html',
			title: '聊天'
		}
	},

	configureWebpack: {
		// provide the app's title in webpack's name field, so that
		// it can be accessed in index.html to inject the correct title.
		name: name,
		resolve: {
			alias: {
				'@': resolve('src')
			}
		}
	},

	chainWebpack: config => {
		// svg-sprite-loader
		const svgRule = config.module.rule('svg')
		svgRule.uses.clear();
		svgRule
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.tap(options => {
				options = {
					symbolId: 'icon-[name]'
				}
				return options
			})
	}
}
