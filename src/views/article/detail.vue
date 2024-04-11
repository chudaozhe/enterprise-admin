<template>
  <div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="分类" prop="category_ids">
          <el-cascader
            placeholder="请选择分类"
            :options="options"
            v-model="ruleForm.category_ids"
            @change="handleChange"
            :props="{ expandTrigger: 'hover' }"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>

        <!--          缩略图-->
        <FileManager ref="fileManagerRef" @selected="selectedImage" />
        <!--          图集-->
        <FileManager ref="fileManager2Ref" @selected="selectedImages" />

        <el-form-item label="缩略图" prop="image">
          <div>
            <GridView
              :images="ruleForm.image ? [ruleForm.image] : []"
              :image_prefix="host"
              :show_plus="image_show_plus"
              @showFileManager="showFileManager(1)"
              @removeImage="removeImage"
            />
            <div style="color: gray">推荐尺寸：440*248px</div>
          </div>
        </el-form-item>

        <el-form-item label="图集" prop="images">
          <div>
            <GridView
              :images="images"
              :image_prefix="host"
              :show_plus="images_show_plus"
              @showFileManager="showFileManager(2)"
              @removeImage="removeImage2"
            />
            <div style="color: gray">推荐尺寸：750*375px</div>
          </div>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <mavon-editor
            style="width: 100%"
            v-model="ruleForm.content"
            ref="mdRef"
            @imgAdd="$imgAdd"
            @imgDel="$imgDel"
          />
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
          <el-input v-model="ruleForm.sort"></el-input>
          <span style="color: gray">值越大越靠前</span>
        </el-form-item>
        <el-form-item label="是否显示" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :value="0">否</el-radio>
            <el-radio :value="1">是</el-radio>
          </el-radio-group>
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
import { get, add, edit } from '@/services/admin/article.js'
import { gets2 } from '@/services/admin/category.js'
import FileManager from '../../components/filemanager/file-manager.vue'
import { add as addFile } from '../../services/admin/file.js'
import config from '@/config.js'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GridView from '@/components/grid-view.vue'

const router = useRouter()
const route = useRoute()
const instance = getCurrentInstance()

const host = ref(config.baseURL)
const images = ref([])
const options = ref([])
const id = ref(route.params.id)
const ruleFormRef = ref()
const fileManagerRef = ref()
const fileManager2Ref = ref()
const mdRef = ref()
const image_show_plus = ref(false)
const images_show_plus = ref(false)
const images_count = ref(8) // 图集最多上传8张
// const image_count = ref(1); //缩略图只能上传1张
const ruleForm = ref({
  category_ids: [],
  title: '',
  image: '',
  images: '',
  keywords: '',
  description: '',
  url: '',
  source: '',
  author: '',
  sort: 0,
  content: '',
  status: 1
})
const rules = reactive({
  category_ids: [{ required: true, type: 'array', message: '请选择类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请填写内容', trigger: 'blur' }]
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const image_type = ref(1) //1缩略图 2图集
onMounted(() => {
  handleCategoryList()
  handleDetail()
  if (id.value === undefined) {
    image_show_plus.value = true
    images_show_plus.value = true
  }
})

const $imgAdd = (pos, file) => {
  // 将图片上传到服务器(formdata方式
  // var formdata = new FormData();
  // formdata.append('image', $file);
  // (x-www-form-urlencoded方式
  let data = {}

  uploadFile(file).then(async function (file) {
    data.content = file.result.substr(22)
    data.type = file.type
    data.width = file.width
    data.height = file.height
    data.size = file.size
    data.title = file.name
    let result = await addFile(data)
    // console.log(result)
    instance.appContext.config.globalProperties.$message({
      type: 'success',
      message: '上传成功',
      duration: 1000
    })
    mdRef.value.$imglst2Url([[pos, result.url]])
  })
}
//获取reader的result
const uploadFile = (file) => {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    //reader.readAsArrayBuffer(file)
    reader.onload = function () {
      file.result = this.result
      let image = new Image()
      image.src = this.result
      image.onload = function () {
        file.width = this.width
        file.height = this.height
        resolve(file)
      }
    }
  })
}
const $imgDel = (pos) => {
  console.log(pos) //["//blog.cw.net/data/upload/2021-05-11/162072210359836.jpg", file]
  //关于删除，仅仅是当前添加的可以删除；如果是从数据库读出来的，就没有删除按钮了
}
const handleDetail = async () => {
  if (id.value > 0) {
    let result = await get(id.value)
    ruleForm.value = result
    ruleForm.value.category_ids = [parseInt(result.type), parseInt(result.category_id)]
    if ('' !== ruleForm.value.images) {
      images.value = ruleForm.value.images.split(',').filter((item) => item !== '')
    }
    image_show_plus.value = ruleForm.value.image.length === 0
    images_show_plus.value = images.value.length < images_count.value
  }
}
const handleCategoryList = async () => {
  options.value = await gets2()
}
const handleCreate = async (params) => {
  await add(params)
  instance.appContext.config.globalProperties.$message({
    type: 'success',
    message: '添加成功',
    duration: 1000
  })
  await router.push({ name: 'article' })
}
const handleUpdate = async (id, params) => {
  await edit(id, params)
  instance.appContext.config.globalProperties.$message({
    type: 'success',
    message: '修改成功',
    duration: 1000
  })
  await router.push({ name: 'article' })
}
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let data = {}
      data.category_id = ruleForm.value.category_ids[1]
      data.title = ruleForm.value.title
      data.url = ruleForm.value.url
      data.image = ruleForm.value.image
      if (images.value.length > 0) {
        data.images = images.value.join(',')
      }
      data.sort = ruleForm.value.sort
      data.keywords = ruleForm.value.keywords
      data.description = ruleForm.value.description
      data.content = ruleForm.value.content
      data.source = ruleForm.value.source
      data.author = ruleForm.value.author
      data.status = ruleForm.value.status
      if (id.value > 0) {
        //update
        handleUpdate(id.value, data)
      } else {
        //add
        handleCreate(data)
      }
    } else {
      console.log('error submit!', fields)
      return false
    }
  })
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  images.value = []
}
const handleChange = (value) => {
  console.log(value[value.length - 1])
}
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
  console.log('file_group:')
  console.log(file.response.url)
}
//调出文件管理组件
const showFileManager = (image_type1) => {
  image_type.value = image_type1
  if (1 === image_type.value) {
    fileManagerRef.value.show()
  } else {
    fileManager2Ref.value.show()
  }
}
const selectedImage = (file) => {
  console.log('selected-选择的图片是：' + file.url)
  ruleForm.value.image = file.url
  image_show_plus.value = false
}
const selectedImages = (file) => {
  console.log('selected-选择的图片是：' + file.url)
  images.value.push(file.url)
  console.log(images.value)
  if (images.value.length >= images_count.value) {
    images_show_plus.value = false
  }
}
const removeImage = (index) => {
  console.log(index)
  ruleForm.value.image = ''
  image_show_plus.value = true
}

const removeImage2 = (index) => {
  console.log(index)
  images.value.splice(index, 1)
  images_show_plus.value = true
}
</script>
