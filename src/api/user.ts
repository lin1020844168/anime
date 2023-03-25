import { getax, postax } from "@/common/request";
import * as ApiType from './api.type'
import * as FnReturns from './type'
import { getVal } from '@sorarain/utils'
import { da, it } from "element-plus/es/locale";
import { badRequestNotify, loginNotify, errorNotification, successNotification } from "./utils";
import {CacheItem} from '@/class/playHistory.class'
import { token } from "@/common/request/config";
import { Register } from "./type";

export async function getFriendList(userId:string, token:string):Promise<FnReturns.FriendList> {
    try {
        const {data} = await getax<ApiType.FriendList>(`http://127.0.0.1:20000/api/user/getFriendList/${userId}`, {
            headers: {
                token: token
            }
        });
        if (data.code!=200) {
            errorNotification('获取好友列表出错啦', data.message) 
            return []
        }
        return data.data
    } catch {
        badRequestNotify('api/getUser')
        return []
    }
}

export async function getUser(userId:string, token:string):Promise<FnReturns.FriendInfo> {
    try {
        const {data} = await getax<ApiType.FriendInfo>(`http://127.0.0.1:20000/api/user/getUser/${userId}`, {
            headers: {
                token: token
            }
        });
        if (data.code!=200) {
            errorNotification('获取用户信息出错啦', '') 
            return {
                userId:'', 
                img: '',
                name: ''
            }
        }
        return data.data
    } catch {
        badRequestNotify('api/getUser')
        return {
            userId:'', 
            img: '',
            name: ''
        } 
    }
}

export async function findFriend(name:string, token:string):Promise<FnReturns.FriendList> {
    try {
        const {data} = await getax<ApiType.FriendList>(`http://127.0.0.1:20000/api/user/findFriend/${name}`, {
            headers: {
                token: token
            }
        });
        if (data.code != 200) {
            errorNotification('', data.message)
            return []
        }
        return data.data
    } catch {
        badRequestNotify('api/getFriendList')
        return []
    }
}

export async function getCode(phone:string):Promise<void> {
    try {
        const {data} = await getax<ApiType.Void>(`http://127.0.0.1:20000/api/user/getCode/${phone}`)
        if (data.code != 200) {
            errorNotification('获取验证码失败', data.message)
            return
        }
        successNotification('验证码发送', '请注意验收')
    } catch {
        badRequestNotify('api/getCode')
    }
}

export async function register(register:Register):Promise<boolean> {
    try {
        const {data} = await postax<ApiType.Void>("http://127.0.0.1:20000/api/user/register", {
            ...register
        })
        if (data.code!=200) {
            errorNotification('注册状态', '注册失败,'+data.message)
            return false
        }
        return true
    } catch {
        badRequestNotify('api/register')
        return false
    }
}

export async function logout(token:string):Promise<boolean> {
    try {
        await postax("http://127.0.0.1:20000/api/user/logout", {}, {
            headers: {
                token: token
            }
        })
        return true
    } catch {
        badRequestNotify('api/login')
        return false
    }
    
}

export async function login(username:string, password:string):Promise<FnReturns.LoginReturn> {
    try{
        const {data} = await getax<ApiType.Token>(`http://127.0.0.1:20000/api/user/login/${username}/${password}`,)
        if (data.code != 200) {
            loginNotify(data.message)
            return {
                username: '',
                img: '', 
                userId: '', 
                token: '',
            }
        }
        return data.data
    } catch {
        badRequestNotify('api/login')
        return {
            username: '',
            img: '', 
            userId: '', 
            token: '',
        }
    }
} 

export async function checkToken(token: string):Promise<FnReturns.UserInfo> {
    const {data} = await getax<ApiType.UserInfo>(`http://127.0.0.1:20000/api/user/checkToken/${token}`)
    try {
        if (data.code != 200) {
            loginNotify(data.message)
            return {
                username: '',
                img: '',
                userId: '', 
                token: '',
            }
        }
        return data.data
    } catch {
        badRequestNotify('api/checkToken')
        return {
            username: '',
            img: '',
            userId: '', 
            token: '',
        }
    }
    
}

