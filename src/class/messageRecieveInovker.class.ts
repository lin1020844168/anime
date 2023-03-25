import { FriendInfo } from "@/api/type";
import { useChatStore } from "@/stores/chat.store";
import { getUserInstance } from "./user.class";
import { getWebSocketInovkerInstance, NotificationMessage,TextMessage, ReturnMessage } from "./websocket.class";
import * as ChatConstant from '@/common/constanst/constanst'
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user.store";
import chatwindow from '@/views/Chat/view/pages/chatHome/chatwindow.vue'
import { id } from "element-plus/es/locale";


class MessageRecieveInvoke {
    private strategy:Strategy|null = null;

    public chooseStrategy(messageJsonStr:string) {
        
        const message = JSON.parse(messageJsonStr);

        const type = message.type
        
        if (type==ChatConstant.NOTIFICATION) {
            this.strategy = new NotificationStrategy()
        } else if (type==ChatConstant.TEXT) {
            this.strategy = new TextStrategy()
        } else if (type==ChatConstant.RETURN) {
            this.strategy = new ReturnStrategy()
        }
        return this
    }

    public parse(messageJsonStr:string):void  {
        this.strategy?.parse(messageJsonStr)
    }
}

let messageRecieveInovker:MessageRecieveInvoke|null = null

export const MessageRecieveInvokeInstance = () => {
    if (messageRecieveInovker==null) {
        messageRecieveInovker = new MessageRecieveInvoke()
    }
    return messageRecieveInovker
}

interface Strategy {
    parse(messageJsonStr:string):void
}

class TextStrategy implements Strategy {
    parse(messageJsonStr: string): void {
        const textMessage:TextMessage = JSON.parse(messageJsonStr)
        const chatStore = useChatStore()
        if (textMessage.type==ChatConstant.TEXT) {
            if (!chatStore.chatMessageMap.has(textMessage.fromUserId)) {
                chatStore.chatMessageMap.set(textMessage.fromUserId, [])
            }
            const chatMessageList = chatStore.chatMessageMap.get(textMessage.fromUserId)
            chatMessageList?.push(textMessage)
        }
    }  
}

class ReturnStrategy implements Strategy  {
    parse(messageJsonStr: string): void {
        const message:ReturnMessage = JSON.parse(messageJsonStr);
        const token = message.token; 
        if (message.srcType == ChatConstant.NOTIFICATION) {
            const strs = token.split(':')
            const idx = Number.parseInt(strs[1])
            if (strs[0]=='add') {
                ElMessage('添加好友信息已发送')
                useChatStore().addFriendReturn(idx)
            } else if (strs[0]=='reject') {
                ElMessage('已拒绝好友请求') 
                useChatStore().rejectFriendReturn(idx)
            } else if (strs[0]=='agree') {
                ElMessage('已同意好友请求')
                useChatStore().agreeFriendReturn(idx)
            }
        }
        if (message.srcType == ChatConstant.TEXT) {
            const strs = token.split(",")
            const userId = strs[0].split(':')[1];
            const messageId = strs[1].split(':')[1];
            const chatMessageList = useChatStore().chatMessageMap.get(userId) as any[];
            let index = -1;
            chatMessageList.forEach((v, idx)=> {
                if (v.id==messageId) {
                    index = idx;
                }
            })
            console.log('...............'+JSON.stringify(chatMessageList))
            const lastMessage = chatMessageList[index]
            console.log('..........'+lastMessage)
            lastMessage.loading = false 
            chatMessageList.splice(index, 1)
            chatMessageList.push(lastMessage)
        }
    }
    
}

class NotificationStrategy implements Strategy{
    async parse(messageJsonStr:string):Promise<void> {
        const notificationMessage:NotificationMessage = JSON.parse(messageJsonStr);
        const chatStore = useChatStore()
        // const n = chatStore.newFriendList.length
        if (notificationMessage.agreeState==ChatConstant.NOOPERATION) {
            const user:FriendInfo = await getUserInstance().getUser(notificationMessage.fromUserId);
            // chatStore.newFriendList.push(user)
            chatStore.addnewFriend({...user, messageId:notificationMessage.id, loading:false})
        }
        if (notificationMessage.agreeState==ChatConstant.AGREE || notificationMessage.agreeState==ChatConstant.REJECT) {
            const user:FriendInfo = await getUserInstance().getUser(notificationMessage.fromUserId);
            chatStore.addHistory({
                ...user, 
                agreeState: notificationMessage.agreeState
            })
        }
        
    }

}

