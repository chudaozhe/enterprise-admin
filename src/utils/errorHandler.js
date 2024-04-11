export default function errorHandler(err, vm, info) {
  console.log('errorHandler')
  console.log(err)
  console.log(JSON.stringify(vm))
  console.log(info)
}
