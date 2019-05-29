<template>
  <div id="app">
    <MHeader></MHeader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import Tab from "components/tab/tab";
import Player from "components/player/player"
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
};
</script>

<style lang="scss" scoped>
#app {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
// 手动模式卡的hi哦撒娇大家速度快几点睡啊很大很大很大
// 上的那就开始的骄傲的
// 上的那颗建行的卡河是大坏蛋
</style>
