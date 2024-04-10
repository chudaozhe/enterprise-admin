<template>
  <div class="item" @click="selected">
    <div class="size_info">{{ file.width }} x {{ file.height }}</div>

    <div class="delete_button" @click="deleteItem(file.id)" v-if="props.showDelete">
      <el-icon><Delete /></el-icon>
    </div>

    <img :src="host + file.url" alt="" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps(['file', 'host', 'showDelete'])

const emits = defineEmits(['selected'])

onMounted(() => {})
const deleteItem = (id) => {
  emits('delete', id)
}
const selected = () => {
  // console.log('send select item')
  emits('selected', props.file)
}
// export default {
//   name: 'all-img-item',
//   data() {
//     return {
//
//     }
//   },
//   props: ['file'],
//   computed: {},
//   mounted() {
//
//   },
//   methods: {
//
//   },
//   emits: ['selected', 'delete'],
// }
</script>

<style scoped>
img {
  height: 140px;
}
.item {
  position: relative;
  overflow: hidden;
  display: inline-block;
  padding: 5px;
  cursor: pointer;
  border: 1px solid #fff;
  transition: all 0.3s;
}
.item:hover {
  border: 1px solid rgba(0, 0, 0, 0.6);
}
.delete_button {
  position: absolute;
  top: 50%;
  left: -40px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 0 6px 6px 0;
  color: #fff;
  transform: translateY(-50%);
  transition: all 0.3s;
}
.item:hover .delete_button {
  left: 0;
}

.size_info {
  position: absolute;
  left: 0;
  top: 0;
  margin: 10px;
  padding: 2px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
}
</style>
