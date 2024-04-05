<template>
  <div class="file-manager">
    <!--<div ref="allImg">allImg</div>-->
    <el-dialog title="图片管理" v-model="dialogVisible" width="80%" :before-close="handleClose">
      <el-tabs :tab-position="tabPosition" v-model="activeName" style="height: 400px">
        <el-tab-pane label="所有图片" name="1">
          <all-img ref="allImg" @delete="$emit('delete', $event)" @selected="selected"> </all-img>
        </el-tab-pane>
        <!--tab-pane2-->
        <!--tab-pane3-->
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import allImg from '../filemanager/allImg.vue'
import { ref } from 'vue'
const dialogVisible = ref(false)
const tabPosition = ref('left')
const ensureFun = ref(null)
const activeName = ref('1')
const emits = defineEmits(['selected'])

const selected = (file) => {
  dialogVisible.value = false
  emits('selected', file)
}
const show = () => {
  dialogVisible.value = true
}
const hide = () => {
  dialogVisible.value = false
}
const handleClose = (done) => {
  done()
}
//暴露方法
defineExpose({
  show,
  hide
})
// export default {
//   name: 'file-manager',
//   data() {
//     return {
//
//     }
//   },
//   components: {
//     allImg: allImg,
//   },
//   mounted() {},
//   methods: {
//
//   },
//   emits: ['delete', 'selected'],
// }
</script>

<style>
.el-tabs__content {
  height: 400px;
  overflow-y: auto;
}
</style>
