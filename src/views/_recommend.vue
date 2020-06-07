<template>
  <div class="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <!-- 初始化scroll的时机是 组件mounted的时候
        scroll包裹的内容是从数据动态渲染的 就是说它需要这些数据 拿到以后报DOM给撑开
        之后从新计算 scroll 调用refresh 才能让scroll正确滚动
      -->
      <div class="slider-wrapper" ref="sliderWrapper" v-if="recommends.length">
        <slider>
          <div v-for="item of recommends" :key="item.id">
            <a :href="item.linkUrl">
              <img class="needsclick" @load="loadImage" :src="item.picUrl" />
            </a>
          </div>
        </slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li class="item" v-for="item in discList" :key="item.dissid">
            <div class="icon">
              <img width="60" height="60" v-lazy="item.imgurl" />
            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Slider from "base/slider/slider";
import { getRecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
export default {
  components: {
    Slider,
    Scroll
  },
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    setTimeout(() => {
      this._getDiscList();
    }, 2000);
  },
  methods: {
    loadImage() {
      // 因为只要有一张图片加载完成 高度就可以撑开
      // 所以不需要每张图片加载完成 都去调用 refresh()
      // 调用前先做判断 在this 上定义一个checkLoaded
      /****
       * checkLoaded开发中经常用到 设置个标志位 确保这个逻辑执行一次
       * **/

      if (!this.checkLoaded) {
        // 如果没有checkLoaded
        // 调用scroll的refresh()
        this.$refs.scroll.refresh();
        // 同时设置checkLoaded为true
        this.checkloaded = true;
        console.log("首张图片加载完成");
      }
    },
    async _getRecommend() {
      let res = await getRecommend();
      if (res.code === ERR_OK) {
        this.recommends = res.data.slider;
        console.log(res.data.slider);
      }
    },
    async _getDiscList() {
      console.log("在组件中调用 _getDiscList()");
      let res = await getDiscList();
      if (res.code === ERR_OK) {
        this.discList = res.data.list;
        console.log("歌单列表", res.data.list);
      }
    }
    // _getRecommend(){
    //   getRecommend().then((res)=>{
    //     if(res.code===ERR_OK){
    //       console.log(res.data.slider);
    //     }
    //   })
    // }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>