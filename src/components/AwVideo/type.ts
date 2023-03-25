import { VideoJsPlayer } from 'video.js'

export type FlvInstance = VideoJsPlayer | null

/** 播放器状态 */
export enum PlayerStatus {
  /** 无状态 */
  None = -2,
  /** 加载失败 */
  Failed = -1,
  /** 加载中 */
  Loading = 0,
  /** 播放中 */
  Playing = 1,
  /** 暂停中 */
  Paused = 2
}

/**视频画质 */
export enum QualityState {
  q_360p = 1<<4,
  q_480p = 1<<5, 
  q_720p = 1<<6,
  q_1080p = 80,
  q_1080pp = 112,
  q_4k = 120,
}

export const QUALITY_CONST = "QUALITY_CONST";

/** 播放器信息 */
export interface Player {
  /** 当前进度 */
  currentTime: number
  /** 总进度 */
  duration: number
  /** 音量 0-100 */
  volume: number
  /** 音量-old */
  oldVolume: number
  /** 状态  */
  status: PlayerStatus
  /** 全屏 */
  fullScreen: boolean
  /** 画中画 */
  pip: boolean
  /** 网站全屏 */
  webFullScreen: boolean
  /** 是否静音 */
  readonly isMuted: boolean
  /** 进度预览图 */
  preview: string
  /** 是否已经进行监听 */
  isListened: boolean
  /** 缓冲节点列表 */
  bufferedList: [number, number][]
}
export interface Quality {
  /** 画质名称 */
  name: string
  /** 画质key */
  value: string | number
}

export interface Episode {
  name: string
  value: string, 
  episodeId: number|string
}

