<template>
  <div class="window-controls">
    <div class="window-title" v-text="title"></div>
    <el-tooltip
      :content="getTooltipContent(item)"
      placement="bottom"
      :visible-arrow="false"
      :enterable="false"
      :open-delay="300"
      transition=""
      :disabled="!tips"
      v-for="(item, index) in controls"
      :key="index"
    >
      <div
        role="button"
        class="window-controls__item"
        :class="getClasses(item)"
        :title="!tips && getTooltipContent(item)"
        @click="handleClick($event, item)"
      ></div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    controls: {
      type: Array,
      default: () => {
        return ["minimize", "close"];
      },
    },
    tips: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    getClasses(item) {
      if (!(typeof item === "string" && item)) {
        return;
      }
      const classes = [item];
      switch (item) {
        case "minimize":
          classes.push("el-icon-minus");
          break;
        case "close":
          classes.push("el-icon-close");
          break;
        case "setting":
          classes.push("el-icon-setting");
      }
      return classes;
    },

    getTooltipContent(type) {
      return type === "minimize"
        ? "最小化"
        : type === "close"
        ? "关闭"
        : type === "setting"
        ? "设置"
        : "按钮";
    },

    handleClick(event, controlName) {
      switch (controlName) {
        case "minimize":
          this.$qtBridge.minimize();
          this.$emit("minimize", event);
          break;
        case "maximize":
          this.$qtBridge.maximize();
          this.$emit("maximize", event);
          break;
        case "restore":
          this.$qtBridge.restore();
          this.$emit("restore", event);
          break;
        case "close":
          this.$qtBridge.close();
          this.$emit("close", event);
          break;
        case "setting":
          this.$emit("setting-click", event);
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.window-controls {
  display: flex;
  height: 32px;
}

.window-controls__item {
  height: 100%;
  padding-left: 7px;
  padding-right: 7px;
  border-radius: 0 0 2px 2px;
  text-align: center;
  line-height: 32px;
  line-height: -moz-block-height;
  -webkit-border-radius: 0 0 2px 2px;
  -moz-border-radius: 0 0 2px 2px;
  -ms-border-radius: 0 0 2px 2px;
  -o-border-radius: 0 0 2px 2px;
}

.window-controls__item:hover {
  background-color: var(
    --theme-main-text-color-opacity-1,
    rgba(255, 255, 255, 0.1)
  );
}

.window-controls__item.close:hover {
  background-color: #ff5439;
}

.window-title {
  display: flex;
  align-items: center;
  margin-right: auto;
  color: #fff;
  text-shadow: 0 1px 0 #000;
  font-size: 12px;
  font-weight: bold;
  padding-left: 6px;
  padding-right: 6px;
  user-select: none;
  -moz-user-select: none;
  pointer-events: none;
}
</style>