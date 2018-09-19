let router = require('koa-router')();
let getRweBody = require('raw-body')
import { msg_auth,get_wx_token, wx_oprate_by_type } from '../lib/weixin'
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


module.exports = router
