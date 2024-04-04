<template>
	<div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <file-manager ref="fileManagerRef" @selected="selectedImage"></file-manager>

        <el-form-item label="轮播图" prop="image">
          <div>
            <div v-if="ruleForm.image" class="el-upload el-upload--picture-card" style="width: 100px; height: 100px;" @click="showFileManager(1)">
              <img style="width:100%" :src="host+ruleForm.image" alt="">
            </div>
            <div v-else class="el-upload el-upload--picture-card" style="width: 100px; height: 100px; line-height: 110px" @click="showFileManager(1)">
              <el-icon><Plus /></el-icon>
            </div>
            <div style="color: gray">推荐尺寸：750*375px</div>
          </div>
        </el-form-item>
        <el-form-item label="转向id" prop="url">
          <el-input v-model="ruleForm.url"></el-input><span style="color: gray">案例id</span>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort"></el-input><span style="color: gray">值越大越靠前</span>
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-input v-model="ruleForm.status"></el-input><span style="color: gray">是否显示：1是 0否</span>
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
	import { get,add,edit } from '@/services/admin/flash.js'
	import fileManager from '../../components/filemanager/fileManager.vue';
  import config from "@/config.js";
  import {getCurrentInstance, onMounted, reactive, ref} from "vue";
  import {useRoute, useRouter} from "vue-router";

  const route = useRoute();
  const router = useRouter();
  const instance = getCurrentInstance();

  const host = ref(config.baseURL);
  const id = ref(route.params.id);
  const ruleFormRef = ref();
  const fileManagerRef = ref();
  const ruleForm = ref({
    title: '',
      image: '',
      url: '',
      sort: 0,
      status:1,
  });
  const rules = reactive({
    title: [
      { required: true, message: '请输入名称', trigger: 'blur' }
    ]
  });
  const imageUrl = ref('');
  onMounted(()=>{
    handleDetail();
  })
  const handleDetail = async () => {
    if(id.value>0){
      let result= await get(id.value);
      if(result.err===0){
        ruleForm.value=result.data;
      }else{
        instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
      }
    }
  }
  const handleCreate = async (params) => {
    let result= await add(params);
    if(result.err===0){
      instance.appContext.config.globalProperties.$message({type:'success', message:'添加成功', duration:1000});
      await router.push({name: 'flash'});
    }else{
      instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
    }
  }
  const handleUpdate = async (id, params) => {
    let result= await edit(id, params);
    if(result.err===0){
      instance.appContext.config.globalProperties.$message({type:'success', message:'修改成功', duration:1000
      });
      await router.push({name: 'flash'});
    }else{
      instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
    }
  }
  const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        let data={};
        data.title=ruleForm.value.title;
        data.url=ruleForm.value.url;
        data.image=ruleForm.value.image;
        data.sort=ruleForm.value.sort;
        data.status=ruleForm.value.status;

        if(id.value>0){
          //update
          handleUpdate(id.value, data)
        }else {
          //add
          handleCreate(data)
        }
      } else {
        return false;
      }
    });
  }
  const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
  }
  //调出文件管理组件
  const showFileManager = (image_type1) => {
    fileManagerRef.value.show()
  }
  const selectedImage = (file) => {
    console.log('selected-选择的图片是：' + file.url)
    ruleForm.value.image = file.url
  }
	// export default {
	// 	data() {
	// 		return {
  //
	// 		};
	// 	},
	// 	components:{
	// 		'fileManager': fileManager
	// 	},
	// 	mounted: function () {
	// 	},
	// 	methods: {
  //
	// 	}
	// }
</script>
