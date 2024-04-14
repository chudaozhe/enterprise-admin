<template>
  <mavonEditor
    :style="{ width: '100%' }"
    ref="mdRef"
    v-model="content"
    @imgAdd="$imgAdd"
    @imgDel="$imgDel"
  />
</template>
<script setup>
import { ref } from 'vue'
import { add as addFile } from '../services/admin/file.js'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const content = defineModel()

const mdRef = ref()

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
    ElMessage({
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
</script>
