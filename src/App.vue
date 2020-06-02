<template>
  <div id="app">
    <div id="nav">
      <m-header></m-header>
      <tab></tab>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  components:{
    MHeader:()=>import('components/m-header/m-header'), //引入顶部logo
    Tab:()=>import('components/tab/tab') //引入顶部导航组件
  }
}
</script>
