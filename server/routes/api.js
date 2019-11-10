var express = require('express');
var router = express.Router();
var factory = require('../util/CommodityFactory')
// 商品工厂对象
let CommodityFactory = new factory({
  appSecret: '17eda35413998548b3fdebd31e6d2c51',
  appKey: '5dc6fcef48989'
})

const errCode = (title) => {
  return {
    time: new Date() * 1,
    code: -1,
    msg: title,
    data: {}
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource /');
});


// 商品分类
router.get('/category', async function (req, res, next) {
  let body = await CommodityFactory.category()
  res.send(body)
})

// 精选专辑API
router.get('/topic', async function (req, res, next) {
  let body = await CommodityFactory.topic()
  res.send(body)
})


// 品牌
router.get('/get-brand-list', async function (req, res, next) {
  let {
    pageId,
    pageSize = 10
  } = req.query
  if (!pageId) {
    res.send(errCode("pageId不可空"))
  }
  let body = await CommodityFactory.getBarndList({
    pageId,
    pageSize
  })
  res.send(body)
})


// 搜索
router.get('/search', async function (req, res, next) {
  let {type=1,pageId,pageSize=20,keyWords='',tmall=0,haitao=0,sort='total_sales'} = req.query
  let body = await CommodityFactory.search({type,pageId,pageSize,keyWords,tmall,haitao,sort})
  res.send(body)
})


// 商品详情
router.get('/good-detail', async function (req, res, next) {
  let {
    id
  } = req.query
  if (!id) {
    res.send(errCode("商品id不可空"))
  }
  let like = await CommodityFactory.similerGoodsList({
    id
  })
  if (like) {
    like = JSON.parse(like).data
  }
  let body = await CommodityFactory.goodDetail({
    id
  })
  if (body) {
    body = JSON.parse(body).data
  }
  res.send({
    time: new Date() * 1,
    code: -1,
    msg: '请求成功',
    data: {
      body,
      like
    }
  })
})


// 榜单
router.get('/get-rank-list', async function (req, res, next) {
  let {
    rankType
  } = req.query
  if (!rankType) {
    res.send(errCode("rankType不可空"))
  }
  let body = await CommodityFactory.getRankList({
    rankType
  })
  res.send(body)
})


// 九块九
router.get('/nine', async function (req, res, next) {
  let {
    pageId,
    pageSize = 10,
    nineCid
  } = req.query
  console.log(pageId)
  if (!pageId) {
    res.send(errCode("pageId不可空"))
  }
  if (!nineCid) {
    res.send(errCode("nineCid不可空"))
  }

  let body = await CommodityFactory.nine({
    pageId,
    pageSize,
    nineCid
  })
  res.send(body)
});


// 活动列表商品
router.get('/topic/list', async function (req, res, next) {
  let {
    pageId,
    pageSize = 10,
    topicId
  } = req.query
  console.log(pageId)
  if (!pageId) {
    res.send(errCode("pageId不可空"))
  }
  if (!topicId) {
    res.send(errCode("topicId不可空"))
  }

  let body = await CommodityFactory.topicList({
    pageId,
    pageSize,
    topicId
  })
  res.send(body)
});


// 活动列表
router.get('/activity', async function (req, res, next) {
  let body = await CommodityFactory.activicy()
  res.send(body)
});


// 活动列表商品
router.get('/activity/list', async function (req, res, next) {
  let {
    pageId,
    pageSize = 10,
    activityId
  } = req.query
  console.log(pageId)
  if (!pageId) {
    res.send(errCode("pageId不可空"))
  }
  if (!activityId) {
    res.send(errCode("activityId不可空"))
  }

  let body = await CommodityFactory.activicyGoodList({
    pageId,
    pageSize,
    activityId
  })
  res.send(body)
});


// 搜索热词
router.get('/top', async function (req, res, next) {
  let body = await CommodityFactory.getCategoryTop100()
  res.send(body)
});


// 跳转
router.get('/jump', async function (req, res, next) {
  let {
    goodsId,
    type = 'info'
  } = req.query
  if (!goodsId) {
    res.send(errCode("goodsId不可空"))
  }
  let body = await CommodityFactory.getLink({
    goodsId
  })
  let result = JSON.parse(body)
  let {
    shortUrl,
    couponClickUrl,
    itemUrl
  } = result.data
  if (type == 'jump') {
    if (shortUrl) {
      res.redirect(301, shortUrl)
      return;
    }
    if (couponClickUrl) {
      res.redirect(301, couponClickUrl)
      return;
    }
    if (itemUrl) {
      res.redirect(301, itemUrl)
      return;
    }
  }
  // res.location(url.couponClickUrl)
  res.send(body)
})


module.exports = router;