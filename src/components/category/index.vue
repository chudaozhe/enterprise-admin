<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<el-radio-group v-model="type" @change="handleChange">
<!--					<el-radio size="small" label="1" border>文件</el-radio>-->
					<el-radio size="small" label="2" border>新闻</el-radio>
					<el-radio size="small" label="3" border>案例</el-radio>
					<el-radio size="small" label="4" border>单页</el-radio>
					<el-radio size="small" label="5" border>技术支持</el-radio>
				</el-radio-group>
				<el-button style="float: right;" @click="handleCreate()" size="small" icon="plus" type="primary">添加</el-button>
			</div>
			<div class="">
				<el-table
					:data="tableData"
					style="width: 100%">
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

					<el-table-column
						label="操作">
						<template slot-scope="scope">
							<el-button @click="handleEdit(scope.row.id)" type="text" size="small">编辑</el-button> |
							<el-popover placement="right">
								<p>确定删除吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="handleCancel">取消</el-button>
									<el-button type="primary" size="mini" @click="handleDelete(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" type="text" size="small">删除</el-button>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>

			</div>
		</el-card>
	</div>
</template>

<script>
	import { gets,del } from '../../model/admin/category'
	export default {
		data() {
			return {
				type:"2",
				tableData: [],
			}
		},
		mounted: function () {
			this.gets();
		},
		methods: {
			gets: async function () {
				this.tableData= await gets(this.type);
			},
			handleCancel(){
				document.querySelector("#app").click();
			},
			handleEdit(index) {
				this.$router.push('/category/'+(index));
				console.log(index);
			},
			handleDelete:async function(id){
				let result= await del(id);
				if(result.err===0){
					this.$message({type:'success', message:'删除成功', duration:1000});
					//重新请求数据
					await this.gets();
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
				document.querySelector("#app").click();
			},
			handleCreate(){
				this.$router.push('/category/create');
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(page) {
				this.gets();
				console.log(`当前页: ${page}`);
			},
			handleChange(type) {
				this.type=type;
				this.gets(type);
			},
			onSubmit() {
				this.gets();
				console.log('submit!');
			}
		},
	}
</script>
