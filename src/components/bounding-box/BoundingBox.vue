<template>
  <div class="bounding-box">
    <div class="bounding-box--n" @mousedown="handleMousedown($event, 'n')"></div>
    <div class="bounding-box--e" @mousedown="handleMousedown($event, 'e')"></div>
    <div class="bounding-box--s" @mousedown="handleMousedown($event, 's')"></div>
    <div class="bounding-box--w" @mousedown="handleMousedown($event, 'w')"></div>
    <div class="bounding-box--nw" @mousedown="handleMousedown($event, 'nw')"></div>
    <div class="bounding-box--ne" @mousedown="handleMousedown($event, 'ne')"></div>
    <div class="bounding-box--sw" @mousedown="handleMousedown($event, 'sw')"></div>
    <div class="bounding-box--se" @mousedown="handleMousedown($event, 'se')"></div>
  </div>
</template>

<script>
export default {
  name: 'BoundingBox',

  props: {
    mininum: {
      type: Array,
      default: () => [100, 100],
      valitator: (value) => Array.isArray(value) && value.length === 2
    }
  },

  created() {
    if (typeof this.mininum[0] !== 'number' || typeof this.mininum[1] !== 'number') return;
    this.$qtBridge.setMinimumSize(this.mininum[0], this.mininum[1]);
  },

  methods: {
    // 上边
    moveTop(event) {
      if (window.outerHeight <= this.mininum[1] && window.screenY <= event.screenY) {
        return;
      }
      const y = window.screenY;
      // 14 是 5 + 5 的边框阴影 + 拉条的宽度 4 px
      this.$qtBridge.geometry(window.screenX, event.screenY - 14, window.outerWidth, window.outerHeight - (event.screenY - 14 - y));
    },

    // 右边
    moveRight(event) {
      this.$qtBridge.geometry(window.screenX, window.screenY, event.screenX - window.screenX + 14, window.outerHeight);
    },

    // 下边
    moveBottom(event) {
      this.$qtBridge.geometry(window.screenX, window.screenY, window.outerWidth, event.screenY - window.screenY + 14);
    },

    // 左边
    moveLeft(event) {
      if (window.outerWidth <= this.mininum[0] && window.screenX <= event.screenX) {
        return;
      }
      const x = window.screenX;
      this.$qtBridge.geometry(event.screenX - 14, window.screenY, window.outerWidth - (event.screenX - 14 - x), window.outerHeight);
    },

    // 左上角
    moveNW(event) {
      const x = window.screenX;
      const y = window.screenY;
      const width = window.outerWidth;
      const height = window.outerHeight;
      const [ miniWidth, miniHeight ] = this.mininum;
      // 如果宽高都已最小
      if (width <= miniWidth && x <= event.screenX && height <= miniHeight && y <= event.screenY) {
        return;
      }
      // 如果宽度达到最小
      if (width <= miniWidth && x <= event.screenX) {
        this.$qtBridge.geometry(x, event.screenY - 14, width, height - (event.screenY - 14 - y));
        return;
      }
      // 如果高度达到最小
      if (height <= miniHeight && y <= event.screenY) {
        this.$qtBridge.geometry(event.screenX - 14, y, width - (event.screenX - 14 - x), height);
        return;
      }
      this.$qtBridge.geometry(event.screenX - 14, event.screenY - 14, width - (event.screenX - 14 - x), height - (event.screenY - 14 - y));
    },

    // 右上角
    moveNE(event) {
      const x = window.screenX;
      const y = window.screenY;
      const width = window.outerWidth;
      const height = window.outerHeight;
      const [ miniWidth, miniHeight ] = this.mininum;
      // 如果宽高都已最小
      if (width <= miniWidth && event.screenX <= (x + width) && height <= miniHeight && y <= event.screenY) {
        return;
      }
      // 如果高度达到最小
      if (height <= miniHeight && y <= event.screenY) {
        this.$qtBridge.geometry(x, y, event.screenX - 14 - x, height);
        return;
      }
      this.$qtBridge.geometry(x, event.screenY - 14, event.screenX - x + 14, height - (event.screenY - 14 - y));
    },

    // 左下角
    moveSW(event) {
      const x = window.screenX;
      const y = window.screenY;
      const width = window.outerWidth;
      const height = window.outerHeight;
      const [ miniWidth, miniHeight ] = this.mininum;
      // 如果宽高都已最小
      if (width <= miniWidth && event.screenX >= x && height <= miniHeight && y >= event.screenY - height) {
        return;
      }
      // 如果宽度达到最小
      if (width <= miniWidth && x <= event.screenX) {
        this.$qtBridge.geometry(x, y, width, event.screenY - 14 - y);
        return;
      }
      this.$qtBridge.geometry(event.screenX - 14, y, width - (event.screenX - 14 - x), event.screenY - y + 14);
    },

    // 右下角
    moveSE(event) {
      this.$qtBridge.geometry(window.screenX, window.screenY, event.screenX - window.screenX + 14, event.screenY - window.screenY + 14);
    },

    handleMousedown(event, orientation) {
      event.preventDefault();
      event.stopPropagation();
      switch(orientation.toUpperCase()) {
        case 'N':
          document.body.style.cursor = 'n-resize';
          document.addEventListener('mousemove', this.moveTop, false);
          document.addEventListener('mouseup', this.handleMouseup, false);
          break;
        case 'S':
          document.body.style.cursor = 's-resize';
          document.addEventListener('mousemove', this.moveBottom, false);
          document.addEventListener('mouseup', this.handleMouseup, false);
          break;
        case 'W':
          document.body.style.cursor = 'w-resize';
          document.addEventListener('mousemove', this.moveLeft, false);
          document.addEventListener('mouseup', this.handleMouseup, false);
          break;
        case 'E':
          document.body.style.cursor = 'e-resize';
          document.addEventListener('mousemove', this.moveRight, false);
          document.addEventListener('mouseup', this.handleMouseup, false);
          break;
        case 'NW':
          document.body.style.cursor = 'nw-resize';
          document.addEventListener('mousemove', this.moveNW, false);
          document.addEventListener('mouseup', this.handleMouseup, false);
          break;
        case 'NE':
          document.body.style.cursor = 'ne-resize';
          document.addEventListener('mousemove', this.moveNE, false);
          document.addEventListener('mouseup', this.handleMouseup, false);
          break;
        case 'SW':
          document.body.style.cursor = 'sw-resize';
          document.addEventListener('mousemove', this.moveSW, false);
          document.addEventListener('mouseup', this.handleMouseup, false);
          break;
        case 'SE':
          document.body.style.cursor = 'se-resize';
          document.addEventListener('mousemove', this.moveSE, false);
          document.addEventListener('mouseup', this.handleMouseup, false);
          break;
        default:
          console.warn("无法改变窗口大小");
          break;
      }
    },

    handleMouseup() {
      document.body.style.cursor = null;
      document.removeEventListener('mousemove', this.moveRight, false);
      document.removeEventListener('mousemove', this.moveBottom, false);
      document.removeEventListener('mousemove', this.moveTop, false);
      document.removeEventListener('mousemove', this.moveLeft, false);
      document.removeEventListener('mousemove', this.moveNW, false);
      document.removeEventListener('mousemove', this.moveNE, false);
      document.removeEventListener('mousemove', this.moveSW, false);
      document.removeEventListener('mousemove', this.moveSE, false);
      document.removeEventListener('mouseup', this.handleMouseup, false);
    }
  }
}
</script>

