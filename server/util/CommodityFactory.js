const request = require('request');
const crypto = require('crypto');

class factory {

    appSecret = ''; //应用的Secret 
    version = 'v1.0.0'; // API接口版本号
    appKey = ''; // 应用分配的appKey
    baseUrl = 'https://openapi.dataoke.com'

    /**
     * 初始化
     * @param {*} option 
     */
    constructor({
        appSecret,
        appKey
    }) {
        this.appSecret = appSecret
        this.appKey = appKey
    }

    // 高效转链
    getLink({goodsId='524420054297'}){
        return this.request_({url:"/api/tb-service/get-privilege-link",requestData:{goodsId},version:'v1.1.0'})
    }
    // 商品分类
    category(){
        return this.request_({url:'/api/category/get-super-category',requestData:{},version:"v1.1.0"})
    }
    // 精选专辑
    topic(){
        return this.request_({url:"/api/goods/topic/catalogue",requestData:{},version:'v1.1.0'})
    }
    /**
     * 精选专辑列表
     * @param {*} pageId // 分页
     * @param {*} pageSize //分页大小
     * @param {*} activityId //活动ID
     */
    topicList({
        pageId = 1,
        pageSize = 20,
        topicId
    }){
        return this.request_({url:'/api/goods/topic/goods-list',requestData:{
            pageId,
            pageSize,
            topicId
        },version:'v1.1.0'})
    }
    // 品牌库API
    getBarndList({pageId=1,pageSize=10}){
        return this.request_({url:"/api/tb-service/get-brand-list",requestData:{pageId,pageSize},version:'v1.1.0'})
    }
    // 超级搜索 TODO:接口有些问题
    search({type=0,pageId,pageSize=10,keyWords='',tmall,haitao,sort='total_sales'}){
        return this.request_({url:"/api/goods/list-super-goods",requestData:{type,pageId,pageSize,keyWords,tmall,haitao,sort},version:'v1.1.1'})
    }
    // 单品详情
    goodDetail({id,goodsId}){
        return this.request_({url:"/api/goods/get-goods-details",requestData:{id,goodsId},version:'v1.1.0'})
    }
    // 猜你喜欢
    similerGoodsList({id,size=10}){
        return this.request_({url:'/api/goods/list-similer-goods-by-open',requestData:{id,size},version:'v1.1.0'})
    }
    // 各大榜单
    getRankList({rankType,cid=''}){
        return this.request_({url:"/api/goods/get-ranking-list",requestData:{rankType,cid},version:'v1.1.0'})
    }
    // 九块九包邮
    nine({
        pageId = 1,
        pageSize = 20,
        nineCid=1
    }){
        return this.request_({url:"/api/goods/nine/op-goods-list",requestData:{
            pageId,
            pageSize,
            nineCid
        },version:'v1.1.0'})
    }
    /**
     * 热门活动API
     */
    activicy() {
        return this.request_({
            url: '/api/goods/activity/catalogue',
            requestData: {},
            version: 'v1.1.0'
        })
    }

    /**
     * 热门活动商品列表
     * @param {*} pageId // 分页
     * @param {*} pageSize //分页大小
     * @param {*} activityId //活动ID
     */
    activicyGoodList({
        pageId = 1,
        pageSize = 20,
        activityId
    }) {
        return this.request_({
            url: '/api/goods/activity/goods-list',
            requestData: {
                pageId,
                pageSize,
                activityId
            },
            version: "v1.1.0"
        })
    }

    /**
     * 热搜记录	
     * @param {*} option 
     */
    getCategoryTop100() {
        return this.request_({
            url: '/api/category/get-top100',
            requestData: {}
        })
    }

    /**
     * 请求方法
     * @param {*} url //API地址
     * @param {*} requestData //请求参数
     * @param {*} version //API版本号
     */
    request_({
        url = '',
        requestData,
        version
    }) {
        const appSecret = this.appSecret

        const data = {
            version: version || 'v1.0.0', // API接口版本号
            appKey: this.appKey, // 应用分配的appKey
            ...requestData
        };
        let requestDataUrl = ''
        if (requestData && JSON.stringify(requestData) !== '{}') {
            let arr = Object.keys(requestData)
            arr.forEach(x => {
                requestDataUrl += `&${x}=${requestData[x]}`
            })
        }
        console.log('url:', requestDataUrl)
        var options = {
            url: `${this.baseUrl}${url}?appKey=${data.appKey}&version=${data.version}&sign=${this.makeSign(data,appSecret)}${requestDataUrl}`, //请求地址
            method: 'GET',
            ...requestData
        };
        console.log(options)
        return new Promise((resolve, reject) => {
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //输出返回的内容
                    // console.log('接口调用成功',response);
                    resolve(body)
                } else {
                    //输出返回的内容
                    console.log('接口调用失败',response);
                    reject(body)
                }
            })
        })
    }



    /**验签sign参数加密
     * @param $data
     * @param $appSecret
     * @return string
     */
    makeSign = ($data, $appSecret) => {

        let $str = '';
        let $index = 0;
        let $sortPor = [];

        for (let key in $data) {
            $sortPor.push(`${key}=${$data[key]}`);
        }
        // 排序
        $sortPor.sort();

        // 转url
        for (let key in $sortPor) {
            $str = `${$str}${$index === 0 ? '' : '&'}${$sortPor[key]}`;
            $index++;
        }

        // md5加密
        const $ret = crypto.createHash('md5').update(`${$str}&key=${$appSecret}`).digest('hex');

        return $ret;
    }
}

module.exports = factory;