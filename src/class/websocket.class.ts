import { FriendInfo } from "@/api"
import { badRequestNotify, errorNotification } from "@/api/utils"
import { token, WS } from "@/common/request/config"
import { BASE_IMG } from "@/common/static"
import { useChatStore } from "@/stores/chat.store"
import { type } from "os"
import { json } from "stream/consumers"
import { MessageRecieveInvokeInstance } from "./messageRecieveInovker.class"
import { getUserInstance } from "./user.class"

export type TextMessage = {
    id: string|null,
    toUserId: string,
    fromUserId: string,
    method: number,
    type: number,
    sendTime: Date,
    isRead: boolean, 
    content: string, 
    token:string
} 

export type NotificationMessage = {
    id: string|null,
    toUserId: string,
    fromUserId: string,
    method: number,
    type: number,
    sendTime: Date,
    agreeState: number, 
    token: string
}

export type ReturnMessage = {
    token:string, 
    type:number,
    srcType: number, 
    isSucess: boolean
    
}

class WebSocketInovker {
    private websocket: WebSocket | null = null

    public getWebsocket() {
        return this.websocket
    }

    public sendMsg(msg: any) {
        if (this.websocket == null) {
            errorNotification('socket出错了', '当前连接尚未建立')
            return
        }
        const messageJsonStr = JSON.stringify(msg)
        this.websocket.send(messageJsonStr)
    }

    public close() {
        if (this.websocket == null) {
            errorNotification('socket出错了', '当前连接尚未建立')
            return
        }
        this.websocket.close()
    }

    public connect() {
        const token = getUserInstance().getToken()
        if (!token) errorNotification('当前用户未登录', '')
        this.websocket = new WebSocket(WS+token)
        console.log(WS+token)
        if (this.websocket != null) {
            this.websocket.addEventListener('open', e => {
                console.log('WebSocket已连接');

            })
            // 监听WebSocket的消息事件
            this.websocket.addEventListener('message', async event => {
                console.log(event.data)
                MessageRecieveInvokeInstance().chooseStrategy(event.data).parse(event.data)

            });

            // 监听WebSocket的关闭事件
            this.websocket.addEventListener('close', event => {
                console.log('WebSocket已关闭');
            });

            // 监听WebSocket的错误事件
            this.websocket.addEventListener('error', event => {
                console.error('WebSocket错误：', event);
            });
        }
    }
}

let webSocketInovker: WebSocketInovker | null = null

export function getWebSocketInovkerInstance() {
    if (webSocketInovker == null) {
        webSocketInovker = new WebSocketInovker()
    }
    return webSocketInovker;
}