<style scoped>
.bounding-box {
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  pointer-events: none;
}

.bounding-box--n,
.bounding-box--s {
  position: absolute;
  left: 0;
  height: 4px;
  width: 100%;
  z-index: 100;
  pointer-events: auto;
}

.bounding-box--e,
.bounding-box--w {
  position: absolute;
  top: 0;
  height: 100%;
  width: 4px;
  z-index: 100;
  pointer-events: auto;
}

.bounding-box--n {
  top: 0;
  cursor: n-resize;
}

.bounding-box--e {
  right: 0;
  cursor: e-resize;
}

.bounding-box--s {
  bottom: 0;
  cursor: s-resize;
}

.bounding-box--w {
  left: 0;
  cursor: w-resize;
}

.bounding-box--nw,
.bounding-box--ne,
.bounding-box--sw,
.bounding-box--se {
  position: absolute;
  width: 10px;
  height: 10px;
  pointer-events: auto;
  z-index: 101;
}

.bounding-box--nw {
  top: 0;
  left: 0;
  cursor: nw-resize;
}

.bounding-box--ne {
  top: 0;
  right: 0;
  cursor: ne-resize;
}

.bounding-box--sw {
  bottom: 0;
  left: 0;
  cursor: sw-resize;
}

.bounding-box--se {
  bottom: 0;
  right: 0;
  cursor: se-resize;
}
</style>
