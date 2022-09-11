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
						:value="item.value">
					</el-option>
				</el-select>
				<el-input size="small" v-model="keyword" placeholder="关键词" style="width:200px; margin-left: 10px"></el-input>
				<el-button size="small" type="primary" @click="onSubmit" style="margin-left: 10px;">搜索</el-button>
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
						label="缩略图"
						width="180">
						<template slot-scope="scope">
							<img v-if="scope.row.image" :src="host+scope.row.image" width="100px" alt="">
							<span v-else>NoPic</span>
						</template>

					</el-table-column>
					<el-table-column
						prop="description"
						label="描述">
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
						label="操作">
						<template slot-scope="scope">
							<el-button @click="handleEdit(scope.row.id)" type="text" size="small">编辑</el-button>
							|
							<el-popover placement="right">
								<p>确定删除吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="handleCancel">取消</el-button>
									<el-button type="primary" size="mini" @click="handleDelete(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" type="text" size="small">删除</el-button>
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

				<div style="margin-top: 10px; margin-bottom: 10px; float: right">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-size=max
						layout="total, prev, pager, next"
						:total=total>
					</el-pagination>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { gets as getCases,del,statusDisplay,statusHidden } from '../../model/admin/case'
	import { gets } from '../../model/admin/category'
	export default {
		data() {
			return {
				host:global.host,
				page:1,
				max:10,
				category_id:0,
				total:0,
				currentPage: 1,
				visible2: false,
				tableData: [],
				keyword:'',
				options: [{
					value: '0',
					label: '全部'
				}],
				value: '0',
			}
		},
		mounted: function () {
			this.listByCases(this.category_id, this.keyword, 1, this.max);
			this.gets();
		},
		methods: {
			listByCases: async function (category_id, keyword, page, max) {
				let result=await getCases(category_id, keyword, page, max);
				if(undefined===result.err){
					this.tableData= result.list;
					this.total=result.count>0?parseInt(result.count):0
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			gets: async function () {
				let result=await gets(3);
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
				this.$router.push('/case/'+(index));
			},
			handleCreate(){
				this.$router.push('/case/create');
			},
			handleDelete:async function(id){
				let result= await del(id);
				if(result.err===0){
					this.$message({type:'success', message:'删除成功', duration:1000});
					//重新请求数据
					await this.listByCases(this.category_id, this.keyword, this.page, this.max);
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
					await this.listByCases(this.category_id, this.keyword, this.page, this.max);
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleHidden:async function(id) {
				let result= await statusHidden(id);
				if(result.err===0){
					this.$message({type:'success', message:'已隐藏', duration:1000});
					//重新请求数据
					await this.listByCases(this.category_id, this.keyword, this.page, this.max);
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(page) {
				this.page=page;
				this.listByCases(this.category_id, this.keyword, page, this.max);
				console.log(`当前页: ${page}`);
			},
			handleChange(category_id) {
				this.category_id=category_id;
				this.keyword='';
				this.listByCases(this.category_id, this.keyword, 1, this.max);
				console.log(category_id);
			},
			onSubmit() {
				this.page=1;
				this.listByCases(this.category_id, this.keyword, 1, this.max);
			}
		},
	}
</script>
