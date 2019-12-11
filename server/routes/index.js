var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req)
  res.render('index', { title: 'Express' ,中文:"打火机卡上打哈电话接啊活动空间啊"});
});

// [].filter(Boolean)
module.exports = router;
