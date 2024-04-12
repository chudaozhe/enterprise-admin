<template>
  <div style="display: flex; align-items: center; justify-content: center; height: 100vh">
    <el-card style="width: 400px">
      <template #header>
        <h1 style="text-align: center">管理后台</h1>
      </template>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <el-form-item prop="username">
          <el-input v-model.number="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            placeholder="密码"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef)"
            @keyup.enter="pressEnterToLogin"
            style="width: 100%"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { doLogin } from '../services/admin/user.js'
import { useUserInfoStore } from '@/stores/store.js'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentInstance, onMounted, onUnmounted, reactive, ref } from 'vue'
const router = useRouter()
const route = useRoute()
const instance = getCurrentInstance()

// 通过回车键登录
const pressEnterToLogin = (e) => {
  if (e.keyCode === 13) {
    submitForm(ruleFormRef.value)
  }
}
const checkUsername = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error('用户名不能为空'))
  }
  callback()
}
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error('请输入密码'))
  }
  callback()
}
const ruleFormRef = ref()
const ruleForm = ref({
  username: '',
  password: ''
})
const rules = reactive({
  password: [{ validator: validatePassword, trigger: 'blur' }],
  username: [{ validator: checkUsername, trigger: 'blur' }]
})

onMounted(() => {
  navigateToAdminIfUserExists()
  // 绑定监听事件
  window.addEventListener('keydown', pressEnterToLogin)
})

onUnmounted(() => {
  // 销毁事件
  window.removeEventListener('keydown', pressEnterToLogin, false)
})
const handleLogin = async (username, password) => {
  let res = await doLogin(username, password)
  let data = {}
  data.id = res.id
  data.nickname = res.nickname
  data.avatar = res.avatar
  data.token = res.token
  useUserInfoStore().setUserInfo(data)
  instance.appContext.config.globalProperties.$message({
    type: 'success',
    message: '您已登录',
    duration: 1000
  })
  let redirect = route.query.redirect
  let url = undefined !== redirect ? redirect : '/admin'
  await router.push(url)
}
/**
 * 如果用户信息存在，则跳转到后台
 * @returns {Promise<void>}
 */
const navigateToAdminIfUserExists = async () => {
  if (!useUserInfoStore().isEmpty()) {
    await router.push({ name: 'admin' })
  }
}
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      handleLogin(ruleForm.value.username, ruleForm.value.password)
      // console.log('submit!')
    } else {
      console.log('error submit!', fields)
      return false
    }
  })
}
</script>
