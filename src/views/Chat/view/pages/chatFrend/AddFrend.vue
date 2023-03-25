<template>
        <div class="addFrend">
            <div class="addTitle">查找朋友</div>
            <div class="search-box">
                <input type="text" class="search-input" v-model="name" placeholder="搜索朋友" />
                <Icon class="search-icon" name="search" @click="findFriend" />
            </div>
            <div class="addList">
                <div v-for="item, index in chatStore.findFriendList">
                    <li>
                        <HeadPortrait class="headimg" :imgUrl="item.img?item.img:BASE_IMG"></HeadPortrait>
                        <span class="name">{{ item.name }}</span>
                        <span v-loading="item.loading" class="btn">
                            <el-button  @click="addFriend(item.userId, index)" type="primary" round>添加</el-button>
                        </span>
                    </li>
                </div>
            </div>

        </div>
</template>
  
<script lang="ts" setup>
import { FriendInfo, FriendList } from '@/api';
import { errorNotification } from '@/api/utils';
import { getUserInstance } from '@/class/user.class';
import { getWebSocketInovkerInstance, NotificationMessage } from '@/class/websocket.class';
import * as ChatConstant from '@/common/constanst/constanst';
import { BASE_IMG } from '@/common/static';
import { useChatStore } from '@/stores/chat.store';
import { getSnowId } from '@/utils/idutils';
import HeadPortrait from '@/views/Chat/components/HeadPortrait.vue';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
const name = ref('')
const chatStore = useChatStore()
const findFriend = async ()=> {
    if (!name.value) return
    chatStore.updateFindFriendList(name.value)
}
const addFriend = (userid:string, index: number) => {
    const message:NotificationMessage = {
        id: getSnowId(),
        toUserId: userid,
        fromUserId: getUserInstance().getUserId(),
        method: ChatConstant.SINGLE,
        type: ChatConstant.NOTIFICATION,
        agreeState: ChatConstant.NOOPERATION, 
        sendTime: new Date(), 
        token: 'add:'+index
    }
    chatStore.findFriendList[index].loading = true
    getWebSocketInovkerInstance().sendMsg(message)
}


</script>       
  
<style lang="less" scoped>

    .addFrend {
        height: 90vh;
        margin-left: 20px;
        .addList {
            height: 70%;
            margin-top: 20px;
            overflow: hidden;
            overflow-y: scroll;

            &::-webkit-scrollbar {
                width: 0;
                /* Safari,Chrome 隐藏滚动条 */
                height: 0;
                /* Safari,Chrome 隐藏滚动条 */
                display: none;
                /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
            }

            li {
                height: 80px;
                width: 90%;
                position: relative;
                margin: 0 30px;
                .headimg {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .name {
                    position: absolute;
                    top: 50%;
                    left: 100px;
                    transform: translateY(-50%);
                }

                .btn {
                    position: absolute;
                    right: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
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
            cursor: pointer;
            position: absolute;
            right: 30px;
            top: 25%;
        }
    }
</style>