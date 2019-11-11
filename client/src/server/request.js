/**
 * request 2019 8 24
 * authr suke
 * address https://sukeai.netlify.com
 */
export default class request{
    // 初始化配置
    config={
        baseUrl:"/",
        isLoading:true,
        isDebug:false,
        defaultOption:{
            header:{
                "Content-Type": "application/json"
            }
        }
    }
    isDebug=false
    customInterceptor=null
    customResponder=null
    errorHandler = null
    /**
     * 初始化
     * @param {*} config 
     */
    constructor(config){
        this.config = Object.assign(this.config,config)
        this.isDebug=config.isDebug
        if('customInterceptor' in config){
            this.customInterceptor=config.customInterceptor
        }
        if('customResponder' in config){
            this.customResponder=config.customResponder
        }
        if('header' in config){
            console.log("🦞 request 全局默认 Header:",config.header)
            this.config.defaultOption.header=Object.assign(this.config.defaultOption.header,config.header)
        }
    }

    /**
     *  拦截器
     * @param {*} options 
     */
    Interceptor(options){
       if(this.isDebug)console.log('%c 🚀🚀🚀new Request Start. -------------------------------','background:#fff;color:blue')
        let {url,method="POST",header={},data={},responseType='text',dataType='json'}=options
        // 组装url
        url = this.config.baseUrl+options.url
        // header
        let token=''
        header= Object.assign(this.config.defaultOption.header||{},{token,...header})
        // 默认配置
        options = Object.assign(options,{url,method,header,data,responseType,dataType})
        if(this.isDebug)console.log('🔧 request配置:',options)
        if(this.customInterceptor){
            options = this.customInterceptor(options)
        }
        if('type' in options){
            // 默认上传方法，不带header
            if(options.type == 'uploadFileStream'){
                delete options.header['Content-Type']
            }
        }
        return options;
    }

    /**
     * 响应器
     * @param {*} res 
     */
    Responder(res){
        const codeMessage = {
            200: '服务器成功返回请求的数据。',
            201: '新建或修改数据成功。',
            202: '一个请求已经进入后台排队（异步任务）。',
            204: '删除数据成功。',
            400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
            401: '用户没有权限（令牌、用户名、密码错误）。',
            403: '用户得到授权，但是访问是被禁止的。',
            404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
            406: '请求的格式不可得。',
            410: '请求的资源被永久删除，且不会再得到的。',
            422: '当创建一个对象时，发生一个验证错误。',
            500: '服务器发生错误，请检查服务器。',
            502: '网关错误。',
            503: '服务不可用，服务器暂时过载或维护。',
            504: '网关超时。',
          };
          let color = 'red'
          let size = 16
          let success= [200,201,204].includes(res.statusCode)
          if(success){
              color='green'
              size = 12
          }
        if(res.statusCode in codeMessage){
            console.log('%cstatusCode:'+res.statusCode+' desc:'+codeMessage[res.statusCode]+'=====','color:'+color+';font-size:'+size+'px')
        }
        if(success){
            if(this.customResponder){
                res = this.customResponder(res)
            }
            return res
        }
        return;
    }

    /**
     * 通用请求
     * @param {*} options 
     */
    async request(options={}){
        options = await this.Interceptor(options)
        return  new Promise((resolve,reject)=>{
            uni.request({
                ...options
            }).then(response=>{
                let [err,res]=response

                // 正常
                if(res){
                    if(this.isDebug)console.log('👌👌👌请求结果:',res)
                    let _res = this.Responder(res)
                    resolve(_res)
                }
                
                // 错误
                if(err){
                    if(this.isDebug)console.log('%c😢😢😢请求错误:【'+options.url+'】','background:#d33;color:#fff')
                    if(this.errorHandler){
                        let err = this.errorHandler(err)
                    }
                    reject(err)
                }
                
            })
        })
    }
    /**
     * 上传通用方法
     * @param {*} options 
     */
    async uploadAct(options={}){
        options = await this.Interceptor(options)
        return new Promise((resolve,reject)=>{
            uni.uploadFile({
                ...options
            }).then(response=>{
                let [err,res]=response
    
                // 正常
                if(res){
                    if(this.isDebug)console.log('👌👌👌请求结果:',res)
                    let _res = this.Responder(res)
                    resolve(_res)
                }
                
                // 错误
                if(err){
                    if(this.isDebug)console.log('%c😢😢😢请求错误:【'+options.url+'】','background:#d33;color:#fff')
                    if(this.errorHandler){
                        let err=this.errorHandler(err)
                    }
                    reject(err)
                }
            })
        })
    }
    /**
     * 别名请求 get
     * @param {*} url 网络地址
     * @param {*} option data,header,method,一般仅data即可
     */
    get(url,option){
        return this.request({url,method:'GET',...option})
    }
    post(url,option){
        return this.request({url,method:'POST',...option})
    }
    delete(url,option){
        return this.request({url,method:'DELETE',...option})
    }
    put(url,option){
        return this.request({url,method:'PUT',...option})
    }
    option(url,option){
        return this.request({url,method:'OPTION',...option})
    }
    
    /**
     * 后端语言和上传接口实现不同,上传接口经常不好处理
     * @param {*} url 
     * @param {*} options 
     */

    // 默认为formdata文件流形象
    uploadFileStream(url,option){
        return this.uploadAct({url,type:'uploadFileStream',...option})
    }
    // payload参数形式
    uploadPayload(url,options){
        return this.uploadAct({url,header:{"Content-Type":"multipart/form-data"},...options})
    }
    // fromDate形式
    uploadFormData(url,options){
        return this.uploadAct({url,header:{"Content-Type":"application/x-www-form-urlencoded"},...options})
    }
}