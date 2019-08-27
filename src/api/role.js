import axios from "@/utils/myaxios.js"
//获取角色分配
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
