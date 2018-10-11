const router = require('koa-router')();
let logUtil = require('../lib/log_utils');
let he_api = require('../lib/he_api');
let Error = require('../lib/error');
const config = require('config')

router.prefix('/he_live')

let api = new he_api(config.he_info.userName, config.he_info.pwd, config.he_info.activityId);

//获取活动列表
router.post('/getActivityList', async (ctx, next) => {
  let start_num = ctx.request.body.start_num;
  if(!start_num){
    start_num = '1';
  } 
  let rows = ctx.request.body.rows;
  if(!rows){
    rows = '10';
  }
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.loginName = config.he_info.userName;
  bodyObj.MsgBody.type = '2';
  bodyObj.MsgBody.contentId = start_num;
  bodyObj.MsgBody.loadSize = rows;
  //bodyObj.MsgBody.contentId = '0';
  console.info(bodyObj);
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getActivityList');
  if(typeof(result) == 'string'){
    result = JSON.parse(result);
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  }
})

//获取活动详情
router.post('/getActivityDetail', async (ctx, next) => {
  let activityId = ctx.request.body.activityId;
  if(!activityId){
    return ctx.body = {
      ret:Error.LACK_OF_PARAMS,
      msg:'参数activityId缺失'
    }
  }
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.loginName = config.he_info.userName;
  bodyObj.MsgBody.activityId = activityId;
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getActivityDetail');
  if(typeof(result) == 'string'){
    result = JSON.parse(result)
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  }
})

//获取活动播放地址
router.post('/getActivityPlayUrl',async (ctx, next) => {
  let activityId = ctx.request.body.activityId;
  if(!activityId){                                                                                     
   return ctx.body = {                                                                                
     ret:Error.LACK_OF_PARAMS,                                                                        
     msg:'参数activityId缺失'                                                                         
   }                                                                                                  
  } 
  let urlType = ctx.request.body.urlType;
  if(!urlType){
    urlType = '0';
  }
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.activityId = activityId; 
  bodyObj.MsgBody.urlType = urlType;
  bodyObj.MsgBody.loginName = config.he_info.userName;
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getActivityPlayUrl');
  result = JSON.parse(result);
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  } 
});

//测试
router.get('/test', async (ctx, next) => {
  request_obj.MsgBody.contentId = ''
  request_obj.MsgBody.loadSize = '0'
  request_obj.MsgBody.type = 2
  let api = new he_api();
  let result = await new Promise((resolve, reject) => {
    api.sendMsgToBpc(api.userInfo.userName, api.userInfo.pwd, 'http://access.hezhibo.com:8008/bpc/api/app/getActivityList',api.userInfo.activityId, JSON.stringify(request_obj), function (err, data, body){
      if(err){
        resolve({
          ret:'error',
          err:err
        });
      }
      resolve(body)
    })
  });
  ctx.body = result
})

//获取评论列表
router.post('/getCommentList', async (ctx, next) => {
  request_obj.MsgBody.userId = '00000000000000000000000000000000';
  let api = new he_api(config.he_info.userName, config.he_info.pwd, config.he_info.activityId);
  api.sendMsgToBpc(api.userInfo.userName, api.userInfo.pwd, 'http://access.hezhibo.com:8008/bpc/api/app/getCommentList',api.userInfo.activityId, JSON.stringify(request_obj), function (err, data, body){
    if(err){
      ctx.body = {
        ret:'error',
        err:err
      }  
      console.info(error);
    }
    ctx.body = {body}
    console.info(body);
  })
})


module.exports = router
