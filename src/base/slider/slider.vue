<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        :class="{active: currentPageIndex === index }"
        v-for="(item, index) in dots"
      ></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from "common/js/dom";
import BScroll from "better-scroll";

/* slider组件支持的几种功能 循环轮播 自动轮播 设置轮播间隔 */
export default {
  name: "slider",
  /* props可以控制slider有哪些属性 */
  props: {
    /* 是否可以循环轮播 默认可以 */
    loop: {
      type: Boolean,
      default: true
    },
    /* 是否自动播放 默认可以 */
    autoPlay: {
      type: Boolean,
      default: true
    },
    /* 轮播间隔 默认4秒 */
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    /* BScroll渲染时机很重要 要保证DOM成功渲染 */
    setTimeout(() => {
      /* 因为是横向滚动 在初始化之前要先计算slider的宽度 */
      this._setSliderWidth();
      this._initDots();
      /* 初始化slider */
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }
    }, 20);

    window.addEventListener("resize", () => {
      if (!this.slider) {
        return;
      }
      this._setSliderWidth(true);
      this.slider.refresh();
    });
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    /* 设置slider宽度 */
    _setSliderWidth(isResize) {
      /* 首先获得整个列表有多少元素 */
      this.children = this.$refs.sliderGroup.children;
      console.log(this.children.length);
      let width = 0;
      /* 获得slider父容器的宽度 每个元素的宽度都是与sliderWidth相同 */
      let sliderWidth = this.$refs.slider.clientWidth;
      /* 计算sliderGroup的宽度 */
      for (let i = 0; i < this.children.length; i++) {
        /* 先获取到每一个子元素 */
        let child = this.children[i];
        /* 为child添加样式 添加样式是很通用的方法  在common/js dom.js中做封装 */
        addClass(child, "slider-item");

        /* 每个child的宽度等于父容器的宽度 */
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      /* 如果loop循环播放为true 要克隆两个DOM 保证左右循环切换 */
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
        console.log(width);
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    /* 初始化slider */
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        /* 允许横向滚动 */
        scrollX: true,
        /* 不允许纵向滚动 */
        scrollY: false,
        /* 惯性 */
        momentum: false,
        snap: {
          // 循环
          loop: true,
          // 手指滑动阀值大于0.3时滑动到下一页
          threshold: 0.3,
          // 切换的时间
          speed: 400
        }
      });

      // bs对象配置方法中(配置后):
      this.slider.on("scrollEnd", () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        // 老版本有,新版去掉:
        // if (this.loop) {
        //   pageIndex -= 1
        // }
        this.currentPageIndex = pageIndex;

        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>