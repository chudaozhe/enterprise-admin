<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div class="">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

					<el-form-item label="标题" prop="title">
						<el-input v-model="ruleForm.title"></el-input>
					</el-form-item>

					<file-manager ref="fileManager" @selected="selected"></file-manager>

					<el-form-item label="图标" prop="image">
						<div v-if="ruleForm.image" class="el-upload el-upload--picture-card" style="width: 100px; height: 100px;" @click="showFileManager(1)">
							<img style="width:100%" :src="host+ruleForm.image" alt="">
						</div>
						<div v-else class="el-upload el-upload--picture-card" style="width: 100px; height: 100px; line-height: 110px" @click="showFileManager(1)">
							<i class="el-icon-plus"></i>
						</div>
						<div style="color: gray">推荐尺寸：128*128px</div>
					</el-form-item>
<!--					<el-form-item label="类型" prop="type">-->
<!--						<el-input v-model="ruleForm.type"></el-input>2单页-->
<!--					</el-form-item>-->
					<el-form-item label="转向id" prop="url">
						<el-input v-model="ruleForm.url"></el-input><span style="color: gray">单页id</span>
					</el-form-item>
					<el-form-item label="排序" prop="sort">
						<el-input v-model="ruleForm.sort"></el-input><span style="color: gray">值越大越靠前</span>
					</el-form-item>
					<el-form-item label="是否显示" prop="status">
						<el-input v-model="ruleForm.status"></el-input><span style="color: gray">是否显示：1是 0否</span>
					</el-form-item>
					<el-form-item>
						<el-button size="small" type="primary" @click="submitForm('ruleForm')">保存</el-button>
						<el-button size="small" v-if="!id" @click="resetForm('ruleForm')">重置</el-button>

					</el-form-item>
				</el-form>

			</div>
		</el-card>
	</div>
</template>
<script>
	import { get,add,edit } from '../../model/admin/shortcut'
	import fileManager from '../filemanager/fileManager';
	export default {
		data() {
			return {
				host:global.host,
				editor:'',//保存simditor对象
				toolbar: ['bold', 'italic', 'underline', 'strikethrough',
					'color', '|', 'ol', 'ul', 'blockquote', 'code', '|',
					'link', 'image', '|', 'indent', 'outdent', 'html'
				],
				id:this.$route.params.id,
				ruleForm: {
					title: '',
					image: '',
					type: 0,
					url: 0,
          sort: 0,
					status:1,
				},
				rules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					]
				},
			};
		},
		components:{
			'fileManager': fileManager
		},
		mounted: function () {
			this.get();
		},
		methods: {
			get: async function () {
				if(this.id>0){
					let result= await get(this.id);
					if(result.err===0){
						let field=result.data;
						this.ruleForm.title=field.title;
						this.ruleForm.url=field.url;
						this.ruleForm.type=field.type;
						this.ruleForm.image=field.image;
						this.ruleForm.sort=field.sort;
						this.ruleForm.status=field.status;
					}else{
						this.$message({type:'error', message:result.msg, duration:1000});
					}
				}
			},
			add:async function(params){
				let result= await add(params);
				if(result.err===0){
					this.resetForm('ruleForm');
					this.$message({type:'success', message:'添加成功', duration:1000});
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			edit:async function(id, params){
				let result= await edit(id, params);
				if(result.err===0){
					this.$message({type:'success', message:'修改成功', duration:1000});
					await this.$router.push('/shortcut');
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			submitForm(formName) {
				let _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let data={};
						data.title=_this.ruleForm.title;
						data.type=_this.ruleForm.type;
						data.url=_this.ruleForm.url;
						data.image=_this.ruleForm.image;
						data.sort=_this.ruleForm.sort;
						data.status=_this.ruleForm.status;

						if(this.id>0){
							//update
							this.edit(this.id, data)
						}else {
							//add
							this.add(data)
						}
					} else {
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//调出文件管理组件
			showFileManager(image_type) {
				this.image_type=image_type;
				this.$refs.fileManager.show();
			},
			selected(file){
				console.log("selected-选择的图片是："+file.url);
				this.ruleForm.image=file.url;
			},
		}
	}
</script>
