<template>
  <div class="chat-window">
    <div class="top">
      <div class="head-pic">
        <HeadPortrait :imgUrl="frinedInfo.img"></HeadPortrait>
      </div>
      <div class="info-detail">
        <div class="name">{{ frinedInfo.name }}</div>

      </div>
      <div class="other-fun">
        <span class="iconfont icon-shipintonghua-tianchong" @click="video"> </span>
        <span class="iconfont icon-voice_calls" @click="telephone"></span>
        <label for="docFile">
          <span class="iconfont icon-wenjian"></span>
        </label>
        <label for="imgFile">
          <span class="iconfont icon-tupian"></span>
        </label>
        <input type="file" name="" id="imgFile" @change="sendImg" accept="image/*" />
        <input type="file" name="" id="docFile" @change="sendFile" accept="application/*,text/*" />
        <!-- accept="application/*" -->
      </div>
    </div>
    <div class="botoom">
      <div class="chat-content" ref="chatContent">
        <div class="chat-wrapper" v-for="item, index in chatStore.chatMessageMap.get(props.frinedInfo.userId)" :key="item.id">
          <div class="chat-friend" v-if="item.fromUserId == props.frinedInfo.userId">
            <div class="chat-text" v-if="item.type == ChatConstant.TEXT">
              {{ item.content }}
            </div>
            <!-- <img :src="item.NOIMG?'':BASE_IMG" alt="表情" v-if="item.extend.imgType == -1" style="width: 100px; height: 100px" />
            <el-image :src="item.NOIMG?'':BASE_IMG" :preview-src-list="srcImgList" v-else>
            </el-image> -->

            <!-- <div class="chat-img" v-if="item.type == -1">
              <div class="word-file">
                <FileCard :fileType="item.extend.fileType" :file="item.content"></FileCard>
              </div>
            </div> -->
            <div class="info-time">
              <img :src="props.frinedInfo.img?BASE_IMG:BASE_IMG" alt="" />
              <span>{{ props.frinedInfo.name }}</span>
              <span>{{ formatDate(new Date(item.sendTime)) }}</span>
            </div>
          </div>
          <div class="chat-me" v-else>
            <div class="chat-text" v-if="item.type == ChatConstant.TEXT" v-loading="item.loading">
              {{ item.content }}
            </div>
            <!-- <div class="chat-img" v-if="item.type == -1">
              <img :src="item.NOIMG?'':BASE_IMG" alt="表情" v-if="item.extend.imgType == 1" style="width: 100px; height: 100px" />
              <el-image style="max-width: 300px; border-radius: 10px" :src="item.NOIMG?'':BASE_IMG" :preview-src-list="srcImgList"
                v-else>
              </el-image>
            </div> -->
            <!-- <div class="chat-img" v-if="item.type == -1">
              <div class="word-file">
                <FileCard :fileType="item.extend.fileType" :file="item.content"></FileCard>
              </div>
            </div> -->
            <div class="info-time">
              <span>{{ getUserInstance().getUserName()}}</span>
              <span>{{ formatDate(item.sendTime) }}</span>
              <img :src="getUserInstance().getImg()?BASE_IMG:BASE_IMG" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="chatInputs">
        <div class="emoji boxinput" @click="clickEmoji">
          <img src="../../../assets/img/emoji/smiling-face.png" alt="" />
        </div>
        <div class="emoji-content">
          <!-- <Emoji
            v-show="showEmoji"
            @sendEmoji="sendEmoji"
            @closeEmoji="clickEmoji"
          ></Emoji> -->
        </div>
        <input class="inputs" v-model="inputText" @keyup.enter="sendText" />
        <div class="send boxinput" @click="sendText">
          <img src="../../../assets/img/emoji/rocket.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { animation } from "../../../util/util";
import { getChatMsg } from "../../../api/getData";
import { formatDate } from "@/utils/dateUtil";
import HeadPortrait from "../../../components/HeadPortrait.vue";
import Emoji from "../../../components/Emoji.vue";
import { defineProps, watch, ref, getCurrentInstance, nextTick, reactive } from "vue";
import FileCard from "../../../components/FileCard.vue";
import { ElMessage, Message } from "element-plus";
import { FriendInfo } from "@/api";
import { getWebSocketInovkerInstance, NotificationMessage, TextMessage } from "@/class/websocket.class";
import { getSnowId } from "@/utils/idutils";
import { getUserInstance } from "@/class/user.class";
import { method } from "lodash";
import * as ChatConstant from '@/common/constanst/constanst'
import { useChatStore } from "@/stores/chat.store";
import { BASE_IMG } from "@/common/static";

const props = withDefaults(defineProps<{
  frinedInfo: FriendInfo
}
>(), {})
const srcImgList = ref([])
const inputText = ref("")
const chatStore = useChatStore()
const chatContent = ref(null) as any
//获取聊天记录
const getFriendChatMsg = () => {

}
//发送信息
const sendMsg = () => {

}

