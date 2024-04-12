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
            <el-input
              size="small"
              v-model="keyword"
              placeholder="关键词"
              style="width: 200px; margin-left: 10px"
            ></el-input>
            <el-button size="small" type="primary" @click="onSubmit" style="margin-left: 10px"
              >搜索</el-button
            >
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
        <el-table-column prop="image" label="缩略图" width="180">
          <template #default="scope">
            <img v-if="scope.row.image" :src="host + scope.row.image" width="100px" alt="" />
            <span v-else>NoPic</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <span v-if="scope.row.status">已显示</span>
            <span v-else>已隐藏</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-link @click="handleEdit(scope.row.id)" type="primary">编辑</el-link>
            |
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
      <template #footer>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-model:current-page="currentPage"
          v-model:page-size="max"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </template>
    </el-card>
  </div>
</template>

<script setup>
import { gets as getCases, del, statusDisplay, statusHidden } from '../../services/admin/case'
import { gets } from '@/services/admin/category.js'
import config from '@/config.js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'

const router = useRouter()

const host = ref(config.baseURL)
const page = ref(1)
const max = ref(10)
const category_id = ref(0)
const total = ref(0)
const currentPage = ref(1)
const tableData = ref([])
const keyword = ref('')
const options = ref([
  {
    value: '0',
    label: '全部'
  }
])
const value = ref('0')

onMounted(() => {
  page.value = 1
  handleList()
  handleCategoryList()
})

const handleList = async () => {
  let result = await getCases(category_id.value, keyword.value, page.value, max.value)
  tableData.value = result.list
  total.value = result.count > 0 ? parseInt(result.count) : 0
}
const handleCategoryList = async () => {
  let result = await gets(3)
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
  router.push({ name: 'caseDetail', params: { id: index } })
}
const handleCreate = () => {
  router.push({ name: 'caseCreate' })
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
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
}
const handleCurrentChange = (page1) => {
  page.value = page1
  handleList()
  console.log(`当前页: ${page.value}`)
}
const handleChange = (category_id1) => {
  category_id.value = category_id1
  page.value = 1
  handleList()
  console.log(category_id)
}
const onSubmit = () => {
  page.value = 1
  handleList()
}
// export default {
// 	data() {
// 		return {
//
// 		}
// 	},
// 	mounted: function () {
//
// 	},
// 	methods: {
// 	},
// }
</script>
