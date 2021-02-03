<template>
  <div class="main-panel">
    <bounding-box :mininum="[300, 700]" />
    <div class="main-bg"></div>

    <window-controls title="OICQ" />

    <el-row type="flex" justify="center" align="middle">
      <el-avatar class="self-avatar" :size="55"></el-avatar>
      <div class="self-info">
        <h4 class="self-name">{{ user.name }}</h4>
        <el-input
          class="self-signature"
          v-model="user.signature"
          size="mini"
          placeholder="编辑个性签名"
          clearable
        ></el-input>
      </div>
      <div class="weather"></div>
    </el-row>

    <el-input
      class="search"
      v-model.trim="keyword"
      size="mini"
      prefix-icon="el-icon-search"
      placeholder="输入关键字进行搜索"
      autofocus
      clearable
    ></el-input>

    <div class="contact-wrapper">
      <div class="bg"></div>
      <el-tabs :stretch="true">
        <el-tab-pane label="联系人">
          <div class="tab-content__wrap">
            <el-tree :data="contacts">
              <template slot-scope="{ node }">
                <span v-if="!node.isLeaf">{{ node.label }}</span>
                <im-user v-else />
              </template>
            </el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="群组">
          <div class="tab-content__wrap">
            <el-tree :data="rooms"></el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="会话">
          <div class="tab-content__wrap">
            <im-user v-for="item in 12" :key="item" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { fetchPreference } from "@/api/preference";
import { Avatar, Input, Row, TabPane, Tabs, Tree } from "element-ui";
import WindowControls from '@/components/window-control/WindowControls.vue';

Vue.component(Avatar.name, Avatar);
Vue.component(Row.name, Row);
Vue.component(Input.name, Input);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.component(Tree.name, Tree);

const BoundingBox = () => import('@/components/bounding-box/BoundingBox');
const ImUser = () => import('./components/im-user');

export default {
  name: "MainPanel",

  components: { BoundingBox, ImUser, WindowControls },

  data() {
    return {
      user: {
        name: "浅安。",
        signature: "南无阿弥陀佛",
      },
      keyword: "",
      contacts: [{
        id: '1',
        label: '前端研发部',
        children: [{
          id: '1-1',
          label: '组长',
          children: [{
            id: '1-1-1',
            label: '张三'
          }]
        }]
      }, {
        id: '2',
        label: '后端研发部',
        children: [{
          id: '2-1',
          label: '李四'
        }]
      }, {
        id: '3',
        label: '安全开发部'
      }],

      rooms: [{
        id: '1',
        label: '前端群',
        children: [{
          id: '1-1',
          label: 'Front-End'
        }]
      }, {
        id: '2',
        label: '后端群',
        children: [{
          id: '2-1',
          label: 'Back-End'
        }]
      }]
    };
  },

  created() {
    this.user = this.getUserFromLocal() || this.user;
  },

  mounted() {
    document.body.hidden = false;

    fetchPreference()
      .then((res) => {
        // 1. 将配置存储到本地
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    this.$options.sockets.onopen = () => {
      this.doWebsocketCertification();
    };

    this.$options.sockets.onmessage = (data) => {
      const msg = data.data;
      const arr = msg.split("\r\n");
      const _from = arr[0].split(":")[1].trim();
      const _to = arr[1].split(":")[1].trim();
      const _event = arr[2].split(":")[1].trim();
      const _body = JSON.parse(arr[4]);

      console.log({ 发送者: _from, 接收者: _to, 事件: _event, 消息: _body });

      switch (_event) {
        case "auth":
          console.log("%c[websocket] 认证成功！", "color:#67c23a");
          this.heartbeatPackage();
          break;
        default:
          break;
      }
    };
  },

  methods: {
    getUserFromLocal() {
      return JSON.parse(window.localStorage.getItem("user"));
    },

    doWebsocketCertification() {
      if (this.$socket.readyState === this.$socket.OPEN) {
        const certify = {
          uid: `${this.user.id}@${this.user.domain}`,
          password: "test",
          type: "user",
        };
        this.emit("", "login", certify);
      }
    },

    heartbeatPackage() {
      this.heartbeatTimer = setInterval(() => {
        if (this.$socket.readyState === this.$socket.CLOSED) {
          clearInterval(this.heartbeatTimer);
        }
        this.emit("", "heartbeat", "");
      }, this.heartbeatInterval);
    },

    emit(to, event, body) {
      let msg = "FROM:" + this.user.id + "@" + this.user.domain + "\r\n";
      msg += "TO:" + to + "\r\n";
      msg += "EVENT:" + event + "\r\n";
      msg += "----\r\n";
      if (typeof body == "object") {
        msg += JSON.stringify(body);
      } else {
        msg += body;
      }
      this.$socket.send(msg);
    },
  },
};
</script>

<style scoped>
.main-panel {
  position: relative;
  width: 100%;
  height: 100%;
}

.main-bg {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #f2f2f2;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.self-info {
  flex: 1;
  overflow: hidden;
}

.self-avatar {
  box-shadow: 0 0 0px 6px rgba(0, 0, 0, 0.05);
  margin: 10px;
}

.self-name {
  margin: 0;
}

.self-signature {
  margin-top: 5px;
}

.weather {
  margin-left: auto;
  padding-left: 10px;
  padding-right: 10px;
  box-sizing: border-box;
}

.contact-wrapper {
  position: relative;
}

.contact-wrapper > .bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 1;
}

.tab-content__wrap {
  height: calc(100vh - 167px);
  overflow: auto;
}
</style>

<style>
.self-signature > .el-input__inner {
  padding: 0;
  height: 24px;
  line-height: 24px;
  background-color: transparent;
  border-color: transparent;
  border-radius: 0;
  color: #000;
}

.self-signature.el-input--suffix > .el-input__inner {
  padding-right: 30px;
}

.self-signature > .el-input__inner:hover {
  border-color: #aaa;
}

.search > .el-input__inner {
  border-radius: 0;
  border-color: transparent;
  background-color: #eeeeeedd;
}
</style>