<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
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
						prop="username"
						label="用户名"
						width="80">
					</el-table-column>
					<el-table-column
						prop="nickname"
						label="昵称"
						width="100">
					</el-table-column>
					<el-table-column label="头像" width="100">
						<template slot-scope="{row}">
							<el-popover placement="left" title trigger="hover">
								<img :src="host+row.avatar" style="height: 100px;width: 100px">
								<img slot="reference" :src="host+row.avatar" style="height: 50px;width: 50px">
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column
						prop="email"
						label="E-mail"
						width="180">
					</el-table-column>
					<el-table-column
						prop="mobile"
						label="手机号"
						width="180">
					</el-table-column>
					<el-table-column
						prop="status"
						label="状态"
						width="80">
						<template slot-scope="scope">
							<span v-if="scope.row.status">已启用</span>
							<span v-else>已禁用</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="create_time"
						label="创建时间"
						width="180">
						<template slot-scope="scope">
							<div v-if="scope.row.create_time">{{scope.row.create_time | formatDate}}</div>
							<span v-else>0</span>
						</template>
					</el-table-column>
					<el-table-column
						label="操作"
						width="300">
						<template slot-scope="scope">
							<el-button @click="handleEdit(scope.row.id)" type="text" size="small">编辑</el-button>
							|
							<el-popover placement="right">
								<p>确定重置吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="cancel">取消</el-button>
									<el-button type="primary" size="mini" @click="handleReset(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" type="text" size="small">重置密码</el-button>
							</el-popover>
							<span v-if="scope.row.status==1">
								|
								<el-popover placement="right">
									<p>确定禁用吗？</p>
									<div style="text-align: right; margin: 0">
										<el-button size="mini" type="text" @click="cancel">取消</el-button>
										<el-button type="primary" size="mini" @click="handleDisable(scope.row.id)">确定</el-button>
									</div>
									<el-button slot="reference" type="text" size="small">禁用</el-button>
								</el-popover>
							</span>
							<span v-else>
								|
								<el-popover placement="right">
									<p>确定启用吗？</p>
									<div style="text-align: right; margin: 0">
										<el-button size="mini" type="text" @click="cancel">取消</el-button>
										<el-button type="primary" size="mini" @click="handleEnable(scope.row.id)">确定</el-button>
									</div>
									<el-button slot="reference" type="text" size="small">启用</el-button>
								</el-popover>
							</span>
							|
							<el-popover placement="right">
								<p>确定删除吗？</p>
								<div style="text-align: right; margin: 0">
									<el-button size="mini" type="text" @click="cancel">取消</el-button>
									<el-button type="primary" size="mini" @click="handleDelete(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" type="text" size="small">删除</el-button>
							</el-popover>
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
	import {formatdate} from '../../util/date.js';
	import { gets, del, disable, enable, reset } from '../../model/admin/admin'
	export default {
		filters:{
			formatDate(time) {
				let timestamp = new Date(parseInt(time+"000"));
				return formatdate(timestamp, 'yyyy-MM-dd hh:mm:ss');  // 此处可根据自己的需要自定义想要的日期格式
			}
		},
		data() {
			return {
				host:global.host,
				max:10,
				total:0,
				currentPage: 1,
				visible2: false,
				tableData: [],
				keyword:'',
			}
		},
		mounted: function () {
			this.handleList(this.keyword, 1, this.max);
		},
		methods: {
			handleList: async function (keyword, page, max) {
				let result=await gets(keyword, page, max);
				if(undefined===result.err){
					this.tableData= result.list;
					this.total=result.count>0?parseInt(result.count):0
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			cancel(){
				console.log('取消');
				document.querySelector("#app").click();
			},
			handleReset:async function(id) {
				let result=await reset(id);
				if(result.err===0){
					this.$message({type:'success', message:'已重置，新密码已发送到对应E-mail', duration:1000});
					document.querySelector("#app").click();
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleDisable: async function(id){
				let result=await disable(id);
				if(result.err===0){
					this.$message({type:'success', message:'已禁用', duration:1000});
					//重新请求数据
					await this.handleList(this.keyword, 1, this.max);
					document.querySelector("#app").click();
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleEnable: async function(id){
				let result=await enable(id);
				if(result.err===0){
					this.$message({type:'success', message:'已启用', duration:1000});
					//重新请求数据
					await this.handleList(this.keyword, 1, this.max);
					document.querySelector("#app").click();
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleAuth(index){
				console.log("Auth:");
				console.log(index);
			},
			handleEdit(id) {
				this.$router.push('/admin/another/admin/'+(id));
			},
			handleCreate(){
				this.$router.push('/admin/create');
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(page) {
				this.handleList(this.keyword, page, this.max);
				console.log(`当前页: ${page}`);
			},
			handleDelete:async function(id){
				let result= await del(id);
				if(result.err===0){
					this.$message({type:'success', message:'删除成功', duration:1000});
					//重新请求数据
					await this.handleList(this.keyword, 1, this.max);
					document.querySelector("#app").click();
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			onSubmit() {
				this.handleList(this.keyword, 1, this.max);
			}
		},
	}
</script>
