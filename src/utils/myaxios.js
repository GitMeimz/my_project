import axios from 'axios'
// 设置基基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
export default axios
// 请求添加拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么：获取token ，设置请求头
    var toke = localStorage.getItem('itcast')
    if(toke){
        config.headers.Authorization = toke
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });