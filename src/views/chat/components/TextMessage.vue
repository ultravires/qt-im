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
.message-bubble {
  padding: 10px;
  background-image: var(--message-bubble-image, none);
  background-color: var(--message-bubble-color, #f1f3f4);
  color: var(--message-text-color, #000);
  box-sizing: border-box;
  border-radius: 6px;
}

.text-msg {
  margin: 0;
  line-height: 1.6;
}
</style>