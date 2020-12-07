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
import { createImageMessage, createTextMessage, IM, sendMessage } from '@/utils/im';

Message.install = function(Vue) {
  Vue.prototype.$message = Message;
}

Vue.use(Message);

const ChatMessage = () => import("./components/ChatMessage");
const QuillEditor = () => import("./components/QuillEditor");

export default {
  name: "ChatPage",

  components: { ChatMessage, QuillEditor, 'file-upload': VueUploadComponent },

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
    };
  },

  watch: {
    'files.length': {
      handler(value) {
        if (!value) {
          this.dialogFileListVisible = false;
        }
      }
    }
  },

  computed: {
    uploaded() {
      return this.$refs.upload.uploaded ? this.clear() : '';
    }
  },

  mounted() {
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
      !this.sendWithCtrl ? sendMessage() : '';
    },

    sendMessage() {
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
html, body {
  height: 100%;
}

html {
  padding: 5px;
  box-sizing: border-box;
}

.windows {
  position: relative;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, .2);
  border-radius: 1px;
  box-sizing: border-box;
  overflow: hidden;
}

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
