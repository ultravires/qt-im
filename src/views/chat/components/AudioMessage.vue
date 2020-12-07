<template>
  <div class="message message-audio">
    <audio ref="audio" controls>
      <source :src="message.payload.audioUrl" :type="message.payload.audioType" />
    </audio>
  </div>
</template>

<script>
export default {
  name: 'AudioMessage',

  props: {
    message: {
      type: Object,
      required: true
    }
  },

  methods: {
    handleClick() {
      this.getUserMedia({ audio: true }).then(mediaStream => {
        this.onSuccess.call(this, mediaStream)
      }).catch(mediaStreamError => {
        this.onError.call(this, mediaStreamError)
      })
    },

    onSuccess(mediaStream) {
      console.log(mediaStream)
    },

    onError(mediaStreamError) {
      if (mediaStreamError.name === 'NotAllowedError') {
        alert("使用语音功能需要语音权限！请授权！")
      }
    }
  }
}
</script>