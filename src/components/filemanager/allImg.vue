<template>
  <div class="all-img">
    <!--    <all-img-item v-for="(item,index) in imgList"-->
    <!--                  :selected-list="selectedList"-->
    <!--                  :url="item"-->
    <!--                  :key="item"-->
    <!--                  @delete="deleteItem(index)"-->
    <!--                  @select="select"-->
    <!--                  @ensure="$emit('ensure')" >-->
    <!--    </all-img-item>-->
    <allImgItem v-for="(item, index) in tableData" :file="item" :key="item.id" @selected="selected">
    </allImgItem>
  </div>
</template>

<script setup>
import allImgItem from '../filemanager/allImgItem.vue'
import { gets } from '@/services/admin/file.js'
import { getCurrentInstance, onMounted, ref } from 'vue'
const instance = getCurrentInstance()
const selectedList = ref([])
const tableData = ref([])
const emits = defineEmits(['selected'])

onMounted(() => {
  listByFile(0, '', 1, 1000)
})
const clearSelected = () => {
  selectedList.value = []
}
const selected = (file) => {
  // var selectedIndex = this.selectedList.indexOf(url);
  console.log('all收到-选择的img：' + file)
  emits('selected', file)
}
const listByFile = async (cid, keyword, page, max) => {
  let result = await gets(cid, keyword, page, max)
  if (undefined === result.err) {
    tableData.value = result.list
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}
// export default {
//   name: 'all-img',
//   data() {
//     return {
//
//     }
//   },
//   components: {
//     allImgItem: allImgItem,
//   },
//   mounted() {
//   },
//   methods: {
//
//   },
//   emits: ['selected'],
// }
</script>
