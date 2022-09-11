<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div class="">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item v-if="!id" label="用户名" prop="username">
						<el-input v-model="ruleForm.username"></el-input>
					</el-form-item>
					<el-form-item label="E-mail" prop="email">
						<el-input v-model="ruleForm.email"></el-input><span style="color: gray">初始密码会发送到你填写的E-mail</span>
					</el-form-item>
					<el-form-item label="昵称" prop="nickname">
						<el-input v-model="ruleForm.nickname"></el-input>
					</el-form-item>
					<el-form-item label="手机号" prop="mobile">
						<el-input v-model="ruleForm.mobile"></el-input>
					</el-form-item>
					<el-form-item label="头像" prop="avatar">
						<el-upload
								class="avatar-uploader"
								:action="icon_url"
								:show-file-list="false"
								:on-success="handleAvatarSuccess"
								:before-upload="beforeAvatarUpload"
								>
							<img v-if="imageUrl" :src="imageUrl" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
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
		import { get, add, edit } from '../../model/admin/admin'
		import store from '../../store';
		export default {
		data() {
			return {
				icon_url:global.host+'/v1/admin/editor/upload',
				options: [],
				id:this.$route.params.id,
				ruleForm: {
					username: '',
					nickname: '',
					avatar: '',
					email: '',
					mobile: ''
				},
				rules: {
					username: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
					email: [
						{ required: true, message: '请填写E-mail', trigger: 'blur' }
					]
				},
				imageUrl: '',
				dialogImageUrl: '',
				dialogVisible: false,
				imgArr:[]
			};
		},
		mounted: function () {
			this.test();
			this.case();
		},
		methods: {
			test(){
				console.log('id:')
				console.log(this.id)
			},
			case: async function () {
				if(this.id>0){
					let result= await get(this.id);
					if(result.err===0){
						let field=result.data;
						//this.ruleForm.username=field.username;
						this.ruleForm.nickname=field.nickname;
						this.ruleForm.mobile=field.mobile;
						this.ruleForm.email=field.email;
						this.imageUrl=''!=field.avatar ?global.host+field.avatar:'';
					}else{
						this.$message({type:'error', message:result.msg, duration:1000});
					}
				}
			},
			createCase:async function(params){
				let result= await add(params);
				if(result.err===0){
					this.resetForm('ruleForm');
					this.$message({type:'success', message:'添加成功', duration:1000});
					await this.$router.push('/admin');
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			putCase:async function(id, params){
				let result= await edit(id, params);
				if(result.err===0){
          let user=store.state.entUser;
          if (id==user.id){
            if(undefined !== params.avatar) user.avatar=params.avatar;
            if(undefined !== params.nickname) user.nickname=params.nickname;
            if('' !== params.avatar || '' !== params.nickname){
              store.commit('setToken', user);
            }
          }
          this.$message({type:'success', message:'修改成功', duration:1000});
          await this.$router.push('/admin');
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			submitForm(formName) {
				let _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let data={};
						if(_this.ruleForm.username && this.id===undefined) data.username=_this.ruleForm.username;
						if(_this.ruleForm.nickname) data.nickname=_this.ruleForm.nickname;
						if(_this.ruleForm.mobile) data.mobile=_this.ruleForm.mobile;
						if(_this.ruleForm.email) data.email=_this.ruleForm.email;
						if(_this.ruleForm.avatar) data.avatar=_this.ruleForm.avatar;

						if(this.id>0){
							//update
							this.putCase(this.id, data)
						}else {
							//add
							this.createCase(data)
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.imageUrl='';
			},
			handleAvatarSuccess(res, file) {
				console.log('file:')
				console.log(file.response.url)
				this.ruleForm.avatar=file.response.url;
				this.imageUrl = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isGIF = file.type === 'image/gif';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG && !isPNG && !isGIF) {
					this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return (isJPG || isPNG || isGIF) && isLt2M;
			}
		}
	}
</script>

<style>
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px!important;
		text-align: center;
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}

</style>