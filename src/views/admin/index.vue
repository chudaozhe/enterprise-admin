<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header2">
          <div>
            <el-input
              size="small"
              v-model="keyword"
              placeholder="关键词"
              style="width: 200px"
            ></el-input>
            <el-button size="small" type="primary" @click="onSubmit" style="margin-left: 10px"
              >搜索</el-button
            >
          </div>
          <el-button size="small" type="primary" @click="handleCreate()">添加</el-button>
        </div>
      </template>
      <el-table :data="tableData">
        <el-table-column prop="id" label="ID" width="50"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="80"> </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="100"> </el-table-column>
        <el-table-column label="头像" width="100">
          <template #default="{ row }">
            <el-popover placement="left" trigger="hover">
              <template #reference>
                <img :src="host + row.avatar" style="height: 50px; width: 50px" />
              </template>
              <template #default>
                <img :src="host + row.avatar" style="height: 100px; width: 100px" />
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="E-mail" width="180"> </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180"> </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <span v-if="scope.row.status">已启用</span>
            <span v-else>已禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="180">
          <template #default="scope">
            <div v-if="scope.row.create_time">{{ formatDate(scope.row.create_time) }}</div>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-link type="primary" @click="handleUpdate(scope.row.id)">编辑</el-link>
            |
            <el-popconfirm
              title="确定重置吗？"
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              @confirm="handleReset(scope.row.id)"
            >
              <template #reference>
                <el-link type="primary">重置密码</el-link>
              </template>
            </el-popconfirm>
            <span v-if="scope.row.status == 1">
              |
              <el-popconfirm
                title="确定禁用吗？"
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                @confirm="handleDisable(scope.row.id)"
              >
                <template #reference>
                  <el-link type="primary">禁用</el-link>
                </template>
              </el-popconfirm>
            </span>
            <span v-else>
              |
              <el-popconfirm
                title="确定启用吗？"
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="#626AEF"
                @confirm="handleEnable(scope.row.id)"
              >
                <template #reference>
                  <el-link type="primary">启用</el-link>
                </template>
              </el-popconfirm>
            </span>
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
import { formatdate } from '@/utils/date.js'
import { gets, del, disable, enable, reset } from '@/services/admin/admin.js'
import { getCurrentInstance, onMounted, ref } from 'vue'
import config from '@/config.js'
import { useRouter } from 'vue-router'
import { InfoFilled } from '@element-plus/icons-vue'

let router = useRouter()
const instance = getCurrentInstance()

const host = ref(config.baseURL)
const max = ref(10)
const total = ref(0)
const currentPage = ref(1)
const tableData = ref([])
const keyword = ref('')
onMounted(() => {
  handleList(keyword.value, 1, max.value)
})
const formatDate = (time) => {
  let timestamp = new Date(parseInt(time + '000'))
  return formatdate(timestamp, 'yyyy-MM-dd hh:mm:ss') // 此处可根据自己的需要自定义想要的日期格式
}
const handleList = async (keyword, page, max) => {
  let result = await gets(keyword, page, max)
  if (undefined === result.err) {
    tableData.value = result.list
    total.value = result.count > 0 ? parseInt(result.count) : 0
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}
const cancel = () => {
  console.log('取消')
  document.querySelector('#app').click()
}
const handleReset = async (id) => {
  let result = await reset(id)
  if (result.err === 0) {
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '已重置，新密码已发送到对应E-mail',
      duration: 1000
    })
    document.querySelector('#app').click()
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}
const handleDisable = async (id) => {
  let result = await disable(id)
  if (result.err === 0) {
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '已禁用',
      duration: 1000
    })
    //重新请求数据
    await handleList(keyword.value, 1, max.value)
    document.querySelector('#app').click()
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}
const handleEnable = async (id) => {
  let result = await enable(id)
  if (result.err === 0) {
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '已启用',
      duration: 1000
    })
    //重新请求数据
    await handleList(keyword.value, 1, max.value)
    document.querySelector('#app').click()
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}
const handleAuth = (index) => {
  console.log('Auth:')
  console.log(index)
}
const handleUpdate = (id) => {
  router.push({ name: 'adminDetail', params: { id: id } })
}
const handleCreate = () => {
  router.push({ name: 'adminCreate' })
}
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`)
}
const handleCurrentChange = (page) => {
  handleList(keyword.value, page, max.value)
  console.log(`当前页: ${page}`)
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
    await handleList(keyword.value, 1, max.value)
    document.querySelector('#app').click()
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}
const onSubmit = () => {
  handleList(keyword.value, 1, max.value)
}
// export default {
// 	filters:{
//
// 	},
// 	data() {
// 		return {
//
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
