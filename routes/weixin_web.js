import { get_wx_token } from '../lib/weixin'
import { get_jsapi_ticket } from '../lib/weixin_web'
import { sha1 } from '../lib/utils';
let router = require('koa-router')();
let Error = require('../lib/error');
let config = require('config')

router.prefix('/wx_web');

/**
 * 获取jsapi_ticket
 */
// router.get('/get_jsapi_ticket', async (cxt, next) => {
//   //获取access_token
//   let access_token_info = await get_wx_user_token();
//   if(!access_token_info.success){
//     return ctx.body = {
//       ret:Error.REQUEST_ACCESS_TOKEN_ERROR,
//       msg:access_token_info.message
//     }
//   }
//   let jsapi_ticket = await get_jsapi_ticket();
//   if(!jsapi_ticket){
//     return ctx.body = {
//       ret:Error.REQUEST_JSAPI_TICKET_ERROR,
//       msg:'请求获取jsapi_ticket失败'
//     }
//   }
//   ctx.body = {
//     ret:Error.SUCCESS,
//     data:jsapi_ticket
//   }
// });

/**
 * 获取加密signature
 */
router.get('/get_signature', async (ctx, next) => {
  //获取access_token
  let access_token_info = await get_wx_token();
  if(!access_token_info.success){
    return ctx.body = {
      ret:Error.REQUEST_ACCESS_TOKEN_ERROR,
      msg:access_token_info.message
    }
  }
  let jsapi_ticket = await get_jsapi_ticket(access_token_info.access_token);
  console.info(jsapi_ticket);
  if(!jsapi_ticket){
    return ctx.body = {
      ret:Error.REQUEST_JSAPI_TICKET_ERROR,
      msg:'请求获取jsapi_ticket失败'
    }
  }
  let _url = ctx.href;
  let index = _url.indexOf('url=')
  let url = _url.slice(index+4)
  console.info(url);
  let noncestr = Math.random().toString(36).substring(2);
  console.info(noncestr); 
  let timestamp = parseInt((new Date().getTime())/1000)+'';
  console.info(timestamp);
  let str = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  let signature = sha1(str);
  console.info(signature);
  ctx.body = {
    ret:Error.SUCCESS,
      appId:config.weixin_info.appID,
      timestamp:timestamp,
      noncestr:noncestr,
      signature:signature
    
  }
});

module.exports = router
