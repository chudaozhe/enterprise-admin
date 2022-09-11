<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
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
						prop="title"
						label="名称"
						width="180">
					</el-table-column>
					<el-table-column
						prop="image"
						label="图片"
						width="180">
						<template slot-scope="scope">
							<img v-if="scope.row.image" :src="host+scope.row.image" width="100px" alt="">
							<span v-else>NoPic</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="status"
						label="状态"
						width="80">
						<template slot-scope="scope">
							<span v-if="scope.row.status">已显示</span>
							<span v-else>已隐藏</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="url"
						label="转向id"
						width="80">
					</el-table-column>

					<el-table-column
						label="操作">
						<template slot-scope="scope">
							<el-button @click="handleEdit(scope.row.id)" size="small" type="text">编辑</el-button> |
							<el-popover placement="right">
								<p>确定删除吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="handleCancel">取消</el-button>
									<el-button size="mini" type="primary" @click="handleDelete(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" size="small" type="text">删除</el-button>
							</el-popover>
							<span v-if="scope.row.status==1">
								|
								<el-button type="text" size="small" @click="handleHidden(scope.row.id)">隐藏</el-button>
							</span>
							<span v-else>
								|
								<el-button type="text" style="margin-left:0;" size="small" @click="handleDisplay(scope.row.id)">显示</el-button>
							</span>
						</template>
					</el-table-column>
				</el-table>

			</div>
		</el-card>
	</div>
</template>

<script>
	import { gets,del,statusDisplay,statusHidden } from '../../model/admin/flash'
	export default {
		data() {
			return {
				host:global.host,
				tableData: [],
			}
		},
		mounted: function () {
			this.gets();
		},
		methods: {
			gets: async function () {
				this.tableData= await gets();
			},
			handleCancel(){
				document.querySelector("#app").click();
			},
			handleEdit(index) {
				this.$router.push('/flash/'+(index));
			},
			handleCreate(){
				this.$router.push('/flash/create');
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
			handleDisplay:async function(id) {
				let result= await statusDisplay(id);
				if(result.err===0){
					this.$message({type:'success', message:'已显示', duration:1000});
					//重新请求数据
					await this.gets();
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleHidden:async function(id) {
				let result= await statusHidden(id);
				if(result.err===0){
					this.$message({type:'success', message:'已隐藏', duration:1000});
					//重新请求数据
					await this.gets();
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
		},
	}
</script>
