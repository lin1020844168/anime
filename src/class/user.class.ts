import { FriendInfo, Register } from "@/api";
import * as Api from "@/api/user"
import { loginNotify, loginSuccess, logoutSuccess, successNotification } from "@/api/utils";
import {TOKEN}  from '@/common/constanst/constanst'
import { usePlayCache } from "@/hooks/user";
import { useFavStore } from "@/stores/fav.store";
import { usePlayCacheStore } from "@/stores/playCache.store";
import { useSystemConfigStore } from "@/stores/systemConfig.store";
import { getPlayProgressInstance } from "./playProgress.class";

class User {
    private userId = '';
    private username = '';
    private img = '';
    private isLogin = false;
    private token = ""

    private async loadUserDataStore() {
        await usePlayCacheStore().getStore()
        await useFavStore().getStore()
    }

    private clearUserDataStore() {
        this.userId = '';
        this.username = '';
        this.img = '';
        this.token = '';
        this.isLogin = false
        usePlayCacheStore().clearStore()
        useFavStore().clearStore()
    }

    public async init() {
        const token = localStorage.getItem(TOKEN)
        if (!token) {
            loginNotify('当前用户尚未登录');
            return;
        }
        const userInfo = await Api.checkToken(token)
        this.userId = userInfo.userId
        this.username = userInfo.username
        this.img = userInfo.img
        this.token = userInfo.token
        
        if (this.getUserName()!='') {
            this.setIsLogin(true)
            this.loadUserDataStore()
            localStorage.removeItem(TOKEN)
            localStorage.setItem(TOKEN, userInfo.token)
            loginSuccess()
        } else {
            this.setIsLogin(false)
            localStorage.removeItem(TOKEN)
        }
    }
    

    public constructor() {
    }

    public async findFriend(name:string) {
        const token = this.token
        const friendList = await Api.findFriend(name, token)
        return friendList

    }

    public async login(username:string, pwd:string) {
        const userInfo = await Api.login(username, pwd);
        const token = userInfo?userInfo.token:''
        if (token && token!='') {
            localStorage.setItem(TOKEN, token)
        }
        this.username = userInfo.username
        this.img = userInfo.img
        this.userId = userInfo.userId
        this.token = userInfo.token
        if (this.username!='') {
            this.isLogin = true
            this.loadUserDataStore()
            loginSuccess()
            useSystemConfigStore().loginVisiable = false
        }
    }

    public async logout() {
        const token = localStorage.getItem(TOKEN)
        if (!token || token=='') {
            loginNotify('当前用户未进行登录操作')
            return
        }
        const isSuccess = await Api.logout(token)
        if (isSuccess) {
            this.clearUserDataStore()
            localStorage.removeItem(TOKEN)
            logoutSuccess()
        }

    }

    public async register(register:Register) {
        const isSuccess =  await Api.register(register);
        if (!isSuccess) return
        successNotification('注册状态', '注册成功')
        await this.login(register.phone, register.password)
    }

    public async getCode(phone:string) {
        await Api.getCode(phone)
    }

    public async getUser(userId:string) {
        const user:FriendInfo = await Api.getUser(userId, this.token);
        return user
    }

    public async getFriendList() {
        return await Api.getFriendList(this.userId, this.token)
    }


    public getUserId() {
        return this.userId
    }

    public setUserId(id:string) {
        this.userId = id
    }

    public getUserName() {
        return this.username;
    }

    public setUserName(username:string) {
        this.username = username
    }

    public getImg() {
        return this.img;
    }

    public setImg(img:string) {
        this.img = img
    }

    public setIsLogin(state:boolean) {
        this.isLogin = state
    }

    public getIsLogin() {
        return this.isLogin
    }

    public getToken() {
        return this.token
    }

    public setToken(token:string) {
        this.token  = token
    }
}

let user:User|null = null
export function getUserInstance() {
    return createUser()
}

export function createUser() {
    if (user==null) {
        user = new User();
    } 
    return user;
}