<template>
  <transition name="slide">
    <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail, getSongVkey } from "api/singer";
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
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters([
      "singer" //对应的是store/getters 中的singer
    ])
  },
  created() {
    this._getDetail();
  },
  methods: {
    async _getDetail() {
      /* 用户在操作过程中 在详情请页面不小心刷新了 那就让他直接回到 /singer路由下 */
      /* 处理边界常用的方式 */
      if (!this.singer.id) {
        this.$router.push("/singer"); //$router 要加$
        return;
      }
      let self =this
      const res = await getSingerDetail(self.singer.id);
      // console.log(res);
      if (res.code === 0) {
        // console.log(res.data.list);
        this.songs = this._normalizeSongs(res.data.list);
        // console.log("songs", this.songs);
      }
    },
    _normalizeSongs(list) {
      // 先定义return返回值
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        // console.log("musicDate",musicData);
        if (musicData.songid && musicData.albummid) {
          getSongVkey(musicData.songmid).then(res => {
            // console.log('getSongVkey123',musicData.songmid,res);
            if (res.response.req.code === 0) {
              const songUrl = res.response.playLists[0];
              const newSong = createSong(musicData, songUrl);
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
