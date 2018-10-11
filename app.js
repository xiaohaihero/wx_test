const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');

//log工具
const logUtil = require('./lib/log_utils');

const weixin = require('./routes/weixin')
const heLiveRouter = require('./routes/he_live_router');
const weixinWeb = require('./routes/weixin_web');

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())


app.use(cors({
  origin: function (ctx) {
    console.log(ctx.url);
    if (ctx.url === '/test') {
    }
    return "*"; // 允许来自所有域名请求
    //return 'http://localhost:8080'; / 这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);

  } catch (error) {
    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
    console.info(error);
  }
});

// routes
app.use(weixin.routes(), weixin.allowedMethods())
app.use(heLiveRouter.routes(), heLiveRouter.allowedMethods());
app.use(weixinWeb.routes(), weixinWeb.allowedMethods());
app.use(async (ctx, next) => {
  if(ctx.request.path == '/MP_verify_akEHrCCGtXbldOXh.txt'){
    ctx.body = 'akEHrCCGtXbldOXh'
  }else{
    await next();
  }
});

module.exports = app
