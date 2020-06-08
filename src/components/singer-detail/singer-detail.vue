<!--
 * @Author: wanglei
 * @Date: 2020-06-08 01:39:15
 * @LastEditTime: 2020-06-08 23:52:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-music\src\components\singer-detail\singer-detail.vue
--> 
<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  computed:{
    ...mapGetters([
      'singer', //对应的是store/getters 中的singer
    ])
  },
  created() {
    console.log('state中的singer',this.singer);
  },
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
