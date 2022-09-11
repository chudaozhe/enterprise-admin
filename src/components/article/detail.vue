<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div class="">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="分类" prop="category_ids">
						<el-cascader
								:options="options"
								v-model="ruleForm.category_ids"
								@change="handleChange"
								:props="{ expandTrigger: 'hover' }"
								size="small" style="width: 160px;">
						</el-cascader>
					</el-form-item>
					<el-form-item label="标题" prop="title">
						<el-input v-model="ruleForm.title"></el-input>
					</el-form-item>

					<file-manager ref="fileManager" @selected="selected"></file-manager>

					<el-form-item label="缩略图" prop="image">
						<div v-if="ruleForm.image" class="el-upload el-upload--picture-card" style="width: 100px; height: 100px;" @click="showFileManager(1)">
							<img style="width:100%" :src="host+ruleForm.image" alt="">
						</div>
						<div v-else class="el-upload el-upload--picture-card" style="width: 100px; height: 100px; line-height: 110px" @click="showFileManager(1)">
							<i class="el-icon-plus"></i>
						</div>
						<div style="color: gray">推荐尺寸：440*248px</div>
					</el-form-item>

					<el-form-item label="图集" prop="images">
						<div style="float: left;" v-if="images.length>0">
							<div class="el-upload el-upload--picture-card" v-for="(item, index) in images" :key="item" style="float: left; margin-right: 10px; width: 100px; height: 100px;">
								<img width="100%" :src="host+item" alt="">
								<div class="panel" @click.stop="deleteItem(index)">
									<i class="vue-picture-manager-icon icon-ai-delete" style="font-size: 16px; color: #fff"></i>
								</div>
							</div>
						</div>
						<div class="el-upload el-upload--picture-card" style="width: 100px; height: 100px; line-height: 110px" @click="showFileManager(2)">
							<i class="el-icon-plus"></i>
						</div>
						<div style="color: gray">推荐尺寸：750*375px</div>
					</el-form-item>

					<el-form-item label="内容" prop="content">
						<textarea id="xx" v-model="ruleForm.content"></textarea>
						<!--<el-input type="textarea" v-model="ruleForm.content"></el-input>-->
					</el-form-item>
					<el-form-item label="关键词" prop="keywords">
						<el-input v-model="ruleForm.keywords"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="description">
						<el-input type="textarea" v-model="ruleForm.description"></el-input>
					</el-form-item>
					<el-form-item label="外部链接" prop="url">
						<el-input v-model="ruleForm.url"></el-input>
					</el-form-item>
					<el-form-item label="来源" prop="source">
						<el-input v-model="ruleForm.source"></el-input>
					</el-form-item>
					<el-form-item label="作者" prop="author">
						<el-input v-model="ruleForm.author"></el-input>
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
	import { get,add,edit } from '../../model/admin/article'
	import { gets2 } from '../../model/admin/category'
	import fileManager from '../filemanager/fileManager';
	export default {
		data() {
			return {
				host:global.host+'/v1',
				images: [],
				editor:'',//保存simditor对象
				toolbar: ['bold', 'italic', 'underline', 'strikethrough',
					'color', '|', 'ol', 'ul', 'blockquote', 'code', '|',
					'link', 'image', '|', 'indent', 'outdent', 'html'
				],
				options: [],
				id:this.$route.params.id,
				ruleForm: {
					category_ids:[],
//					category_ids: [1, 11, 113],
					title: '',
					image: '',
					images: '',
					keywords:'',
					description: '',
					url: '',
					source:'',
					author:'',
					sort: 0,
					content: '',
					status: 1,
				},
				rules: {
					category_ids: [
						{ required: true, type:'array', message: '请选择类型', trigger: 'change' }
					],
					title: [
						{ required: true, message: '请输入标题', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请填写内容', trigger: 'blur' }
					]
				},
				dialogImageUrl: '',
				dialogVisible: false,
				image_type:1,//1缩略图 2图集
			};
		},
		components:{
			'fileManager': fileManager
		},
		mounted: function () {
			this.createEditor();
			this.gets();
			this.detail();
		},
		methods: {
			deleteItem(index){
				this.images.splice(index, 1);
				console.log(index)
			},
			detail: async function () {
				if(this.id>0){
					let result= await get(this.id);
					if(result.err===0){
						let field=result.data;
						this.ruleForm.category_ids=[parseInt(field.type), parseInt(field.category_id)];
						this.ruleForm.title=field.title;
						this.ruleForm.image=field.image;
						this.ruleForm.sort=field.sort;
						this.ruleForm.url=field.url;
						this.ruleForm.keywords=field.keywords;
						this.ruleForm.description=field.description;
						this.ruleForm.content=field.content;
						this.ruleForm.source=field.source;
						this.ruleForm.author=field.author;
						this.ruleForm.status=field.status;
						if(''!==field.images) this.images=field.images.split(",");
						this.editor.setValue(this.ruleForm.content)
					}else{
						this.$message({type:'error', message:result.msg, duration:1000});
					}
				}
			},
			gets: async function () {
				this.options= await gets2();
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
					await this.$router.push('/article');
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
					console.log(_this.ruleForm);
					if (valid) {
						let data={};
						data.category_id=_this.ruleForm.category_ids[1];
						data.title=_this.ruleForm.title;
						data.url=_this.ruleForm.url;
						data.image=_this.ruleForm.image;
						if(_this.images.length>0){
							data.images=_this.images.join(",");
						}
						data.sort=_this.ruleForm.sort;
						data.keywords=_this.ruleForm.keywords;
						data.description=_this.ruleForm.description;
						data.content=_this.ruleForm.content;
						data.source=_this.ruleForm.source;
						data.author=_this.ruleForm.author;
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
				this.images=[];
				this.editor.setValue(this.ruleForm.content);
			},
			handleChange(value) {
				console.log(value[value.length-1]);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
				console.log('file_group:')
				console.log(file.response.url)
			},
			//调出文件管理组件
			showFileManager(image_type) {
				this.image_type=image_type;
				this.$refs.fileManager.show();
			},
			selected(file){
				console.log("selected-选择的图片是："+file.url);
				if(this.image_type===2){
					this.images.push(file.url);
				}else this.ruleForm.image=file.url;
			},
		}
	}
</script>