<template>
  <div class="singer" ref="singer">
    <!-- 父容器的高度是固定的 子元素的内容高度要撑开 才能滚动 -->
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <!-- 使用router-view去承载子路由 -->
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer";
import ListView from "base/listview/listview";
import { mapMutations } from "vuex";
import { playlistMixin } from "common/js/mixin";

const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    };
  },
  components: {
    ListView
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom=bottom
      this.$refs.list.$el.bottom=bottom
    },
    selectSinger(singer) {
      this.$router.push({
        /* 编程式导航 */
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    async _getSingerList() {
      let res = await getSingerList();
      if (res.code === ERR_OK) {
        // console.log(res);
        this.singers = this._normalizeSinger(res.data.list);
        // console.log("歌手列表", this.singers);
        // console.log("map",this._normalizeSinger(this.singers) );
      }
    },
    // 标准化歌手列表
    _normalizeSinger(list) {
      let map = {
        // 热门歌手
        hot: {
          title: HOT_NAME,
          items: []
        }
      };

      list.forEach((item, index) => {
        // 遍历歌手数组的前10条数据添加到 热门歌手数组中
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        );
      });
      // console.log(map);
      // 为了得到有序列表，我们需要处理 map
      let ret = []; //剩余的
      let hot = []; //热门
      // 遍历map
      for (let key in map) {
        let val = map[key]; //map的值 获取每一个元素
        if (val.title.match(/[a-zA-Z]/)) {
          // map中元素的title如果能匹配到[a-zA-Z] 中的一个字母
          // 就将匹配的元素 push到ret数组
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        // 按字母的升序 charCodeAt(0) 返回字符串第一个字符的 Unicode 编码
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    /* 通过扩展运算符的方式调mapMutations 做对象映射 */
    ...mapMutations({
      /* 把mutation的修改， 映射成一个方法名
        对应的是mutation-types.js 中的 SET_SINGER 常量
        做了这层映射以后 在代码中可以通过
        this.setSinger(singer) 将数据singer传进来
        实现数据提交
      */
      setSinger: "SET_SINGER"
    })
  }
};
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>