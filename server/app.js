var createError = require('http-errors');//报错
var express = require('express');//express框架
var path = require('path');//node模块


var cookieParser = require('cookie-parser');//cookie中间件
var logger = require('morgan');//日志
var bodyParser = require('body-parser')//request body中间件
// var log = require('npmlogger');
var indexRouter = require('./routes/index'); //index路由
var apiRouter = require('./routes/api'); //api路由
var articleRouter  = require('./routes/article') //文章路由
var loginRouter = require('./routes/user/login') //用户登陆
var app = express();

// 模版引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded  
app.use(bodyParser.urlencoded({ extended: false }))    

// parse application/json  
app.use(bodyParser.json())

app.use(logger('dev'));
// JSON
app.use(express.json());
// urlencoded
app.use(express.urlencoded({ extended: false }));
// cookie
app.use(cookieParser());

// 挂载静态文件
app.use('/static',express.static(path.join(__dirname, 'public')));
// 挂载路由
app.use('/', indexRouter);

app.use('/api',(req,res,next)=>{
  console.log('=============>>>>>>>>>>>');
  console.log('==err==||AppBase 登录检测或一些其他的内容');
  console.log('=============>>>>>>>>>>>');
  if(true){
    res.redirect('/login/login')
    res.send('')
    return;
  }
  next();//执行下一步  api的路由文件
})
app.use('/api', apiRouter);
app.use('/article',articleRouter)
app.use('/login',loginRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
console.log('app running on http://127.0.0.1:3000')
// log.info('heloo lady!')
module.exports = app;
