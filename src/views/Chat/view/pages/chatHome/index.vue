<template>
  <div class="chatHome">
    <div class="chatLeft">
      <div class="title">
        聊天室
      </div>
      <div class="online-person">
        <span class="onlin-text">聊天列表</span>
        <PersonList @click-person="clickPerson" :personList="personList" />
      </div>   
    </div>
    <div class="chatRight">
      <!-- <router-view></router-view> -->
      <div v-if="showChatWindow">
        <ChatWindow
          :frinedInfo="chatWindowInfo"
          @personCardSort="personCardSort"
        ></ChatWindow>
      </div>
      <div class="showIcon" v-else>
        <!-- <span class="iconfont icon-snapchat"></span> -->
        <img class="icon-snapchat" :src="getAssetsFil('snapchat.png')" alt="" />
      </div>
    </div>
    <!-- <el-col :span="4"><div class="grid-content bg-purple"></div></el-col> -->
  </div>
</template>

<script>
import PersonCard from "../../../components/PersonCard.vue";
import ChatWindow from "./chatwindow.vue"; 
import PersonList from '../../../components/PersonList.vue';

import { getFriend } from "../../../api/getData";
import { BASE_IMG } from "@/common/static";
export default {
  name: "Chat",
  components: {
    PersonList,
    PersonCard,
    ChatWindow,
  },
  mounted() {
    this.personList = [
        {
            img: "",
            name: "大毛",
            detail: "我是大毛",
            lastMsg: "to do",
            id: "1002",
            headImg: BASE_IMG,

        },
        {
            img: "",
            name: "小毛",
            detail: "我是小毛",
            lastMsg: "dada dw ertgthy j uy",
            id: "1003",
            headImg: BASE_IMG,

        },
        {
            img: "",
            name: "小王",
            detail: "我是小王",
            lastMsg: "大萨达萨达所大大萨达",
            id: "1004",
            headImg: BASE_IMG, 
        },
        {
            img: "",
            name: "大毛",
            detail: "我是大毛",
            lastMsg: "to do",
            id: "1002",
            headImg: BASE_IMG,

        },
        {
            img: "",
            name: "小毛",
            detail: "我是小毛",
            lastMsg: "dada dw ertgthy j uy",
            id: "1003",
            headImg: BASE_IMG,

        },
        {
            img: "",
            name: "小王",
            detail: "我是小王",
            lastMsg: "大萨达萨达所大大萨达",
            id: "1004",
            headImg: BASE_IMG, 
        },
    ]
  }, 
  data() {
    return {
      pcCurrent: "",
      personList: [],
      showChatWindow: false,
      chatWindowInfo: {},
    };
  },
  methods: {
    getAssetsFil(url) {
      return new URL(`../../../assets/img/${url}`, import.meta.url).href
    },
    clickPerson(info) {
      this.showChatWindow = true;
      this.chatWindowInfo = info;
      this.personInfo = info;
      this.pcCurrent = info.id;
    },
    personCardSort(id) {
      if (id !== this.personList[0].id) {
        console.log(id);
        let nowPersonInfo;
        for (let i = 0; i < this.personList.length; i++) {
          if (this.personList[i].id == id) {
            nowPersonInfo = this.personList[i];
            this.personList.splice(i, 1);
            break;
          }
        }
        this.personList.unshift(nowPersonInfo);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.chatHome {
  // margin-top: 20px;
  .chatLeft {
    width: 280px;
    .title {
      font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
    }
    .online-person {
      margin-top: 20px;
      .onlin-text {
        padding-left: 10px;
        color: rgb(176, 178, 189);
      }
      .person-cards-wrapper {
        padding-left: 10px;
        height: 65vh;
        margin-top: 20px;
        overflow: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 0; /* Safari,Chrome 隐藏滚动条 */
          height: 0; /* Safari,Chrome 隐藏滚动条 */
          display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
        }
      }
    }
  }

  .chatRight {
    flex: 1;
    padding-right: 30px;
    .showIcon {
      position: absolute;
      top: calc(50% - 150px); /*垂直居中 */
      left: calc(50% - 50px); /*水平居中 */
      .icon-snapchat {
        width: 300px;
        height: 300px;
        font-size: 300px;
        // color: rgb(28, 30, 44);
      }
    }
  }
}
</style>