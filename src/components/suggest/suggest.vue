<template>
<!-- :beforeScroll="beforeScroll" -->
  <scroll
    ref="suggest"
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title></loading>
    </ul>
    <!-- 处理边界情况 检索不到数据 -->
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import { mapMutations, mapActions } from "vuex";
import Singer from "common/js/singer";
import { getSingerDetail, getSongVkey } from "api/singer";

const TYPE_SINGER = "singer";
const perpage = 20;

export default {
  props: {
    /* 是否显示歌手 */
    showSinger: {
      type: Boolean,
      default: true
    },
    /* 组件所依赖的检索词 */
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      page: 1, //当前页
      pullup: true,
      beforeScroll: true,
      /* 判断是否加载完 标志位 */
      hasMore: true,
      result: [],
      // array 存储加载下一页返回的内容
      array: []
    };
  },
  methods: {
    /* 代理的方法 */
    refresh() {
      this.$refs.suggest.refresh();
    },
    search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        console.log("搜素结果", res);
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data);
          this._checkMore(res.data);
        }
      });
    },
    searchMore() {
      console.log("加载更多", this.query);
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        console.log("加载更多的新数据", res);
        if (res.code === ERR_OK) {
          this.array = this._genResult(res.data);
          console.log("this.array", this.array);
          this.array.map(item => {
            this.result.push(item);
            console.log(item);
          });
          // this.newArray=this.result.concat(this.array)
          // console.log('this.newArray',this.newArray);
          // // this.result = this.result.concat(this._genResult(res.data));
          // this.result = this.newArray
          console.log("result", this.result);
          this._checkMore(res.data);
        }
      });
    },
    /* 监听列表滚动 派发事件  */
    listScroll() {
      this.$emit("listScroll");
    },
    selectItem(item) {
      console.log(item);
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        console.log(`/search/${singer.id}`);
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      /* 派发事件
        我们不能在这个函数中写 保存歌曲历史的相关逻辑
        因为 suggest组件本身做的事情是不包括去存取歌曲历史的 应该是外面做的事情
        所以这个组件在作为自己要做的事情之后 就可以派发一个事件出去 
        只有关心这个事件的组件 才会去处理 保存搜索历史 这样一个逻辑
        这个逻辑是交由父组件它的外层组件去完成的
        search组件可以监听 select事件
      */
      this.$emit("select", item);
    },
    /* 获取 */
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    _genResult(data) {
      if (data.song) {
        let list = this._normalizeSongs(data.song.list);
        if (data.zhida && data.zhida.singerid) {
          // this.result 中查找含有属性type的元素的下标 如果没有返回-1
          let index = this.result.findIndex((item)=>{
            return item.type
          })
          // 如果this.result数组中 没有歌手直达元素 则向数组头部添加
          if (index === -1) {
            list.unshift({ ...data.zhida, ...{ type: TYPE_SINGER } });
          }
        }
        return list;
      }
    },
    _normalizeSongs(list) {
      // 先定义return返回值
      let ret = [];
      list.forEach(musicData => {
        if (musicData.songid && musicData.albummid) {
          getSongVkey(musicData.songmid).then(res => {
            if (res.response.req.code === 0) {
              const songUrl = res.response.playLists[0];
              const newSong = createSong(musicData, songUrl);
              // console.log(newSong);
              ret.push(newSong);
            }
          });
        }
      });
      // console.log(ret);
      return ret;
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage > song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    findIndex(list, song) {
      return list.findIndex(item => {
        return item.id === song.id;
      });
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  created() {
    console.log("suggest组件created query", this.query);
  },

  watch: {
    /* 当query发生变化的时候 调用请求服务端检索数据 */
    query(newQuery) {
      console.log("suggest中watch query", newQuery);
      this.search(newQuery);
    },
    array(list) {
      let newResult = this.result.slice();
      list.map(item => {
        // 查看当前item在newResult中是否存在 不存在返回-1
        let frIndex = this.findIndex(newResult, item);
        // 如果在newResult中不存在 则将item插入到newResult中
        if (frIndex === -1) {
          newResult.push(item);
        }
      });
      // 将newResult 赋值给this.result
      this.result = newResult;
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>