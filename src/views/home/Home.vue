<template>
  <div>
    <!-- <home-header></home-header> -->
    <m-header></m-header>
  </div>
</template>

<script>
import HomeHeader from 'components/home/Header'
export default {
  name: "Home",
  components: {
    MHeader:()=>import("components/m-header/m-header")
  }
};
</script>

<style lang="stylus" scoped></style>