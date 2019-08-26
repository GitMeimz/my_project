// 引入封装好的 axios
import axios from '@/utils/myaxios.js';
// 实现登录验证
export const login = (data)=>{
    // axios()返回一个promise对象
     return axios ({
         url:'login',
         method:'post',
         data
     })
}