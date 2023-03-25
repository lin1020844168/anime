<template>
  <div id="search">
    <SearchHeader
      v-model="filter.name"
      :history="searchHistoryList"
      :items="items"
      @search="searchByName"
      @clear="resetName"
      @deleteHistory="deleteHistory"
      @clearHistory="clearHistory"
      @update:modelValue="updateModelValue"
    >
      <Icon
        class="filter-icon"
        name="filter"
        :class="{ active: filterVisible }"
        @click="filterVisible = !filterVisible"
      />
    </SearchHeader> 

    <transition class="animate__animated animate__faster" enter-active-class="animate__slideInDown" leave-active-class="animate__slideOutUp">
      <article
        @mousewheel="filterVisible=false"
        v-show="filterVisible && !categoryconfig.pending"
        class="search-filter"
      >
      <AwRadio
        v-model="categoryconfig.partition.value"
        label="分区"
        :options="categoryconfig.org"
        :right-cancle="false"
        />
        <div v-for="(item,index) in categoryconfig?.org[categoryconfig.partition.cur]?.children">
          <AwRadio 
            v-model="categoryconfig.selectOther[index].value"
            :label="item.name" 
            :options="item.children" 
            :right-cancle="false"
            @click="searchByFilter"
            />
        </div> 
        
        <!-- <AwRadio
          v-model="filter.cate"
          label="分类"
          :options="filterConfig.cate"
          :right-cancle="false"
        />
        <AwRadio
          v-model="filter.type"
          label="类型"
          :options="filterConfig.cateInfo"
          :right-cancle="false"
          @change="searchByFilter(true)"
        />
        <AwRadio
          v-model="filter.order"
          label="排序"
          :options="SEARCH_FILTER.ORDER"
          :right-cancle="false"
          @change="searchByFilter(true)"
        />
        <AwRadio
          v-model="filter.year"
          label="年份"
          :options="SEARCH_FILTER.RELEASE_TIME"
          :right-cancle="false"
          @change="searchByFilter(true)"
        />
        <AwRadio
          v-model="filter.letter"
          label="字母"
          :options="SEARCH_FILTER.LETTER"
          :right-cancle="false"
          @change="searchByFilter(true)"
        /> -->
      </article>
    </transition>
    <main ref="searchMainEl" class="search-main">
      <transition
        enter-active-class="animate__fadeIn"
        leave-active-class="animate__fadeOut"
      >
        <div v-show="isSearchWaiting" class="search-main__loading">
          <LoadingCodeRun text="电波获取中，请稍后" />
        </div>
      </transition>
      <EmptyImgBlock
        class="search-main__empty"
        v-show="isEmptySearch"
        content="什么信息都没找到，甚至还白嫖了顿饭~"
        height="60%"
      >
        <img src="~static/img/search-empty.png" style="width: 100%" alt="" />
      </EmptyImgBlock>
      <div class="search-main__content">
        <ComicCard
          v-for="comic in searchResult"
          :key="comic.id"
          :detail="comic"
        />
      </div>
    </main>
    <el-pagination
      v-show="searchResult.length > 0"
      v-model:currentPage="pager.currnet"
      class="search-page"
      :page-size="pager.size"
      layout="prev, pager, next, jumper"
      :total="pager.total"
      @current-change="
        hasSearchKey ? searchByName(false) : searchByFilter(false)
      "
    />
  </div>
</template>

<script lang="ts">
import { getVal } from '@sorarain/utils'
import { computed, defineComponent, reactive, ref, shallowReactive } from 'vue'

import SearchHeader from '@/components/Form/SearchHeader.vue'
import EmptyImgBlock from '@comps/Block/EmptyImgBlock.vue'
import AwRadio from '@comps/Form/AwRadio.vue'
import LoadingCodeRun from '@comps/Loading/LoadingCodeRun.vue'
import ComicCard from './component/ComicCard.vue'

import * as Api from '@/api'
import { useLongtimePendingRef, usePageOut } from '@/hooks/utils'
import { useSearchHistory } from '@/stores/searchHistory.store'
import { SEARCH_FILTER } from './statics/form'
import { filter, size } from 'lodash'
import { complement, SelectOther, SelectPartition as SelectPartition } from '@/api'
import { watch } from 'fs'

/**
 * 筛选模组
 * @param init 筛选模组就绪回调
 */
