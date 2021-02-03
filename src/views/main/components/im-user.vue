<template>
  <div class="im-user">
    <el-row type="flex" align="middle">
      <figure>
        <el-avatar src="" :size="36"></el-avatar>
      </figure>
      <el-row class="im-user-content" type="flex" justify="space-between">
        <h6 class="name">张三</h6>
        <small>南无阿弥陀佛</small>
      </el-row>
    </el-row>
  </div>
</template>

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