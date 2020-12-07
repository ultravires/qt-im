<template>
  <div class="message message-event">
    <div class="message-event__wrapper">
      <div class="message-event__content">
        <i v-if="message.payload.icon !== false" :class="[message.payload.icon || getPrefixIcon, message.payload.type]"></i>
         {{ message.payload.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventMessage',

  props: {
    message: {
      type: Object,
      required: true
    }
  },

  computed: {
    getPrefixIcon() {
      return 'el-icon-' + this.message.payload.type;
    }
  }
}
</script>

<style scoped>
.message-event {
  text-align: center;
  font-size: 12px;
}

.message-event__content {
  display: inline-block;
  padding: 2px 10px;
  margin: 5px 0;
  background-color: rgba(0, 0, 0, .1);
  border-radius: 99999px;
  font-size: 14px;
}

.success {
  color: #00a000;
}

.warning {
  color: #ff6347;
}

.info {
  color: #4c94f0;
}

.error {
  color: #f00;
}
</style>