<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import { getSingerDetail, getSongVkey } from "api/singer";
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'

  export default {
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
            console.log(this.songs);
          }
        })
      },
    _normalizeSongs(list) {
      // 先定义return返回值
      console.log(list);
      let ret = [];
      list.forEach(item => {
        let { data } = item;
        // console.log("musicDate",musicData);
        if (data.songid && data.albummid) {
          getSongVkey(data.songmid).then(res => {
            // console.log('getSongVkey123',data.songmid,res);
            if (res.response.req.code === 0) {
              const songUrl = res.response.playLists[0];
              const newSong = createSong(data, songUrl);
              // console.log(newSong);
              ret.push(newSong);
            }
          });
        }
      });
      return ret;
    }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>