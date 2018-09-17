const router = require('koa-router')()

router.prefix('/wx_test');

//测试
router.get('/test', async (ctx, next) => {
  ctx.body = {
    ret:0,
    msg:"success"
  }
});


module.exports = router