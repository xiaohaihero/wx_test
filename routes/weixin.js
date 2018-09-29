let router = require('koa-router')();
let getRweBody = require('raw-body')
import { msg_auth,get_wx_token, wx_oprate_by_type, get_wx_user_token, get_wx_user_info, get_wx_user_info_by_openid } from '../lib/weixin'
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
    //console.info(obj_info);
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
  console.info("进入用户鉴权方法.........................");
  let params = ctx.query;
  console.info(params);
  //let userTokenInfo = await get_wx_user_token(params.code);
  //console.info(userTokenInfo);
  //let userInfo = await get_wx_user_info(userTokenInfo.access_token, userTokenInfo.openid);
  //userInfo = (new Buffer(JSON.stringify(userInfo))).toString('base64');
  //ctx.status = 302;
  //ctx.body = userInfo;
  //ctx.redirect(`http://tsml520.cn:5000?code=success&userInfo=${userInfo}`);
});

/**
* 根据用户id获取用户信息
*/
router.get('/get_wx_user_info_by_openid/:openid', async(ctx, next) => {
  let openid = ctx.params.openid;
  let token_result = await get_wx_token();
  if(!token_result.access_token){
    return ctx.body = token_result;
  }
  let user_info = await get_wx_user_info_by_openid(token_result.access_token, openid);
  ctx.body = user_info
});


module.exports = router
