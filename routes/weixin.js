let router = require('koa-router')();

router.prefix('/wx');

//获取微信消息
router.get('/msg', async (ctx, next) => {
  let params = ctx.query;
  console.info(params);
  ctx.body = "success"
});

module.exports = router