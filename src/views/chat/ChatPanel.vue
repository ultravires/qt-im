<template>
  <el-container class="chat-container">
    <file-upload
      ref="upload"
      v-model="files"
      :thread="1"
      :custom-action="customAction"
      :multiple="true"
      :drop="true"
      :drop-directory="true"
      @input-file="inputFile"
      @input-filter="inputFilter"
      @dragenter.native="$refs.upload.$el.style.zIndex = 1"
      @dragleave.native="$refs.upload.$el.style.zIndex = -1"
    >
    </file-upload>
    <el-main style="flex-direction: column-reverse; padding: 0">
      <div ref="messages" class="chat-messages-container">
        <chat-message
          :data-index="index"
          :message="message"
          v-for="(message, index) in messages"
          :key="index"
        >
        </chat-message>
      </div>
    </el-main>
    <!-- 消息显示区 -->

    <el-footer class="chat-editor-container" height="200px">
      <div class="chat-record-view">
        <div class="view-duration-progress" :style="{width: (audioDuration / 60 * 100) + '%'}"></div>
        <span class="view-text">{{ recordTip }}</span>
      </div>
      <quill-editor ref="editor" :mention="true" @enter="handleEnter"></quill-editor>
      <el-row
        class="chat-button-groups"
        type="flex"
        justify="end"
        align="middle"
      >
        <el-button type="primary" size="mini" @click="sendMessage">发送</el-button>
      </el-row>
    </el-footer>
    <!-- 消息编辑区 -->

    <!-- 文件上传对话框 -->
    <el-dialog
      title="发送文件"
      :visible.sync="dialogFileListVisible"
      width="50%"
      :before-close="handleFileDialogClose">
      <ul class="el-upload-list">
        <li class="el-upload-list__item" v-for="(file, index) in files" :key="file.id || index">
          <a class="el-input-list__item-name">
            <i class="el-icon-document"></i>
            <span v-text="`${file.name} - ${getSizeOfFile(file)}`"></span>
          </a>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-circle-check"></i>
          </label>
          <i class="el-icon-close" @click="remove(file)"></i>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="clear" v-text="'取消'"></el-button>
        <el-button type="primary" size="mini" @click="handleConfirmUploadFile" v-text="'确定'"></el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import Vue from 'vue';
import { fetchMessages } from "@/api/message";
import VueUploadComponent from 'vue-upload-component';
import { uploadDirectory, uploadFile } from '@/api/file';
import { Message } from 'element-ui';
import { createImageMessage, createTextMessage, IM } from '@/utils/im';
import { audioRecorder } from './libs/Recorder';

Message.install = function(Vue) {
  Vue.prototype.$message = Message;
}

Vue.use(Message);

const ChatMessage = () => import("./components/ChatMessage");
const QuillEditor = () => import("./components/QuillEditor");

