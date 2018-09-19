let router = require('koa-router')();
let getRweBody = require('raw-body')
import { msg_auth,get_wx_token, wx_oprate_by_type, get_wx_user_token, get_wx_user_info } from '../lib/weixin'
import { post_format_xml, xml_obj, formatMessage } from '../lib/utils'

router.prefix('/wx');

//获取微信消息
router.get('/msg', async (ctx, next) => {
  let params = ctx.query;
  let auth_res = msg_auth(params);
  ctx.body = auth_res
});

/**
* 
* 获取微信服务器转发的消息
*/
router.post('/msg', async (ctx, next) => {
  let params = ctx.query;
  let auth_res = msg_auth(params);
  if(auth_res == params.echostr){
    let xml = await post_format_xml(ctx);
    let wx_obj = await xml_obj(xml);
    let obj_info = formatMessage(wx_obj.xml);
    console.info(obj_info);
    let result = await get_wx_token();
    let return_xml = wx_oprate_by_type(obj_info);
    ctx.body = return_xml
  }else{
    ctx.body = 'sb 滚啊'
  }
})

/**
 * 用户跳转地址
 */
router.get('/he_live', async (ctx, next) => {
  let params = ctx.query;
  console.info(params);
  let userTokenInfo = await get_wx_user_token(params.code);
  console.info(userTokenInfo);
  let userInfo = await get_wx_user_info(userTokenInfo, params.state);
  ctx.status = 301;
  ctx.body = 'Redirecting to shopping cart';
  ctx.redirect('http://tsml520.cn:5000/');

  ctx.body = "success";
});



module.exports = router
