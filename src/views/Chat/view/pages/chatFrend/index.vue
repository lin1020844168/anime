<template>
  <el-container>
    <el-aside width="260px">
      <div class="contacts-page">
        <h1 class="page-title">通讯录</h1>
        <button class="addbtn" @click="toNew">
          新的朋友<Icon class="iconfont" name="tixing"></Icon>
        </button>
        <button class="addbtn" @click="toAdd">
          添加好友<Icon class="iconfont" name="tianjiayonghu"></Icon>
        </button>
        <div class="search-box">
          <input type="text" class="search-input" v-model="input" placeholder="搜索联系人" />
          <Icon class="search-icon" name="search" />
        </div>

        <PersonList class="person-list" :person-list="chatStore.friendList" @click-person="clickPerson" />
      </div>
    </el-aside>
    <el-main>
      <div v-if="showState == showChatwindow">
        <ChatWindow :frinedInfo="chatWindowInfo"></ChatWindow>
      </div>
      <div v-else-if="showState == showNew">
        <NewFrend></NewFrend>
      </div>
      <div v-else-if="showState==showAdd">
        <AddFrend></AddFrend>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { BASE_IMG } from '@/common/static';
import { defineComponent, ref, reactive } from 'vue';
import PersonList, { PersonInfo } from '../../../components/PersonList.vue'
import ChatWindow from '../chatHome/chatwindow.vue';
import NewFrend from './NewFrend.vue';
import AddFrend from './AddFrend.vue';
import { useChatStore } from '@/stores/chat.store';
import { FriendInfo } from '@/api';
const chatStore = useChatStore();
chatStore.initFriendList();
const input = ref('')
const showChatwindow = 1
const showNew = 2
const showAdd = 3
const showState = ref(2)
const chatWindowInfo:FriendInfo = reactive({
  userId: '', 
  img: '', 
  name: ''
})
const pcCurrent = ref(0)

const clickPerson = (info:PersonInfo, idx:number) => {
  showState.value = 1;
  chatWindowInfo.name = info.name;
  chatWindowInfo.img = info.img;
  chatWindowInfo.userId = info.id
  console.log('info........................' + JSON.stringify(info))
  pcCurrent.value = idx;
}

const toNew= () => {
  showState.value = 2;
}
const toAdd=()=> {
  showState.value = 3
}

</script>

<style lang="less" scoped>
.person-list {
  height: 47vh;
}
.addbtn {
  margin-top: 20px;
  border-radius: 125px;
  width: 250px;
  height: 40px;
  display: block;
  background-color: var(--aside-bg-color);
  color: var(--font-color);
  border: 0.2px solid var(--font-color);
  box-shadow: 0px 0px 10px 0px var(--aside-bg-color);

  &:hover {
    color: #1d90f5;
    transition: 0.3s;
    border: 0.2px solid #1d90f5;
    box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
  }

  .iconfont {
    padding-left: 5px;
  }
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.search-box {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  position: relative;

  .search-input {

    height: 30px;
    text-indent: 20px;
    flex-grow: 1;
    border: none;
    background-color: var(--aside-bg-color);
    color: var(--font-color);
    padding: 5px;
    margin-right: 10px;
    border-radius: 10px;

    &:focus {
      outline: none;
    }
  }

  .search-icon {
    position: absolute;
    right: 10%;
    top: 25%;
  }
}</style>
