<template>
	<div class="file-manager">
		<!--<div ref="allImg">allImg</div>-->
		<el-dialog title="图片管理" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
			<el-tabs :tab-position="tabPosition" v-model="activeName" style="height: 400px;">
				<el-tab-pane label="所有图片" name="1">
					<all-img ref="allImg"
							@delete="$emit('delete',$event)"
							@selected="selected">
					</all-img>
				</el-tab-pane>
				<!--tab-pane2-->
				<!--tab-pane3-->
			</el-tabs>
		</el-dialog>
	</div>
</template>

<script>
	import allImg from '../filemanager/allImg';

	export default {
		name: 'file-manager',
		data() {
			return {
				dialogVisible: false,
				tabPosition: 'left',
				ensureFun: null,
				activeName:'1'
			}
		},
		components:{
			'allImg': allImg
		},
		mounted() {

		},
		methods: {
			selected(file) {
				this.dialogVisible = false;
				this.$emit('selected', file);
			},
			show() {
				this.dialogVisible = true;
			},
			hide() {
				this.dialogVisible = false;
			},
			handleClose(done) {
				done();
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
<style>
	.el-tabs__content {
		height: 400px;
		overflow-y: auto;
	}
</style>
