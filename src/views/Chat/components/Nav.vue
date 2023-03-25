<template>
  <div class="nav">
    <div class="nav-menu-wrapper">
      <ul class="menu-list">
        <li
          v-for="(item, index) in menuList"
          :key="index"
          :class="{ activeNav: index == current }"
          @click="changeMenu(index)"
        >
          <div class="block"></div>
          <span><Icon :name="item"/></span>
        </li>
      </ul>
    </div>
    <div class="own-pic">
        <HeadPortrait :imgUrl="imgUrl"></HeadPortrait>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { loginNotify } from "@/api/utils";
import { BASE_IMG } from "@/common/static";
import {ref,getCurrentInstance} from 'vue'
import { useRoute, useRouter } from "vue-router";
import HeadPortrait from './HeadPortrait.vue'

// import HeadPortrait from "./HeadPortrait.vue";
const menuList = ref([
        "xiaoxi",
        "tianjiayonghu",  
      ])
const current = ref(0)
const imgUrl = BASE_IMG
const router = useRouter()
const changeMenu = (index:number) => {
      switch (index) {
        case 0:   
          router.push({
            name: "ChatHome",       
          });
          break;
        case 1:
          router.push({
            name: "test"
          })
          break;
        case 2:
        loginNotify('该功能还没有开发哦，敬请期待一下吧~🥳')

          break;
        case 3:
        loginNotify('该功能还没有开发哦，敬请期待一下吧~🥳')
          break;
        case 4:
        loginNotify('该功能还没有开发哦，敬请期待一下吧~🥳')
          break;
        default:
          router.push({
            name: "ChatHome",
          });
      }
      current.value = index;
    }
</script>

<style lang="less" scoped>
.nav {
  width: 100%;
  height: 90vh;
  position: relative;
  border-radius: 20px 0 0 20px;
  background-color: var(--aside-bg-color);
  .nav-menu-wrapper {
    position: absolute;
    top: 40%;
    transform: translate(0, -50%);
    .menu-list {
      margin-left: 10px;

      li {
        margin: 40px 0 0 30px;
        list-style: none;
        cursor: pointer;
        position: relative;
        .block {
          background-color: rgb(29, 144, 245);
          position: absolute;
          left: -40px;
          width: 6px;
          height: 25px;
          transition: 0.5s;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          opacity: 0;
        }
        &:hover {
          span {
            color: rgb(29, 144, 245);
          }
          .block {
            opacity: 1;
          }
        }
      }
    }
  }
  .own-pic {
    position: absolute;
    bottom: 10%;
    margin-left: 25px;
  }
}
.activeNav {
  span {
    color: rgb(29, 144, 245);
  }
  .block {
    opacity: 1 !important;
  }
}
</style>