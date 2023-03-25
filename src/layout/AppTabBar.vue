<template>
  <div class="app-tab__bar">
    <InvertSwitch
      v-model="daytimeType"
      class="daytime"
      @change="onDaytimeTypeChanged"
    >
      <template #icon="{ active }">
        <Icon :name="!active ? 'sun' : 'moon'" />
      </template>
    </InvertSwitch>
    <div v-click-outside="() => (comiclistVisible = false)" class="comiclist">
      <Icon
        class="tool"
        :class="{ active: comiclistVisible }"
        name="history"
        @click="comiclistVisible = !comiclistVisible"
      />
      <AppTabBarComiclist v-model:visible="comiclistVisible" />
    </div>
    
    <div @mouseover="userlistVisible=true" @mouseout="userlistVisible=false"  class="avatar" :class="{active:userStore.isLogin&&userlistVisible}"  >
      <div class="userimg" v-if="userStore.isLogin" >
        <BaseImg    src="https://api.adicw.cn/uploads/UserAvatar/default.jpg" />
      </div>
      <div class="loginButton" @click="openLoginVisible()" v-else>登录</div>   
    </div>
    <AppTabBarUserlist @mouseover="userlistVisible=true" @mouseout="userlistVisible=false"  v-model:visible="userlistVisible" />
    
  </div>
</template>

<script lang="ts">
import InvertSwitch from '@/components/Form/InvertSwitch.vue'
import { computed, defineComponent, provide, ref } from 'vue'
import AppTabBarComiclist from './AppTabBarComiclist.vue'
import { getThemeInstance } from '@/theme/theme.class'
import { DF_SYSTEM_COLOR, THEME_DARK, THEME_PINK } from '@/theme/static'
import { debounce } from '@sorarain/utils'
import { useSystemConfigStore } from '@/stores/systemConfig.store'
import { useUserStore } from '@/stores/user.store'
import { createUser } from '@/class/user.class'
import AppTabBarUserlist from './AppTabBarUserlist.vue'

function daytimeModule() {
  const daytimeType = ref(true)
  const theme = computed(() =>
    DF_SYSTEM_COLOR.map((item, index) => ({
      ...item,
      value: daytimeType.value ? THEME_DARK[index] : THEME_PINK[index]
    }))
  )
  const onDaytimeTypeChanged = debounce(() => {
    getThemeInstance()?.colorVarInit(theme.value)
    getThemeInstance()?.saveLocalColor(theme.value)
  }, 300)
  return {
    daytimeType,
    onDaytimeTypeChanged
  }
}

export default defineComponent({
  name: 'AppTabBar',
  components: {
    AppTabBarComiclist,
    InvertSwitch,
    AppTabBarUserlist
},
  setup() {
    const comiclistVisible = ref(false)
    const userlistVisible = ref(true)
    const systemConfig = useSystemConfigStore()
    const userStore = useUserStore()
    const openLoginVisible = () => {
      systemConfig.loginVisiable = true
    }
    return {
      userlistVisible,
      userStore,
      openLoginVisible,
      comiclistVisible,
      systemConfig,
      ...daytimeModule()
    }
  }
})
</script>
<style lang="less" scoped>
.app-tab__bar {
  position: fixed;
  right: 40px;
  top: 10px;
  display: flex;
  align-items: center;
  z-index: 8;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    z-index: 9;
    &.active {
        transform: translateY(18px) translateX(18px) scale(1.8);
        transition: all 0.3s 0s linear;
    }
        
    
    img {
      width: 100%;
      height: 100%;
      
    }
    .loginButton {
      font-size: 16px;
      line-height: 40px;
      text-align: center;
      color: var(--font-color);
      background-color: var(--primary-color);
    }
  }
  .tool {
    position: relative;
    display: flex;
    width: 36px;
    height: 36px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    margin-right: 14px;
    cursor: pointer;
    color: var(--font-color);
    &::after {
      .mask(-1,var(--aside-bg-color));
      border-radius: 50%;
      opacity: 0.8;
    }
    &.active {
      color: var(--primary-color);
    }
  }
  .comiclist {
    position: relative;
    user-select: none;
  }
  .daytime {
    margin-right: 14px;
  }
}
</style>
