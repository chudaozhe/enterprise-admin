<template>
  <div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <file-manager ref="fileManagerRef" @selected="selectedImage"></file-manager>

        <el-form-item label="图标" prop="image">
          <div>
            <GridView
              :images="ruleForm.image ? [ruleForm.image] : []"
              :image_prefix="host"
              :show_plus="image_show_plus"
              @showFileManager="showFileManager"
              @removeImage="removeImage"
            />
            <div style="color: gray">推荐尺寸：128*128px</div>
          </div>
        </el-form-item>
        <!--					<el-form-item label="类型" prop="type">-->
        <!--						<el-input v-model="ruleForm.type"></el-input>2单页-->
        <!--					</el-form-item>-->
        <el-form-item label="转向id" prop="url">
          <el-input v-model="ruleForm.url"></el-input>
          <span style="color: gray">单页id</span>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="ruleForm.sort"></el-input>
          <span style="color: gray">值越大越靠前</span>
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-input v-model="ruleForm.status"></el-input>
          <span style="color: gray">是否显示：1是 0否</span>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm(ruleFormRef)">保存</el-button>
          <el-button size="small" v-if="!id" @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup>
import { get, add, edit } from '@/services/admin/shortcut.js'
import FileManager from '../../components/filemanager/file-manager.vue'
import { onMounted, reactive, ref } from 'vue'
import config from '@/config.js'
import { useRoute, useRouter } from 'vue-router'
import GridView from '@/components/grid-view.vue'
const route = useRoute()
const router = useRouter()

const host = ref(config.baseURL)
const id = ref(route.params.id)
const ruleFormRef = ref()
const fileManagerRef = ref()
const image_show_plus = ref(false)
const ruleForm = ref({
  title: '',
  image: '',
  type: 0,
  url: 0,
  sort: 0,
  status: 1
})
const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
})
onMounted(() => {
  handleDetail()
})
const handleDetail = async () => {
  if (id.value > 0) {
    ruleForm.value = await get(id.value)
  }
}
const handleCreate = async (params) => {
  await add(params)
  ElMessage({
    type: 'success',
    message: '添加成功',
    duration: 1000
  })
  await router.push({ name: 'shortcut' })
}
const handleUpdate = async (id, params) => {
  await edit(id, params)
  ElMessage({
    type: 'success',
    message: '修改成功',
    duration: 1000
  })
  await router.push({ name: 'shortcut' })
}
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let data = {}
      data.title = ruleForm.value.title
      data.type = ruleForm.value.type
      data.url = ruleForm.value.url
      data.image = ruleForm.value.image
      data.sort = ruleForm.value.sort
      data.status = ruleForm.value.status

      if (id.value > 0) {
        //update
        handleUpdate(id.value, data)
      } else {
        //add
        handleCreate(data)
      }
    } else {
      return false
    }
  })
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
//调出文件管理组件
const showFileManager = () => {
  fileManagerRef.value.show()
}
const selectedImage = (file) => {
  console.log('selected-选择的图片是：' + file.url)
  ruleForm.value.image = file.url
  image_show_plus.value = false
}
const removeImage = (index) => {
  console.log(index)
  ruleForm.value.image = ''
  image_show_plus.value = true
}
// export default {
// 	data() {
// 		return {
//
// 		};
// 	},
// 	components:{
// 		'fileManager': fileManager
// 	},
// 	mounted: function () {
// 	},
// 	methods: {
//
// 	}
// }
</script>
