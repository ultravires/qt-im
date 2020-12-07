// class Enum {
// 	static create(enums) {
// 		return Object.freeze(enums);
// 	}
// }

// const IM_CONV_TYPE = Enum.create({ CONV_TYPE_C2C: 1 , CONV_TYPE_GROUP: 2 });
// const IM_MESSAGE_TYPE = Enum.create({ MESSAGE_TYPE_TEXT: 1, MESSAGE_TYPE_IMAGE: 2 });
// 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
// 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
// priority: TIM.TYPES.MSG_PRIORITY_NORMAL,


export const IM = {
	TYPES: {
		MESSAGE_TYPE_TEXT: 'TEXT',
		MESSAGE_TYPE_IMAGE: 'IMAGE',
		MESSAGE_TYPE_AUDIO: 'AUDIO',
		MESSAGE_TYPE_VIDEO: 'VIDEO',
		MESSAGE_TYPE_FILE: 'FILE',
		MESSAGE_TYPE_CUSTOM: 'CUSTOM',
		MESSAGE_TYPE_FACE: 'FACE',
		MESSAGE_TYPE_EVENT: 'EVENT',

		CONV_TYPE_C2C: 'c2c',
		CONV_TYPE_GROUP: 'group',

		PRIORITY_NORMAL: 'NORMAL'
	}
}

export class Message {
	constructor(options) {
		// 消息 ID
		this.id = 'xxxx-xxxx-xxxxxxxx-xxxx';
		// 消息接收者
		this.to = '1020915098';
		// 消息发送者
		this.from = '523449036';
		// 消息类型
		this.type = options.type;
		// 消息载荷
		this.payload = options.payload;
		// 会话 ID
		this.conversationId = 'xxxx-xxxx-xxxxxxxx-xxxx';
		// 会话类型
		this.conversationType = options.conversationType;
		// 消息流向
		this.flow = 'out';
		// 消息时间
		this.time = new Date().getTime();
		// 发送状态 SENDING | SNET | FAILED | DEFAULT
		this.status = 'DEFAULT';
		// 是否被撤回
		this.isRevoked = false;
		// 消息优先级
		this.priority = IM.TYPES.PRIORITY_NORMAL;
		// 消息是否已读 C2C
		this.isRead = false;
	}
}

export class TextMessage extends Message {
	constructor(options) {
		super(options);
		this.type = IM.TYPES.MESSAGE_TYPE_TEXT;
	}
}

export class ImageMessage extends Message {
	constructor(options) {
		super(options);
		this.type = IM.TYPES.MESSAGE_TYPE_IMAGE;
	}
}

export class AudioMessage extends Message {
	constructor(options) {
		super(options);
		this.type = IM.TYPES.MESSAGE_TYPE_AUDIO;
	}
}

export class VideoMessage extends Message {
	constructor(options) {
		super(options);
		this.type = IM.TYPES.MESSAGE_TYPE_VIDEO;
	}
}

export class FileMessage extends Message {
	constructor(options) {
		super(options);
		this.type = IM.TYPES.MESSAGE_TYPE_FILE;
	}
}

export class CustomMessage extends Message {
	constructor(options) {
		super(options);
		this.type = IM.TYPES.MESSAGE_TYPE_CUSTOM;
	}
}

export class FaceMessage extends Message {
	constructor(options) {
		super(options);
		this.type = IM.TYPES.MESSAGE_TYPE_FACE;
	}
}

export class EventMessage extends Message {
	constructor(options) {
		super(options);
		this.type = IM.TYPES.MESSAGE_TYPE_EVENT;
	}
}

/**
 * 创建文本消息
 * @param {Object} options 消息选项
 * @param {String} options.to 消息的接收方
 * @param {String} options.conversationType 会话类型，CONV_TYPE_C2C | CONV_TYPE_GROUP
 * @param {String} [options.priority=MSG_PRIORITY_NORMAL] 消息优先级
 * @param {Object} options.payload 消息载荷
 */
export function createTextMessage(options) {
	const message = new TextMessage(options);
	return message;
}

