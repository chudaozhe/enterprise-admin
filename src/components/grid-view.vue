<template>
  <div class="container">
    <div class="item select_item" v-for="(item, index) in images" :key="index">
      <img :src="image_prefix + item" alt="" />
      <el-icon class="close" @click="removeImage(index)"><CircleCloseFilled /></el-icon>
    </div>
    <div class="item" v-show="show_plus" @click="showFileManager">
      <el-icon class="plus"><Plus /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps(['image_prefix', 'images', 'show_plus'])
const emits = defineEmits(['showFileManager', 'removeImage'])

onMounted(() => {
  console.log('images')
  console.log(JSON.stringify(props.images))
})

const showFileManager = () => {
  // console.log('send showFileManager item')
  emits('showFileManager', null)
}

const removeImage = (index) => {
  emits('removeImage', index)
}
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 3列，每列占用1/3空间 */
  //grid-template-rows: repeat(5, 1fr);
  gap: 10px; /* 格子之间的间隙 */
}

.item {
  background-color: #fafafa; /* 格子的背景颜色 */
  border: 1px dashed #cdd0d6; /* 格子的边框 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
}
.item img {
  border-radius: 6px;
  object-fit: cover;
  width: 100px;
  height: 50px;
}
.item .plus {
  width: 100px;
  height: 50px;
  color: #909399;
  font-size: 28px;
}
.item:hover {
  border-color: #409eff;
  color: #409eff;
}

.select_item {
  position: relative;
}
.close {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  color: #000;
  font-size: 20px;
  padding: 5px;
}
</style>
