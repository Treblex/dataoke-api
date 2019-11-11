import request from './request'
import {Interceptor, Responder,errorHandler} from './custom'

const isDebug = process.env.NODE_ENV === "development"

let baseUrl = 'http://api.abadboy.cn/index/'
// #ifdef H5
	baseUrl = '/abadboy/' //跨域配置的指定代理前缀
// #endif

// 声明实例
let http = new request({baseUrl,isDebug,header:{test:"hello","Content-Type": "application/json"}})
http.customInterceptor=Interceptor//自定义拦截器
http.customResponder=Responder//自定义响应器
http.errorHandler=errorHandler

// API列表 对外暴露的接口
const api = {
    jssdk(data={}){
        return http.get('index/jssdk',{data})
    },
    upload(data){
        return http.uploadPayload('index/upload',{...data})
    }
}
export default api