/**
 * 创建图片消息
 * @param {Object} options 消息选项
 * @param {String} options.to 消息的接收方
 * @param {String} options.conversationType 会话类型，CONV_TYPE_C2C | CONV_TYPE_GROUP
 * @param {String} [options.priority=MSG_PRIORITY_NORMAL] 消息优先级
 * @param {Object} options.payload 消息载荷
 * @param {HTMLInputElement|File} options.payload.file 用于选择图片的 DOM 节点（Web）或者 File 对象（Web）
 * @param {Function} options.onProgress 上传进度回调
 */
export function createImageMessage(options) {
	const message = new ImageMessage(options);
	return message;
}

/**
 * 创建音频消息
 * @param {Object} options 消息选项
 * @param {String} options.to 消息的接收方
 * @param {String} options.conversationType 会话类型，CONV_TYPE_C2C | CONV_TYPE_GROUP
 * @param {String} [options.priority=MSG_PRIORITY_NORMAL] 消息优先级
 * @param {Object} options.payload 消息载荷
 * @param {File} options.payload.file 音频文件
 */
export function createAudioMessage(options) {
	const message = new AudioMessage(options);
	return message;
}

/**
 * 创建视频消息
 * @param {Object} options 消息选项
 * @param {String} options.to 消息的接收方
 * @param {String} options.conversationType 会话类型，CONV_TYPE_C2C | CONV_TYPE_GROUP
 * @param {String} [options.priority=MSG_PRIORITY_NORMAL] 消息优先级
 * @param {Object} options.payload 消息载荷
 * @param {File} options.payload.file 视频文件
 */
export function createVideoMessage(options) {
	const message = new VideoMessage(options);
	return message;
}

/**
 * 创建文件消息
 * @param {Object} options 消息选项
 * @param {String} options.to 消息的接收方
 * @param {String} options.conversationType 会话类型，CONV_TYPE_C2C | CONV_TYPE_GROUP
 * @param {String} [options.priority=MSG_PRIORITY_NORMAL] 消息优先级
 * @param {Object} options.payload 消息载荷
 * @param {File} options.payload.file 文件
 */
export function createFileMessage(options) {
	const message = new FileMessage(options);
	return message;
}

/**
 * 创建自定义消息
 * @param {Object} options 消息选项
 * @param {String} options.to 消息的接收方
 * @param {String} options.conversationType 会话类型，CONV_TYPE_C2C | CONV_TYPE_GROUP
 * @param {String} [options.priority=MSG_PRIORITY_NORMAL] 消息优先级
 * @param {Object} options.payload 消息载荷
 * @param {String} options.payload.data 自定义消息的数据字段
 * @param {String} options.payload.description 自定义消息的说明字段
 * @param {String} options.payload.extension 自定义消息的扩展字段
 */
export function createCustomMessage(options) {
	const message = new CustomMessage(options);
	return message;
}

/**
 * 创建表情消息
 * @param {Object} options 消息选项
 * @param {String} options.to 消息的接收方
 * @param {String} options.conversationType 会话类型，CONV_TYPE_C2C | CONV_TYPE_GROUP
 * @param {String} [options.priority=MSG_PRIORITY_NORMAL] 消息优先级
 * @param {Object} options.payload 消息载荷
 * @param {Number} options.payload.index 表情索引，用户自定义
 * @param {String} options.payload.data 额外数据
 */
export function createFaceMessage(options) {
	const message = new FaceMessage(options);
	return message;
}

/**
 * 创建事件消息
 * @param {Object} options 消息选项
 * @param {String} options.to 消息的接收方
 * @param {String} options.conversationType 会话类型，CONV_TYPE_C2C | CONV_TYPE_GROUP
 * @param {String} [options.priority=MSG_PRIORITY_NORMAL] 消息优先级
 * @param {Object} options.payload 消息载荷
 * @param {Number} options.payload.type 事件类型
 * @param {String} options.payload.description 事件描述
 */
export function createEventMessage(options) {
	const message = new EventMessage(options);
	return message;
}

/**
 * 发送消息
 * @param {Message} message 消息
 */
export function sendMessage(message) {
	// TODO 发送消息
}