export async function addFav(
    user_id: number | string,
    anime_id: number | string,
    token: string
): Promise<FnReturns.AddFavReturn> {
    try {
        const { data } = await postax<ApiType.AddFav>(`http://127.0.0.1:20000/api/anime/fav/add/${user_id}/${anime_id}`,{},{
            headers: {
                token: token
            }});
        
        return data.data
    } catch {
        badRequestNotify('api/addFav')
        return false
    }

}

export async function delFav(
    user_id: number | string,
    anime_id: number | string,
    token: string
): Promise<FnReturns.DelFavReturn> {
    try {
        const { data } = await postax<ApiType.DelFav>(`http://127.0.0.1:20000/api/anime/fav/del/${user_id}/${anime_id}`,{},{
            headers: {
                token: token
            }});
        
        return data.data
    } catch {
        badRequestNotify('api/delFav')
        return false
    }

}

export async function getFav(
    id: number | string,
    token: string
): Promise<FnReturns.GetFavReturn> {
    try {
        const { data } = await getax<ApiType.GetFav>(`http://127.0.0.1:20000/api/anime/fav/get/${id}`, {
            headers: {
                token: token
            }});
        
        return getVal(() => data.data, []).map((item) => ({
            favDate: item.favDate,
            comicId: item.comicId,
            comicName: item.comicName,
            comicCover: item.comicCover
        }))
    } catch {
        badRequestNotify('api/getFav')
        return []
    }

}

export async function getHistory(
    id: number | string,
    token: string
): Promise<FnReturns.GetHistoryReturn> {
    try {
        const { data } = await getax<ApiType.GetHistory>(`http://127.0.0.1:20000/api/anime/history/get/${id}`, {
            headers: {
                token: token
            }});
        
        return getVal(() => data.data, []).map((item) => ({
            id: item.id,
            cover: item.cover,
            name: item.name,
            date: item.date
        }))
    } catch {
        badRequestNotify('api/getHistory')
        return []
    }

}

export async function addHistory(
    user_id: number | string,
    anime_id: number | string,
    token: string
): Promise<FnReturns.AddHistoryReturn> {
    try {
        const { data } = await postax<ApiType.AddHistory>(`http://127.0.0.1:20000/api/anime/history/add/${user_id}/${anime_id}`,{},{
            headers: {
                token: token
            }});
        
        return data.data
    } catch {
        badRequestNotify('api/addHistory')
        return false
    }
}

export async function delHistory(
    user_id: number | string,
    anime_id: number | string,
    token: string
): Promise<FnReturns.DelHistoryReturn> {
    try {
        const { data } = await postax<ApiType.DelHistory>(`http://127.0.0.1:20000/api/anime/history/del/${user_id}/${anime_id}`,{},{
            headers: {
                token: token
            }});
        
        return data.data
    } catch {
        badRequestNotify('api/delHistory')
        return false
    }

}

export async function clearHistory(
    user_id: number | string,
    token: string
): Promise<FnReturns.ClearHistoryReturn> {
    try {
        const { data } = await postax<ApiType.ClearHistory>(`http://127.0.0.1:20000/api/anime/history/clear/${user_id}`,{},{
            headers: {
                token: token
            }});
        
        return data.data
    } catch {
        badRequestNotify('api/clearHistory')
        return false
    }
}

export async function addEpisodeProgress(
    user_id: number | string,
    episodeId: number | string, 
    progress: number | string,
    token: string
): Promise<FnReturns.AddEpisodeProgressReturn> {
    try {
        const { data } = await postax<ApiType.AddEpisodeProgress>(`http://127.0.0.1:20000/api/anime/progress/add/${user_id}/${episodeId}/${progress}`,{},{
            headers: {
                token: token
            }});
        return data.data
    } catch {
        badRequestNotify('api/addEpisodeProgress')
        return false
    }
}


export async function getEpisodeProgress(
    user_id: number | string,
    token: string
): Promise<FnReturns.GetEpisodeProgressReturn> {
    try {
        const { data } = await getax<ApiType.GetEpisodeProgress>(`http://127.0.0.1:20000/api/anime/progress/get/${user_id}`, {
            headers: {
                token: token
            }});
        
        return getVal(() => data.data, []).map((item) => ({
            comicId: item.comicId, 
            orgId: item.orgId, 
            name: item.name,
            progress: item.progress,
            episodeId: item.episodeId,
            date: item.date
        }))
    } catch {
        badRequestNotify('api/getEpisodeProgress')
        return []
    }

}