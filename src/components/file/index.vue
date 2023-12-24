<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<el-upload style="float: right;"
					class="upload-demo"
					action=""
					:on-change="handleChange"
					:file-list="fileList"
					:http-request="handleUpload"
					:before-upload="beforeUpload"
					:on-success="handleUploadSuccess">
				<el-button size="small" type="primary">上传</el-button>
			</el-upload>
		</div>
	<div class="all-img">
		<allImgItem v-for="(item, index) in tableData"
				:url="host+item.url"
				:key="item.id"
				@delete="handleDelete(item.id)" >
		</allImgItem>
	</div>
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
	</el-card>
</template>

<script>
	import allImgItem from './allImgItem'
	import { add, gets, del } from '../../model/admin/file'
	export default {
		name: 'all-img',
		data() {
			return {
				host:global.host,
				cid:0,
				keyword:'',
				thisKey: '',
				curIndex: -1,
				selectedList: [],
				tableData: [],
				page:1,
				max:10,
				total:0,
				currentPage: 1,
				fileList:[]
			}
		},
		components:{
			'allImgItem': allImgItem
		},
		mounted: function () {
			this.listByFile(this.cid, this.keyword, 1, this.max);
		},
		methods:{
			handleChange(file, fileList) {
				this.fileList = [];
			},
			listByFile: async function (cid, keyword, page, max) {
				let result=await gets(cid, keyword, page, max);
				if(undefined===result.err){
					this.tableData= result.list;
					this.total=result.count>0?parseInt(result.count):0
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleUpload:async function(params){
				// const formData = new FormData()
				// formData.append('type', params.file.type)
				console.log('upload：');
				let _this = this;
				let data = {};

				this.uploadFile(params.file).then(async function(file){
					//处理 re
					data.content = file.result.substr(22);
					data.type=params.file.type;
					data.width=file.width;
					data.height=file.height;
					data.size=params.file.size;
					data.title=params.file.name;
					let result=await add(data);
					if(result.err===0){
						_this.$message({type:'success', message:'上传成功', duration:1000});
						//重新请求数据
						await _this.listByFile(_this.cid, _this.keyword, 1, _this.max);
						document.querySelector("#app").click();
					}else{
						_this.$message({type:'error', message:result.msg, duration:1000});
					}
				});

			},
			//获取reader的result
			uploadFile:function (file){
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
			},
			handleDelete:async function(id){
				let result= await del(id);
				if(result.err===0){
					this.$message({type:'success', message:'删除成功', duration:1000});
					//重新请求数据
					await this.listByFile(this.cid, this.keyword, this.page, this.max);
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			handleSizeChange(val){
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(page){
				this.page=page;
				this.listByFile(this.cid, this.keyword, page, this.max);
				console.log(`当前页: ${page}`);
			},
			onSubmit(){
				this.listByFile(this.cid, this.keyword, 1, this.max);
				console.log(this.keyword)
				console.log('submit!');
			},
			beforeUpload(file){
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isGIF = file.type === 'image/gif';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if(!isJPG && !isPNG && !isGIF){
					this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
				}
				if(!isLt2M){
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return (isJPG || isPNG || isGIF) && isLt2M;
			},
			handleUploadSuccess(res, file){
				console.log('file:')
				// console.log(file.response.url)
				console.log(file.raw)
				// this.ruleForm.icon = file.response.url;
				// this.imageUrl = URL.createObjectURL(file.raw);
			},
		}
	}
</script>

