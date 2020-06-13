<template>
  <scroll
    @scroll="scroll"
    :listen-scroll="listenScroll"
    :probe-type="probeType"
    :data="data"
    class="listview"
    ref="listview"
  >
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li
            @click="selectItem(item)"
            v-for="item in group.items"
            class="list-group-item"
            :key="item.id"
          >
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!-- // 右侧快速入口列表 -->
    <!-- 修饰符 (modifier) 是以半角句号 . 指明的特殊后缀，用于指出一个指令应该以特殊方式绑定。
    例如，.prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefault()：-->
    <!-- 右侧列表刚创建 没有添加交互事件 touchstart  touchmove 只有dom 互动是没有反应-->
    <!-- 之前 touchstart  touchmove 是由bettre-scroll封装好的  -->
    <!-- 首先添加点击事件 当手指触碰的时候会有所反应 @touchstart="onShortcutTouchStart" -->
    <!-- 我们希望的效果 在滑动右侧快速入口列表的时候 左侧也能滚动到相应的位置 
            @touchmove.stop.prevent="onShortcutTouchMove"
            .stop.prevent阻止冒泡 阻止浏览器原生滚动
            .stop - 调用 event.stopPropagation()。
            .prevent - 调用 event.preventDefault()。
    -->
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.prevent.stop="onShortcutTouchMove"
    >
      <ul>
        <!-- :data-index="index" 扩展的自定义属性 要在点击事件中获取这个index-->
        <li
          v-for="(item, index) in shortcutList"
          :data-index="index"
          class="item"
          :class="{'current':currentIndex===index}"
          :key="index"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";

const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18; /* 每个锚点的高度 */

export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    // 右侧字母快速入口列表
    /* 因为所有的歌手信息都重新按照姓氏首字母做了聚合分组
        还有一个热门特殊分组

      */
    shortcutList() {
      return this.data.map(group => {
        /* 获取分组的名字 因为头一个分组比较特殊 title是热门
            其他分组的 title都是一个字母 我们需要一个字符来做索引
            索引 热门 我们就用 title.substr(0,1)来截取第一个字符
          */
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    };
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
    /* 为什么不把touch放在 data 或者props中 
        因为在vue中 data，props中的数据都会被天剑get和set方法
        以便监听数据的变化，而我们并不需要监听touch的变化
      */
    this.touch = {};
    this.listHeight = [];
  },
  methods: {
    /* 我们把item这个元素作为事件的参数给派发出去 
        这样外部就会知道我们点击的是什么元素
        我们这个listview是一个基础组件 所以他的点击事件
        是不会有业务逻辑相关的 它仅仅就是把这个事件派发出去
        然后告诉外部我被点击了，以及我被点击的元素是什么
        那么，只有外部关心这个事件的人才会决定 我点击这个元素我要干什么
        
     */
    selectItem(item) {
      this.$emit("select", item);
    },
    /**
     * @description: 点击这是事件以后想要页面滚动到相应的元素
     * 首先要知道我们点了右侧列表中的第几个元素，才能知道左侧的歌手列表组要滚动到第几个
     * 所以点的时候要获得右侧列表元素的索引
     * 通过参数e是没办法拿到 我们所点击的第几个索引 所以在DOM遍历的过程中我们给它加一个index 给他扩展一个data-index属性
     * 要在本次的点击事件中获取data-index
     * @param {type} 第一个参数是el
     * @return:
     */

    onShortcutTouchStart(e) {
      // 要从点击事件的e.target获取index
      // 自己封装的获取自定义属性值的方法 getData()
      // getData()封装在了基础的dom操作文件 'common/js/dom'
      /* 定义锚点 获取data-index 的值 取到的值是字符串 */
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0]; /* 获得 第一个触碰的位置 */
      /* 在created钩子函数中定义的空对象 this.touch 
      为了onShortcutTouchStart(e) 和 onShortcutTouchMove(e) 共享位置      
      */
      this.touch.y1 = firstTouch.pageY;
      /* this.touch.anchorIndex 初始化记录一开始点击的时候是第几个索引 */
      this.touch.anchorIndex = anchorIndex;
      /* 调用scroll滚动到相应的位置 */
      this._scrollTo(anchorIndex);
    },
    /**
     * @description:
     * 要计算从touchstart到touchmove滚动位置的差 delta
     * 根据delta计算我们要滚动到哪 滚动到第几个元素
     * 在touchstart的时候就要记录当前的Y值 然后touchmove的时候又可以获取到一个touchstart的Y值
     * @param {type}
     * @return:
     */

    onShortcutTouchMove(e) {
      /* e.touches 获取到触碰的手指 e.touches[0]第一个手指的位置 */
      let firstTouch = e.touches[0];
      /*firstTouch.pageY  Y轴位置  需要在两个函数里面共享这个位置 
        所以在created钩子函数中定义个空对象 this.touch
        为什么不把touch放在 data 或者props中 
        因为在vue中 data，props中的数据都会被添加get和set方法
        以便监听数据的变化，主要是为了和DOM做数据绑定用的 
        而我们并不需要监听touch的变化 只是为了在两个函数之间能够获取到共享的数据
      */
      this.touch.y2 = firstTouch.pageY;
      /* 通过 (this.touch.y2 - this.touch.y1)可以得到 第一个触碰的手指在Y轴上的偏移量 偏移像素
          怎么去获取到我们偏移了几个元素呢？
          我们可以知道每一个锚点的高度 (右侧快速列表每个列表项的高度 ANCHOR_HEIGHT=18) 字体高度+padding值
          用偏差除以18 再向下取整
      */
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      /* 记录touchmove后的当前元素的索引
        this.touch.anchorIndex 取到的值是字符串 
        "+"在JS中不仅进行数学加法运算 也有字符串拼接的效果
        只要运算中出现字符串 就是字符串拼接 否则就是数学运算
      */
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      // console.log(anchorIndex);
       /* 调用方法滚动到相应的位置 */
      this._scrollTo(anchorIndex);
    },
    /*  */
    refresh() {
      this.$refs.listview.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    /* 计算歌手分组的集合高度 */
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    /* 滚动到相应的位置 */
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      /* 滚动到相应的 左侧歌手列表组  */
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      /* newY歌手分组的集合高度 */
      console.log('newY:',newY);
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        console.log('height1分组歌手下限',height1,'height2分组歌手上限',height2);
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          console.log('diff=当前列表组上限-向上滚动的偏移量',this.diff);
          return;
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      console.log('newVal',newVal);
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
        console.log('fixedTop',fixedTop);
      if (this.fixedTop === fixedTop) {
        console.log('fixedTop',fixedTop,'this.fixedTop',this.fixedTop);
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
