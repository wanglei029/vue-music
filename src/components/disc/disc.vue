<template>
  <transition name="slide">
    <music-list  :title="title" :bg-image="bgImage" :songs="songs" ></music-list>
  </transition>
</template>

<script>
/* 这个组件是二级路由 首先要修改router */
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { getSongVkey } from "api/singer";

import { createSong } from "common/js/song";

export default {
  components: {
    MusicList: () => import("components/music-list/music-list")
  },
  data() {
    return {
      songs: []
    };
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters([
      "disc" //对应的是store/getters 中的disc
    ])
  },
  created() {
    this._getSongList();
  },
  methods: {
    async _getSongList() {
      /* 用户在操作过程中 在详情请页面不小心刷新了 那就让他直接回到 /singer路由下 */
      /* 处理边界常用的方式 */
      if (!this.disc.dissid) {
        this.$router.push("/recommend"); //$router 要加$
        return;
      }
      const res = await getSongList(this.disc.dissid);
      console.log(res);
      if (res.response.code === 0) {
        // console.log(res.data.list);
        this.songs = this._normalizeSongs(res.response.cdlist[0].songlist);
        console.log("songs", this.songs);
      }
    },
    _normalizeSongs(list) {
      // 先定义return返回值
      let ret = [];
      list.forEach(item => {
        // console.log("musicDate",musicData);
        if (item.id && item.mid) {
          getSongVkey(item.mid).then(res => {
            // console.log('getSongVkey123',musicData.songmid,res);
            if (res.response.req.code === 0) {
              const songUrl = res.response.playLists[0];
              const newSong = createSong(item, songUrl);
              // console.log(newSong);
              ret.push(newSong);
            }
          });
        }
      });
      return ret;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
