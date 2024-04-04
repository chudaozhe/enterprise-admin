<template>
	<div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item v-if="!id" label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="ruleForm.email"></el-input><span style="color: gray">初始密码会发送到你填写的E-mail</span>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="ruleForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="icon_url"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <el-icon class="avatar-uploader-icon" v-else><Plus /></el-icon>
          </el-upload>
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
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import config from '@/config.js'
import {useUserInfoStore} from "@/stores/store.js";

const route = useRoute();
const router = useRouter();
const instance = getCurrentInstance()

const ruleFormRef =ref();
const icon_url = ref(config.baseURL + '/admin/editor/upload');
const id = ref(route.params.id);
const imageUrl = ref('');
const ruleForm = reactive({
  username: '',
  nickname: '',
  avatar: '',
  email: '',
  mobile: '',
})
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请填写E-mail', trigger: 'blur' }
  ]
})
onMounted(()=>{
  handleDetail();
})
const userInfoStore=()=>{
  return useUserInfoStore()
}
const handleDetail = async () => {
  if(id.value>0){
    let result= await get(id.value);
    if(result.err===0){
      let field=result.data;
      //ruleForm.username=field.username;
      ruleForm.nickname=field.nickname;
      ruleForm.mobile=field.mobile;
      ruleForm.email=field.email;
      imageUrl.value=''!==field.avatar ?config.baseURL+field.avatar:'';
    }else{
      instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
    }
  }
}
const handleCreate = async (params) => {
  let result= await add(params);
  if(result.err===0){
    instance.appContext.config.globalProperties.$message({type:'success', message:'添加成功', duration:1000});
    await router.push({name:'admin'});
  }else{
    instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
  }
}
const handleUpdate = async (id, params) => {
  let result= await edit(id, params);
  if(result.err===0){
    let user=userInfoStore().userInfo;
    if(undefined !== params.avatar) user.avatar=params.avatar;
    if(undefined !== params.nickname) user.nickname=params.nickname;
    if('' !== params.avatar || '' !== params.nickname){
      userInfoStore().setUserInfo(user);
    }
    instance.appContext.config.globalProperties.$message({type:'success', message:'修改成功', duration:1000});
    await router.push({name:'admin'});
  }else{
    instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
  }
}
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let data={};
      if(ruleForm.username && id.value===undefined) data.username=ruleForm.username;
      if(ruleForm.nickname) data.nickname=ruleForm.nickname;
      if(ruleForm.mobile) data.mobile=ruleForm.mobile;
      if(ruleForm.email) data.email=ruleForm.email;
      if(ruleForm.avatar) data.avatar=ruleForm.avatar;
      console.log(JSON.stringify(data))
      if(id.value>0){
        //update
        handleUpdate(id.value, data)
      }else {
        //add
        handleCreate(data)
      }
    } else {
      console.log('error submit!!');
      return false;
    }
  });
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  imageUrl.value='';
}
const handleAvatarSuccess = (res, file) => {
  // console.log('file:')
  // console.log(file.response.url)
  ruleForm.avatar=file.response.url;
  imageUrl.value = URL.createObjectURL(file.raw);
}
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isGIF = file.type === 'image/gif';
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG && !isPNG && !isGIF) {
    instance.appContext.config.globalProperties.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
  }
  if (!isLt2M) {
    instance.appContext.config.globalProperties.$message.error('上传头像图片大小不能超过 2MB!');
  }
  return (isJPG || isPNG || isGIF) && isLt2M;
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
		line-height: 100px!important;
		text-align: center;
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}

</style>