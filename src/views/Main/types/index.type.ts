import * as Api from '@apis/index'
import * as VideoApi from '@/components/AwVideo/type'


export type Playlist = Api.GetComicMainReturn['playlist']
export type ComicName = Api.GetComicMainReturn['title']
export interface Anthology {
  /** 当前选中的集的地址 */
  current: string
  /** 错误集的集合 */
  bads: string[]
  /** 播放源及其地址集 */
  list: {
    /** 源名称 */
    name: string
    /** 源key */
    orgId: string
    /**画质列表 */
    qualities: VideoApi.Quality[]
    /** 集列表 */
    values: {
      /** 集名称 */
      name: string
      /** 集地址 */
      value: string, 
      /** id */
      episodeId :number|string
    }[]
  }[]
}
