<template>
  <div class="message message-audio">
    <div class="message-bubble">
      <audio-player :src="message.payload.audioUrl" :type="message.payload.audioType"></audio-player>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/components/audio-player/AudioPlayer.vue';

export default {
  components: { AudioPlayer },
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

<style scoped>
.message-bubble {
  padding: 10px;
  background-image: var(--message-bubble-image, none);
  background-color: var(--message-bubble-color, #f1f3f4);
  color: var(--message-text-color, #000);
  box-sizing: border-box;
  border-radius: 6px;
}
</style>