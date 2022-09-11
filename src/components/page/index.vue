<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span style="line-height: 36px;">筛选：</span>
				<el-select v-model="value" placeholder="请选择" size="small" @change="handleChange" style="width:140px">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
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
						prop="category_name"
						label="分类"
						width="180">
					</el-table-column>
					<el-table-column
						prop="title"
						label="标题"
						width="180">
					</el-table-column>
					<el-table-column
						prop="image"
						label="头图"
						width="180">
						<template slot-scope="scope">
							<img v-if="scope.row.image" :src="host+scope.row.image" width="100px" alt="">
							<span v-else>NoPic</span>
						</template>

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
	import { gets as getPages,del } from '../../model/admin/page'
	import {gets} from '../../model/admin/category';
	export default {
		data() {
			return {
				host:global.host,
				max:100,
				category_id:0,
				tableData: [],
				value:0,
				options:[],
			}
		},
		mounted: function () {
			this.gets();
			this.listByPage();
		},
		methods: {
			listByPage: async function () {
				let result=await getPages(this.category_id, 1, this.max);
				if(undefined===result.err){
					this.tableData= result.list;
					this.total=result.count>0?parseInt(result.count):0
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}

			},
			gets: async function () {
				let result=await gets(4);
				let o=[{value:0, label:'全部'}];
				if(result.length>0){
					for (let i = 0, length = result.length; i < length; i++) {
						o[i+1]={value:result[i].id, label:result[i].name}
					}
				}
				this.options= o;
			},
			handleCancel(){
				document.querySelector("#app").click();
			},
			handleEdit(index) {
				this.$router.push('/page/'+(index));
			},
			handleCreate(){
				this.$router.push('/page/create');
			},
			handleDelete:async function(id){
				let result= await del(id);
				if(result.err===0){
					this.$message({type:'success', message:'删除成功', duration:1000});
					//重新请求数据
					await this.listByPage();
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
				document.querySelector("#app").click();
			},
			handleChange(category_id) {
				this.category_id=category_id;
				this.listByPage();
			},
			onSubmit() {
				this.listByPage();
			}
		},
	}
</script>
