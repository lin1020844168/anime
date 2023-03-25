<template>
    <div class="person-cards-wrapper">
        <div class="personList" v-for="personInfo in prop.personList" :key="personInfo.id">
            <PersonCard @click="clickPerson(personInfo)" :personInfo="personInfo" :pcCurrent="pcCurrent"></PersonCard>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { type } from 'os';
import PersonCard from './PersonCard.vue'
import { ref,withDefaults,defineEmits } from 'vue';
export type PersonInfo = {
    img: string,  
    name: string,
    id: string,  
}
const prop = withDefaults(defineProps<{
    personList: PersonInfo[]
}>(), {
})
const pcCurrent = ref('')
const emits = defineEmits(['clickPerson'])
const clickPerson = (info:PersonInfo)=> {
    emits('clickPerson', info, pcCurrent.value)
}

</script>
<style lang="less">
.person-cards-wrapper {
    height: 65vh;
    margin-top: 20px;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0; /* Safari,Chrome 隐藏滚动条 */
      height: 0; /* Safari,Chrome 隐藏滚动条 */
      display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
    }
  }</style>