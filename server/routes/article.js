var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/detail/:id', function(req, res, next) {
//   console.log(req.params['id'])
  res.send({
    time: new Date(),
    code: -1,
    msg: '「 '+req.params['id']+' 」文章不存在,Nice!',
    data: {}
  })
});


module.exports = router;
