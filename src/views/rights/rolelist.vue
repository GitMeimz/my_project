<template>
  <div class="rolelist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" @click="addrole">添加角色</el-button>

    <!-- 表格 -->
    <el-table :data="roleList" style="width: 100%;" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom:1px dashed #c4c4c4  ;"
          >
            <el-col :span="4">
              <el-tag type="success" closable @close="Rights(scope.row,first.id)">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag
                    type="info"
                    closable
                    @close="Rights(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    style="margin-left:5px;margin-bottom:5px"
                    type="warning"
                    closable
                    v-for="third in second.children"
                    :key="third.id"
                    @close="Rights(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-if="scope.row.children.length === 0">你还没有任何权限，请先分配！！！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="editor(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="info" icon="el-icon-share" @click="rightist(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
          
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="grantdialogTableVisible">
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expand-all="true"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="grantdialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editordialogVisible" width="600px">
      <el-form :model="editorList" status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称">
          <el-input v-model="editorList.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editorList.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editordialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addeditor">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="showaddrole" width="600px">
      <el-form :model="addForm" status-icon label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showaddrole = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { Role,Deleterole} from "@/api/role.js";
import {
  delRightByRoleId,
  getrightsList,
  roleauthorization,
  addRole,
  Editingrole
} from "@/api/rights.js";

export default {
  data() {
    return {
      chkedArr: [], //   当前角色所拥有的权限id
      roleList: [],
      grantdialogTableVisible: false,
      rightList: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      editordialogVisible: false,
      editorList: {
          roleName:'',
          roleDesc:'',
          id:''
      },
      showaddrole:false,
      addForm:{
          roleName:'',
          roleDesc:''
      },
      roleId:'',
    };
  },
  methods: {
    //权限列表
    Rights(row, rightId) {
      delRightByRoleId(row.id, rightId)
        .then(res => {
          console.log(res);
          this.$message.success("删除角色权限成功");
          row.children = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //分配权限
    rightist(row) {
      this.roleId = row.id;
      this.grantdialogTableVisible = true;
      //展示树形结构
      getrightsList("tree").then(res => {
        console.log(res);
        this.rightList = res.data.data;
      });
      row.children.forEach(first => {
        //遍历一级权限
        if (first.children.length > 0) {
          //一级权限的二级权限>0
          first.children.forEach(second => {
            //遍历二级权限
            if (second.children.length > 0) {
              //二级权限的三级权限>0
              second.children.forEach(third => {
                //遍历三级权限
                this.chkedArr.push(third.id); //三级权限的id 得到这个id展示数据
              });
            }
          });
        }
      });
    },
    //添加角色授权
    dialogVisible() {
      let arr = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys());
      console.log(arr);
      roleauthorization(this.roleId, arr.join(",")).then(res => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg);
          this.grantdialogTableVisible = false;
          this.init();
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    },
    //添加角色对话框
    addrole(){
       this.showaddrole = true
    },
    // 添加角色
    addRole(){
       addRole(this.addForm).then((res)=>{
         console.log(res)
         if(res.data.meta.status === 201){
           this.$message.success(res.data.meta.msg)
           this.showaddrole = false
           this.init()
         }else{
           this.$message.success(res.data.meta.msg)
         }
       }) 
    },
    //编辑角色对话框
    editor(row) {
      this.editordialogVisible = true;
      console.log(row)
      this.editorList.id = row.id;
      this.editorList.roleName = row.roleName;
      this.editorList.roleDesc = row.roleDesc;
    },
    // 编辑角色
    addeditor(){
      console.log(this.editorList)
        Editingrole(this.editorList)
        .then((res)=>{
          console.log(res)
          if(res.data.meta.status === 200){
            this.$message.success('编辑成功');
            this.editordialogVisible = false;
            this.init();
          }
        })
        .catch(()=>{
          this.$message.success('编辑失败');
        })
        
    },
    // 删除角色
    del(id){
       console.log(id);
       this.$confirm('是否删除角色',{
         confirmButtonText:'确定',
         cancelButtonTextt:'取消',
         type:'warning'
       })
       .then(()=>{
         Deleterole(id)
         .then(res=>{
           console.log(res);
           if(res.data.meta.status === 200){
             this.$message({
               type:'success',
               message:'删除成功'
             });
             this.init()
           }else{
             this.$message({
               type:'error',
               message:res.data.meta.msg
             });
           }
         })
         .catch(()=>{
           this.$message({
             type:'error',
             message:'删除失败'
           })
         })
       })
       .catch(()=>{
          this.$message({
            type: "info",
            message: "取消删除"
          });
       })
    },
    // 数据刷新
    init() {
      Role().then(res => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data;
        }
      });
    }
  },

  mounted() {
    Role("tree")
      .then(res => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style lang="less" scoped>
</style>