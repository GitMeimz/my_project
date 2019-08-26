import axios from "@/utils/myaxios.js"
//获取所有权限列表数据
export const getrightsList = (type)=>{
    return axios({
        url: `rights/${type}`,
        method:'get'
    })
}