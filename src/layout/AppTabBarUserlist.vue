<template>
    
    <div v-show="visible&userStore.isLogin" class="comiclist-content">
        <div class="userlist">{{userStore.username }}</div>
        <div @click="logout" class="logout">
            <!-- <Icon class="icon" :name="tuichu"></Icon> -->
            
            <Icon class="icon" name="tuichu" /> 退出登录
            
        </div>     
    </div>

</template>
<script type="ts" setup>
import { getUserInstance } from '@/class/user.class';
import { useUserStore } from '@/stores/user.store';

defineProps({
    visible: {
      type: Boolean,
      default: false
    }
})
defineEmits({
    'update:visible': null
})
const userStore = useUserStore()
const logout = ()=> {
    userStore.logout()
}
</script>
<style lang="less" scoped>
.comiclist {

  &-content {
    position: absolute;
    right: -20%;
    top: 100%;
 
    margin-top: 10px;
    background: var(--aside-bg-color);
    box-shadow: 0 0 10px rgb(0 0 0 / 0.2);
    border-radius: 20px;
    overflow: hidden;
    animation-duration: 0.625s;
    
    .userlist {
        margin-top: 20px;
        text-align: center;
        font-size: 25px;
    }

    .logout {

        margin: 30px 0;
        padding: 0 40px;
    
        text-align: center;

        &:hover {
            filter: brightness(0.5);
            cursor: pointer;

            opacity: 0.6;
        }

        .icon {
            padding-right: 20px;
        }
    }
  }

  
}
</style>