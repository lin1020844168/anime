<template>
  <transition>
    <div v-if="detail" class="pixiv-main" :style="selfStyle">
      <PixivCircleBack />
      <div class="pixiv-main__content" :style="contentStyle">
        <div class="painter">
          <div class="painter-avatar">
            <BaseImg
              v-if="!pixivImgMain.pending"
              :src="pixivImgMain.author.avatar"
              @click="toPainter"
            />
          </div>
          <div class="painter-info">
            <p>
              <b @click="toPainter">{{ pixivImgMain.author.name }}</b>
              <a> · {{ $moment(pixivImgMain.date).fromNow() }}</a>
            </p>
            <ul>
              <li>#Vinneart</li>
              <li>#Artworks</li>
            </ul>
          </div>
        </div>
        <div class="plate">
          <img
            ref="plateImgEl"
            :src="pixivImgMainList.first"
            @load="onPlateImgLoad"
            @click="preview(pixivImgMainList.first)"
          />
          <BaseImg
            v-for="(src, index) in pixivImgMainList.others"
            :key="index"
            :src="src"
            @click="preview(src)"
          />
          <ul>
            <li v-for="(item, index) in pixivImgMain.tags" :key="index">
              <a href="#" @click.prevent>#{{ item }}</a>
            </li>
          </ul>
        </div>
        <div class="else">
          <div class="else-item">
            <Icon name="icon_love" />
            <span> {{ pixivImgMain.likeTotal }}</span>
          </div>
          <div class="else-item">
            <Icon name="iccosplay" />
            <span>
              {{ pixivImgMain.favTotal }}
            </span>
          </div>
        </div>
      </div>
      <div ref="fakeEl" :style="fakeStyle" class="pixiv-main__fake">
        <img :src="enterRect?.path" alt="" @load="onFakeImgLoad" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { getVilipixPicMain } from '@/api'
import { ImagePreview } from '@/components/AwImagePreview/ImagePreview'
import { PixivMainParams, toPixivPainter } from '@/router/jump'
import * as Api from '@apis/index'
import { jsonParse } from '@sorarain/utils'
import {
  computed,
  CSSProperties,
  defineComponent,
  onActivated,
  onDeactivated,
  reactive,
  ref,
  unref
} from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import PixivCircleBack from '../../component/PixivCircleBack.vue'

