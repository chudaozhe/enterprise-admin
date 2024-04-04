<template>
	<div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="分类" prop="category_id">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="ruleForm.category_id"
            @change="handleChange"
            size="small" style="width: 160px;">
          </el-cascader>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <file-manager ref="fileManagerRef" @selected="selectedImage"></file-manager>

        <el-form-item label="头图" prop="image">
          <div>
            <div v-if="ruleForm.image" class="el-upload el-upload--picture-card" style="width: 100px; height: 100px;" @click="showFileManager(1)">
              <img style="width:100%" :src="host + ruleForm.image" alt="">
            </div>
            <div v-else class="el-upload el-upload--picture-card" style="width: 100px; height: 100px; line-height: 110px" @click="showFileManager(1)">
              <el-icon><Plus /></el-icon>
            </div>
            <div style="color: gray">推荐尺寸：750*375px</div>
          </div>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <mavon-editor
            style="width: 100%"
            v-model="ruleForm.content"
            ref="mdRef"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"/>
          <!--<el-input type="textarea" v-model="ruleForm.content"></el-input>-->
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
	import { get,add,edit } from '@/services/admin/page.js'
	import fileManager from '../../components/filemanager/fileManager.vue';
	import {gets} from '@/services/admin/category.js';
  import {getCurrentInstance, onMounted, reactive, ref} from "vue";
  import {useRoute, useRouter} from "vue-router";
  import config from '@/config.js';
  import {add as addFile} from "@/services/admin/file.js";

  const route = useRoute();
  const router = useRouter();
  const instance = getCurrentInstance();

  const host = ref(config.baseURL);
  const options = ref([]);
  const id = ref(route.params.id);
  const mdRef = ref();
  const ruleFormRef = ref();
  const fileManagerRef = ref();
  const ruleForm = ref({
    category_id: 0,
    title: '',
    image: '',
    content: ''
  });
  const rules = reactive({
    title: [
      { required: true, message: '请输入标题', trigger: 'blur' }
    ],
      content: [
      { required: true, message: '请填写内容', trigger: 'blur' }
    ]
  });
  onMounted(()=>{
    handleDetail();
    handleCategoryList();
  })
  const $imgAdd = (pos, file) => {
    // 将图片上传到服务器(formdata方式
    // var formdata = new FormData();
    // formdata.append('image', $file);
    // (x-www-form-urlencoded方式
    let data = {}

    uploadFile(file).then(async function (file) {
      data.content = file.result.substr(22)
      data.type = file.type
      data.width = file.width
      data.height = file.height
      data.size = file.size
      data.title = file.name
      let result = await addFile(data)
      console.log(result)
      if (result.err === 0) {
        instance.appContext.config.globalProperties.$message({
          type: 'success',
          message: '上传成功',
          duration: 1000,
        })
        mdRef.value.$imglst2Url([[pos, result.data.url]])
      } else {
        instance.appContext.config.globalProperties.$message({ type: 'error', message: result.msg, duration: 1000 })
      }
    })
  }
  //获取reader的result
  const uploadFile = (file) => {
    return new Promise(function (resolve, reject) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      //reader.readAsArrayBuffer(file)
      reader.onload = function () {
        file.result = this.result
        let image = new Image()
        image.src = this.result
        image.onload = function () {
          file.width = this.width
          file.height = this.height
          resolve(file)
        }
      }
    })
  }
  const $imgDel = (pos) => {
    console.log(pos) //["//blog.cw.net/data/upload/2021-05-11/162072210359836.jpg", file]
    //关于删除，仅仅是当前添加的可以删除；如果是从数据库读出来的，就没有删除按钮了
  }
  const handleDetail = async () => {
    if(id.value>0){
      let result= await get(id.value);
      if(result.err===0){
        ruleForm.value = result.data;
      }else{
        instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
      }
    }
  }
  const handleCategoryList = async () => {
    let result=await gets(4);
    let o=[{value:0, label:'无'}];
    if(result.length>0){
      for (let i = 0, length = result.length; i < length; i++) {
        o[i+1]={value:parseInt(result[i].id), label:result[i].name}
      }
    }
    options.value = o;
  }
  const handleCreate = async (params) => {
    let result= await add(params);
    if(result.err===0){
      instance.appContext.config.globalProperties.$message({type:'success', message:'添加成功', duration:1000});
    }else{
      instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
    }
  }
  const handleUpdate = async (id, params) => {
    let result= await edit(id, params);
    if(result.err===0){
      instance.appContext.config.globalProperties.$message({type:'success', message:'修改成功', duration:1000});
      await router.push({name: 'page'});
    }else{
      instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
    }
  }
  const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        let data={};
        data.category_id=ruleForm.value.category_id;
        data.title=ruleForm.value.title;
        data.image=ruleForm.value.image;
        data.content=ruleForm.value.content;

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
  const handleChange = (value) => {
    console.log(value[value.length-1]);
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
	// 		};
	// 	},
	// 	components:{
	// 		'fileManager': fileManager
	// 	},
	// 	mounted: function () {
  //
	// 	},
	// 	methods: {
  //
	// 	}
	// }
</script>
