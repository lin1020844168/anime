<template>
  <div class="chat">
    <Home></Home> 
  </div>
</template>      
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  beforeRouteEnter(to, from, next) {
    const websocketInvoke = getWebSocketInovkerInstance();
    let cnt = 10;
    while(websocketInvoke.getWebsocket()==null && cnt>0) {
        websocketInvoke.connect()
        cnt--;
    }
    if (cnt == 0) {
        errorNotification('websocket连接超时', '')
    }
    next()
  }
});
</script>
<script lang="ts" setup>
import { errorNotification } from '@/api/utils';
import { getWebSocketInovkerInstance } from '@/class/websocket.class';
import { onMounted, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave  } from 'vue-router';
import Home from './view/home.vue'

onBeforeRouteLeave(()=> {
  getWebSocketInovkerInstance().close()
})
</script>
      
<style lang="less">


.chat {
  width: 100vw;
  height: 90vh;
}
</style>