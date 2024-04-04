<template>
	<div>
    <el-card>
      <template #header>
        <div class="card-header2">
          <el-radio-group v-model="type" @change="handleChange">
            <!--					<el-radio size="small" label="1" border>文件</el-radio>-->
            <el-radio size="small" :value="2" border>新闻</el-radio>
            <el-radio size="small" :value="3" border>案例</el-radio>
            <el-radio size="small" :value="4" border>单页</el-radio>
            <el-radio size="small" :value="5" border>技术支持</el-radio>
          </el-radio-group>
          <el-button @click="handleCreate()" size="small" icon="plus" type="primary">添加</el-button>
        </div>
      </template>
      <el-table :data="tableData">
        <el-table-column
          prop="id"
          label="ID"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="memo"
          label="描述"
          width="100">
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-link @click="handleUpdate(scope.row.id)" type="primary">编辑</el-link> |
            <el-popconfirm
              title="确定删除吗？"
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="#626AEF"
              @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-link type="primary">删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
	</div>
</template>

<script setup>
	import { gets,del } from '@/services/admin/category.js'
  import {onMounted, ref} from "vue";
  import {useRouter} from "vue-router";
  import {InfoFilled} from "@element-plus/icons-vue";

  const router = useRouter();

  const type = ref(2);
  const tableData = ref([]);
  onMounted(()=>{
    handleList();
  })
  const handleList = async () => {
    tableData.value= await gets(type.value);
  }
  const handleCancel = () => {
    document.querySelector("#app").click();
  }
  const handleUpdate = (index) => {
    router.push({name: 'categoryDetail', params: {id:index}});
    console.log(index);
  }
  const handleDelete = async (id) => {
    let result= await del(id);
    if(result.err===0){
      instance.appContext.config.globalProperties.$message({type:'success', message:'删除成功', duration:1000});
      //重新请求数据
      await handleList();
    }else{
      instance.appContext.config.globalProperties.$message({type:'error', message:result.msg, duration:1000});
    }
    document.querySelector("#app").click();
  }
  const handleCreate = () => {
    router.push({name: 'categoryCreate'});
  }
  const handleSizeChange = (val) => {
    console.log(`每页 ${val} 条`);
  }
  const handleCurrentChange = (page) => {
    handleList();
    console.log(`当前页: ${page}`);
  }
  const handleChange = (type1) => {
    type.value = type1;
    handleList(type);
  }
  const onSubmit = () => {
    handleList();
    console.log('submit!');
  }
	// export default {
	// 	data() {
	// 		return {
	//
	// 		}
	// 	},
	// 	mounted: function () {
	// 	},
	// 	methods: {
  //
	// 	},
	// }
</script>
