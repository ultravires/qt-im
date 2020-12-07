<template>
  <div class="message message-file">
    <el-row class="message-file__content" type="flex" justify="start" align="middle">
      <el-image class="message-file__pic" :src="getFileIcon(message.payload.fileExtensionName)" fit="fill"></el-image>
      <el-row type="flex" justify="space-between" style="flex-direction: column; align-self: normal">
        <h4 class="message-file__name">
          {{ getSubString(message.payload.fileName) + (message.payload.fileExtensionName || '') }}
          <small class="message-file__size">（{{ formatSize(message.payload.fileSize) }}）</small>
        </h4>
        <p class="message-file__desc"></p>
      </el-row>
    </el-row>
    <el-row class="message-file__operator" type="flex" justify="end" align="middle">
      <el-button type="text">打开</el-button>
      <el-button type="text">打开文件夹</el-button>
      <el-button type="text">转发</el-button>
      <el-button type="text" icon="el-icon-menu"></el-button>
    </el-row>
  </div>
</template>

<script>
import audioFileIcon from '@/icons/file-icon/IconSize50/audio.png'
import codeFileIcon from '@/icons/file-icon/IconSize50/code.png'
import defaultFileIcon from '@/icons/file-icon/IconSize50/default.png'
// import excelFileIcon from '@/icons/file-icon/IconSize50/excel.png'
// import exeFileIcon from '@/icons/file-icon/IconSize50/exe.png'
// import folderFileIcon from '@/icons/file-icon/IconSize50/folder.png'
// import pdfFileIcon from '@/icons/file-icon/IconSize50/pdf.png'
// import picFileIcon from '@/icons/file-icon/IconSize50/pic.png'
// import pic_psdFileIcon from '@/icons/file-icon/IconSize50/pic_psd.png'
// import pptFileIcon from '@/icons/file-icon/IconSize50/ppt.png'
// import textFileIcon from '@/icons/file-icon/IconSize50/text.png'
import videoFileIcon from '@/icons/file-icon/IconSize50/video.png'
// import wordFileIcon from '@/icons/file-icon/IconSize50/word.png'
import zipFileIcon from '@/icons/file-icon/IconSize50/zip.png'

export default {
  name: 'FileMessage',

  props: {
    message: {
      type: Object,
      required: true
    }
  },

  methods: {
    formatSize(size) {
      return size < 1024 ? size.toFixed(2) + 'B' : size < Math.pow(1024, 2)
        ? (size / 1024).toFixed(2) + 'KB' : size < Math.pow(1024, 3)
        ? (size / Math.pow(1024, 2)).toFixed(2) + 'MB' : size < Math.pow(1024, 4)
        ? (size / Math.pow(1024, 3)).toFixed(2) + 'GB' : size < Math.pow(1024, 5)
        ? (size / Math.pow(1024, 4)).toFixed(2) + 'TB' : '超大文件'
    },

    // 多余文字中间采用省略号
    getSubString(str) {
      if (str.length < 10) return str
      return str.substr(0, 3) + '...' + str.substr(str.length - 5, 5)
    },

    // 根据文件后缀名返回图片
    getFileIcon(ext) {
      let fileIcon = '';
      switch(ext) {
        case '.html':
        case '.xml':
        case '.vue':
        case '.c':
        case '.h':
        case '.cpp':
        case '.java':
        case '.python':
        case '.go':
          fileIcon = codeFileIcon;
          break;
        case '.mp3':
          fileIcon = audioFileIcon;
          break;
        case '.mp4':
          fileIcon = videoFileIcon;
          break;
        case '.zip':
          fileIcon = zipFileIcon;
          break;
        default:
          fileIcon = defaultFileIcon;
      }
      return fileIcon;
    }
  }
}
</script>

<style scoped>
.message-file {
  width: 300px;
  background: #fff;
  border-radius: 3px;
  border: 1px solid #cfdbe2;
  box-sizing: border-box;
  overflow: hidden;
}

.message-file__content {
  padding: 10px;
  box-sizing: border-box;
}

.message-file__pic {
  flex-shrink: 0;
  flex-grow: 0;
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.message-file__name {
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.message-file__size {
  font-size: 12px;
  font-weight: normal;
  color: rgba(0, 0, 0, .5);
}

.message-file__desc {
  padding: 0;
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, .5);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.message-file__operator {
  border-top: 1px solid #cfdbe2;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}
</style>