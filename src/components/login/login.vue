<template>
    <div class="aw-dailog__mask"></div>
        <div class="container"
            :class="{'right-panel-active':turn}"
        >
            <!-- 注册 -->
            <Icon
              @click="systemConfig.loginVisiable = false"
              class="container__close"
              name="delete2"
            />
            <div class="container_form container--signup">
                <div class="form" id="form1" >
                    <h2 class="form_title">注册</h2>
                    <input v-model="usernameR" type="text" placeholder="手机号" class="input" name="username" />
                    <input v-model="name" type="text" placeholder="昵称" class="input" name="name"/>
                    <input v-model="passwordR" type="password" placeholder="密码" class="input" name="password"/>
          
                      <input v-model="code" type="text" placeholder="验证码" class="input" />
                      <el-button @click="getCode()" class="getCode" round>获取验证码</el-button>
                
                    
                    <button @click="register({
                      phone: usernameR, password: passwordR, name: name, code: code})" class="btn signup">注册</button>
                    <div class="signinMessage"></div>
                </div>
            </div>

            <!-- 登录 -->
            <div class="container_form container--signin">
                <div class="form" id="form2">
                    <h2 class="form_title">登陆</h2>
                    <input v-model="username" type="phone" placeholder="用户名/手机号" class="input" name="username"/>
                    <input v-model="password" type="password" placeholder="密码" class="input" name="password"/>
                    <div>
                        <div class="loginMessage"></div>
                    </div>
                    <button @click="login(username, password)" class="btn login">登陆</button>
                </div>
            </div>
            <!-- 浮层 -->
            <div class="container_overlay">
                <div class="overlay">
                    <div class="overlay_panel overlay--left">
                        <button class="btn" id="signIn" @click="turn=!turn">登陆</button>
                    </div>
                    <div class="overlay_panel overlay--right">
                        <button class="btn" id="signUp" @click="turn=!turn">注册</button>
                    </div>
                </div>
            </div>
        </div>
</template>
    
    
<script lang="ts" setup>
import { Ref, ref } from '@vue/runtime-dom';
import {watch, inject} from 'vue'
import * as Api from '@/api/user'
import {useUserStore} from '@/stores/user.store'
import { useSystemConfigStore } from '@/stores/systemConfig.store';
import {Register} from '@/api/type'
const turn = ref(false)
const systemConfig = useSystemConfigStore();
const userStore = useUserStore()
const username = ref('')
const password = ref('')
const usernameR = ref('')
const passwordR = ref('')
const name = ref('')
const code = ref('')
const login = (username:string, password:string)=> {
  userStore.login(username, password)
}
const register =  (register:Register)=> {
  userStore.register(register)
}
const getCode = () => {
  userStore.getCode(usernameR.value);
}

</script>

<style lang="less" scoped>

  /* 颜色 */
  @white: #e9e9e9;
  @gray: #333;
  @blue: #095c91;
  @blue-r: #315a7491;
  @lightblue: #0393a3;

  /* 圆角 */
  @button-radius: 0.7rem;
  @radius: 30px;
  /* 大小 */
  @max-width: 758px;
  @max-height: 420px;

.form_title {
  font-weight: 300;
  margin: 0;
  margin-bottom: 1.25rem;
}

.link {
  color: (@gray);
  font-size: 0.9rem;
  margin: 1.5rem 0;
  text-decoration: none;
}

.container {
  background-color: (@white);
  border-radius: (@radius);
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
    0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: (@max-height);
  max-width: (@max-width);
  overflow: hidden;
  position: relative;
  width: 100%;


  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;

  
  color: #333;
  padding: 40px 30px;
  box-sizing: border-box;
  text-align: center;
  z-index: 3332;
  animation-duration: 0.5s;

  &__close {
    position: absolute;
    top: 10px;
    right: 30px;
    font-size: 30px;
    z-index: 200;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.25s;

    &:hover {
      transform: rotate(180deg);
    }
  }
}

.container_form {
  height: 100%;
  position: absolute;
  top: 0;
  transition: all 0.6s ease-in-out;
}

.container--signin {
  left: 0;
  width: 50%;
  z-index: 5;
}

.container.right-panel-active .container--signin {
  transform: translateX(100%);
}

.container--signup {
  left: 0;
  opacity: 0;
  width: 50%;
  z-index: 4;
}

.container.right-panel-active .container--signup {
  -webkit-animation: show 0.6s;
  animation: show 0.6s;
  opacity: 1;
  transform: translateX(100%);
  z-index: 8;
}

.container_overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
  z-index: 100;
}

.container.right-panel-active .container_overlay {
  transform: translateX(-100%);
}

.overlay {
  background-color: rgba(255, 255, 255, 0.25);
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay_panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay--left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay--left {
  transform: translateX(0);
}

.overlay--right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay--right {
  transform: translateX(20%);
}

.btn {
  background-color: (@blue);
  background-image: linear-gradient(
    90deg,
    (@blue) 0%,
    (@lightblue) 74%
  );
  border-radius: 20px;
  border: 0.2px solid (@blue-r);
  color: (@white);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.9rem 4rem;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

.form > .btn {
  margin-top: 1.5rem;
}

.btn:active {
  transform: scale(0.95);
}

.btn:focus {
  outline: none;
}

.form {
  background-color: (@white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  text-align: center;
}

.input {
  background-color: #fff;
  border: none;
  padding: 0.9rem 0.9rem;
  margin: 0.5rem 0;
  width: 100%;
}

@-webkit-keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 4;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 8;
  }
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 4;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 8;
  }
}

.aw-dailog__mask {
  position: fixed;
  z-index: 3332;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  animation-duration: 0.25s;
}

.getCode {
  position: absolute;
  left: 250px;
  top: 275px;
}

</style>