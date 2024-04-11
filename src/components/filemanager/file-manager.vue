<template>
  <div>
    <el-dialog title="图片管理" v-model="dialogVisible" width="80%" :before-close="handleClose">
      <el-tabs :tab-position="tabPosition" v-model="activeName" style="height: 400px">
        <el-tab-pane label="所有图片" name="1">
          <FileItem
            v-for="(item, index) in tableData"
            :file="item"
            :key="item.id"
            @selected="selected"
            :host="host"
            :showDelete="false"
          />
        </el-tab-pane>
        <!--tab-pane2-->
        <!--tab-pane3-->
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import FileItem from '@/components/filemanager/file-item.vue'
import { onMounted, ref } from 'vue'
import { gets } from '@/services/admin/file.js'
import config from '@/config.js'
const host = config.baseURL
const dialogVisible = ref(false)
const tabPosition = ref('left')
const activeName = ref('1')
const tableData = ref([])
const emits = defineEmits(['selected'])

onMounted(() => {
  handleList(0, '', 1, 1000)
})

const selected = (file) => {
  dialogVisible.value = false
  emits('selected', file)
}
const handleList = async (cid, keyword, page, max) => {
  let result = await gets(cid, keyword, page, max)
  tableData.value = result.list
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
