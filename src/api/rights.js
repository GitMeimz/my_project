import axios from "@/utils/myaxios.js"
//获取所有权限列表数据
export const getrightsList = (type)=>{
    return axios({
        url: `rights/${type}`,
        method:'get'
    })
}
// 删除角色的指定权限
export const delRightByRoleId = (roleId,rightId)=>{
    return axios({
        url:`roles/${roleId}/rights/${rightId}`,
        method:'delete'
    })
}
//  为指定角色授权
export const roleauthorization = (roleId,rids)=>{
    return axios({
       url:`roles/${roleId}/rights`,
       method:'post',
       data:{rids}
    })
}
// 编辑提交角色
export const Editingrole = (data)=>{
    return axios ({
      url:`roles/${data.id}`,
      method:'put',
      data
    })
}
// 新增角色
export const addRole = (data)=>{
    return axios({
        url:`roles`,
        method:'post',
        data
    })
}