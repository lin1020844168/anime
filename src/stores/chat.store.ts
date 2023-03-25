import { defineStore } from "pinia";
import { FriendInfo, FriendList, newFriend } from "@/api";
import { getUserInstance } from "@/class/user.class";
import { PersonInfo } from "@/views/Chat/components/PersonList.vue";
import { BASE_IMG } from "@/common/static";
import * as ChatConst from '@/common/constanst/constanst'
import { getFrendList } from "@/api/chat";
import { TextMessage } from "@/class/websocket.class";

export const useChatStore = defineStore('chatStore', {
    state: () => ({
        incr: 0,
        newFriendList: [] as newFriend[], 
        applyHistoryList: [] as (FriendInfo&{agreeState:number})[], 
        friendList: [] as PersonInfo[],
        findFriendList: [] as (FriendInfo&{loading:boolean})[], 
        chatMessageMap: new Map<string, any[]>(),
        friendMap: new Map<string, PersonInfo>() 
    }),
    actions: {
        addnewFriend(user:newFriend) {
            this.newFriendList.unshift(user)
        },
        removenewFriend(userid: string) {
            this.newFriendList.filter((e)=>e.userId!=userid)
        },
        async initFriendList() {
            const friendList = await getUserInstance().getFriendList()
            this.friendList = friendList.map((e:FriendInfo) => ({
                name:e.name,
                img: e.img?e.img:BASE_IMG,
                id: e.userId
            }))
            friendList.forEach(e => {
                this.chatMessageMap.set(e.userId, [])
                this.friendMap.set(e.userId, {
                    id: e.userId, 
                    img: e.img,  
                    name: e.name
                })
            })
        }, 
        async updateFindFriendList(name:string) {
            const friendList = await getUserInstance().findFriend(name)
            this.findFriendList = friendList.map((e)=>({...e, loading: false}))
        }, 
        addFriendReturn(index:number) {
            this.findFriendList[index].loading = false
        },
        rejectFriendReturn(index:number) {

            this.applyHistoryList.unshift({...this.newFriendList[index], agreeState: ChatConst.REJECT})
            this.newFriendList[index].loading = false
            this.newFriendList.splice(index, 1)
        },
        agreeFriendReturn(index:number) {
            this.applyHistoryList.unshift({...this.newFriendList[index], agreeState: ChatConst.AGREE})
            this.newFriendList[index].loading = false
            this.newFriendList.splice(index, 1)
        }, 
        addHistory(history:(FriendInfo&{agreeState:number})) {
            this.applyHistoryList.unshift(history)
        }
    }

})