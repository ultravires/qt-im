class DeviceManager {
	static _instance = null;

	constructor() {}

	/**
	 * @returns {DeviceManager}
	 */
	static getInstance() {
		if (this._instance instanceof DeviceManager) {
			return this._instance;
		}
		this._instance = new DeviceManager();
		return this._instance;
	}

	/**
	 * @param {MediaStreamConstraints} constraints 
	 */
	async getUserMedia(constraints) {
		return await navigator.mediaDevices.getUserMedia(constraints);
	}

	/**
	 * 根据限制条件获取已连接的设备，当 type 为假值时返回所有已连接设备
	 * @param {MediaDeviceKind=} type 
	 */
	async getConnectionDevices(type) {
		if (!type) {
			return await navigator.mediaDevices.enumerateDevices();
		}
		const devices = await navigator.mediaDevices.enumerateDevices();
		return devices.filter(device => device.kind === type);
	}

	/**
	 * 获取音频输入设备
	 */
	async getAudioInputDevices() {
		return await this.getConnectionDevices('audioinput');
	}

	/**
	 * 获取音频输出设备
	 */
	async getAudioOutputDevices() {
		return await this.getConnectionDevices('audiooutput');
	}

	/**
	 * 获取视频输入设备
	 */
	async getVideoInputDevices() {
		return await this.getConnectionDevices('videoinput');
	}
}

const deviceManager = DeviceManager.getInstance();



class Recorder {
	constructor() {
	}

	start() {
		console.warn('start 方法没有被实现！');
	}

	stop() {
		console.warn('stop 方法没有被实现！');
	}

	pause() {
		console.warn('pause 方法没有被实现！');
	}

	resume() {
		console.warn('resume 方法没有被实现！');
	}

	destroy() {
		console.warn('destroy 方法没有被实现！');
	}
}



class AudioRecorder extends Recorder {
	options = {
		type: 'mp3',
		sampleRate: 32000,
		sampleSize: 16,
		noiseSuppression: true,
		channelCount: 2, // 双通道
		min: 1, // 最小录音时长
		max: 60 // 最大录音时长
	}

	constructor(options = {}) {
		super();
		this.duration = 0;
		this.audioContext = new AudioContext();
		this.mediaStream = null;
		Object.assign(this.options, options);
	}

	set options(val) {
		Object.assign(this.options, val);
	}

	setOptions(options) {
		this.options = options;
	}

	async getUserMedia(constraints) {
		return await deviceManager.getUserMedia(constraints);
	}

	async getAudioInputDevices() {
		return await deviceManager.getAudioInputDevices();
	}

	async getAudioOutputDevices() {
		return await deviceManager.getAudioOutputDevices();
	}

	async start() {
		let timer = setInterval(() => {
			this.onProgress(this.duration++);
			if (this.duration > this.options.max) {
				clearInterval(timer);
				this.stop();
			}
		}, 1000);
		this.onStart();
		const audioInputDevices = await this.getAudioInputDevices();
		if (audioInputDevices && audioInputDevices.length > 0) {
			const audioInputDevice = audioInputDevices[0];
			const mediaStream = await this.getUserMedia({
				audio: {
					deviceId: audioInputDevice.deviceId,
					sampleRate: this.options.sampleRate,
					sampleSize: this.options.sampleSize,
					noiseSuppression: this.options.noiseSuppression
				}
			});
			this.mediaStream = mediaStream;
			return mediaStream;
		}
	}

	stop() {
		return new Promise((resolve, reject) => {
			this.onStop();
			const audioContext = new AudioContext();
			const mediaStreamSource = audioContext.createMediaStreamSource(this.mediaStream);
			console.log(mediaStreamSource.disconnect());
			if (this.options.min < this.duration) {
				resolve({ blob: null, duration: this.duration });
			} else {
				reject(new Error(`录音最小时长为 ${this.options.min}s.`));
			}
		});
	}

	onStart() {}

	onProgress() {}

	onStop() {}
}

export const audioRecorder = new AudioRecorder();
export { deviceManager };
