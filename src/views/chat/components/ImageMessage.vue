<template>
  <div class="message message-image">
    <el-image :src="message.payload.imageUrl" fit="fill" :preview-src-list="[message.payload.imageUrl]" lazy :style="{width: message.payload.imageInfo.width + 'px', height: message.payload.imageInfo.height + 'px', maxWidth: '100%'}">
      <div slot="error" class="image-slot">
        <img src="@/assets/chat/pic_fail_small.png" alt="加载失败"/>
      </div>
    </el-image>
  </div>
</template>


<script>
export default {
  name: 'ImageMessage',

  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.el-image {
  background-color: #d2d2d2;
  border: 3px solid #d2d2d2;
  box-sizing: border-box;
  border-radius: 6px;
}

.el-image > image {
  border-radius: 3px;
}
</style>

<style scoped>
.message-image {
  max-width: 450px;
}

.message-image:focus {
  border: 3px solid #d2d2d2;
}
</style>
