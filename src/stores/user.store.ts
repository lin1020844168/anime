import { defineStore } from "pinia";
import {getUserInstance} from '@/class/user.class'
import { Register, UserInfo } from "@/api";


export const useUserStore = defineStore('user', {
    state: ()=>({
        isLogin: false,
        username: '',
        img: '',
        token: '',
        userId: ''
    }),
    actions: {
        async login(username:string, pwd: string) {
            await getUserInstance().login(username, pwd)
            this.update()
        },
        async init() {
            await getUserInstance().init()
            this.update()
        },
        async logout() {
            await getUserInstance().logout()
            this.update()
        },
        async register(register:Register) {
            await getUserInstance().register(register)
            this.update()
        },
        async getCode(phone:string) {
            await getUserInstance().getCode(phone)
        },

        update() {
            this.isLogin = getUserInstance().getIsLogin()
            this.token = getUserInstance().getToken()
            this.img = getUserInstance().getImg()
            this.username = getUserInstance().getUserName()
            this.userId = getUserInstance().getUserId()

        }

    }

})