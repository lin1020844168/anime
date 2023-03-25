import { getax } from '@/common/request'
import * as Returns from './type'
import * as ApiType from './api.type'

export async function getFrendList():Promise<Returns.FriendList> {
    try {
        const {data} = await getax<ApiType.FriendList>('https://127.0.0.1:30000/api/chat/getFrendList')
        return data.data
    } catch {
        return []
    }
}


