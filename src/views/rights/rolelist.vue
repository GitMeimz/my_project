<template>
  <div class="rolelist">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success">添加角色</el-button>

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
              <el-tag type="success" closable>{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id">
                <el-col :span="4">
                  <el-tag type="info" closable>{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    style="margin-left:5px;margin-bottom:5px"
                    type="warning"
                    closable
                    v-for="third in second.children"
                    :key="third.id"
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
        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
          <el-button type="primary" icon="el-icon-edit"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="角色权限" placement="top">
          <el-button type="info" icon="el-icon-share"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="删除" placement="top">
          <el-button type="danger" icon="el-icon-delete"></el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { Role } from "@/api/role.js";
export default {
  data() {
    return {
      roleList: []
    };
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