<template>
  <div class="chat-editor">
    <el-input class="chat-editor__textarea" type="textarea" style="width:0;height:0;overflow:hidden;display:none"></el-input>
    <div class="chat-editor__toolbar"></div>
    <div class="chat-editor-wrapper">
      <div ref="editor" class="chat-editor__editable" contenteditable="true" @input="handleInput" @compositionstart="handleCompositionStart" @compositionend="handleCompositionEnd"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatEditor',

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      content: '',
      isCompositionEnd: true
    }
  },

  watch: {
    value(value) {
      this.content = value;
    }
  },

  methods: {
    _change() {
      this.content = this.getHtmlContent();
      this.isCompositionEnd && this.$emit('input', this.content);
    },

    handleInput() {
      this._change();
    },

    handleCompositionStart() {
      this.isCompositionEnd =  this.$refs.editor.compositionEnd = false;
    },

    // input 事件总是在 compositionend 事件之前触发
    handleCompositionEnd() {
      this.isCompositionEnd = this.$refs.editor.compositionEnd = true;
      this._change();
    },

    getHtmlContent() {
      return this.$refs.editor.innerHTML;
    },

    getTextContent() {
      return this.$refs.editor.innerText;
    },

    getEditor() {
      return this.$refs.editor;
    }
  }
}
</script>

<style scoped>
.chat-editor {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.chat-editor-wrapper {
  height: 100%;
}

.chat-editor__editable {
  height: 100%;
  padding: 10px 20px;
  overflow-y: scroll;
  box-sizing: border-box;
  outline: none;
}
</style>