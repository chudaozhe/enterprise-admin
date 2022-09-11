<template>
  <div class="all-img">
<!--    <all-img-item v-for="(item,index) in imgList"-->
<!--                  :selected-list="selectedList"-->
<!--                  :url="item"-->
<!--                  :key="item"-->
<!--                  @delete="deleteItem(index)"-->
<!--                  @select="select"-->
<!--                  @ensure="$emit('ensure')" >-->
<!--    </all-img-item>-->
    <allImgItem v-for="(item, index) in tableData"
            :file="item"
            :key="item.id"
            @selected="selected" >
    </allImgItem>
  </div>
</template>

<script>
  import allImgItem from '../filemanager/allImgItem';
  import {gets} from '../../model/admin/file';
  import store from '../../store';

  export default {
    name: 'all-img',
    data() {
      return {
          host:global.host,
          thisKey:'',
          curIndex:-1,
          selectedList:[],
          tableData:[],
      }
    },
    components:{
      'allImgItem': allImgItem
    },
    mounted() {
        this.listByFile(0, '', 1, 1000);
    },
    methods: {
      clearSelected() {
        this.selectedList = [];
      },
        selected(file) {
        // var selectedIndex = this.selectedList.indexOf(url);
        console.log("all收到-选择的img："+file);
        this.$emit('selected', file);
      },
        listByFile: async function (cid, keyword, page, max) {
            let result=await gets(cid, keyword, page, max);
            if(undefined===result.err){
                this.tableData= result.list;
            }else{
                this.$message({type:'error', message:result.msg, duration:1000});
                store.commit('setToken', {});
                this.$router.push('/login');
            }
        },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .item_box {
    display: inline-block;
  }

</style>
