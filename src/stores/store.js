import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserInfoStore = defineStore('userInfo',()=>{

  const userInfo = ref({});

  const setUserInfo = (info)=>{
    userInfo.value = info;
  }

  const removeUserInfo = ()=> {
    userInfo.value = {}
  }

  return {
    userInfo, setUserInfo, removeUserInfo
  }
},{
  persist: true //持久化存储
});