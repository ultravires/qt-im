<template>
	<div class="main-panel">
		<h1></h1>
	</div>
</template>


<script>
import { fetchPreference } from '@/api/preference'

export default {
	name: 'MainPanel',

	data() {
		return {
			user: null
		};
	},

	created() {
		this.user = this.getUserFromLocal();
	},

	mounted() {
		fetchPreference().then(res => {
			// 1. 将配置存储到本地
			console.log(res);
		}).catch(err => {
			console.error(err);
		});
		this.$options.sockets.onopen = () => {
			this.doWebsocketCertification();
		}

		this.$options.sockets.onmessage = (data) => {
			const msg = data.data;
			const arr = msg.split('\r\n');
			const _from = arr[0].split(':')[1].trim();
			const _to = arr[1].split(':')[1].trim();
			const _event = arr[2].split(':')[1].trim();
			const _body = JSON.parse(arr[4]);

			console.log({ "发送者": _from, "接收者": _to, "事件": _event, "消息": _body });

			switch (_event) {
				case 'auth':
					console.log('%c[websocket] 认证成功！', 'color:#67c23a');
					this.heartbeatPackage();
					break;
				default:
					break;
			}
		}
	},

	methods: {
		getUserFromLocal() {
			return JSON.parse(window.localStorage.getItem('user'));
		},

		doWebsocketCertification() {
			if (this.$socket.readyState === this.$socket.OPEN) {
				const certify = {
					uid: `${this.user.id}@${this.user.domain}`,
					password: 'test',
					type: 'user'
				};
				this.emit('', 'login', certify);
			}
		},

		heartbeatPackage() {
			this.heartbeatTimer = setInterval(() => {
				if (this.$socket.readyState === this.$socket.CLOSED) {
					clearInterval(this.heartbeatTimer);
				}
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