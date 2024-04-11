<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header2">
          <div>
            <span>筛选：</span>
            <el-select
              v-model="value"
              placeholder="请选择"
              size="small"
              @change="handleChange"
              style="width: 140px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <el-button @click="handleCreate()" size="small" icon="plus" type="primary"
            >添加</el-button
          >
        </div>
      </template>
      <el-table :data="tableData">
        <el-table-column prop="id" label="ID" width="50"> </el-table-column>
        <el-table-column prop="category_name" label="分类" width="180"> </el-table-column>
        <el-table-column prop="title" label="标题" width="180"> </el-table-column>
        <el-table-column prop="image" label="头图" width="180">
          <template #default="scope">
            <img v-if="scope.row.image" :src="host + scope.row.image" width="100px" alt="" />
            <span v-else>NoPic</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-link @click="handleEdit(scope.row.id)" type="primary">编辑</el-link> |
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
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { gets as getPages, del } from '@/services/admin/page.js'
import { gets } from '@/services/admin/category.js'
import { getCurrentInstance, onMounted, ref } from 'vue'
import config from '@/config'
import { useRouter } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'
const instance = getCurrentInstance()

const router = useRouter()
const host = ref(config.baseURL)
const max = ref(100)
const category_id = ref(0)
const tableData = ref([])
const total = ref(0)
const value = ref(0)
const options = ref([])

onMounted(() => {
  handleCategoryList()
  handleList()
})
const handleList = async () => {
  let result = await getPages(category_id.value, 1, max.value)
  tableData.value = result.list
  total.value = result.count > 0 ? parseInt(result.count) : 0
}
const handleCategoryList = async () => {
  let result = await gets(4)
  let o = [{ value: 0, label: '全部' }]
  if (result.length > 0) {
    for (let i = 0, length = result.length; i < length; i++) {
      o[i + 1] = { value: result[i].id, label: result[i].name }
    }
  }
  options.value = o
}
const handleCancel = () => {
  document.querySelector('#app').click()
}
const handleEdit = (index) => {
  router.push({ name: 'pageDetail', params: { id: index } })
}
const handleCreate = () => {
  router.push({ name: 'pageCreate' })
}
const handleDelete = async (id) => {
  await del(id)
  instance.appContext.config.globalProperties.$message({
    type: 'success',
    message: '删除成功',
    duration: 1000
  })
  //重新请求数据
  await handleList()
  document.querySelector('#app').click()
}
const handleChange = (category_id1) => {
  category_id.value = category_id1
  handleList()
}
// export default {
// 	data() {
// 		return {
// 		}
// 	},
// 	mounted: function () {
//
// 	},
// 	methods: {
//
// 	},
// }
</script>
