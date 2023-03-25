<template>
    <div class="newFrend">
        <div class="addTitle">新的朋友</div>
        <div class="newList">
            <div v-for="item, index in chatStore.newFriendList" :key="chatStore.incr">
                <li>
                    <HeadPortrait class="headimg" :imgUrl="item.img?item.img:BASE_IMG"></HeadPortrait>
                    <span class="name">{{ item.name }}</span>
                    <span v-loading="item.loading" class="btn">
                        <el-button type="primary" round @click="agree(item.userId, item.messageId, index)">同意</el-button>
                        <el-button type="danger" round @click="reject(item.userId, item.messageId, index)">拒绝</el-button>
                    </span>
                </li>
            </div>
        </div>
    </div>
    <div class="history">
        <div class="addTitle">历史记录</div>
        <div class="newList">
            <div v-for="item in chatStore.applyHistoryList">
                <li>
                    <HeadPortrait class="headimg" :imgUrl="item.img?item.img:BASE_IMG"></HeadPortrait>
                    <span class="name">{{ item.name }}</span>
                    <span class="btn">
                        <el-button v-if="item.agreeState==ChatConstant.AGREE" 
                            type="primary" round>已同意</el-button>
                        <el-button v-else-if="item.agreeState==ChatConstant.REJECT"
                         type="danger" round>已拒绝</el-button>
                    </span>
                </li>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getUserInstance } from '@/class/user.class';
import { getWebSocketInovkerInstance, NotificationMessage } from '@/class/websocket.class';
import * as ChatConstant from '@/common/constanst/constanst';
import { BASE_IMG } from '@/common/static';
import { useChatStore } from '@/stores/chat.store';
import HeadPortrait from '@/views/Chat/components/HeadPortrait.vue';
import { ref } from 'vue';
const username = ref('')
const chatStore = useChatStore()
const agree = (userid:string, messageId:string|null, index:number) => {
    const message:NotificationMessage = {
        id: messageId,
        toUserId: userid,
        fromUserId: getUserInstance().getUserId(),
        method: ChatConstant.SINGLE,
        type: ChatConstant.NOTIFICATION, 
        agreeState: ChatConstant.AGREE, 
        sendTime: new Date(), 
        token: 'agree:'+index
    }
    useChatStore().newFriendList[index].loading = true
    getWebSocketInovkerInstance().sendMsg(message)
}
const reject = (userid: string, messageId:string|null, index:number) => {
    const message:NotificationMessage = {
        id: messageId,
        toUserId: userid,
        fromUserId: getUserInstance().getUserId(),
        method: ChatConstant.SINGLE,
        type: ChatConstant.NOTIFICATION, 
        agreeState: ChatConstant.REJECT, 
        sendTime: new Date(), 
        token: 'reject:'+index
    }
    useChatStore().newFriendList[index].loading = true
    getWebSocketInovkerInstance().sendMsg(message)
}

</script>       

<style lang="less" scoped>
.history {
    margin-left: 20px;
    height: 40vh;

    .newList {
        height: 80%;
        margin-top: 10px;
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
            margin: 0 20px;
            position: relative;
            vertical-align: middle;

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

            ::v-deep .el-button {
                background-color: var(--aside-bg-color);
                cursor: auto;
            }
        }
    }
}

.newFrend {
    margin-left: 20px;
    height: 40vh;

    .newList {
        height: 80%;
        margin-top: 10px;
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
            margin: 0 20px;
            position: relative;
            vertical-align: middle;

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

</style>