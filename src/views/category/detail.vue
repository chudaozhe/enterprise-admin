<template>
  <div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item style="margin-bottom: 20px">
          <el-radio-group v-model="ruleForm.type">
            <!--							<el-radio size="small" :value="1" border>文件</el-radio>-->
            <el-radio size="small" :value="2" border>新闻</el-radio>
            <el-radio size="small" :value="3" border>案例</el-radio>
            <el-radio size="small" :value="4" border>单页</el-radio>
            <el-radio size="small" :value="5" border>技术支持</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="memo">
          <el-input v-model="ruleForm.memo"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
          <el-button size="small" v-if="!id" @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { get, add, edit } from '@/services/admin/category.js'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentInstance, onMounted, ref } from 'vue'
const route = useRoute()
const router = useRouter()
const instance = getCurrentInstance()

const ruleFormRef = ref()
const id = ref(route.params.id)
const ruleForm = ref({
  type: '2',
  name: '',
  memo: '',
  sort: 0
})
const rules = ref({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})
onMounted(() => {
  handleDetail()
})
const handleDetail = async () => {
  if (id.value > 0) {
    let result = await get(id.value)
    if (result.err === 0) {
      ruleForm.value = result.data
      // ruleForm.value=field.type.toString();
    } else {
      instance.appContext.config.globalProperties.$message({
        type: 'error',
        message: result.msg,
        duration: 1000
      })
    }
  }
}
const handleCreate = async (params) => {
  let result = await add(params)
  if (result.err === 0) {
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '添加成功',
      duration: 1000
    })
    router.push({ name: 'category' })
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}
const handleUpdate = async (id, params) => {
  let result = await edit(id, params)
  if (result.err === 0) {
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '修改成功',
      duration: 1000
    })
    router.push({ name: 'category' })
  } else {
    instance.appContext.config.globalProperties.$message({
      type: 'error',
      message: result.msg,
      duration: 1000
    })
  }
}
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let data = {}
      data.type = ruleForm.value.type
      data.name = ruleForm.value.name
      data.memo = ruleForm.value.memo
      data.sort = ruleForm.value.sort

      if (id.value > 0) {
        //update
        handleUpdate(id.value, data)
      } else {
        //add
        handleCreate(data)
      }
    } else {
      return false
    }
  })
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
// 	export default {
// 	data() {
// 		return {
//
// 		};
// 	},
// 	mounted: function () {
// 	},
// 	methods: {
//
// 	}
// }
</script>
