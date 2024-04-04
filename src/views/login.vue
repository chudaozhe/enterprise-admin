<template>
  <div style="display: flex; align-items: center; justify-content: center; height: 100vh">
    <el-card style="width: 400px;">
      <template #header>
        <h1 style="text-align: center;">管理后台</h1>
      </template>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
        <el-form-item prop="username">
          <el-input v-model.number="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="密码" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" style="width: 100%">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { doLogin } from '../services/admin/user.js'
import { useUserInfoStore } from "@/stores/store.js";
import {useRoute, useRouter} from "vue-router";
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import { get } from '@/services/admin/admin.js'
const router = useRouter()
const route = useRoute()
const instance = getCurrentInstance()
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
    password: '',
  });
const rules = reactive({
    password: [{ validator: validatePassword, trigger: 'blur' }],
    username: [{ validator: checkUsername, trigger: 'blur' }],
  });
onMounted(()=>{
  handleAdminDetail();
})
const handleLogin = async (username, password) => {
  let res = await doLogin(username, password)
  if (res?.id) {
    let data = {}
    data.id = res.id
    data.nickname = res.nickname
    data.avatar = res.avatar
    data.token = res.token
    useUserInfoStore().setUserInfo(data)
    instance.appContext.config.globalProperties.$message({ type: 'success', message: '您已登录', duration: 1000 })
    let redirect = route.query.redirect
    let url = undefined !== redirect ? redirect : '/admin'
    await router.push(url)
  } else {
    instance.appContext.config.globalProperties.$message({ type: 'error', message: res.msg, duration: 1000 })
  }
}
/**
 * 验证是否已登录
 * @returns {Promise<void>}
 */
const handleAdminDetail = async () => {
  let res = await get(1);
  if (res?.data){
    await router.push({name: 'admin'});
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
