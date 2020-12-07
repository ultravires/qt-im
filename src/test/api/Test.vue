<template>
	<div id="app"></div>
</template>

<script>
import { login } from '@/api/oauth';
import { fetchOrganTree } from '@/api/organ';
export default {
	name: 'Test',

	data() {
		return {
			user: null,
			heartbeatInterval: 5 * 1000
		}
	},

	created() {
		const _this = this;
		async function exec() {
			let loginResult = await login({username: 'xiangchengyu', password: 'admin'}).catch(err => { console.error(err) });
			if (loginResult.success) {
				_this.user = loginResult.user;

				_this.$options.sockets.onopen = () => {
					if (_this.$socket.readyState === _this.$socket.OPEN) {
						_this.doWebsocketCertification();
						_this.heartbeatPackage();
					}
				};

				_this.$options.sockets.onmessage = data => {
					const msg = data.data;
					const arr = msg.split('\r\n');
					const _from = arr[0].split(':')[1].trim();
					const _to = arr[1].split(':')[1].trim();
					const _event = arr[2].split(':')[1].trim();
					const _body = JSON.parse(arr[4]);

					console.log({ "发送者": _from, "接收者": _to, "事件": _event, "消息": _body });

					switch (_event) {
						case 'auth':
							console.log('[websocket] 认证成功！');
							break;
						default:
							break;
					}
				};
			}
		}

		exec();
	},

	mounted() {
		for (let i = 0; i < 1; ++i) {
			fetchOrganTree().catch(err => { console.error(err) });
		}
	},

	methods: {
		doWebsocketCertification() {
			const certify = {
				uid: `${this.user.id}@${this.user.domain}`,
				password: 'test',
				type: 'user'
			};
			this.emit('', 'login', certify);
		},

		heartbeatPackage() {
			clearInterval(this.heartbeatTimer);
			this.heartbeatTimer = setInterval(() => {
				this.emit('', 'heartbeat', '');
			}, this.heartbeatInterval);
		},

		emit(to, event, body) {
			let msg = 'FROM:' + this.user.id + '@' + this.user.domain + '\r\n';
			msg += 'TO:' + to + '\r\n';
			msg += 'EVENT:' + event + '\r\n';
			msg += '----\r\n';
			if (typeof body == 'object') {
				msg += JSON.stringify(body);
			} else {
				msg += body;
			}
			this.$socket.send(msg);
		}
	}
}
</script>
