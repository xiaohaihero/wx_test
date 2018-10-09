import { get_wx_user_token } from '../lib/weixin'
import { get_jsapi_ticket } from '../lib/weixin_web'
import { sha1 } from '../lib/utils';
let router = require('koa-router')();
let Error = require('../lib/error');
let config = require('config')

router.prifix('/wx_web');

/**
 * 获取jsapi_ticket
 */
router.get('/get_jsapi_ticket', async (cxt, next) => {
  //获取access_token
  let access_token_info = await get_wx_user_token();
  if(!access_token_info.success){
    return ctx.body = {
      ret:Error.REQUEST_ACCESS_TOKEN_ERROR,
      msg:access_token_info.message
    }
  }
  let jsapi_ticket = await get_jsapi_ticket();
  if(!jsapi_ticket){
    return ctx.body = {
      ret:Error.REQUEST_JSAPI_TICKET_ERROR,
      msg:'请求获取jsapi_ticket失败'
    }
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:jsapi_ticket
  }
});

/**
 * 获取加密signature
 */
router.post('/get_signature', async (ctx, next) => {
  let jsapi_ticket = ctx.request.body.jsapi_ticket;
  if(!jsapi_ticket){
    return ctx.body = {
      ret:Error.LACK_OF_PARAMS,
      msg:`参数jsapi_ticket缺失`
    }
  }
  let url = ctx.request.url;
  let noncestr = Math.random().toString(36).substring(2); 
  let timestamp = new Date().getTime();
  let str = `jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  let signature = sha1(str);
  ctx.body = {
    ret:SUCCESS,
    data:{
      appId:config.weixin_info.appID,
      timestamp:timestamp,
      nonceStr:noncestr,
      signature:signature
    }
  }
});
