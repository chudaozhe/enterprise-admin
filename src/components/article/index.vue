<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span style="line-height: 36px;">筛选：</span>
				<el-cascader
					:options="options"
					v-model="category_id"
					@change="handleChange"
					:props="{ expandTrigger: 'hover', checkStrictly: true }"
					clearable
					size="small" style="width: 160px;">
				</el-cascader>
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
							<el-button @click="handleEdit(scope.row.id)" type="text" size="small">编辑</el-button> |
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
	import { gets as getArticles, gets2 as getArticles2, del, statusDisplay, statusHidden } from '../../model/admin/article'
	import {gets2} from '../../model/admin/category';
	export default {
		data() {
			return {
				host:global.host,
				page:1,
				max:10,
				category_id:0,
				category_ids:[],
				total:0,
				currentPage: 1,
				tableData: [],
				keyword:'',
				options: [{
					value: '0',
					label: '全部'
				}],
			}
		},
		mounted: function () {
			this.listByArticle(this.category_id, this.keyword, this.page, this.max);
			this.gets();
		},
		methods: {
			listByArticle: async function (category_id, keyword, page, max) {
				let result;
				if(this.category_ids.length>0){
					result=await getArticles2(category_id, keyword, page, max);
				}else result=await getArticles(category_id, keyword, page, max);

				this.tableData= result.list;
				this.total=result.count>0?parseInt(result.count):0
			},
			gets: async function () {
				this.options= await gets2();
			},
			handleCancel(){
				document.querySelector("#app").click();
			},
			handleEdit(index) {
				this.$router.push('/article/'+(index));
			},
			handleCreate(){
				this.$router.push('/article/create');
			},
			handleDelete:async function(id){
				let result= await del(id);
				if(result.err===0){
					this.$message({type:'success', message:'删除成功', duration:1000});
					//重新请求数据
					if(this.category_ids.length>0){
						await this.listByArticle(this.category_ids, this.keyword, this.page, this.max);
					}else{
						this.category_ids=[];
						await this.listByArticle(this.category_id, this.keyword, this.page, this.max);
					}
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
					if(this.category_ids.length>0){
						await this.listByArticle(this.category_ids, this.keyword, this.page, this.max);
					}else{
						this.category_ids=[];
						await this.listByArticle(this.category_id, this.keyword, this.page, this.max);
					}
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleHidden:async function(id) {
				let result= await statusHidden(id);
				if(result.err===0){
					this.$message({type:'success', message:'已隐藏', duration:1000});
					//重新请求数据
					if(this.category_ids.length>0){
						await this.listByArticle(this.category_ids, this.keyword, this.page, this.max);
					}else{
						this.category_ids=[];
						await this.listByArticle(this.category_id, this.keyword, this.page, this.max);
					}
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(page) {
				this.page=page;
				if(this.category_ids.length>0){
					this.listByArticle(this.category_ids, this.keyword, page, this.max);
				}else{
					this.category_ids=[];
					this.listByArticle(this.category_id, this.keyword, page, this.max);
				}
				console.log(`当前页: ${page}`);
			},
			handleChange(value){
				if(undefined === value || value.length === 0) return;
				this.page = 1;
				let category_id = value[value.length - 1];
				this.category_id = category_id;
				this.keyword = '';
				let category_ids = [];
				if(category_id === 2){
					category_ids = this.getChildrenIds(2);
				}else if(category_id === 5){
					category_ids = this.getChildrenIds(5);
				}
				if(category_ids.length > 0){
					this.category_ids = category_ids;
					this.listByArticle(this.category_ids, this.keyword, this.page, this.max);
				}else{
					this.category_ids = [];
					this.listByArticle(this.category_id, this.keyword, this.page, this.max);
				}
			},
			getChildrenIds:function(type){
				let o=[];
				for (let i = 0, length = this.options.length; i < length; i++) {
					let children=[];
					if(this.options[i].value===type){
						children=this.options[i].children;
						for (let j = 0, length = children.length; j < length; j++){
							o.push(children[j].value);
						}
					}
				}
				return o;
			},
			onSubmit() {
				this.page=1;
				if(this.category_ids.length>0){
					this.listByArticle(this.category_ids, this.keyword, this.page, this.max);
				}else{
					this.category_ids=[];
					this.listByArticle(this.category_id, this.keyword, this.page, this.max);
				}
			}
		},
	}
</script>
