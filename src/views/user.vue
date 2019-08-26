<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input
      placeholder="请输入内容"
      v-model="userobj.query"
      @keydown.enter.native="init"
      class="input-with-select"
    >
      <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
    </el-input>
    <el-button type="primary" plain @click="FormVisible = true">添加用户</el-button>
    <!-- <el-button type="primary" plain @click="FormVisible ">添加用户</el-button> -->

    <el-table :data="userlist" border style="width: 100%">
      <el-table-column type="index" style="width:50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="cha(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="editor(scope.row) "></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content=" 角色分配" placement="top">
            <el-button type="success" icon="el-icon-share" @click="adddeluser(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" @click="del(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4, 5]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="FormVisible">
      <el-form :model="Addusers" :label-width="'80px'" :rules="rules" ref="Addusers">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="Addusers.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="Addusers.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="Addusers.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="Addusers.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="FormVisible=false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" :label-width="'80px'" ref="editForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配对话框 -->
    <el-dialog title="角色分配" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" :label-width="'80px'">
        <el-form-item label="用户名">
          <span>{{grantForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="grantForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser1">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
import {
  getAllUsers,
  addUser,
  delid,
  editUser,
  updateUserState
} from "@/api/user.index.js";
import { Role, grantUserRole} from "@/api/role.js";
export default {
  data() {
    return {
      FormVisible: false,
      Addusers: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editDialogFormVisible: false,
      editForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      grantDialogFormVisible: false,
      roleList: [],
      grantForm: {
        username: "",
        rid: "",
        id: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            tirgger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            tirgger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            tirgger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入电话",
            tirgger: "blur"
          },
          {
            pattern: /^1\d{10}$/,
            message: "请输入正确的手机号",
            tirgger: "blur"
          }
        ]
      },
      total: 0,
      userlist: [],
      userobj: {
        query: "",
        pagenum: 1, //当前页码
        pagesize: 3 //显示条数
      }
    };
  },
  methods: {
    handleSizeChange(val) {
      this.userobj.pagesize = val;
      this.init();
    },
    handleCurrentChange(val) {
      this.userobj.pagenum = val;
      this.init();
    },
    init() {
      getAllUsers(this.userobj)
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.userlist = res.data.data.users;
            this.total = res.data.data.total;
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg);
            this.$router.push({ name: "login" });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增用户

    add() {
      this.$refs.Addusers.validate(valid => {
        if (valid) {
          addUser(this.Addusers)
            .then(res => {
              console.log(res);
              if (res.data.meta.status === 201) {
                this.$message.success("添加成功");
                this.FormVisible = false;
                // 重置表单
                this.$refs.Addusers.resetFields();
                this.init();
              }
            })
            .catch(err => {
              console.log(err);
              this.$message.success("新增失败");
            });
        } else {
          this.$message.warning("请输入所有必填数据");
        }
      });
    },
    //删除用户
    del(id) {
      console.log(id);
      this.$confirm("是否删除此条数据", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delid(id)
            .then(res => {
              console.log(res);
              if (res.data.meta.status === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.init();
              } else {
                this.$message({
                  type: "error",
                  message: res.data.meta.msg
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },

    //角色分配
    adddeluser(row) {
      console.log(row);
      this.grantDialogFormVisible = true;
      this.grantForm.username = row.username;
      this.grantForm.id = row.id;
      this.grantForm.rid = row.rid;
    },
    // 用户角色分配
    edituser1(){

      console.log(this.grantForm)
      if (this.grantForm.rid){
        grantUserRole(this.grantForm)
        .then(res=>{
          console.log(res)
          if(res.data.meta.status === 200){
            this.$message.success(res.data.meta.msg)
            this.grantDialogFormVisible = false
            this.init()
          }
        })
        .catch(()=>{
          this.$message.success('用户编辑失败')
        })
      } else{
        this.$message.error('请选择你的角色')
      }
    },
    //弹出编辑对话框
    editor(row) {
      this.editDialogFormVisible = true;
      console.log(row);
      this.editForm.id = row.id;
      this.editForm.username = row.username;
      this.editForm.email = row.email;
      this.editForm.mobile = row.mobile;
    },
    //编辑用户数据
    edituser() {
      editUser(this.editForm)
        .then(res => {
          console.log(res);
          if (res.data.meta.status === 200) {
            this.$message.success("编辑成功");
            this.editDialogFormVisible = false;
            this.init();
          }
        })
        .catch(() => {
          this.$message.success("编辑失败");
        });
    },
    //修改用户状态
    cha(id, type) {
      updateUserState(id, type)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.$message({
              type: "success",
              message: "状态修改成功"
            });
            this.init();
          } else {
            this.$message({
              type: "error",
              message: res.data.meta.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "success",
            message: "修改状态失败"
          });
        });
    }
  },
  mounted() {
    // getAllUsers(this.userobj)
    //   .then(res => {
    //     console.log(res);
    //     this.userlist = res.data.data.users;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    this.init();
    // 加载角色列表数据
    Role()
      .then(res => {
        console.log(res)
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
.el-input {
  width: 300px;
}
.el-button {
  margin-left: 5px;
}
</style>