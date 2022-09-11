<template>
	<div style="margin-top: 10%">
		<el-card class="box-card" style="width: 400px; margin: 0 auto">
			<div slot="header" class="clearfix" style="line-height: 48px; font-weight: bold; font-size: 30px; text-align: center">
				<span >管理后台</span>
			</div>
			<div>
				<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
					<el-form-item prop="username">
						<el-input v-model.number="ruleForm2.username" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" v-model="ruleForm2.password" placeholder="密码" auto-complete="off"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="submitForm('ruleForm2')" style="width: 100%">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { doLogin } from '../model/admin/user'
	import store from '../store.js'
	export default {
		data(){
			let checkUsername=(rule, value, callback) =>{
				if(value === ''){
					return callback(new Error('用户名不能为空'));
				}
				callback();
			};
			let validatePassword=(rule, value, callback) =>{
				if(value === ''){
					return callback(new Error('请输入密码'));
				}
				callback();
			};

			return {
				ruleForm2:{
					username:'',
					password:'',
				},
				rules2:{
					password:[
						{validator:validatePassword, trigger:'blur'}
					],
					username:[
						{validator:checkUsername, trigger:'blur'}
					]
				}
			};
		},
		methods:{
			login: async function (username, password) {
				let re = await doLogin(username, password);
				if(undefined!==re && undefined===re.err){
					let data={};
					data.id=re.id;
					data.nickname=re.nickname;
					data.avatar=re.avatar;
					data.token=re.token;
					store.commit('setToken', data);
					this.$message({type:'success', message:'您已登录', duration:1000});
					let redirect=this.$route.query.redirect;
					let url=undefined !== redirect ?redirect :'/article';
					await this.$router.push(url);
				}else{
					this.$message({type:'error', message:re.msg, duration:1000});
				}
			},
			submitForm(formName){
				this.$refs[formName].validate((valid) =>{
					if(valid){
						this.login(this.ruleForm2.username, this.ruleForm2.password);
					}else{
						return false;
					}
				});
			}
		}
	}
</script>
