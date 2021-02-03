<template>
  <div class="login-panel" @keydown.enter="login">

    <window-controls title="QQ" />

    <div class="login-form-container">
      <el-avatar class="login-avatar" src="/" :size="60">
        <img src="~@/assets/login/pic_login_avatar_default.png" />
      </el-avatar>
      <el-form v-model="loginForm" class="login-form">
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model.trim="loginForm.username"
            class="login-form__input username"
            type="text"
            @focus="isUsernameFocus = true"
            @blur="isUsernameFocus = false"
          >
            <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model.trim="loginForm.password"
            class="login-form__input password"
            :class="{ plain: isShowPassword }"
            :type="isShowPassword ? 'text' : 'password'"
            @focus="isPasswordFocus = true"
            @blur="isPasswordFocus = false"
          >
            <i
              slot="prefix"
              class="el-input__icon"
              :class="isPasswordFocus ? 'el-icon-unlock' : 'el-icon-lock'"
            ></i>
            <i
              slot="suffix"
              class="el-input__icon el-icon-view"
              @click="isShowPassword = !isShowPassword"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isRememberUsername">记住用户</el-checkbox>
          <el-checkbox v-model="isRememberPassword">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {
  Avatar,
  Form,
  FormItem,
  Input,
  Button,
  Checkbox,
  Message,
  Tooltip,
} from "element-ui";
import { login } from "@/api/oauth";
import { validatePassword, validateUsername } from "@/utils/validate";
import { enc } from "crypto-js/core";
import AES from "crypto-js/aes";
import Base64 from "crypto-js/enc-base64";
import WindowControls from '@/components/window-control/WindowControls.vue';


// Element-ui 的 Message 组件按需引入需要 install
Message.install = function (Vue) {
  Vue.prototype.$message = Message;
};
Vue.use(Message);

Vue.component(Avatar.name, Avatar);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Tooltip.name, Tooltip);

const IMPanel = window.IMPanel;

// AES secret key
const secret = "leadal_im";

export default {
  name: "LoginPanel",

  components: { WindowControls },

  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      isRememberUsername: false,
      isRememberPassword: false,
      isUsernameFocus: false,
      isPasswordFocus: false,
      isShowPassword: false,
    };
  },

  watch: {
    isRememberUsername(value) {
      if (!value) {
        this.isRememberPassword = false;
      }
    },
    isRememberPassword(value) {
      if (value) {
        this.isRememberUsername = true;
      }
    },
  },

  beforeCreate() {
    this.$qtBridge &&
      this.$qtBridge.resize(
        IMPanel.LoginPanel.width,
        IMPanel.LoginPanel.height
      );
  },

  created() {
    this.$qtBridge && console.log(this.$qtBridge);
    let [cipherUsername = "", cipherPassword = ""] = this.getAccountCookie();
    this.isRememberUsername = this.getPrefFromLocal()[0];
    this.isRememberPassword = this.getPrefFromLocal()[1];
    this.isRememberUsername &&
      (this.loginForm.username = AES.decrypt(cipherUsername, secret).toString(
        enc.Utf8
      ));
    this.isRememberPassword &&
      (this.loginForm.password = AES.decrypt(cipherPassword, secret).toString(
        enc.Utf8
      ));
  },

  mounted() {
    document.body.hidden = false;

    if (!this.loginForm.username) {
      this.$refs.username.focus();
    } else {
      this.$refs.password.focus();
    }
  },

  methods: {
    handleLogin() {
      let { username = "", password = "" } = this.loginForm;
      if (!this.validateAccount(username, password)) {
        this.$message({
          message: "用户名或密码不正确！",
          type: "error",
        });
        return;
      }
      this.login();
    },

    login() {
      let { username = "", password = "" } = this.loginForm;
      login({ username, password })
        .then((res) => {
          if (!res.success) {
            throw new Error(res.msg);
          }
          this.setPrefToLocal();
          this.setUserToLocal(res.user);
          this.setTokenToLocal(res.token);
          this.setAccountCookie();
          console.log("[login] 登录成功！");
          this.$qtBridge &&
            this.$qtBridge.open({
              key: "MAIN_WINDOW",
              url: IMPanel.MainPanel.url,
              caption: IMPanel.MainPanel.name,
              width: Number(IMPanel.MainPanel.width),
              height: Number(IMPanel.MainPanel.height),
              left: window.screen.availWidth - Number(IMPanel.MainPanel.width) - 10,
              top: 10
            });
        })
        .catch((err) => {
          this.$message({
            message: err || 'error: 未知异常',
            type: 'error'
          });
          console.error("[login] 登录失败！", err);
        });
    },

    setAccountCookie() {
      let uck = Base64.stringify(enc.Utf8.parse("IM_username"));
      let pck = Base64.stringify(enc.Utf8.parse("IM_password"));
      let { username = "", password = "" } = this.loginForm;
      let cipherUsername = AES.encrypt(username, secret).toString();
      let cipherPassword = AES.encrypt(password, secret).toString();
      this.$cookies.isKey(uck) && this.$cookies.remove(uck);
      this.$cookies.isKey(pck) && this.$cookies.remove(pck);
      this.isRememberUsername && this.$cookies.set(uck, cipherUsername, -1);
      this.isRememberPassword && this.$cookies.set(pck, cipherPassword, -1);
    },

    getAccountCookie() {
      let uck = Base64.stringify(enc.Utf8.parse("IM_username"));
      let pck = Base64.stringify(enc.Utf8.parse("IM_password"));
      let cipherUsername = this.$cookies.isKey(uck) && this.$cookies.get(uck);
      let cipherPassword = this.$cookies.isKey(pck) && this.$cookies.get(pck);
      return [cipherUsername, cipherPassword];
    },

    setPrefToLocal() {
      window.localStorage.setItem(
        "isRememberUsername",
        JSON.stringify(this.isRememberUsername)
      );
      window.localStorage.setItem(
        "isRememberPassword",
        JSON.stringify(this.isRememberPassword)
      );
    },

    getPrefFromLocal() {
      let isRememberUsername = JSON.parse(
        window.localStorage.getItem("isRememberUsername")
      );
      let isRememberPassword = JSON.parse(
        window.localStorage.getItem("isRememberPassword")
      );
      return [isRememberUsername, isRememberPassword];
    },

    setUserToLocal(user) {
      window.localStorage.setItem("user", JSON.stringify(user));
    },

    setTokenToLocal(token) {
      window.localStorage.setItem("token", JSON.stringify(token));
    },

    validateAccount(username, password) {
      return validateUsername(username) && validatePassword(password);
    },
  },
};
</script>

<style scoped>
.login-panel {
  width: 100%;
  height: 100%;
  background-color: #fff;
  background-image: url("~@/assets/login/bg_login_background.png");
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}

.login-form-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60%;
  background-color: #fff;
  text-align: center;
}

.login-form {
  width: 50%;
  margin: 0 auto;
}

.login-avatar {
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
  transform: translateY(-50%);
}
</style>

<style>
.login-form__input > .el-input__inner {
  border-top-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-radius: 0;
}

.login-form__input.password.plain .el-input__suffix {
  color: #409eff;
}

.el-form-item {
  margin-bottom: 12px;
}
</style>