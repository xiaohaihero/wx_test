let router = require('koa-router')();
import { msg_auth } from '../lib/weixin'

router.prefix('/wx');

//获取微信消息
router.get('/msg', async (ctx, next) => {
  let params = ctx.query;
  let auth_res = msg_auth(params);
  ctx.body = {
    ret:0,
    data:auth_res
  }
});

module.exports = router