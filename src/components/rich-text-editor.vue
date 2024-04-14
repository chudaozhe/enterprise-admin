<template>
  <div style="width: 100%; border: 1px solid #e4e7ed; box-shadow: 0 0 12px rgba(0, 0, 0, 0.12)">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
      style="border-bottom: 1px solid #e4e7ed; box-shadow: 0 0 12px rgba(0, 0, 0, 0.12)"
    />
    <Editor
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      style="height: 400px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
      @onDestroyed="handleDestroyed"
      @onFocus="handleFocus"
      @onBlur="handleBlur"
      @customAlert="customAlert"
      @customPaste="customPaste"
    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { add as addFile } from '../services/admin/file.js'

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()
const mode = ref('default')

// 内容 HTML
const valueHtml = defineModel()

const toolbarConfig = {
  //隐藏视频功能
  excludeKeys: [
    // "group-more-style",
    // 'group-image',
    'group-video'
    // 'editVideoSize',
    // 'insertVideo',
    // 'uploadVideo',
  ]
}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      // 自定义图片上传功能
      customUpload: async (resultFile, insertImgFn) => {
        // const formData = new FormData();
        // formData.append('file', resultFile);
        let data = {}
        uploadFile(resultFile).then(async function (file) {
          data.content = file.result.substr(22)
          data.type = file.type
          data.width = file.width
          data.height = file.height
          data.size = file.size
          data.title = file.name
          console.log(data)
          let result = await addFile(data)
          // console.log(result)
          ElMessage({
            type: 'success',
            message: '上传成功',
            duration: 1000
          })
          // 插入图片，三个参数分别对应，url alt href
          insertImgFn(result.url, '', result.url)
        })
      }
    }
    // uploadVideo: {
    //   // 自定义视频上传功能
    //   customUpload: (resultFile, insertImgFn) => {
    //     const formData = new FormData();
    //     formData.append('file', resultFile);
    //     // 将文件上传至服务器，res.data返回服务器存放文件的url
    //     fileApi.postFileUpload(formData).then(res => {
    //       // 插入视频，三个参数分别对应，url alt href
    //       insertImgFn(res.data, '', res.data);
    //     });
    //   }
    // }
  }
}

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return

  editor.destroy()
})

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

// 编辑器回调函数
const handleCreated = (editor) => {
  console.log('created', editor)
  editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
  console.log('change:', editor.getHtml())
}
const handleDestroyed = (editor) => {
  console.log('destroyed', editor)
}
const handleFocus = (editor) => {
  console.log('focus', editor)
}
const handleBlur = (editor) => {
  console.log('blur', editor)
}
const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`)
}
const customPaste = (editor, event, callback) => {
  console.log('ClipboardEvent 粘贴事件对象', event)

  // 自定义插入内容
  // editor.insertText('xxx');

  // 返回值（注意，vue 事件的返回值，不能用 return）
  // callback(false); // 返回 false ，阻止默认粘贴行为
  callback(true) // 返回 true ，继续默认的粘贴行为
}

// const insertText = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//
//   editor.insertText('hello world');
// };

// const printHtml = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   console.log(editor.getHtml());
// };
//
// const disable = () => {
//   const editor = editorRef.value;
//   if (editor == null) return;
//   editor.disable()
// };
</script>
