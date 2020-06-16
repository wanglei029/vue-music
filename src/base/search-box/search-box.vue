<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <!-- ref="query"添加的这个引用是为了让父组件 search可以获取到input -->
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) {
        console.log('设置query');
        this.query = query
      },
      /* 让input输入框失去焦点 */
      blur() {
        this.$refs.query.blur()
      }
    },
    created() {
      /* 为什么要将 watch写在created中？
        当query发生改变就像外部抛出 query事件
        query是和input数据双向绑定的 当input做输入的是时候 query就会发生变化
        然后watch回调就会执行
        那我们要做的就是让回调函数延迟执行 不要立即执行，
        因为回调函数只要执行就会派发query事件，外层的search组件就能收到query 触发onQueryChange
        接着就会set this.query  query传到suggest.vue组件 当suggest.vue组件watch到query变化
        就会执行search
        这就是我们不断输入页面不断发送请求的原因
        所以 要想从本质上解决这个问题就要从源头上节流 在common/js/util.js 下实现一个节流函数debounce


      */
      this.$watch('query', debounce((newQuery) => {
        console.log(newQuery);
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>