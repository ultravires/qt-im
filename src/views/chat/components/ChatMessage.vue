<template>
  <div ref="message" class="chat-message">
    <!-- 事件消息 -->
    <event-message v-if="message.type.toUpperCase() === 'EVENT'" :message="message"></event-message>

    <template v-if="message.type.toUpperCase() !== 'EVENT'">
      <div class="chat-message__time">2010-04-12 12:33:02</div>
      <el-row type="flex" :class="{'in-message': message.flow === 'in', 'out-message': message.flow === 'out'}">
        <el-avatar class="chat-message__avatar" src="http://assets.sanphantom.com/avatar.jpg?imageMogr2/auto-orient/thumbnail/!32x32r/gravity/Center/crop/32x32/interlace/1/blur/1x0/quality/100|imageslim" :size="32"></el-avatar>
        <div class="chat-message__wrapper">
          <h3 v-if="message.conversationType === 'group'" class="chat-message__owner">【黄铜】浅安。</h3>
          <el-row type="flex" justify="start" class="chat-message__content">
            <Compnent :is="getMessageComponentName" :message="message" />
            <div class="chat-message__readStatus">已读</div>
          </el-row>
        </div>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',

  props: {
    message: {
      type: Object,
      required: true
    }
  },
  
  components: {
    'TextMessage': () => import('./TextMessage'),
    'FileMessage': () => import('./FileMessage'),
    'ImageMessage': () => import('./ImageMessage'),
    'AudioMessage': () => import('./AudioMessage'),
    'EventMessage': () => import('./EventMessage')
  },

  computed: {
    getMessageComponentName() {
      let type = this.message.type.toUpperCase();
      return type === 'TEXT'
        ? 'TextMessage' : type === 'IMAGE'
        ? 'ImageMessage' : type === 'FILE'
        ? 'FileMessage' : type === 'AUDIO'
        ? 'AudioMessage' : type === 'EVENT'
        ? 'EventMessage' : new Error('错误的消息类型！');
    }
  },

  mounted() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          console.log(entry.target.dataset.index)
        }
      })
    });
    observer.observe(this.$refs.message);
  }
}
</script>

<style scoped>
.chat-message {
  font-size: 14px;
}

.out-message,
.out-message .chat-message__content {
  flex-direction: row-reverse;
}

.chat-message__wrapper {
  max-width: 60%;
}

.chat-message__avatar {
  margin: 5px;
}

.chat-message__time {
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, .5);
  padding: 10px 0;
}

.chat-message__owner {
  margin: 2px 0;
  font-weight: normal;
  font-size: 14px;
}

.out-message .chat-message__owner {
  text-align: right;
}

.chat-message__readStatus {
  margin: 0 5px;
  flex-shrink: 0;
  align-self: flex-end;
  font-size: 12px;
  color: rgba(0, 0, 0, .5);
}
</style>