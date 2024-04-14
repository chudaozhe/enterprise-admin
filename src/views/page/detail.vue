<template>
  <div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="分类" prop="category_id">
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="ruleForm.category_id"
            @change="handleChange"
            size="small"
            style="width: 160px"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <file-manager ref="fileManagerRef" @selected="selectedImage"></file-manager>

        <el-form-item label="头图" prop="image">
          <div>
            <GridView
              :images="ruleForm.image ? [ruleForm.image] : []"
              :image_prefix="host"
              :show_plus="image_show_plus"
              @showFileManager="showFileManager"
              @removeImage="removeImage"
            />
            <div style="color: gray">推荐尺寸：750*375px</div>
          </div>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <RichTextEditor v-model="ruleForm.content" v-if="config.editor === 'html'" />
          <MarkdownEditor v-model="ruleForm.content" v-if="config.editor === 'md'" />
          <!--<el-input type="textarea" v-model="ruleForm.content"></el-input>-->
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
import { get, add, edit } from '@/services/admin/page.js'
import FileManager from '../../components/filemanager/file-manager.vue'
import { gets } from '@/services/admin/category.js'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import config from '@/config.js'
import GridView from '@/components/grid-view.vue'
import MarkdownEditor from '@/components/markdown-editor.vue'
import RichTextEditor from '@/components/rich-text-editor.vue'

const route = useRoute()
const router = useRouter()

const host = ref(config.baseURL)
const options = ref([])
const id = ref(route.params.id)
const ruleFormRef = ref()
const fileManagerRef = ref()
const image_show_plus = ref(false)
const ruleForm = ref({
  category_id: 0,
  title: '',
  image: '',
  content: ''
})
const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请填写内容', trigger: 'blur' }]
})
onMounted(() => {
  handleDetail()
  handleCategoryList()
})

const handleDetail = async () => {
  if (id.value > 0) {
    ruleForm.value = await get(id.value)
  }
}
const handleCategoryList = async () => {
  let result = await gets(4)
  let o = [{ value: 0, label: '无' }]
  if (result.length > 0) {
    for (let i = 0, length = result.length; i < length; i++) {
      o[i + 1] = { value: parseInt(result[i].id), label: result[i].name }
    }
  }
  options.value = o
}
const handleCreate = async (params) => {
  await add(params)
  ElMessage({
    type: 'success',
    message: '添加成功',
    duration: 1000
  })
  await router.push({ name: 'page' })
}
const handleUpdate = async (id, params) => {
  await edit(id, params)
  ElMessage({
    type: 'success',
    message: '修改成功',
    duration: 1000
  })
  await router.push({ name: 'page' })
}
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let data = {}
      data.category_id = ruleForm.value.category_id
      data.title = ruleForm.value.title
      data.image = ruleForm.value.image
      data.content = ruleForm.value.content

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
const handleChange = (value) => {
  console.log(value[value.length - 1])
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
// 		};
// 	},
// 	components:{
// 		'fileManager': fileManager
// 	},
// 	mounted: function () {
//
// 	},
// 	methods: {
//
// 	}
// }
</script>
