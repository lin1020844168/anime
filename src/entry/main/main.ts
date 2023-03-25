import { createApp } from 'vue'

import App from './App.vue'

import { createVueInit } from '@/utils/vue/index'
import { baseLoader } from '../base'
import { elementPlusInit } from './plugins/elementPlus'
import 'animate.css';


const app = createApp(App)

baseLoader(app)

app.use(elementPlusInit).use(createVueInit)
app.mount('#app')
