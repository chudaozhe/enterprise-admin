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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.el-upload {
  position: relative;
  overflow: hidden;
}
.el-upload:hover .panel {
  left: 0;
}
.panel {
  position: absolute;
  box-sizing: border-box;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  background: rgba(0, 0, 0, 0.6);
  -webkit-border-radius: 0 6px 6px 0;
  -moz-border-radius: 0 6px 6px 0;
  border-radius: 0 6px 6px 0;
  color: #fff;
  left: -40px;
  transition: all 0.3s;
  height: 30px;
  line-height: 30px;
}
</style>
