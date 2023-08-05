<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',

}
</script>

<style lang="less" scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 1920px;
  height: 1080px;
  position: relative;
}

#app {
  width: 1920px;
  height: 1080px;
  position: absolute;
  left: 0px;
  transform-origin: 0px 0px;
  top: 0px;
}

</style>
