import axios from "@/utils/myaxios.js"
//获取所有用户数据
export const Role = ()=>{
    return axios({
        url: 'roles'
     })
}
//用户角色分配
export const grantUserRole= (data)=>{
    return axios({
        url:`users/${data.id}/role`,
        method:'put',
        data:{rid:data.rid}
    })
}
// 删除角色
export const Deleterole = (id)=>{
    return axios({
        url:`roles/${id}`,
        method:'delete',
    })
}