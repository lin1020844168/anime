import { getax } from '@/common/request'
import { jsonParse, arrChildSwap } from '@sorarain/utils'
import { ref } from 'vue'
import { StorageWatcherCling } from './storageWatcher.class'
import * as Api from '@/api/user'
import { getUserInstance } from './user.class'

const COMIC_FAV_STORE_KEY = 'COMIC_FAV_STORE'

export interface Comic {
  /** 动漫id */
  comicId: ComicId
  /** 动漫名称 */
  comicName: string
  /** 动漫封面 */
  comicCover: string
}

export type ComicFavItem = Comic & {
  /** 收藏时间 */
  favDate: number
}

class ComicFav extends StorageWatcherCling {
  constructor() {
    super(COMIC_FAV_STORE_KEY)
  }
  private fav_ = ref<ComicFavItem[]>([])
  public get fav() {
    return this.fav_.value
  }

  public getTime() {
    return new Date().getTime()
  }

  /**
   * 判断是否存在此集
   * @param comicId
   * @returns
   */
  public has(comicId: ComicFavItem['comicId']) {
    return !!~this.fav_.value.findIndex((item) => item.comicId === comicId)
  }

  public index(comicId: ComicFavItem['comicId']) {
    return this.fav_.value.findIndex((item) => item.comicId === comicId)
  }

  public async favHandler(comic: Comic) {
    const removeIndex = this.index(comic.comicId)
    const user = getUserInstance()
    if (!!~removeIndex) {
      if (!user.getIsLogin()) return
      
      const userId = user.getUserId()
      const token = user.getToken()
      const isSuccess = await Api.delFav(userId, comic.comicId, token)
      if (isSuccess) {
        this.fav_.value.splice(removeIndex, 1)
      }
      
    } else {
      if (!user.getIsLogin()) return
      const userId = user.getUserId()
      const token = user.getToken()
      const isSuccess = await Api.addFav(userId, comic.comicId, token)
      if (isSuccess) {
        this.fav_.value.unshift({
          ...comic,
          favDate: this.getTime()
        })
      }

    }
  }

  public saveStore() {
    // localStorage.setItem(COMIC_FAV_STORE_KEY, JSON.stringify(this.fav_.value))
  }

  public async getStore() {
    // const data = jsonParse<ComicFavItem[]>(
    //   localStorage.getItem(COMIC_FAV_STORE_KEY),
    //   []
    // )
    const user = getUserInstance()
    if (!user.getIsLogin()) return
      
      const userId = user.getUserId()
      const token = user.getToken()
    const data = await Api.getFav(userId, token)
    if (data instanceof Array) {
      this.fav_.value = data
    }
  }

  public clearStore() {
    this.fav_.value = []
  }

  public exChange(aIndex: number, bIndex: number) {
    arrChildSwap(this.fav_.value, aIndex, bIndex)
  }
}

let instance: ComicFav | null
export function createComicFav() {
  if (!instance) {
    instance = new ComicFav()
  }
  return instance
}
export function getComicFavInstance() {
  return instance!
}
