<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" class="shortcut" :data="shortcut" ref="shortcut">
        <!-- scroll 会根据第一个元素来计算高度 所以要将<div class="hot-key">
        和<div class="search-history"> 包裹在一个div中-->
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey" :key="item.n">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <!-- 因为要在清空之前 弹窗确认 就不能直接调用 @click="clearSearchHistory" 
              改为@click="showConfirm"           
              -->
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>

            <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <!-- @listScroll 监听suggest组件派发的事件 实际上经过了两层传递
        先从scroll传递到suggest 在传递到search
      -->
      <suggest @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
    </div>
    <!-- 弹窗组件 -->
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from "base/search-box/search-box";
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";
import Suggest from "components/suggest/suggest";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
import Scroll from "base/scroll/scroll";
import { mapActions } from "vuex";
import { playlistMixin, searchMixin } from "common/js/mixin";
export default {
  mixins: [playlistMixin, searchMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  data() {
    return {
      hotKey: []
      /* query从mixin中获取 */
      // query: ""
    };
  },
  created() {
    this._getHotKey();
  },
  computed: {
    /* shortcut传给scroll的data来计算高度 */
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    }
    /* 从mixin中获取  ...mapGetters(["searchHistory"]) */
    // ...mapGetters(["searchHistory"])
  },
  methods: {
    /* 迷你播放器和搜索列表高度自适应 */
    handlePlaylist(playlist) {
      // 根据playlist的长度计算底部bottom偏移的值
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.shortcutWrapper.style.bottom = bottom;
      console.log(
        "this.$refs.shortcutWrapper.style.bottom",
        this.$refs.shortcutWrapper.style.bottom
      );
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
    },
    /* 从mixin中获取 addQuery(query) onQueryChange(query) blurInput()  saveSearch()*/
    /* 点击热门搜索词 自动添加到搜索框中 */
    // addQuery(query) {
    //   this.$refs.searchBox.setQuery(query);
    // },
    /* 子组件search-box query事件 */
    // onQueryChange(query) {
    //   console.log("搜索框中query改变", this.query);
    //   this.query = query;
    // },
    /* 手机端搜索的时候 当我们滚动搜索列表 就让输入框失去焦点 从而让键盘收起 */
    // blurInput() {
    //   /* 在父组件search中调用子组件search-box中的方法 */
    //   this.$refs.searchBox.blur();
    // },
    /* 保存搜索结果 */
    // saveSearch() {
    //   this.saveSearchHistory(this.query);
    // },
    showConfirm() {
      console.log("confirm");
      this.$refs.confirm.show();
    },
    /* 删除历史列表中的某一个元素 */
    /* 这里只是 mapActions 中 deleteSearchHistory方法的代理 
        其实可以删除 在DOM元素上直接调用
      有时候我们需要用method 去掉action 如果发现method做的事情仅仅只是调用action
      以及他们参数完全一样 可以省略method的定义 因为...mapActions([])就已经相当于
      向methods中挂方法了，可以直接把注入的方法用到DOM上 这样可以减少一些代码量
    */
    // deleteOne(item){
    //   this.deleteSearchHistory(item)
    // },
    /* 清空历史记录 */
    /* 这里只是 mapActions 中 clearSearchHistory方法的代理 其实可以删除 在DOM元素上直接调用*/
    // deleteAll(){
    //   this.clearSearchHistory()
    // },
    /* 获取热门搜索词 */
    _getHotKey() {
      getHotKey().then(res => {
        console.log(res);
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions([
      /* 从mixin中获取 "saveSearchHistory","deleteSearchHistory", */
      // "saveSearchHistory",
      // "deleteSearchHistory",
      "clearSearchHistory"
    ])
  },
  watch: {
    /* 如果从搜索列表suggest组件 切到主页search上的话 query的变化实际上是从有到无的变化 */
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>