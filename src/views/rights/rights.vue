<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightList" stripe style="width: 100%">
        <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
          <template slot-scope="scope">
            <span>{{scope.row.level | levelFormat}}</span>
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import{getrightsList} from '@/api/rights.js'
export default {
    data(){
        return{
           rightList:[] 
        }
    },
    //添加过滤器
    filters:{
      levelFormat(level){
          if(level === '0'){
              return '一级'
          }else if(level === '1'){
              return '二级'
          }else if(level === '2'){
              return '三级'
          }
      }
    },
    mounted(){
        getrightsList('list')
        .then(res=>{
            console.log(res)
            if(res.data.meta.status === 200){
                this.rightList = res.data.data
            }else{
                this.$message.error('数据获取失败')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }
};
</script>
<style lang="less" scoped>
</style>