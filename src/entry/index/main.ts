import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import 'animate.css';

import { createComicMouseright } from '@/class/comicMouseright.class'
import { createVueInit } from '@/utils/vue/index'
import { baseLoader } from '../base'
import ElementUI from 'element-plus';
import { elementPlusInit } from './plugins/elementPlus'

const app = createApp(App)
         
await baseLoader(app)
createComicMouseright()
   
app.use(elementPlusInit)
app.use(createVueInit).use(router)
app.mount('#app') 
// if (process.env.NODE_ENV === "development") {
//   import("autopreview/vue3").then(({ default: AutoPreview }) => {
//     new AutoPreview("#app", (app) => {                                  
                                                        
//     });   
//   });
// }
    