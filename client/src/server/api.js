import request from './request'
import {Interceptor, Responder,errorHandler} from './custom'

const isDebug = process.env.NODE_ENV === "development"

let baseUrl = 'http://47.252.11.244:3000'
// #ifdef H5
// if(isDebug){
// 		baseUrl = '' //跨域配置的指定代理前缀
// }
// #endif

// 声明实例
let http = new request({baseUrl,isDebug,header:{test:"hello"}})
http.customInterceptor=Interceptor//自定义拦截器
http.customResponder=Responder//自定义响应器
http.errorHandler=errorHandler

// API列表 对外暴露的接口
const api = {
	// 活动
    activity(data){
		return http.get('/api/activity',data)
	},
	// 分类
	category(data){
		return http.get('/api/category',data)
	}
}
export default api