//获取窗口高度并滚动至最底层
const scrollBottom = () => {
  nextTick(()=> {
    const obj = reactive(chatContent)
    const target = obj.value.scrollHeight
    obj.value.scrollTop = target
    // clearInterval(obj.value.timer);
    // let step = (target - obj.value.scrollTop-obj.value.offsetHeight)/3;
    // step = Math.ceil(step);
    // obj.value.timer = setInterval(()=> {
    //   if (obj.value.scrollTop+step+obj.value.offsetHeight >= target) {
    //     clearInterval(obj.value.timer);
    //   } else {
    //     obj.value.scrollTop = obj.value.scrollTop + step
    //     console.log(obj.value.scrollHeight, obj.value.scrollTop, obj.value.offsetHeight)
    //   }
    // }, 100);
  }
)
}
watch(()=>chatStore.chatMessageMap.get(props.frinedInfo.userId), ()=> {
  scrollBottom()
}, {immediate: true, deep: true})
//关闭标签框
const clickEmoji = () => {

}
//发送文字信息
const sendText = () => {
  if (!inputText.value) {
    ElMessage('消息不能为空哦~')
    return
  }
  const textMessage: TextMessage = {
    id: getSnowId(),
    toUserId: props.frinedInfo.userId,
    fromUserId: getUserInstance().getUserId(),
    method: ChatConstant.SINGLE,
    type: ChatConstant.TEXT,
    sendTime: new Date(),
    isRead: false,
    content: inputText.value,
    token: ''
  }
  textMessage.token = 'userId:' + props.frinedInfo.userId+','+'messageId'+":"+textMessage.id;
  chatStore.chatMessageMap.get(props.frinedInfo.userId)?.push({...textMessage, loading: true})
  getWebSocketInovkerInstance().sendMsg(textMessage)
  inputText.value = ''
}
//发送表情
const sendEmoji = () => {

}
//发送本地图片
const sendImg = () => {

}
//发送文件
const sendFile = () => { }
// 发送语音
const telephone = () => {
  ElMessage({
    message: '"该功能还没有开发哦，敬请期待一下吧~🥳"'
  })
}
//发送视频
const video = () => {
  ElMessage({
    message: '"该功能还没有开发哦，敬请期待一下吧~🥳"'
  })
}

</script>
<style lang="less" scoped>
.chat-window {
  width: 100%;
  height: 100%;
  margin-left: 20px;
  position: relative;

  .top {
    margin-bottom: 50px;

    &::after {
      content: "";
      display: block;
      clear: both;
    }

    .head-pic {
      float: left;
    }

    .info-detail {
      float: left;
      margin: 5px 20px 0;

      .name {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }

      .detail {
        color: #9e9e9e;
        font-size: 12px;
        margin-top: 2px;
      }
    }

    .other-fun {
      float: right;
      margin-top: 20px;

      span {
        margin-left: 30px;
        cursor: pointer;
      }

      // .icon-tupian {

      // }
      input {
        display: none;
      }
    }
  }

  .botoom {
    width: 100%;
    height: 70vh;
    background-color: var(--aside-bg-color);
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;

    .chat-content {
      width: 100%;
      height: 85%;
      overflow-y: scroll;
      padding: 20px;
      box-sizing: border-box;

      &::-webkit-scrollbar {
        width: 0;
        /* Safari,Chrome 隐藏滚动条 */
        height: 0;
        /* Safari,Chrome 隐藏滚动条 */
        display: none;
        /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
      }

      .chat-wrapper {
        position: relative;
        word-break: break-all;

        .chat-friend {
          width: 100%;
          float: left;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .chat-text {
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 20px 20px 5px;
            background-color: rgb(56, 60, 75);
            color: #fff;

            &:hover {
              background-color: rgb(39, 42, 55);
            }
          }

          .chat-img {
            img {
              width: 100px;
              height: 100px;
            }
          }

          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 10px;
            }

            span:last-child {
              color: rgb(101, 104, 115);
              margin-left: 10px;
              vertical-align: middle;
            }
          }
        }

        .chat-me {
          width: 100%;
          float: right;
          margin-bottom: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;

          .chat-text {
            float: right;
            max-width: 90%;
            padding: 20px;
            border-radius: 20px 20px 5px 20px;
            background-color: rgb(29, 144, 245);
            color: #fff;

            &:hover {
              background-color: rgb(26, 129, 219);
            }
          }

          .chat-img {
            img {
              max-width: 300px;
              max-height: 200px;
              border-radius: 10px;
            }
          }

          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 14px;
            display: flex;
            justify-content: flex-end;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-left: 10px;
            }

            span {
              line-height: 30px;
            }

            span:first-child {
              color: rgb(101, 104, 115);
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
      }
    }

    .chatInputs {
      width: 90%;
      position: absolute;
      bottom: 0;
      margin: 3%;
      display: flex;

      .boxinput {
        width: 50px;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 1px solid rgb(80, 85, 103);
        position: relative;
        cursor: pointer;

        img {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .emoji {
        transition: 0.3s;

        &:hover {
          background-color: rgb(46, 49, 61);
          border: 1px solid rgb(71, 73, 82);
        }
      }

      .inputs {
        width: 90%;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 2px solid rgb(34, 135, 225);
        padding: 10px;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 20px;
        color: #fff;
        font-weight: 100;
        margin: 0 20px;

        &:focus {
          outline: none;
        }
      }

      .send {
        background-color: rgb(29, 144, 245);
        border: 0;
        // transition: 0s;
        box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);

        &:hover {
          box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
        }
      }
    }
  }
}
</style>