<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div class="">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="分类" prop="category_id">
						<el-cascader
								expand-trigger="hover"
								:options="options"
								v-model="ruleForm.category_id"
								@change="handleChange"
								size="small" style="width: 160px;">
						</el-cascader>
					</el-form-item>
					<el-form-item label="标题" prop="title">
						<el-input v-model="ruleForm.title"></el-input>
					</el-form-item>

					<file-manager ref="fileManager" @selected="selected"></file-manager>

					<el-form-item label="头图" prop="image">
						<div v-if="ruleForm.image" class="el-upload el-upload--picture-card" style="width: 100px; height: 100px;" @click="showFileManager(1)">
							<img style="width:100%" :src="host+ruleForm.image" alt="">
						</div>
						<div v-else class="el-upload el-upload--picture-card" style="width: 100px; height: 100px; line-height: 110px" @click="showFileManager(1)">
							<i class="el-icon-plus"></i>
						</div>
						<div style="color: gray">推荐尺寸：750*375px</div>
					</el-form-item>
					<el-form-item label="内容" prop="content">
						<textarea id="xx" v-model="ruleForm.content"></textarea>
						<!--<el-input type="textarea" v-model="ruleForm.content"></el-input>-->
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
	import { get,add,edit } from '../../model/admin/page'
	import fileManager from '../filemanager/fileManager';
	import {gets} from '../../model/admin/category';
	export default {
		data() {
			return {
				host:global.host,
				editor:'',//保存simditor对象
				toolbar: ['bold', 'italic', 'underline', 'strikethrough',
					'color', '|', 'ol', 'ul', 'blockquote', 'code', '|',
					'link', 'image', '|', 'indent', 'outdent', 'html'
				],
				options: [],
				id:this.$route.params.id,
				ruleForm: {
					category_id: 0,
					title: '',
					image: '',
					content: ''
				},
				rules: {
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请填写内容', trigger: 'blur' }
					]
				},
			};
		},
		components:{
			'fileManager': fileManager
		},
		mounted: function () {
			this.createEditor();
			this.get();
			this.gets();
		},
		methods: {
			get: async function () {
				if(this.id>0){
					let result= await get(this.id);
					if(result.err===0){
						let filed=result.data;
						this.ruleForm.category_id=filed.category_id;
						this.ruleForm.title=filed.title;
						this.ruleForm.image=filed.image;
						this.ruleForm.content=filed.content;
						this.editor.setValue(this.ruleForm.content)
					}else{
						this.$message({type:'error', message:result.msg, duration:1000});
					}
				}
			},
			gets: async function () {
				let result=await gets(4);
				let o=[{value:0, label:'无'}];
				if(result.length>0){
					for (let i = 0, length = result.length; i < length; i++) {
						o[i+1]={value:parseInt(result[i].id), label:result[i].name}
					}
				}
				this.options= o;
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
					this.resetForm('ruleForm');
					this.$message({type:'success', message:'修改成功', duration:1000});
					await this.$router.push('/page');
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			createEditor() {
				var _this = this;
				this.editor = new Simditor({
					textarea: $('#xx'),
					toolbar: _this.toolbar,
					upload: {
						url: _this.host+'/admin/editor/upload', //文件上传的接口地址
//                      params: null, //键值对,指定文件上传接口的额外参数,上传的时候随文件一起提交
						fileKey: 'file', //服务器端获取文件数据的参数名
						connectionCount: 1,
						leaveConfirm: '正在上传文件'
					},
					pasteImage: true,
					tabIndent: true,
				});
				this.editor.on("valuechanged", function(e, src) {
					_this.ruleForm.content = _this.editor.getValue()
				})
			},
			submitForm(formName) {
				let _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let data={};
						data.category_id=_this.ruleForm.category_id;
						data.title=_this.ruleForm.title;
						data.image=_this.ruleForm.image;
						data.content=_this.ruleForm.content;

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
				this.editor.setValue(this.ruleForm.content);
			},
			handleChange(value) {
				console.log(value[value.length-1]);
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
