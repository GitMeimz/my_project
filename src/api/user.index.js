// 引入分装好的axios
import axios from '@/utils/myaxios.js';
//获取所有用户数据
export const getAllUsers = (params)=>{
    return axios({
        url:'users',
        params
    })
}
// 用户数据新增
export const addUser = (data)=>{
    return axios({
        url:'users',
        method:'post',
        data
    })
}
// 删除用户
export const delid = (id)=>{
    return axios({
        url:`users/${id}`,
        method:'delete',
        
    })
}
// 编辑用户数据
export const editUser = (data)=>{
    return axios({
        url:`users/${data.id}`,
        method:'put',
        data
    })
}
 //修改用户状态
export const  updateUserState = (uid,type)=>{
    return axios({
        url:`users/${uid}/state/${type}`,
        method:'put',
    })
}

