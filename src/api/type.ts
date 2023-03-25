import { ComicFavItem } from '@/class/comicFav.class'
import * as ApiType from './api.type'
import {CacheItem as HistoryCacheItem}  from '@/class/playHistory.class'
import {CacheItem as ProgressCacheItem } from '@/class/playProgress.class'
import { Category } from './api.type'
import exp from 'constants'

/**
 * 分页
 */
type Page<T> = {
  /** 当前页数据 */
  data: T
  /** 总数 */
  total: number

  /** 当前页条数 */
  size: number
}

/**
 * 动漫分页列表
 */
export interface ComicPageList {
  /** 封面 */
  cover: string
  /** id */
  id: string
  /** 杂项 */
  season: string
  /** 名称 */
  title: string
}

/**
 * 动漫搜索-返回值
 */
export type SearchComicReturn = Page<ComicPageList[]>

/**
 * 动漫详情-返回值
 */
export interface GetComicMainReturn {
  // playlist: {
  //   name: string
  //   value: {
  //     name: string
  //     value: string
  //   }[]
  // }[]
  /** 播放列表 */
  playlist: Map<
    string,
    {
      /** 名称 */
      name: string
      /** 值 */
      value: number
    }[]
  >
  /** 名称 */
  title: string
  /** 集数状态 */
  season: string
  /** 地区 */
  region: string
  /** 评分 */
  rank: string
  /** 作者名称 */
  master: string
  /** 语言 */
  lang: string
  /** 发布日期 */
  firstDate: string
  /** 封面 */
  cover: string
  /** 声优名字集 */
  voiceActors: string[]
  /** 分类集 */
  cates: string[]
}

// export type GetLatestComic = Page<ComicPageList[]>

/**
 * 周更新-返回值
 */
export type GetDaysWeek = {
  name: string
  value: ComicPageList[]
}[]

/**
 * 动漫筛选-返回值
 */
export type FilterComicReturn = Page<ComicPageList[]>

export interface GetHomeMixData {
  /** 每日更新 */
  perweek: {
    name: string
    key: string
    value: {
      title: string
      season: string
      id: string
    }[]
  }[]
  /** 热门 */
  hots: ComicPageList[]
  /** 最新 */
  latest: ComicPageList[]
  /** 剧场版 */
  tv: ComicPageList[]
  /** 完结日漫 */
  endJp: ComicPageList[]
  /** 国漫 */
  cn: ComicPageList[]
  /** 轮播 */
  banner: {
    cover: string
    id: string
    title: string
  }[]
}

/**
 * 动漫播放源
 */
export type GetVideoUrlReturn = {
  /** 源id */
  key: string
  /** 源-播放地址列表 */
  // value: string[]
  playlist: {
    //连接地址
    link: string,
    //标题
    title: string
  }[]
}[]

/**
 * 动漫筛选 分类-类型
 */
export type GetComicFilterConfig = {
  /** 分类id */
  id: number
  /** 分类名称 */
  name: string
  /** 分类下的类型列表 */
  value: {
    /** 类型名称 */
    name: string
    /** 类型值 */
    value: string
  }[]
}[]

export interface ComicSearchItem {
  /** id */
  id: string
  /** 名称 */
  title: string
  /** 源图地址 */
  orgurl: string
  /** 预览图地址 */
  preurl: string
  /** 简介 */
  // desc: string
  /** 时间 */
  date: string
  w: number
  h: number
  commentTotal: number
  likeTotal: number
  tags: string
  total: number
}

export interface VilipixSearch {
  list: ComicSearchItem[]
  total: number
}

export interface VilipixRank {
  list: ComicSearchItem[]
  total: number
}

export type VilipixPicMain = {
  orgImgs: string[]
  author: {
    id: string
    avatar: string
    name: string
  }
  date: Date
} & Pick<ApiType.VilipixIllust, 'likeTotal' | 'favTotal' | 'tags'>

export interface VilipixerInfo {
  avatar: string
  name: string
  desc: string
}

/**==================================================================================================== */
//返回视频url关键信息集合
export type GetEpisodeOrgReturn = {
  //源信息
  key: string,
  //源路径
  src: string,
  //画质列表
  qualities: {
    //画质值
    value: number,
    //画质描述
    desc: string,
  }[],
  //分集xinxi
  episodes: {
    //分集id
    id: string,
    //分集位置
    title: string|number, 
    //分集标题
    longTitle: string
  }[]
}[]

export type GetFavReturn = ComicFavItem[]

export type AddFavReturn = boolean

export type DelFavReturn = boolean

export type AddHistoryReturn = boolean

export type GetHistoryReturn = HistoryCacheItem[]

export type DelHistoryReturn = boolean

export type ClearHistoryReturn  = boolean

export type AddEpisodeProgressReturn = boolean

export type GetEpisodeProgressReturn = ProgressCacheItem[]

export type GetCategoryConfigReturn = Category[]

export type GetComplementReturn = string[]

export type LoginReturn = UserInfo

export interface SelectPartition {
  cur: number, 
  value: string
}

export type SelectOther = {
  cur: number,
  value: string, 
  selectValue: string
}[]

export type UserInfo = {
  username: string,
  img: string, 
  userId: string, 
  token: string
}


export type Register = {
  phone:string, password:string, name: string, code:string
}

export type FriendInfo = {
  userId:string,
  name:string,
  img:string
}

export type newFriend = FriendInfo&{
  messageId: string|null, 
  loading: boolean
}
 

export type ApplyHistoryList = ApplyHistory[]

export type FriendList = FriendInfo[]

/**==================================================================================================== */