export default {
  name: "ChatPage",

  components: { ChatMessage, QuillEditor, FileUpload: VueUploadComponent },

  data() {
    return {
      dialogFileListVisible: false,
      messages: [],
      limitSize: 2 * Math.pow(1024, 3),
      // 上传文件
      files: [],
      autoUpload: false,
      // 是否使用 Ctrl+Enter 发送消息
      sendWithCtrl: false,
      // 录音提示
      recordTip: '正在录音...',
      // 是否允许客户端自动滚动到底部
      // 1. 当用户正在查看历史消息记录的时候不允许收到新的消息滚动至底部
      // 2. 当用户正在聊天的时候，收到消息要滚动至底部
      autoScroll: false,
      // 音频时长
      audioDuration: 0
    };
  },

  watch: {
    'files.length': {
      handler(value) {
        if (!value) {
          this.dialogFileListVisible = false;
        }
      }
    },

    messages() {
      this.$nextTick(() => {
        this.autoScroll && this.$refs.messages.scrollTo({top: 99999});
      });
    }
  },

  computed: {
    uploaded() {
      return this.$refs.upload.uploaded ? this.clear() : '';
    }
  },

  created() {
    // TODO fix: 这里的代码其实是找不到 $refs.messages 的.
    // 因为 $refs.messages 在组件内部无法被 this.$nextTick 检测到 DOM 更新
    // this.$nextTick(() => {
    //   this.$refs.$messages.scrollTo({top: 99999});
    // });

    const that = this;

    // 录音设置
    audioRecorder.options = {
      type: 'ogg',
      min: 1,
      max: 60
    };

    // 录音开始回调
    audioRecorder.onStart = function() {
      console.log('开始了！');
    }

    // 录音实时回调
    audioRecorder.onProgress = function(duration) {
      that.audioDuration = duration;
    }

    // 当录音被动停止（超过最大录音时长）或手动停止时触发
    audioRecorder.onStop = function() {
      console.log('停止了！');
    }

    // 开始录音
    startAudioRecord().catch(err => { this.$message({ message: err, type: 'error' }) });

    // 模拟录音 5 s
    let sleep = 0;
    let timer = setInterval(() => {
      if (sleep++ < 3) {
        // nothing
      } else {
        // 停止录音
        stopAudioRecord().catch(err => { this.$message({ message: err, type: 'error' }) });
        clearInterval(timer);
      }
    }, 1000);

    async function startAudioRecord() {
      const mediaStream = await audioRecorder.start();

      console.log(mediaStream);
    }

    async function stopAudioRecord() {
      const { blob, duration } = await audioRecorder.stop();
      console.log(blob, duration);
    }
  },

  mounted() {
    document.body.hidden = false;

    this.getMessages();

    let dropzone = this.$refs.upload.$el;
    window.addEventListener('dragenter', function(event) {
      event.preventDefault();
      dropzone.style.zIndex = 1;
    }, false);
    window.addEventListener('drop', function(event) {
      event.preventDefault();
      dropzone.style.zIndex = -1;
    }, false);
  },

  methods: {
    getMessages() {
      const targetId = new URLSearchParams(window.location.search).id;
      fetchMessages({ id: targetId })
        .then((res) => {
          if (res.success) {
            this.messages = res.data;
          } else {
            throw new Error(res.msg);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },

    handleEnter() {
      !this.sendWithCtrl ? this.sendMessage() : '';
    },

    sendMessage() {
      this.autoScroll = true;

      const editor = this.$refs.editor.editor;
      let text = this.getTextContent();
      let images = this.getImageContent();

      for (let i = 0, length = images.length; i < length; ++i) {
        let message = createImageMessage({
          conversationType: IM.TYPES.CONV_TYPE_C2C,
          payload: {
            imageUrl: images[i]
          }
        });
        this.messages.push(message);
      }

      let rich = editor.getContents();
      console.log(rich);
      const message = createTextMessage({
        conversationType: IM.TYPES.CONV_TYPE_C2C,
        payload: {
          text: text
        }
      });
      text.trim() && this.messages.push(message);
      editor.setContents();
    },

    getTextContent() {
      const editor = this.$refs.editor.editor;
      let delta = editor.getContents();
      let text = [];
      
      delta.forEach(item => {
        if (typeof item.insert === 'string') {
          text.push(item.insert);
        } else if (typeof item.insert === 'object') {
          text.push(item.insert.label || item.insert.mention);
        }
      });

      return text.join('');
    },

    getImageContent() {
      const editor = this.$refs.editor.editor;
      let delta = editor.getContents();
      let images = [];

      delta.forEach(item => {
        if (typeof item.insert === 'object') {
          item.insert.image && images.push(item.insert.image);
        }
      });

      return images;
    },

    // eslint-disable-next-line no-unused-vars
    async customAction(file, component) {
      let isDirectory = file.name.indexOf('/') !== -1;
      let filePath = isDirectory ? file.name : '';
      let [fileName, fileExtensionName] = file.name.split('.');
      let formData = new FormData();
      formData.append('file', file.file);
      if (isDirectory) {
        return await uploadDirectory(formData, {
          id: file.rootId.replace(/-/g, '') || '',
          filePath: encodeURIComponent(filePath),
          displayName: encodeURIComponent(fileName.split('/')[0]),
          ext: fileExtensionName,
          msgType: 'IMAGE'
        }).then(res => {
          if (res.success) {
            console.log(res);
          }
        });
      }
      return await uploadFile(formData, {
        displayName: encodeURIComponent(file.name),
        ext: fileExtensionName,
        msgType: 'IMAGE'
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.error(err);
      });
    },

    abort(file) {
      this.$refs.upload.update(file, { active: false });
    },

    stop() {
      this.$refs.upload.active = false;
    },

    upload() {
      this.$refs.upload.active = true;
    },

    remove(file) {
      return this.$refs.upload.remove(file);
    },

    clear() {
      return this.$refs.upload.clear();
    },

    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // 添加文件
        this.dialogFileListVisible = true;
      }

      // 更新文件
      if (newFile && oldFile) {
        // 开始上传
        if (newFile.active !== oldFile.active) {
          // 限制文件大小
          // if (!(newFile.size > 0 && newFile.size <= 100 * Math.pow(1024, 3))) {
          //   newFile = this.$refs.upload.update(newFile, { error: '超出文件大小限制！' });
          // }
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile);
        }

        // 上传错误
        if (newFile.error !== oldFile.error) {
          console.warn('error', newFile.error, newFile);
        }

        // // 上传成功
        if (newFile.success !== oldFile.success) {
          console.log('success', newFile.success, newFile);
          // this.uploaded;
          this.remove(newFile);
        }
      }

      if (!newFile && oldFile) {
        // 删除文件
        if (oldFile.success) {
          // TODO 从服务器删除文件
        }
      }

      // 自动上传
      if (this.autoUpload) {
        if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
          if (!this.$refs.upload.active) {
            this.$refs.upload.active = true;
          }
        }
      }
    },

    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!(newFile.size > 0 && newFile.size <= this.limitSize)) {
          this.remove(newFile);
          setTimeout(() => {
            this.$message({
              message: newFile.size <= 0 ? `“${newFile.name}” 为空文件，已移除！` : `“${newFile.name}” 过大，超过限制 ${this.getSizeOfFile({size: this.limitSize})}，已移除！`,
              type: 'warning'
            });
          }, 100);
          return prevent();
        }

        if (/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          newFile.blob = '';
          let URL = window.URL || window.webkitURL;
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file);
          }
        }
      }
    },

    // 返回固定格式的文件大小字符串
    getSizeOfFile(file) {
      let size = '';
      const SIZE_KB = 1024,
        SIZE_MB = Math.pow(1024, 2),
        SIZE_GB = Math.pow(1024, 3),
        SIZE_TB = Math.pow(1024, 4);
      if (file.size < SIZE_KB) {
        size = file.size + 'B';
      } else if (file.size < SIZE_MB) {
        size = (file.size / SIZE_KB).toFixed(2) + 'KB';
      } else if (file.size < SIZE_GB) {
        size = (file.size / SIZE_MB).toFixed(2) + 'MB';
      } else if (file.size < SIZE_TB) {
        size = (file.size / SIZE_GB).toFixed(2) + 'GB';
      } else {
        size = (file.size / SIZE_TB).toFixed(2) + 'TB';
      }
      return size;
    },

    handleFileDialogClose() {
      this.clear();
    },

    handleConfirmUploadFile() {
      this.dialogFileListVisible = false;
      this.upload();
    },

    scrollToBottom() {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
    }
  },
};
</script>

<style>
.el-upload {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.el-upload-dragger {
  width: 100%;
  height: 100%;
  background-color: transparent;
  overflow: hidden;
}
</style>

<style scoped>
.chat-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.chat-messages-container {
  padding: 20px 0;
  height: 100%;
  overflow-y: scroll;
  box-sizing: border-box;
}

.chat-editor-container {
  display: flex;
  flex-direction: column;
  padding: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  box-sizing: border-box;
  overflow: hidden;
}

.chat-button-groups {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
}

.chat-record-view {
  position: relative;
  background-color: #f3f3f3;
  width: 100%;
  height: 18px;
  line-height: 18px;
}

.chat-record-view > .view-duration-progress {
  width: 32%;
  height: 100%;
  background-color: #bee8f8;
}

.chat-record-view > .view-text {
  position: absolute;
  top: 0;
  left: 10px;
  padding-left: 12px;
  font-size: 12px;
  color: #565f7b;
}

.chat-record-view > .view-text::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  top: calc(50% - 5px);
  left: 0;
  background-color: #0f0;
  border-radius: 50%;
}

/* Dropzone - start */
.chat-upload__dropzone {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}
/* Dropzone - end */
</style>
