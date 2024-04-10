<template>
  <div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item v-if="!id" label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
          <span style="color: gray">初始密码会发送到你填写的E-mail</span>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <!--        选择头像-->
        <FileManager ref="fileManagerRef" @selected="selectedImage" />
        <el-form-item label="头像" prop="avatar">
          <div>
            <GridView
              :images="ruleForm.avatar ? [ruleForm.avatar] : []"
              :image_prefix="host"
              :show_plus="image_show_plus"
              @showFileManager="showFileManager"
              @removeImage="removeImage"
            />
            <div style="color: gray">推荐尺寸：440*248px</div>
          </div>
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
import { get, add, edit } from '@/services/admin/admin.js'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import config from '@/config.js'
import { useUserInfoStore } from '@/stores/store.js'
import FileManager from '../../components/filemanager/file-manager.vue'
import GridView from '@/components/grid-view.vue'

const route = useRoute()
const router = useRouter()
const instance = getCurrentInstance()

const host = ref(config.baseURL)
const ruleFormRef = ref()
const fileManagerRef = ref()
const id = ref(route.params.id)
const image_show_plus = ref(false)
const ruleForm = ref({
  username: '',
  nickname: '',
  avatar: '',
  email: '',
  mobile: ''
})
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请填写E-mail', trigger: 'blur' }]
})
onMounted(() => {
  handleDetail()
})
const userInfoStore = () => {
  return useUserInfoStore()
}
const handleDetail = async () => {
  if (id.value > 0) {
    let result = await get(id.value)
    if (result.err === 0) {
      ruleForm.value = result.data
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
    await router.push({ name: 'admin' })
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
    let user = userInfoStore().userInfo
    if (undefined !== params.avatar) user.avatar = params.avatar
    if (undefined !== params.nickname) user.nickname = params.nickname
    if ('' !== params.avatar || '' !== params.nickname) {
      userInfoStore().setUserInfo(user)
    }
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '修改成功',
      duration: 1000
    })
    await router.push({ name: 'admin' })
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
      if (ruleForm.value.username && id.value === undefined) data.username = ruleForm.value.username
      if (ruleForm.value.nickname) data.nickname = ruleForm.value.nickname
      if (ruleForm.value.mobile) data.mobile = ruleForm.value.mobile
      if (ruleForm.value.email) data.email = ruleForm.value.email
      if (ruleForm.value.avatar) data.avatar = ruleForm.value.avatar
      console.log(JSON.stringify(data))
      if (id.value > 0) {
        //update
        handleUpdate(id.value, data)
      } else {
        //add
        handleCreate(data)
      }
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
//调出文件管理组件
const showFileManager = () => {
  fileManagerRef.value.show()
}
const selectedImage = (file) => {
  console.log('selected-选择的图片是：' + file.url)
  ruleForm.value.avatar = file.url
  image_show_plus.value = false
}
const removeImage = (index) => {
  console.log(index)
  ruleForm.value.avatar = ''
  image_show_plus.value = true
}
// export default {
//   data() {
//     return {
//
//     };
//   },
//   mounted: function () {
//
//   },
//   methods: {
//
//   }
// }
</script>

<style>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px !important;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