function animateModule() {
  const $route = useRoute()
  const plateImgEl = ref<HTMLImageElement>()
  const fakeEl = ref<HTMLElement>()

  const fake = reactive({
    active: true,
    visible: false,
    duration: 625
  })
  const plateImgPending = ref(true)

  const enterRect = computed<PixivMainParams['rect'] | null>(() =>
    jsonParse($route.params.rect as string, null)
  )
  const selfStyle = computed<CSSProperties>(() => {
    return !enterRect.value
      ? {}
      : {
          animationDuration: `${fake.duration / 1000}s`
          // 'overflow-y': fake.active ? 'hidden' : 'auto'
        }
  })
  const contentStyle = computed<CSSProperties>(() => {
    return {
      opacity: fake.active || plateImgPending.value ? 0 : 1
    }
  })
  const fakeStyle = computed<CSSProperties>(() => {
    const fakeRect = unref(enterRect)
    const active = fake.visible || plateImgPending.value
    // 设置初始位置，避免动画一开始会跳一下位置
    const initRect: CSSProperties = fakeRect
      ? {
          width: `${fakeRect.width}px`,
          height: `${fakeRect.height}px`,
          transform: `translate3d(${fakeRect.x}px,${fakeRect.y}px,0)`,
          borderRadius: fakeRect.radius
        }
      : {}
    return {
      opacity: active ? 1 : 0,
      zIndex: active ? 3 : -1,
      ...initRect
    }
  })

  const fakeAnimate = (
    reverse = false,
    callback = () => {
      //
    }
  ) => {
    const fakeRect = unref(enterRect)
    const realRect = plateImgEl.value?.getBoundingClientRect()
    if (!fakeRect || !realRect || !fakeEl.value) {
      callback()
      fake.visible = true
      return
    }

    fake.active = true
    const keyframes: Keyframe[] = [
      {
        width: `${fakeRect.width}px`,
        height: `${fakeRect.height}px`,
        transform: `translate3d(${fakeRect.x}px,${fakeRect.y}px,0)`,
        borderRadius: fakeRect.radius
      },
      {
        width: `${realRect.width}px`,
        height: `${(realRect.width / fakeRect.width) * fakeRect.height}px`, // 图片第一时间可能没有加载完成，所以需要自己算
        transform: `translate3d(${realRect.x}px,${realRect.y}px,0)`,
        borderRadius: getComputedStyle(plateImgEl.value!).borderRadius
      }
    ]
    fakeEl.value.animate(!reverse ? keyframes : keyframes.reverse(), {
      duration: fake.duration,
      fill: 'forwards',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).onfinish = callback
    fake.visible = true
  }
  const onPlateImgLoad = () => {
    plateImgPending.value = false
  }
  const onFakeImgLoad = () => {
    //
  }

  onActivated(() => {
    fakeAnimate(false, () => {
      fake.visible = false
      fake.active = false
    })
  })
  onDeactivated(() => {
    fake.active = true
    fake.visible = true
    plateImgPending.value = true
  })
  onBeforeRouteLeave(async () => {
    fakeAnimate(true)
    return true
  })

  return {
    plateImgEl,
    fakeEl,
    selfStyle,
    contentStyle,
    fakeStyle,
    enterRect,
    onPlateImgLoad,
    fakeAnimate,
    onFakeImgLoad
  }
}

export default defineComponent({
  name: 'PixivMain',
  components: {
    PixivCircleBack
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    alive: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const $route = useRoute()

    const pixivImgMain: Api.VilipixPicMain & {
      pending: boolean
    } = reactive({
      pending: true,
      orgImgs: [],
      author: {
        name: '',
        id: '',
        avatar: ''
      },
      tags: [],
      likeTotal: '',
      favTotal: '',
      date: new Date()
    })

    const pixivImgMainList = computed(() => {
      const list = [...pixivImgMain.orgImgs]
      return {
        first: list.shift(),
        others: list
      }
    })
    const detail = computed(() => $route.params.id)

    const fetchpixivImgMain = async () => {
      if (!props.id) return
      const data = await getVilipixPicMain(props.id)
      if (!data) return
      pixivImgMain.orgImgs = data.orgImgs
      pixivImgMain.author.name = data.author.name
      pixivImgMain.author.id = data.author.id
      pixivImgMain.author.avatar = data.author.avatar
      pixivImgMain.likeTotal = data.likeTotal
      pixivImgMain.favTotal = data.favTotal
      pixivImgMain.date = data.date
      pixivImgMain.tags = data.tags
      pixivImgMain.pending = false
    }
    const toPainter = () => {
      toPixivPainter(pixivImgMain.author.id)
    }

    const preview = (path?: string) => {
      if (!path) return
      ImagePreview({
        current: path,
        images: pixivImgMain.orgImgs
      })
    }

    onActivated(() => {
      fetchpixivImgMain()
    })
    onDeactivated(() => {
      pixivImgMain.orgImgs.splice(0)
      pixivImgMain.pending = true
    })

    return {
      detail,
      pixivImgMain,
      pixivImgMainList,
      toPainter,
      preview,
      ...animateModule()
    }
  }
})
</script>
<style lang="less" scoped>
.pixiv-main {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 666;
  border-top-left-radius: var(--df-radius);
  overflow-y: auto;

  &__content {
    position: relative;
    left: 0;
    right: 0;
    margin: 10vh auto;
    width: 70%;
    background: var(--box-bg-color);
    border-radius: var(--df-radius);
    padding: 24px;
    box-sizing: border-box;
    // transition: opacity 0.625s;

    .painter {
      display: flex;
      width: 100%;
      margin-bottom: 24px;

      &-avatar {
        width: 60px;
        height: 60px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 18px;
          cursor: pointer;
        }
      }

      &-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 6px 6px 4px 8px;
        box-sizing: border-box;

        p {
          line-height: 16px;

          b {
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }

          a {
            font-size: 12px;
            color: var(--font-unactive-color);
          }
        }

        ul {
          display: flex;
          font-size: 12px;
          line-height: 13px;
          gap: 8px;

          li {
            display: flex;
            align-items: center;
            padding: 0 12px;
            .font-format(26px);
            background: var(--bg-color);
            border-radius: 8px;
          }
        }
      }
    }

    .plate {
      width: 100%;
      border-radius: var(--df-radius);
      overflow: hidden;
      padding-bottom: 16px;
      box-sizing: border-box;
      box-shadow: 0 0 2px var(--font-unactive-color);
      border-top-left-radius: var(--df-radius);
      border-top-right-radius: var(--df-radius);

      img {
        display: block;
        width: 100%;
        cursor: zoom-in;
      }

      ul {
        display: flex;
        flex-wrap: wrap;
        padding: 16px;
        padding-bottom: 10px;
        font-size: 16px;
        gap: 4px 12px;

        li {
          a {
            display: block;
            .font-format(21px);
          }
        }
      }
    }

    .else {
      width: 100%;
      display: flex;
      padding-top: 22px;
      gap: 22px;

      &-item {
        display: flex;
        align-items: center;

        i {
          font-size: 30px;
        }

        span {
          font-size: 16px;
          margin-left: 6px;
        }
      }
    }
  }

  &__fake {
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;

    img {
      width: 100%;
    }
  }
}
</style>
