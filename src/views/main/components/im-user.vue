<template>
  <div class="im-user">
    <el-row type="flex" align="middle">
      <figure>
        <el-avatar src="" :size="36"></el-avatar>
      </figure>
      <el-row class="im-user-content" type="flex" justify="space-between">
        <h6 class="name">{{ data.label }}</h6>
        <small>{{ data.text }}</small>
      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ImUser',

  props: {
    data: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped>
figure {
  flex: 0;
  margin: 0;
  margin: 10px;
}

.im-user-content {
  flex-direction: column;
  height: 100%;
}

.name {
  margin: 0;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
}

small {
  color: gray;
  white-space: nowrap;
  overflow: hidden;
}
</style>