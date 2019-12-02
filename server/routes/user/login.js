var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/login', function(req, res, next) {
//   res.render('user/login',{})
// });

router.use('/login', function(req, res, next) {
    let {username,password} = req.body
    if(username && password){
        res.send({username,password,msg:"登录成功"})
    }
    res.render('user/login',{})
});

module.exports = router;
