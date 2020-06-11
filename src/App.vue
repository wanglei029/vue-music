<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
export default {
  components: {
    MHeader: () => import("components/m-header/m-header"), //引入顶部logo
    Tab: () => import("components/tab/tab"), //引入顶部导航组件
    Player:()=>import('components/player/player')
  }
};
</script>
