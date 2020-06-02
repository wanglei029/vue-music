<template>
  <div id="app">
    <div id="nav">
      <tab></tab>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  components:{
    Tab:()=>import('components/tab/tab') //引入顶部导航组件
  }
}
</script>
