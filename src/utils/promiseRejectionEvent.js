export default function promiseRejectionEvent(event) {
  console.log('unhandledrejection:', event.reason) // 捕获后自定义处理
  ElMessage({
    showClose: true,
    message: event.reason.msg,
    type: 'error'
  })
  //防止默认处理(例如将错误输出到控制台)
  event.preventDefault()
}
