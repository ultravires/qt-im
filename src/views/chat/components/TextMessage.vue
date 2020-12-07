<template>
  <div class="message message-text">
    <div class="message-bubble">
      <p class="text-msg">{{ message.payload.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextMessage',

  props: {
    message: {
      type: Object,
      required: true
    }
  },
}
</script>

<style scoped>
.message-text {
  border-radius: 6px;
  overflow: hidden;
}

.message-bubble {
  background-color: var(--message-bubble-color, #f1f3f4);
  padding: 10px;
  box-sizing: border-box;
}

.text-msg {
  margin: 0;
  line-height: 1.6;
}
</style>