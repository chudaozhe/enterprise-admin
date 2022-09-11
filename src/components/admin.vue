<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="20" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
        <p style="float: left; line-height: 20px">{{collapsed?'':sysName}}</p>
        <p :class="collapsed?'el-icon-s-unfold':'el-icon-s-fold'" @click="collapse" style="float: right"></p>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img :src="host+admin.avatar" /> {{admin.nickname}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dialogFormVisible = true">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside  v-show="!collapsed" :class="collapsed?'menu-collapsed':'menu-expanded'">
        <!--导航菜单-->
        <el-menu :default-active="$route.path" class="el-menu-vertical" @open="handleOpen" @close="handleClose" @select="handleSelect" unique-opened router>
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-user"></i>管理员管理</template>
            <el-menu-item index="/admin">管理员列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-picture-outline"></i>图片空间</template>
            <el-menu-item index="/file">图片列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-copy-document"></i>分类管理</template>
            <el-menu-item index="/category">分类列表</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-suitcase"></i>案例管理</template>
            <el-menu-item index="/case">案例列表</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-news"></i>文章管理</template>
            <el-menu-item index="/article">文章列表</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title"><i class="el-icon-tickets"></i>单页管理</template>
            <el-menu-item index="/page">单页列表</el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title"><i class="el-icon-menu"></i>快捷方式管理</template>
            <el-menu-item index="/shortcut">快捷方式列表</el-menu-item>
          </el-submenu>
          <el-submenu index="8">
            <template slot="title"><i class="el-icon-money"></i>焦点图</template>
            <el-menu-item index="/flash">焦点图</el-menu-item>
          </el-submenu>

        </el-menu>
      </aside>

      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="36%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="当前密码" prop="password">
          <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input type="password" v-model="ruleForm.new_password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="new_password2">
          <el-input type="password" v-model="ruleForm.new_password2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import store from '../store.js'
  import {changePassword} from '../model/admin/admin';
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.new_password2 !== '') {
            this.$refs.ruleForm.validateField('new_password2');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.new_password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        host:global.host,
        sysName:'管理后台',
        collapsed:false,
        admin:store.state.entUser,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        ruleForm: {
          password: '',
          new_password: '',
          new_password2: '',
        },
        rules: {
          password: [
            { required: true, message: '请输入当前密码', trigger: 'blur' }
          ],
          new_password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          new_password2: [
            { required: true, message: '请再次确认新密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ],
        },
      }
    },
    mounted() {
      // this.$notify({
      //   title: '提示',
      //   message: '体验版部分功能已禁用，包括：删除，及部分修改',
      //   duration: 0
      // });
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelect: function (a, b) {
        console.log(a, b)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.handlePassword(this.ruleForm.password, this.ruleForm.new_password);
            console.log('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handlePassword:async function(password, new_password) {
        let result=await changePassword(password, new_password);
        if(result.err===0){
          this.dialogFormVisible=false;
          this.$message({type:'success', message:'修改成功，请重新登录', duration:1000});
          store.commit('setToken', {});
          await this.$router.push('/login');
        }else{
          this.$message({type:'error', message:result.msg, duration:1000});
        }
      },
      //退出登录
      logout: function () {
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          store.commit('setToken', {});
          _this.$router.push('/login');
        }).catch(() => {

        });


      },
      //折叠导航栏
      collapse:function(){
        this.collapsed=!this.collapsed;
      },
      showMenu(i,status){
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
      }
    },
  }

</script>

<style scoped lang="scss">
  $color-primary: #20a0ff;//#18c79c
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
      height: 60px;
      line-height: 60px;
      background: $color-primary;
      color:#fff;
      .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
        .userinfo-inner {
          cursor: pointer;
          color:#fff;
          img {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
          }
        }
      }
      .logo {
        //width:230px;
        height:60px;
        font-size: 22px;
        padding-left:20px;
        padding-right:20px;
        img {
          width: 40px;
          float: left;
          margin: 10px 10px 10px 18px;
        }
        .txt {
          color:#fff;
        }
      }
      .logo-width{
        width:230px;
      }
      .logo-collapse-width{
        width:60px
      }
      .tools{
        padding: 0px 23px;
        width:14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
      }
    }
    .main {
      display: flex;
      /*background: #324057;*/
      position: absolute;
      top: 60px;
      bottom: 0px;
      overflow: hidden;
      aside {
        /*flex:0 0 230px;*/
        /*width: 230px;*/
        /*position: absolute;*/
        /*top: 0px;*/
        /*bottom: 0px;*/
        .el-menu{
          height: 100%;
        }
        .collapsed{
          /*width:60px;*/
          .item{
            position: relative;
          }
          .submenu{
            position:absolute;
            top:0px;
            left:60px;
            z-index:99999;
            height:auto;
            display:none;
          }

        }
      }
      /*收缩*/
      .menu-collapsed{
        flex:0 0 0px;
        width: 0px;
      }
      /*展开*/
      .menu-expanded{
        flex:0 0 230px;
        width: 230px;
      }
      .content-container {
        // background: #f1f2f7;
        flex:1;
        // position: absolute;
        // right: 0px;
        // top: 0px;
        // bottom: 0px;
        // left: 230px;
        overflow-y: scroll;
        padding: 20px;
        .breadcrumb-container {
          //margin-bottom: 15px;
          .title {
            width: 200px;
            float: left;
            color: #475669;
          }
          .breadcrumb-inner {
            float: right;
          }
        }
        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }
    }
  }
</style>