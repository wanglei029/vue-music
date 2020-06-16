<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="item in hotKey" :key="item.n">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <!-- @listScroll 监听suggest组件派发的事件 实际上经过了两层传递
        先从scroll传递到suggest 在传递到search
       -->
      <suggest @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import{ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import {mapActions} from 'vuex'
export default {
  components: {
    SearchBox,
    Suggest
  },
  data() {
    return {
      hotKey:[],
      query:''
    }
  },
  created() {
    this._getHotKey()
  },
  methods: {
    /* 点击热门搜索词 自动添加到搜索框中 */
    addQuery(query){
      this.$refs.searchBox.setQuery(query)
    },
    /* 子组件search-box query事件 */
    onQueryChange(query){
      console.log('搜索框中query改变',this.query);
      this.query=query
    },
    /* 手机端搜索的时候 当我们滚动搜索列表 就让输入框失去焦点 从而让键盘收起 */
    blurInput(){
      /* 在父组件search中调用子组件search-box中的方法 */
      this.$refs.searchBox.blur()
    },
    /* 保存搜索结果 */
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    /* 获取热门搜索词 */
    _getHotKey(){
      getHotKey().then(res=>{
        console.log(res);
        if(res.code===ERR_OK){
          this.hotKey=res.data.hotkey.slice(0,10);
        }
      })
    },
    ...mapActions([
      'saveSearchHistory'
    ])
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>