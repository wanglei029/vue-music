<template>
  <transition name="list-fade">
    <!-- 在最外层监听@click="hide" 里面的事件会冒泡 -->
    <div class="playlist" v-show="showFlag" @click="hide">
      <!-- @click.stop 阻止事件冒泡 点击内层列表不会关闭 -->
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <!-- 在添加ref="listContent" 前
        scroll组件已经初始化 但是不能滚动 为什么
        因为 当我们调用show()的时候 是从display:none 切换为显示 从隐藏到显示
        那显示以后 实际上DOM才能够正确的计算
        这时候 要从新计算better-scroll 所以在show()的时候要去调用scroll的refresh方法
        -->
        <scroll ref="listContent" class="list-content" :data="sequenceList">
          <ul>
            <li
              ref="listItem"
              class="item"
              v-for="(item,index) in sequenceList"
              :key="index"
              @click="selectItem(item,index)"
            >
              <!-- :class="getCurrentIcon(item)" 当前播放歌曲的样式 -->
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close">
          <span @click="hide">关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { playMode } from "common/js/config";
import Scroll from "base/scroll/scroll";
export default {
  data() {
    return {
      showFlag: false
    };
  },
  computed: {
    ...mapGetters(["sequenceList", "currentSong", "playlist", "mode"])
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        /* 当组件刚显示的时候列表滚动到当前播放歌曲 */
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "icon-play";
      }
      return "";
    },
    selectItem(item, index) {
      /* 设置vuex的state setCurrentIndex */
      /* 如果是随机播放 index需要重新设置 要找到当前播放歌曲在playlist中的索引 */
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(song => {
          return (song.id = item.id);
        });
      }
      /* 当前播放模式是顺序播放 或者单曲循环 index就是index */
      this.setCurrentIndex(index);
      this.setPlayingState(true);
    },
    /* 让列表滚动到当前播放的歌曲 */
    scrollToCurrent(current) {
      /* 从sequenceList 列表中找到 当前播放歌曲的索引 
        找到当前歌曲在顺序列表中的索引 通过索引可以访问到我们是第几个li 然后滚动过去
        什么时候滚动？
        当我们歌曲切换成功以后滚动  添加watch观测 currentSong对的变化
      */
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      /* Element 滚动到列表对应的元素 要滚动到每个li 要给li加引用 ref="listItem"*/
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    deleteOne(item){
        
    },
    ...mapMutations({
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayingState: "SET_PLAYING_STATE"
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
        /* 当前组件不显示或者 newSong.id === oldSong.id 就什么都不做*/
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      this.scrollToCurrent(newSong);
    }
  },
  components: {
    Scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
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

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>