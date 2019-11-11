/**
 * 自定义请求拦截器
 * @param {*} options 配置内容
 */
const Interceptor=(options)=>{
    let {header,data} = options

    // 获取token
    let token = 'fghjklsduDKLDFGHJK$%^&*()'

    // 请求头加token
    header = Object.assign(header,{token})
    // 请求体加token
    data = Object.assign(data,{token})
    console.log('💥 自定义配置:  ',{header,data})
    // 重新封装options
    options = Object.assign(options,{header,data})
    return options
}

/**
 * 自定义响应拦截器
 * @param {*} res 
 */
const Responder=(res)=>{
    let {data} = res
    console.log('🐸 自定义响应处理',data)
    let errCode={
        // 示例
        "-1":login
    }
    if(data.status in errCode){
         errCode[data.status]()
         return;
    }
    if(data.status){
        return data.data
    }
    return ;
}

/**
 * 错误处理
 * @param {*} err 
 */
const errorHandler=(err)=>{
   if(err){
    //   alert(err.errMsg)
   }
}

const login=()=>{
    console.log('do login...')
}

export {
    Interceptor,
    Responder,
    errorHandler
}