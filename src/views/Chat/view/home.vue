<template>
  <div class="home">
    <ElContainer height="100%">
      <ElAside width="100px">
        <Nav></Nav>
      </ElAside>
      <ElMain>
        <router-view></router-view>
      </ElMain>              
    </ElContainer>      
  </div>     
</template>
                       
<script lang="ts" setup>    
import Nav from "../components/Nav.vue";
import { ElContainer,ElAside, ElMain } from "element-plus";
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 90vh;
  background-color: var(--box-bg-color);
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>