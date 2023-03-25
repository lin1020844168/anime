import { jsonParse } from '@sorarain/utils'
import { ref } from 'vue'
import { StorageWatcherCling } from './storageWatcher.class'
import * as UserApi from '@/api/user'
import { loginNotify } from '@/api/utils'
import { getUserInstance } from './user.class'


export interface CacheItem {
  id: number
  cover: string
  name: string
  date: number
}

const PLAY_HISTORY_STORE_KEY = 'PLAY_HISTORY_STORE'

/**
 * 播放历史缓存
 */
class PlayHistory extends StorageWatcherCling {
  constructor() {
    super(PLAY_HISTORY_STORE_KEY)
  }
  /** 缓存列表 */
  private cache_ = ref<CacheItem[]>([])

  public get cache() {
    return this.cache_.value
  }

  /**
   * 添加历史数据
   * @param item 动漫信息
   */
  public add(item: Omit<CacheItem, 'date'>) {
    const user = getUserInstance()
    if (!user.getIsLogin()) {
      return
    }
    const index = this.cache_.value.findIndex((ch) => ch.id == item.id)
    if (!!~index) {
      this.cache_.value.splice(index, 1)
    }
    this.cache_.value.unshift({
      ...item,
      date: new Date().getTime()
    })
    const userId = user.getUserId();
    const token = user.getToken()
    UserApi.addHistory(userId, item.id, token)
  }

  /**
   * 删除指定id数据
   * @param id 动漫id
   */
  public remove(id: CacheItem['id']) {
  const user = getUserInstance()
    if (!user.getIsLogin()) {
      loginNotify('请先登录后再进行操作')
      return
    }
    const index = this.cache_.value.findIndex((ch) => ch.id === id)
    if (!!~index) {
      this.cache_.value.splice(index, 1)
    }
    const userId = user.getUserId();
    const token = user.getToken()
    UserApi.delHistory(userId, id, token)
  }

  /**
   * 数据-本地保存
   */
  public saveStore() {
    // localStorage.setItem(
    //   PLAY_HISTORY_STORE_KEY,
    //   JSON.stringify(this.cache_.value)
    // )
  }

  /**
   * 数据-本地获取
   */
  public async getStore() {
    // const data = jsonParse<CacheItem[]>(
    //   localStorage.getItem(PLAY_HISTORY_STORE_KEY),
    //   []
    // )
    const user = getUserInstance()
    if (!user.getIsLogin()) {
      return
    }
    const userId = user.getUserId();
    const token = user.getToken()
    const data = await UserApi.getHistory(userId, token)
    if (data instanceof Array) {
      this.cache_.value = data
    }
  }

  /**
   * 数据-历史清空
   */
  public clearHistory() {
    const user = getUserInstance()
    if (!user.getIsLogin()) {
      loginNotify('请先登录后再进行操作')
      return
    }
    this.cache_.value.splice(0)
    // localStorage.removeItem(PLAY_HISTORY_STORE_KEY)
    const userId = user.getUserId();
    const token = user.getToken()
    UserApi.clearHistory(userId, token)
  }

  public clearStore() {
    this.cache_.value.splice(0)
  }
}

let instance: PlayHistory | null
export function createPlayHistory() {
  if (!instance) {
    instance = new PlayHistory()
  }
  return instance
}
export function getPlayHistoryInstance() {
  return instance!
}
