import { WEB_NAME } from '@/common/static'
import ChatHome from './view/pages/chatHome/index.vue'
import Video from './view/pages/video.vue'
import Test from './view/pages/chatFrend/index.vue'
import ChatWindow from './view/pages/chatHome/chatwindow.vue'

const Chat = () => import('@/views/Chat/Index.vue')
export default {
  path: '/Chat', 
  name: 'Chat',
  component: Chat,  
  redirect: {name: "test"},
  meta: {
    title: WEB_NAME + '-聊天',
    elName: '#chat'
  },
  children: [
    {
        path: "ChatHome",
        name: "ChatHome",
        component: ChatHome,
    },    
    {
        path: "Video",
        name: "Video",
        component: Video
    }, 
    {
        path: "test",
        name: "test",
        component: Test
    },   
]
}
