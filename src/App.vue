<template>
  <RouterView v-slot="{ Component }">
    <transition name="fade-right" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  font-family:
    Helvetica Neue,
    Helvetica,
    PingFang SC,
    Hiragino Sans GB,
    Microsoft YaHei,
    SimSun,
    sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
.card-header {
  display: flex;
  justify-content: right;
}
.card-header2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.aside-menu-icon {
  width: 25px;
  height: 25px;
  margin-right: 10px;
}
</style>
