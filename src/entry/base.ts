import { App } from 'vue'
import moment from 'moment'
import { createComicFav } from '@/class/comicFav.class'
import { createPlayHistory } from '@/class/playHistory.class'
import { createPlayProgress } from '@/class/playProgress.class'
import { createPreloadCdn } from '@/plugins/preloadCdn.class'
import { createTheme } from '@/theme/theme.class'
import { createPinia } from 'pinia'
import { createUser } from '@/class/user.class'
import { useUserStore } from '@/stores/user.store'

export async function baseLoader(app: App<Element>) {
  const pinia = createPinia() 
  app.use(pinia)
  createPlayProgress()
  createPlayHistory()
  createComicFav()
  createUser()
  await useUserStore().init()
  createPreloadCdn()
  createTheme()
  app.config.globalProperties.$moment = moment
  
  window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault()
  })
}
function userUserStore() {
  throw new Error('Function not implemented.')
}

