<template>
  <header class="search-header" :class="{ using: state.using }">
    <div v-click-outside="unUsing" class="search-input">
      <input
        ref="inputEl"
        type="text"
        :value="modelValue"
        placeholder="请输入搜索关键字..."
        @keyup.enter="emit('search')"
        @input="updateValue"
        @focus="state.using = true"
      />
      <Icon
        class="search-icon"
        :name="modelValue !== '' ? 'delete1' : 'search'"
        @click="clearValue"
      />

      <div
        v-if="state.using && props.items.length > 0"
        :class="{ active: state.using && props.items.length > 0 }"
        class="search-input__search"
      >
        <ul class="list ">
          <li
            v-for="(item, index) in items"
            :key="index"
            @click="changeHistory(item)"
            v-html="item"
          >
      
          </li>
        </ul>
    
      </div>

      <div
        v-if="state.using && props.hots.length > 0"
        :class="{ active: state.using && props.hots.length > 0 }"
        class="search-input__history"
      >
        <div class="title">热门关键词</div>
        <ul class="list">
          <li
            v-for="(item, index) in props.hots"
            :key="index"
            @click="changeHistory(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <div
        v-if="state.using && props.history.length > 0"
        :class="{ active: state.using && props.history.length > 0 }"
        class="search-input__history"
      >
        <div class="title">
          搜索记录
          <Icon name="delete" @click="$emit('clearHistory')" />
        </div>
        <AwListModifyTransition tag="ul" class="list">
          <li
            v-for="item in props.history"
            :key="item.date"
            @click="changeHistory(item.value)"
          >
            {{ item.value }}
            <Icon
              name="delete2"
              @click.stop="$emit('deleteHistory', item.value)"
            />
          </li>
        </AwListModifyTransition>
      </div>
    </div>
    <slot />
  </header>
</template>

<script lang="ts" setup>
import { bottom } from '@popperjs/core';
import { AwListModifyTransition } from 'sorarain'
import { reactive, ref } from 'vue'

interface History {
  date: number
  value: string
}

const props = withDefaults(
  defineProps<{
    items?: string[],
    modelValue: string
    history?: History[]
    hots?: string[]
  }>(),
  {
    history: () => [],
    hots: () => [],
    items: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
  (e: 'clear'): void
  (e: 'deleteHistory', value: string): void
  (e: 'clearHistory'): void
}>()

const inputEl = ref<HTMLInputElement>()

const state = reactive({
  using: false
})

const unUsing = () => {
  state.using = false
}
const updateValue = (e: Event) => {
  const { value } = e.target as HTMLInputElement
  emit('update:modelValue', value)
}
const changeHistory = (v: string) => {
  const formatV = deleteHtml(v) 
  if (formatV === props.modelValue) return
  emit('update:modelValue', formatV)
  emit('search')
  unUsing()
}

const deleteHtml= (v:string):string =>{
  let flag = false;
  let l = 0;
  let ans = "";
  for (let i=0; i<v.length; i++) {
    if (!flag && v[i]=='<') {
      flag = true;
      ans += v.substring(l, i);
    }
    if (flag && v[i]=='>') {
      l = i+1;
      flag = false;
    }
    
  }
  return l>=v.length?ans:ans+v.substring(l, v.length)
}
const clearValue = () => {
  if (props.modelValue !== '') {
    emit('update:modelValue', '')
    emit('clear')
  } else {
    emit('search')
  }
}
</script>
<style lang="less" scoped>
.search-header {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 26px;
  width: 100%;
  height: 48px;
  transition: all 0.625s;
  z-index: 333;

  &.using {
    transform: translate(50% - 20%, 100%);

    .search-input {
      width: 40% !important;
    }
  }
}

.search-input {
  @radius: 12px;
  position: relative;
  color: var(--font-color);
  transition: all 0.25s;
  color: var(--font-color);
  width: 26%;
  height: 100%;

  & > i {
    position: absolute;
    right: 16px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    height: max-content;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.25s;

    &:hover {
      opacity: 0.6;
    }
  }

  &:focus-within {
    .search-input__history {
      display: block;
    }

    input {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  }

  input {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--box-bg-color);
    outline: none;
    border: none;
    text-indent: 20px;
    font-size: 16px;
    border-radius: @radius;
    color: var(--font-color);

    &::placeholder {
      color: var(--font-unactive-color);
      font-size: 14px;
    }
  }

  &__search{
    position: relative;
    margin-top: 20px;
    width: 100%;
    box-sizing: border-box;
    background: var(--aside-bg-color);
    border-radius: @radius;
    box-shadow: 0 0 14px rgba(0, 0, 0, 0.2);
    user-select: none;
    max-height: 0;
    transition: all 0.25s;
    overflow: auto;
    &.active {
      // max-height: 220px;
      max-height: 440px;
      // padding: 20px;
    }

    .title {
      color: var(--font-unactive-color);
      font-weight: 700;
      font-size: 14px;
      padding-bottom: 16px;

      i {
        font-size: 14px;
        padding-left: 2px;
        cursor: pointer;
        transition: all 0.25s;

        &:hover {
          opacity: 0.7;
          color: var(--warning-color);
        }
      }
    }
    .list {
      li {
        position: relative;
        padding: 0 16px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        
        cursor: pointer;
        transition: all 0.25s;

        &:hover {
          background: var(--bg-color);
        }
      }
    }
  }

  &__history {
    // position: absolute;
    // top: calc(100% + 20px);
    position: relative;
    margin-top: 20px;
    width: 100%;
    box-sizing: border-box;
    background: var(--aside-bg-color);
    border-radius: @radius;
    box-shadow: 0 0 14px rgba(0, 0, 0, 0.2);
    user-select: none;
    max-height: 0;
    transition: all 0.25s;
    overflow: auto;
    &.active {
      // max-height: 220px;
      max-height: 440px;
      padding: 20px;
    }

    .title {
      color: var(--font-unactive-color);
      font-weight: 700;
      font-size: 14px;
      padding-bottom: 16px;

      i {
        font-size: 14px;
        padding-left: 2px;
        cursor: pointer;
        transition: all 0.25s;

        &:hover {
          opacity: 0.7;
          color: var(--warning-color);
        }
      }
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      width: 100%;

      li {
        position: relative;
        padding: 0 16px;
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
        background: var(--bg-color);
        cursor: pointer;
        transition: all 0.25s;

        &:hover {
          opacity: 0.8;
        }

        i {
          display: inline-block;
          position: absolute;
          right: 0;
          top: 0;
          transform: translate(50%, -50%);
          font-size: 20px;
          line-height: 20px;
          transition: all 0.25s;

          &:hover {
            color: var(--warning-color);
          }
        }
      }
    }
  }
}
</style>
