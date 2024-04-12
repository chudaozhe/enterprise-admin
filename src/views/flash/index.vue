<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <el-button @click="handleCreate()" size="small" icon="plus" type="primary"
            >添加</el-button
          >
        </div>
      </template>
      <el-table :data="tableData">
        <el-table-column prop="id" label="ID" width="50"> </el-table-column>
        <el-table-column prop="title" label="名称" width="180"> </el-table-column>
        <el-table-column prop="image" label="图片" width="180">
          <template #default="scope">
            <img v-if="scope.row.image" :src="host + scope.row.image" width="100px" alt="" />
            <span v-else>NoPic</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <span v-if="scope.row.status">已显示</span>
            <span v-else>已隐藏</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="转向id" width="80"> </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-link @click="handleUpdate(scope.row.id)" type="primary">编辑</el-link> |
            <el-popconfirm
              title="确定删除吗？"
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-link type="primary">删除</el-link>
              </template>
            </el-popconfirm>
            <span v-if="scope.row.status == 1">
              |
              <el-link type="primary" @click="handleHidden(scope.row.id)">隐藏</el-link>
            </span>
            <span v-else>
              |
              <el-link type="primary" @click="handleDisplay(scope.row.id)">显示</el-link>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { gets, del, statusDisplay, statusHidden } from '@/services/admin/flash.js'
import config from '@/config.js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()

const host = ref(config.baseURL)
const tableData = ref([])
onMounted(() => {
  handleList()
})
const handleList = async () => {
  tableData.value = await gets()
}
const handleCancel = () => {
  document.querySelector('#app').click()
}
const handleUpdate = (index) => {
  router.push({ name: 'flashDetail', params: { id: index } })
}
const handleCreate = () => {
  router.push({ name: 'flashCreate' })
}
const handleDelete = async (id) => {
  await del(id)
  ElMessage({
    type: 'success',
    message: '删除成功',
    duration: 1000
  })
  //重新请求数据
  await handleList()
  document.querySelector('#app').click()
}
const handleDisplay = async (id) => {
  await statusDisplay(id)
  ElMessage({
    type: 'success',
    message: '已显示',
    duration: 1000
  })
  //重新请求数据
  await handleList()
}
const handleHidden = async (id) => {
  await statusHidden(id)
  ElMessage({
    type: 'success',
    message: '已隐藏',
    duration: 1000
  })
  //重新请求数据
  await handleList()
}
// export default {
// 	data() {
// 		return {
//
// 		}
// 	},
// 	mounted: function () {
// 	},
// 	methods: {
//
// 	},
// }
</script>
