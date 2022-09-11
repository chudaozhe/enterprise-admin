<template>
	<div style="background: #eef1f6">
		<el-card class="box-card">
			<div class="">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item style="margin-bottom: 20px">
						<el-radio-group v-model="ruleForm.type">
<!--							<el-radio size="small" label="1" border>文件</el-radio>-->
							<el-radio size="small" label="2" border>新闻</el-radio>
							<el-radio size="small" label="3" border>案例</el-radio>
							<el-radio size="small" label="4" border>单页</el-radio>
							<el-radio size="small" label="5" border>技术支持</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="名称" prop="name">
						<el-input v-model="ruleForm.name"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="memo">
						<el-input v-model="ruleForm.memo"></el-input>
					</el-form-item>
					<el-form-item label="排序" prop="sort">
						<el-input v-model="ruleForm.sort"></el-input>
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
		import { get,add,edit } from '../../model/admin/category'
		export default {
		data() {
			return {
				id:this.$route.params.id,
				ruleForm: {
					type: '2',
					name: '',
					memo: '',
					sort:0
				},
				rules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
			};
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
						this.ruleForm.type=field.type.toString();
						this.ruleForm.name=field.name;
						this.ruleForm.memo=field.memo;
						this.ruleForm.sort=field.sort;
					}else{
						this.$message({type:'error', message:result.msg, duration:1000});
					}
				}
			},
			add:async function(params){
				let result= await add(params);
				if(result.err===0){
					this.resetForm('ruleForm');
					this.$message({
						type:'success',
						message:'添加成功',
						duration:1000
					});

				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			edit:async function(id, params){
				let result= await edit(id, params);
				if(result.err===0){
					this.resetForm('ruleForm');
					this.$message({
						type:'success',
						message:'修改成功',
						duration:1000
					});
					this.$router.push('/category');
				}else{
					this.$message({type:'error', message:result.msg, duration:1000});
				}
			},
			submitForm(formName) {
				let _this=this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let data={};
						data.type=_this.ruleForm.type;
						data.name=_this.ruleForm.name;
						data.memo=_this.ruleForm.memo;
						data.sort=_this.ruleForm.sort;

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
			}
		}
	}
</script>