function filterModule(init: () => void) {
  const categoryconfig = reactive({
    org: [] as Api.GetCategoryConfigReturn, 
    selectOther: [] as SelectOther, 
    partition: {} as SelectPartition,
    pending: false
  })

  /** 筛选信息 */
  const filter = reactive({
    name: '',
    cate: -1
  })
  /** 筛选参数 */
  const filterConfig = shallowReactive({
    pending: true,
    org: [] as Api.GetComicFilterConfig,
    get cate() {
      return this.org.map((item) => ({
        name: item.name,
        value: item.id
      }))
    },
    get cateInfo() {
      const info = this.org.find((item) => item.id === filter.cate)
      return !info ? [] : info.value
    }
  })
  const pager = reactive({
    currnet: 1,
    size: 24,
    total: 0
  })
  const filterVisible = ref(false)

  const resetPager = () => {
    pager.currnet = 1
    pager.total = 0
  }
  const resetFilter = () => {
    resetPager()
    Object.keys(filter).forEach((key) => {
      if (key !== 'name') {
        ;(filter as any)[key] = ''
      }
    })
  }
  const resetName = () => {
    filter.name = ''
    resetPager()
  }

  ;(async () => {
    // filterConfig.org = await Api.getComicFilterConfig()
    // if (filterConfig.org.length > 0) {
    //   filter.cate = filterConfig.org[0].id
    //   filter.type = getVal(() => filterConfig.org[0].value[0].value, '')
    // }
    // filterConfig.pending = false
    const data = await Api.getCategoryConfig()
    categoryconfig.org = data
    categoryconfig.partition = {
      cur: 0, 
      value: data[0].value
    }
    categoryconfig.selectOther = data[0].children.map((item, index)=>({
      cur: index,
      value: item.children[0].value,
      selectValue: item.value
    }))
    init()
  })()

  return {
    categoryconfig,
    filter,
    filterConfig,
    pager,
    SEARCH_FILTER,
    filterVisible,
    resetFilter,
    resetName
  }
}
function searchHistoryModule() {
  const searchHistory = useSearchHistory()
  const searchHistoryList = computed(() => searchHistory.list)
  const deleteHistory = (v: string) => {
    searchHistory.delete(v)
  }
  const clearHistory = () => {
    searchHistory.clear()
  }
  return {
    searchHistoryList,
    deleteHistory,
    clearHistory
  }
}
export default defineComponent({
  name: 'Search',
  components: {
    AwRadio,
    ComicCard,
    LoadingCodeRun,
    EmptyImgBlock,
    SearchHeader
  },
  setup() {
    const searchMainEl = ref<HTMLElement>()
    const searchResult = ref<Api.ComicPageList[]>([])
    const searchHistory = useSearchHistory()

    /** 是否在搜索请求中 */
    const isSearchFetching = ref(false)
    /** 是否为空搜索结果 */
    const isEmptySearch = ref(false)
    const isSearchWaiting = useLongtimePendingRef(isSearchFetching, {
      initPending: true
    })
    const {
      categoryconfig,
      filter,
      pager,
      filterVisible,
      resetName,
      resetFilter,
      ...filterModuleArgs
    } = filterModule(() => {
      searchByFilter()
    })
    const hasSearchKey = computed(() => filter.name !== '')

    const setSearchResult = (data: Api.ComicPageList[]) => {
      if (data.length === 0) {
        isEmptySearch.value = true
      }
      searchResult.value = data
    }

    
    let timer: NodeJS.Timeout;
    const items = ref<string[]>([])
    const updateModelValue = (v: string) => {
      clearTimeout(timer)
      timer = setTimeout(async () => {
        if (v === "") {
          items.value = []
        } else {
          items.value = await complement(v)
        }

      }, 500)
    }


    /**
     * 根据名称搜索
     * @param clear 是否清空历史
     */
    const searchByName = async (clear = true) => {
      if (!filter.name) return
      filterVisible.value = false
      isSearchFetching.value = true
      isEmptySearch.value = false
      searchMainEl.value!.scrollTop = 0
      clear && resetFilter()
      searchHistory.add(filter.name)
      const { data, total, size } = await Api.searchComic({
        name: filter.name,
        page: pager.currnet 
      })
      pager.total = total
      pager.size = size
      setSearchResult(data)
      isSearchFetching.value = false
    }
    /**
     * 根据筛选搜索
     * @param clear 是否清空历史
     */
    const searchByFilter = async (clear = true) => {
      isSearchFetching.value = true
      isEmptySearch.value = false
      searchMainEl.value!.scrollTop = 0
      clear && resetName()
      const { data, total, size } = await Api.filterComic({
        page: pager.currnet,
        selectOther: categoryconfig.selectOther,
        partition: categoryconfig.partition.value
      })
      pager.total = total
      pager.size = size
      setSearchResult(data)
      isSearchFetching.value = false
    }

    usePageOut(() => {
      searchHistory.save()
    })

    // onMounted(() => {
    //   searchByFilter()
    // })

    return {
      items,
      updateModelValue,
      categoryconfig,
      searchMainEl,
      filter,
      pager,
      filterVisible,
      searchResult,
      hasSearchKey,
      isSearchWaiting,
      searchByFilter,
      searchByName,
      resetName,
      resetFilter,
      isEmptySearch,
      ...filterModuleArgs,
      ...searchHistoryModule()
    }
  }
})
</script>
<style lang="less" scoped>
@import '~styles/var';

#search {
  @rootGap: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: @rootGap;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .search {
    .box {
      background: var(--box-bg-color);
    }

    &-filter {
      .box;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      padding: 16px 30px;
      box-sizing: border-box;
      border-top-left-radius: var(--df-radius);
      border-bottom-left-radius: var(--df-radius);
      user-select: none;
    }

    &-main {
      .box;
      position: relative;
      flex: 1;
      border-top-left-radius: var(--df-radius);
      overflow-y: auto;

      &__content {
        display: grid;
        grid-template-columns: repeat(var(--search-col-count), 1fr);
        gap: 24px;
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
        animation-duration: 0.25s;
      }

      &__loading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 4;
        background: var(--box-bg-color);
        animation-duration: 0.5s;
      }

      &__empty {
        margin-top: 40px;
      }

      // ::v-deep(.empty-img-block__inner) {
      //   aspect-ratio: 1/1;
      // }
    }

    &-page {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      width: max-content;
      padding: 12px 16px;
      background: #fff;
      border-radius: 15px;
      box-shadow: 0 -2px 14px rgb(0 0 0 / 14%);
      transition: all 0.25s;
      opacity: 0.2;
      transform: translateY(70%);

      &:hover {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .filter-icon {
    color: var(--font-color);
    font-size: 28px;
    cursor: pointer;
    transition: all 0.25s;

    &.active {
      color: var(--primary-color);
    }

    &:hover {
      .active;
    }
  }
}
</style>
