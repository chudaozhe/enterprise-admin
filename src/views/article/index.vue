<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header2">
          <div>
            <span>筛选：</span>
            <el-cascader
              placeholder="请选择分类"
              :options="options"
              v-model="category_id"
              @change="handleChange"
              :props="{ expandTrigger: 'hover', checkStrictly: true }"
              clearable
              size="small"
              style="width: 160px"
            >
            </el-cascader>
            <el-input
              style="width: 200px; margin-left: 10px"
              v-model="keyword"
              size="small"
              placeholder="关键词"
            />
            <el-button style="margin-left: 10px" size="small" type="primary" @click="onSubmit"
              >搜索</el-button
            >
          </div>

          <el-button @click="handleCreate()" size="small" type="primary">添加</el-button>
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
            <el-link @click="handleUpdate(scope.row.id)" type="primary">编辑</el-link>
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
import {
  gets as getArticles,
  gets2 as getArticles2,
  del,
  statusDisplay,
  statusHidden
} from '../../services/admin/article.js'
import { gets2 } from '@/services/admin/category.js'
import config from '@/config.js'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'
const router = useRouter()
const instance = getCurrentInstance()

const host = ref(config.baseUrl)
const page = ref(1)
const max = ref(10)
const category_id = ref(0)
const category_ids = ref([])
const total = ref(0)
const currentPage = ref(1)
const tableData = ref([])
const keyword = ref('')

const options = ref([
  {
    id: 0,
    name: '全部'
  }
])
onMounted(() => {
  handleList()
  handleCategoryList()
})

const handleList = async function () {
  let result
  if (category_ids.value.length > 0) {
    result = await getArticles2(category_ids.value, keyword.value, page.value, max.value)
  } else {
    category_ids.value = []
    result = await getArticles(category_id.value, keyword.value, page.value, max.value)
  }

  tableData.value = result.list
  total.value = result.count > 0 ? parseInt(result.count) : 0
}
const handleCategoryList = async () => {
  options.value = await gets2()
}
const handleCancel = () => {
  document.querySelector('#app').click()
}

const handleUpdate = (index) => {
  router.push({ name: 'articleDetail', params: { id: index } })
}

const handleCreate = () => {
  router.push({ name: 'articleCreate' })
}
const handleDelete = async (id) => {
  let result = await del(id)
  if (result.err === 0) {
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '删除成功',
      duration: 1000
    })
    //重新请求数据
    await handleList()
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
  document.querySelector('#app').click()
}

const handleDisplay = async (id) => {
  let result = await statusDisplay(id)
  if (result.err === 0) {
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '已显示',
      duration: 1000
    })
    //重新请求数据
    await handleList()
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}

const handleHidden = async (id) => {
  let result = await statusHidden(id)
  if (result.err === 0) {
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '已隐藏',
      duration: 1000
    })
    //重新请求数据
    await handleList()
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
}
const handleCurrentChange = (page1) => {
  page.value = page1
  handleList()
  console.log(`当前页: ${page.value}`)
}

const handleChange = (value) => {
  if (undefined === value || value.length === 0) return
  page.value = 1
  category_id.value = value[value.length - 1]
  keyword.value = ''
  let category_ids1 = []
  if (category_id.value === 2) {
    category_ids1 = getChildrenIds(2)
  } else if (category_id.value === 5) {
    category_ids1 = getChildrenIds(5)
  }
  if (category_ids1.length > 0) {
    category_ids.value = category_ids1
    handleList()
  } else {
    category_ids.value = []
    handleList()
  }
}
const getChildrenIds = (type) => {
  let o = []
  for (let i = 0, length = options.value.length; i < length; i++) {
    let children = []
    if (options.value[i].value === type) {
      children = options.value[i].children
      for (let j = 0, length = children.length; j < length; j++) {
        o.push(children[j].value)
      }
    }
  }
  return o
}
const onSubmit = () => {
  page.value = 1
  handleList()
}
</script>
