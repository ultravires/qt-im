<template>
  <div class="box">
    <div class="audio-content" @click="togglePlay">
      <span class="audio-duration">32″</span>
      <div class="wifi-symbol">
        <div class="wifi-circle first"></div>
        <div class="wifi-circle second" :class="{'animated-fadeInOut': isPlaying}"></div>
        <div class="wifi-circle third" :class="{'animated-fadeInOut': isPlaying}"></div>
      </div>
    </div>
    <div class="audio-translate">
      {{ translate }}
    </div>
    <audio ref="audio">
      <source :src="src" :type="type" />
    </audio>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',

  props: {
    src: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isPlaying: false,
      translate: '[呃，什么也没听到！]'
    };
  },

  watch: {
    isPlaying(val) {
      val ? this.$refs.audio.play() : this.$refs.audio.pause();
    }
  },

  methods: {
    play() {
      this.isPlaying = true;
    },

    stop() {
      this.isPlaying = false;
    },

    togglePlay() {
      this.isPlaying = !this.isPlaying;
    }
  }
}
</script>

<style scoped>
.box {
  min-width: 120px;
  box-sizing: border-box;
  position: relative;
  margin-left: 10px;
}

.audio-content {
  cursor: pointer;
}

/* .audio-duration {
  color: #666;
} */

.wifi-symbol {
  display: inline-block;
  position:relative;    /*必须，否则苹果overflow失效*/
  width: 50px;
  height: 50px;
  margin-left: 10px;
  box-sizing: border-box;
  overflow: hidden;
  transform: rotate(135deg) scale(.8) skew(5deg, 5deg);
  vertical-align: middle;
}

.wifi-circle {
  position: absolute;
  border: 3px solid #fff;
  border-radius: 50%;
}

.first {
  width: 5px;
  height: 5px;
  background-color: #fff;
  top: 45px;
  left: 45px;
}

.second {
  width: 25px;
  height: 25px;
  top: 35px;
  left: 35px;
}

.second.animated-fadeInOut {
  animation: fadeInOut 1s infinite 0.2s;
}

.third {
  width: 40px;
  height: 40px;
  top: 25px;
  left: 25px;
}

.third.animated-fadeInOut {
  animation: fadeInOut 1s infinite 0.4s;
}

@keyframes fadeInOut {
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
}
</style>