<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div class="title" :style="{ width: collapsed ? '60px' : '200px' }">
          <span v-show="!collapsed">{{ collapsed ? '' : sysName }}</span>
          <el-icon @click="collapse">
            <Expand v-show="collapsed" />
            <Fold v-show="!collapsed" />
          </el-icon>
        </div>
        <div>
          <el-dropdown trigger="hover">
            <div class="userinfo">
              <span>{{ admin?.nickname }}</span>
              <img :src="host + admin?.avatar" alt="" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="dialogFormVisible = true">修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" v-show="!collapsed">
          <!--导航菜单-->
          <el-menu
            :default-active="$route.path"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
            unique-opened
            router
          >
            <el-sub-menu v-for="(item, index) in menuList" :key="index" :index="item.id.toString()">
              <template #title>
                <component v-if="item.icon" class="aside-menu-icon" :is="item.icon"></component>
                <!--                  <el-icon><Setting /></el-icon>-->
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.uri">
                <component
                  v-if="subItem.icon"
                  class="aside-menu-icon"
                  :is="subItem.icon"
                ></component>
                <span>{{ subItem.title }}</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <RouterView v-slot="{ Component }">
              <transition name="fade-right" mode="out-in">
                <component :is="Component" />
              </transition>
            </RouterView>
          </el-main>
          <!--          <el-footer>Footer</el-footer>-->
        </el-container>
      </el-container>
    </el-container>
    <!--    修改密码弹窗-->
    <el-row>
      <el-dialog title="修改密码" v-model="dialogFormVisible" width="500">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
          <el-form-item label="当前密码" prop="password">
            <el-input type="password" v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input type="password" v-model="ruleForm.new_password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="new_password2">
            <el-input type="password" v-model="ruleForm.new_password2"></el-input>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <div class="dialog-footer">
            <el-button size="small" type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
            <el-button size="small" @click="resetForm(ruleFormRef)">重置</el-button>
          </div>
        </template>
      </el-dialog>
    </el-row>
  </div>
</template>

<script setup>
import { useUserInfoStore } from '@/stores/store.js'
import { changePassword } from '@/services/admin/admin.js'
import config from '@/config.js'
import { onMounted, reactive, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
const router = useRouter()

const host = ref(config.baseURL)
const sysName = ref('管理后台')
const collapsed = ref(false)
const admin = ref()
const dialogFormVisible = ref(false)
const ruleFormRef = ref()
const ruleForm = ref({
  password: '',
  new_password: '',
  new_password2: ''
})
const validatePass = async (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.value.new_password2 !== '') {
      ruleFormRef.value.validateField('new_password2')
    }
    callback()
  }
}
const validatePass2 = async (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.value.new_password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
const rules = reactive({
  password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  new_password2: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
})
const menuList = ref([
  {
    id: 1,
    title: '管理员管理',
    icon: 'lock',
    uri: '',
    children: [
      {
        id: 2,
        title: '管理员列表',
        icon: 'user',
        uri: '/admin'
      }
    ]
  },
  {
    id: 3,
    title: '图片空间',
    icon: 'picture',
    uri: '',
    children: [
      {
        id: 4,
        title: '图片列表',
        icon: '',
        uri: '/file'
      }
    ]
  },
  {
    id: 5,
    title: '分类管理',
    icon: 'folder-opened',
    uri: '',
    children: [
      {
        id: 6,
        title: '分类列表',
        icon: '',
        uri: '/category'
      }
    ]
  },
  {
    id: 7,
    title: '案例管理',
    icon: 'collection-tag',
    uri: '',
    children: [
      {
        id: 8,
        title: '案例列表',
        icon: '',
        uri: '/case'
      }
    ]
  },
  {
    id: 9,
    title: '文章管理',
    icon: 'memo',
    uri: '',
    children: [
      {
        id: 10,
        title: '文章列表',
        icon: '',
        uri: '/article'
      }
    ]
  },
  {
    id: 11,
    title: '单页管理',
    icon: 'notebook',
    uri: '',
    children: [
      {
        id: 12,
        title: '单页列表',
        icon: '',
        uri: '/page'
      }
    ]
  },
  {
    id: 13,
    title: '快捷方式管理',
    icon: 'position',
    uri: '',
    children: [
      {
        id: 14,
        title: '快捷方式列表',
        icon: '',
        uri: '/shortcut'
      }
    ]
  },
  {
    id: 15,
    title: '焦点图',
    icon: 'reading',
    uri: '',
    children: [
      {
        id: 16,
        title: '焦点图',
        icon: '',
        uri: '/flash'
      }
    ]
  }
])

onMounted(() => {
  admin.value = userInfoStore().userInfo
})

const userInfoStore = () => {
  return useUserInfoStore()
}

const handleOpen = (key, keyPath) => {
  // console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  // console.log(key, keyPath)
}

const handleSelect = (a, b) => {
  // console.log(a, b)
}

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      handlePassword(ruleForm.value.password, ruleForm.value.new_password)
      console.log('submit!')
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

const handlePassword = async (password, new_password) => {
  await changePassword(password, new_password)
  dialogFormVisible.value = false
  ElMessage({
    type: 'success',
    message: '修改成功，请重新登录',
    duration: 1000
  })
  userInfoStore().removeUserInfo()
  await router.push({ name: 'login' })
}
//退出登录
const handleLogout = async () => {
  await ElMessageBox.confirm('确认退出吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  })
    .then(() => {
      userInfoStore().removeUserInfo()
      router.push({ name: 'login' })
    })
    .catch(() => {
      //取消
    })
}
//折叠导航栏
const collapse = () => {
  collapsed.value = !collapsed.value
}
</script>

<style lang="scss" scoped>
$color-primary: #20a0ff; //#18c79c
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $color-primary;
  height: 60px;
  line-height: 60px;
  color: #fff;
}
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  font-size: 22px;
}
.userinfo {
  display: flex;
  align-items: center;
  height: 60px;
  cursor: pointer;
  color: #fff;
  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 0 10px;
  }
}
.el-menu {
  border-right: 0;
}
</style>
