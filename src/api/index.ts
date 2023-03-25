import { getax } from '@/common/request/index'
import { getVal } from '@sorarain/utils'
import * as FnReturns from './type'
import * as ApiType from './api.type'
import { newError, badRequestNotify } from './utils'
import { fakeRequest, FAKE_Filter, FAKE_getAnimeDetail, FAKE_GETCONFIG, FAKE_GETINDEX, FAKE_GETVIDEO, FAKE_SEARCH } from './fakedata'
import { it } from 'node:test'
import { da } from 'element-plus/es/locale'
import { SelectOther } from './type'


export * from './type'
export * from './pixiv'

/**
 * 根据名称获取动漫列表
 * @param param
 * @returns
 */
export async function searchComic(param: {
  name: string
  page: number
}): Promise<FnReturns.SearchComicReturn> {
  try {
    const {
      data: {
        data: { results, total, size }
      }
    } = await getax<ApiType.Search>(
      `http://127.0.0.1:20000/api/search/${param.name}?page=${param.page}`
    )
    // const {
    //   data: {
    //     data: { results, pagetotal }
    //   }
    // } = await fakeRequest(FAKE_SEARCH)
    if (results instanceof Array) {
      return {
        data: results,
        total: total,
        size: size
      }
    } else {
      throw newError()
    }
  } catch {
    badRequestNotify('api/search')
    return {
      data: [],
      total: 0,
      size: 0
    }
  }
}

/**
 * 动漫筛选
 * @param param
 * @returns
 */
export async function filterComic(param: {
  selectOther: SelectOther,
  partition: string,
  page: number
}): Promise<FnReturns.FilterComicReturn> {
  try {
    // const api = Object.entries(param.selectOther).reduce((total, [k, v]) => {
    //   return v !== '' ? `${total}&${k}=${v}` : total
    // }, 'http://127.0.0.1:20000/api/filter?')
    let api = `http://127.0.0.1:20000/api/filter?partition=${param.partition}&page=${param.page}`
    param.selectOther.forEach(e=>{
      api += "&"+e.selectValue+"="+e.value
    })
    api = encodeURI(api)
    const { data } = await getax<ApiType.Filter>(api)
    // const { data } = await fakeRequest(FAKE_Filter)
    return {
      data: getVal(() => data.data.results, []).map((item) => ({
        cover: item.cover,
        id: item.id,
        season: item.season,
        title: item.title
      })),
      total: data?.data?.total || 0,
      size: data?.data?.size || 0
    }
  } catch {
    badRequestNotify('api/filter')
    return {
      data: [],
      total: 0,
      size: 0
    }
  }
}

/**
 * 获取动漫详情
 * @param id
 * @returns
 */
export async function getComicMain(
  id: number | string
): Promise<FnReturns.GetComicMainReturn | null> {
  try {
    const {
      data: { data }
    } = await getax<ApiType.getAnimeDetail>(`http://127.0.0.1:20000/api/getAnimeDetail/${id}`)

    // const {
    //   data: { data }
    // } = await fakeRequest(FAKE_getAnimeDetail)
    const playlist = new Map()
    Object.entries(data.playlist || {}).forEach(([k, v]) => {
      playlist.set(
        k,
        v.map((item, index) => ({
          name: String(item.title),
          value: index
        }))
      )
    })

    return {
      playlist,
      title: data.title,
      season: data.season || '未知',
      region: data.region || '未知',
      rank: data.rank || '',
      master: data.master || '未知',
      lang: data.lang || '未知',
      firstDate: data.first_date || '未知',
      cover: data.cover || '',
      voiceActors: data.actors || [],
      cates: data.categories || []
    }
  } catch {
    badRequestNotify('api/getAnimeDetail')
    return null
  }
}

/**
 * 获取视频地址集
 * 暂时什么用，被我换了
 * @param key
 * @returns
 */
// export async function getVideoUrl(
//   key: string | number
// ): Promise<FnReturns.GetVideoUrlReturn> {
//   try {
//     const {
//       data: { data }
//     } = await await getax<ApiType.GetVideo>(`http://127.0.0.1:20000/api/bilibili/getVideo/${key}`)
//     // const {
//     //   data: { data }
//     // } = await fakeRequest(FAKE_GETVIDEO)
//     // return Object.entries(data).map(([k, v]) => ({
//     //   key: k,
//     //   value: (v instanceof Array ? v : []).map((url) =>
//     //     url.replaceAll("'", '').split('?url=').pop()
//     //   ) as string[]
//     // }))
//     console.log("data================"+data)
//     return getVal(()=>data.getVideo, []).map((item)=>({
//       key: item.key,
//       playlist: getVal(()=>item.playlist, []).map((e)=>({
//         link: e.link,
//         title: e.title
//       }))
//     }))
//   } catch (e) {
//     badRequestNotify('api/getVideo')
//     console.error(e)
//     return []
//   }
// }

