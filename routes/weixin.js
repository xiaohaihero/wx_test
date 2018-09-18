let router = require('koa-router')();
let getRweBody = require('raw-body')
import { msg_auth,get_wx_token } from '../lib/weixin'
import { post_format_xml, xml_obj } from '../lib/utils'

router.prefix('/wx');

//获取微信消息
router.get('/msg', async (ctx, next) => {
  let params = ctx.query;
  let auth_res = msg_auth(params);
  ctx.body = auth_res
});

/**
* 
* 
*/
router.post('/msg', async (ctx, next) => {
  let params = ctx.query;
  let auth_res = msg_auth(params);
  if(auth_res == params.echostr){
    let xml = await post_format_xml(ctx);
    let obj = await xml_obj(xml);
    console.info(obj);
    let result = await get_wx_token();
    console.info(result);
    ctx.body = 'success'
  }else{
    ctx.body = ''
  }
})


module.exports = router
