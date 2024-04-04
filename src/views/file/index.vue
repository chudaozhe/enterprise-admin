<template>
	<el-card>
    <template #header>
      <div class="card-header">
        <el-upload
          :on-change="handleChange"
          :file-list="fileList"
          :http-request="handleUpload"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess">
          <el-button size="small" type="primary">上传</el-button>
        </el-upload>
      </div>
    </template>
    <div class="all-img">
      <allImgItem v-for="(item, index) in tableData"
                  :url="host+item.url"
                  :key="item.id"
                  @delete="handleDelete(item.id)" >
      </allImgItem>
    </div>
    <template #footer>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:current-page="currentPage"
        v-model:page-size="max"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </template>
	</el-card>
</template>

<script setup>
import allImgItem from './allImgItem.vue'
import { add, gets, del } from '@/services/admin/file.js'
import {getCurrentInstance, onMounted, ref} from "vue";
import config from '@/config.js'

const instance = getCurrentInstance();

const host = ref(config.baseURL);
const cid = ref(0);
const keyword = ref('');
const tableData = ref([]);
const page = ref(1);
const max = ref(10);
const total = ref(0);
const currentPage = ref(1);
const fileList = ref([]);
onMounted(()=>{
  handleList(cid.value, keyword.value, 1, max.value);
})
const handleChange = (file, fileList) => {
  fileList.value = [];
}
const handleList = async (cid, keyword, page, max) => {
  let result=await gets(cid, keyword, page, max);
  if(undefined===result.err){
    tableData.value = result.list;
    total.value = result.count>0?parseInt(result.count):0
  }else{
    instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
  }
}
const handleUpload = async (params) => {
  // const formData = new FormData()
  // formData.append('type', params.file.type)
  console.log('upload：');
  let data = {};

  uploadFile(params.file).then(async function(file){
    //处理 re
    data.content = file.result.substr(22);
    data.type=params.file.type;
    data.width=file.width;
    data.height=file.height;
    data.size=params.file.size;
    data.title=params.file.name;
    let result=await add(data);
    if(result.err===0){
      instance.appContext.config.globalProperties.$message({type:'success', message:'上传成功', duration:1000});
      //重新请求数据
      await handleList(cid.value, keyword.value, 1, max.value);
      document.querySelector("#app").click();
    }else{
      instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
    }
  });

}
//获取reader的result
const uploadFile = (file) => {
  return new Promise(function(resolve, reject){
    let reader = new FileReader()
    reader.readAsDataURL(file);
    //reader.readAsArrayBuffer(file)
    reader.onload = function(){
      file.result=this.result;
      let image = new Image()
      image.src = this.result
      image.onload = function() {
        file.width=this.width;
        file.height=this.height;
        resolve(file)
      }
    }
  })
}
const handleDelete = async(id) => {
  let result= await del(id);
  if(result.err===0){
    instance.appContext.config.globalProperties.$message({type:'success', message:'删除成功', duration:1000});
    //重新请求数据
    await handleList(cid.value, keyword.value, page.value, max.value);
  }else{
    instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
  }
}
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
}
const handleCurrentChange = (page1) => {
  page.value = page1;
  handleList(cid.value, keyword.value, page.value, max.value);
  console.log(`当前页: ${page.value}`);
}
const beforeUpload = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  const isGIF = file.type === 'image/gif';
  const isLt2M = file.size / 1024 / 1024 < 2;
  if(!isJPG && !isPNG && !isGIF){
    instance.appContext.config.globalProperties.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
  }
  if(!isLt2M){
    instance.appContext.config.globalProperties.$message.error('上传头像图片大小不能超过 2MB!');
  }
  return (isJPG || isPNG || isGIF) && isLt2M;
}
const handleUploadSuccess = (res, file) => {
  console.log('file:')
  // console.log(file.response.url)
  console.log(file.raw)
}
// export default {
//   name: 'all-img',
//   data() {
//     return {
//
//     }
//   },
//   components:{
//     'allImgItem': allImgItem
//   },
//   mounted: function () {
//   },
//   methods:{
//
//   }
// }
</script>