/**
 * 获取混合列表（热门、最新更新、轮播、每周更新列表、番外、完结日漫、国漫）
 * @returns
 */
export async function getHomeMixData(): Promise<FnReturns.GetHomeMixData | null> {
  try {
    const { data } = await getax<ApiType.GetIndex>('http://127.0.0.1:20000/api/getIndex')
    // const { data } = await fakeRequest(FAKE_GETINDEX)
    const listFormat = (list: any[]) =>
      list.slice(0, 10).map((item) => ({
        cover: item.cover,
        id: item.id,
        season: item.season,
        title: item.title
      }))
    return {
      hots: getVal(() => data.data.hots.results, []).map((item) => ({
        cover: item.cover,
        id: item.id,
        season: item.season,
        title: item.title
      })),
      latest: listFormat(getVal(() => data.data.latest, [])),
      banner: getVal(() => data.data.banner, []).map((item) => ({
        cover: item.cover,
        id: item.id || '-1',
        title: item.title || '未知'
      })),
      perweek: Object.entries(getVal(() => data.data.perweek, {})).map(
        ([k, v]) => ({
          name: `周${['一', '二', '三', '四', '五', '六', '日'][+k]}`,
          key: k,
          value: (v || []).map((e) => ({
            id: e.id,
            season: e.season || '未知',
            title: e.title || '未知'
          }))
        })
      ),
      tv: listFormat(getVal(() => data.data.theatre_comic, [])),
      endJp: listFormat(getVal(() => data.data.japancomic, [])),
      cn: listFormat(getVal(() => data.data.chinese_comic, []))
    }
    // return
  } catch (e) {
    badRequestNotify('api/getIndex')
    console.error(e)
    return null
  }
}

/**
 * 获取动漫筛选条件
 * @returns
 */
export async function getComicFilterConfig(): Promise<FnReturns.GetComicFilterConfig> {
  try {
    const { data } = await getax<ApiType.GetConfig>('http://127.0.0.1:20000/api/getConfig')
    // const { data } = await fakeRequest(FAKE_GETCONFIG)

    return getVal(() => data.data.filtersConfig, []).map((item) => ({
      id: item.id,
      name: item.name,
      value: (item.categories || []).map((key) => ({
        name: key.classname,
        value: key.classid
      }))
    }))
  } catch {
    badRequestNotify('api/getConfig')
    return []
  }
}

/**
 * ====================================================================================================================
 */
/**
 * 获取视频数据源
 */
export async function getEpisodeOrg(
  id: number | string
): Promise<FnReturns.GetEpisodeOrgReturn> {
  try {
    const {data} = await getax<ApiType.GetEpisodeOrg>(`http://127.0.0.1:20000/api/getEpisodeOrg/${id}`)
    return getVal(()=>data.data, []).map((i1)=>({
      key: i1.key,
      src: i1.src,
      episodes: getVal(()=>i1.episodes, []).map((i2)=>({
        id: i2.id, 
        title: i2.title,
        longTitle: i2.longTitle
      })),
      qualities: getVal(()=>i1.qualities, []).map((i3)=>({
        value: i3.value,
        desc: i3.desc
      }))
    }))
  } catch {
    badRequestNotify('api/getConfig')
    return []
  }
}

/**
 * 获取动漫筛选条件
 * @returns
 */
export async function getCategoryConfig(): Promise<FnReturns.GetCategoryConfigReturn> {
  try {
    const { data } = await getax<ApiType.GetCategoryConfig>('http://127.0.0.1:20000/api/getCategoryConfig')
    // const { data } = await fakeRequest(FAKE_GETCONFIG)

    return getVal(()=>data.data, []).map((item)=>({
      name: item.name,
      value: item.value,
      children: item.children
    }))
  } catch {
    badRequestNotify('api/getCategoryConfig')
    return []
  }
}

/**
 * 补全
 */
export async function complement(keyword: string): Promise<FnReturns.GetComplementReturn> {
  try {
    const { data } = await getax<ApiType.GetComplement>(`http://127.0.0.1:20000/api/anime/complement/${keyword}`)

    return data.data
  } catch {
    badRequestNotify('api/complement')
    return []
  }
}

/**
 * ====================================================================================================================
 */
