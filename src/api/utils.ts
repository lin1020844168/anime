import { getVal } from '@sorarain/utils'
import { ElNotification } from 'element-plus'
import * as ApiReturns from './api.type'

/**
 * 视频地址格式化（用于处理部分错误的地址）
 * @param url
 * @returns
 */
export function videoUrlFormat(url: string) {
  return url.replaceAll("'", '').split('?url=').pop() || ''
}

export const newError = () => new Error('bad request')

export const successNotification = (title:string, message:string) => {
  return ElNotification({
    type: 'success',
    title: title,
    customClass: 'app-notify',
    message: message,
    duration: 0
  })
}

export const errorNotification =(title:string, message:string) => {
  return ElNotification({
    type: 'error',
    title: title,
    customClass: 'app-notify',
    message: message,
    duration: 0
  })
}

export const badRequestNotify = (apiPath: string) => {
  return ElNotification({
    type: 'error',
    title: '资源获取',
    customClass: 'app-notify',
    message: `${apiPath} 资源获取出问题啦！`,
    duration: 0
  })
}

export const loginSuccess = () => {
  return ElNotification({
    type: 'success',
    title: '登录成功',
    customClass: 'app-notify',
    duration: 0
  })
} 

export const logoutSuccess = () => {
  return ElNotification({
    type: 'success',
    title: '退出成功',
    customClass: 'app-notify',
    duration: 0
  })
} 

export const loginNotify = (msg: string) => {
  return ElNotification({
    type: 'warning',
    title: '登录状态',
    message: msg,
    customClass: 'app-notify',
    duration: 0
  })
}

export function vilipixImgPathFormat(url: string, size = 240) {
  return `${url}?x-oss-process=image/resize,w_${size}/format,jpg`
}

export function vilipixSearchResultFormat(data: ApiReturns.VilipixSearch) {
  return {
    list: getVal(() => data.data.rows, []).map((item) => ({
      date: item.created_at,
      title: item.title,
      orgurl: item.original_url,
      preurl: vilipixImgPathFormat(item.regular_url),
      id: item.picture_id,
      w: item.width,
      h: item.height,
      commentTotal: item.comment_total,
      likeTotal: item.like_total,
      tags: item.tags,
      total: item.page_total
    })),
    total: data?.data?.count || 0
  }
}
