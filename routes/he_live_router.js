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
  let type = ctx.request.body.type;
  if(!type){
    type = '1';
  }
  bodyObj.MsgBody.type = type;
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

//获取实景分组结构信息
router.post('/getSceneGroupList', async (ctx, next) => {
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
  bodyObj.MsgBody.contentId = start_num;
  bodyObj.MsgBody.loadSize = rows;
  console.info(bodyObj);
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getSceneGroupList');
  if(typeof(result) == 'string'){
    result = JSON.parse(result);
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  }
})

//获取实景分组结构信息
router.post('/getSceneGroupListWith2', async (ctx, next) => {
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
  bodyObj.MsgBody.contentId = start_num;
  bodyObj.MsgBody.loadSize = rows;
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getSceneGroupListWith2');
  if(typeof(result) == 'string'){
    result = JSON.parse(result);
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  }
})

//获取实景资源列表接口
router.post('/getSceneList', async (ctx, next) => {
  let start_num = ctx.request.body.start_num;
  if(!start_num){
    start_num = '1';
  } 
  let rows = ctx.request.body.rows;
  if(!rows){
    rows = '10';
  }
  let groupId = ctx.request.body.groupId;
  let type = ctx.request.body.type;
  if(!type){
    type = '1';      //1:实景   2.实景热门置顶资源
  }
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.loginName = config.he_info.userName;
  bodyObj.MsgBody.contentId = start_num;
  bodyObj.MsgBody.loadSize = rows;
  if(groupId){
    bodyObj.MsgBody.groupId = groupId;
  }
  bodyObj.MsgBody.type = type;
  console.info(bodyObj);
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getSceneList');
  if(typeof(result) == 'string'){
    result = JSON.parse(result);
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  }
})

//获取实景资源播放URL
router.post('/getScenePlayUrl',async (ctx, next) => {
  let resourceId = ctx.request.body.resourceId;
  if(!resourceId){                                                                                     
   return ctx.body = {                                                                                
     ret:Error.LACK_OF_PARAMS,                                                                        
     msg:'参数resourceId缺失'                                                                         
   }                                                                                                  
  } 
  let urlType = ctx.request.body.urlType;
  if(!urlType){
    urlType = '0';                    // 0:HLS 1:RTSP 2:RTMP
  }
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.resourceId = resourceId; 
  bodyObj.MsgBody.urlType = urlType;
  bodyObj.MsgBody.loginName = config.he_info.userName;
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getScenePlayUrl');
  result = JSON.parse(result);
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  } 
});



//测试
router.get('/test', async (ctx, next) => {
  
  ctx.body = ''
})

//获取评论列表
router.post('/getCommentList', async (ctx, next) => {
  let start_num = ctx.request.body.start_num;
  if(!start_num){
    start_num = '1';
  } 
  let rows = ctx.request.body.rows;
  if(!rows){
    rows = '10';
  }
  let resourceId = ctx.request.body.resourceId;
  if(!resourceId){                                                                                     
   return ctx.body = {                                                                                
     ret:Error.LACK_OF_PARAMS,                                                                        
     msg:'参数resourceId缺失'                                                                         
   }                                                                                                  
  } 
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.loginName = config.he_info.userName;
  bodyObj.MsgBody.contentId = start_num;
  bodyObj.MsgBody.loadSize = rows;
  bodyObj.MsgBody.resourceId = resourceId;
  console.info(bodyObj);
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getCommentList');
  if(typeof(result) == 'string'){
    result = JSON.parse(result);
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  }
})

//发表评论
router.post('/addComment', async (ctx, next) => {
  let resourceId = ctx.request.body.resourceId;
  if(!resourceId){                                                                                     
   return ctx.body = {                                                                                
     ret:Error.LACK_OF_PARAMS,                                                                        
     msg:'参数resourceId缺失'                                                                         
   }                                                                                                  
  } 
  let content = ctx.request.body.content;
  if(!content){
    return ctx.body = {                                                                                
      ret:Error.LACK_OF_PARAMS,                                                                        
      msg:'参数content缺失'                                                                         
    } 
  }
  let openId = ctx.request.body.openId;
  if(!openId){
    return ctx.body = {
      ret:Error.LACK_OF_PARAMS,
      msg:'参数openId缺失'
    }
  }
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.loginName = openId;
  bodyObj.MsgBody.resourceId = resourceId;
  bodyObj.MsgBody.content = content;
  console.info(bodyObj);
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/addComment');
  if(typeof(result) == 'string'){
    result = JSON.parse(result);
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  }
})

//发表点赞
router.post('/addPraise', async (ctx, next) => {
  let contentId = ctx.request.body.contentId;
  if(!contentId){                                                                                     
   return ctx.body = {                                                                                
     ret:Error.LACK_OF_PARAMS,                                                                        
     msg:'参数contentId缺失'                                                                         
   }                                                                                                  
  } 
  let praiseCount = ctx.request.body.praiseCount;
  if(!praiseCount){
    praiseCount = '1';
  }
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.loginName = config.he_info.userName;
  bodyObj.MsgBody.contentId = contentId;
  bodyObj.MsgBody.praiseCount = praiseCount;
  console.info(bodyObj);
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/addPraise');
  if(typeof(result) == 'string'){
    result = JSON.parse(result);
  }
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  }
})

//添加微信用户
router.post('/addWxUser',async (ctx, next) => {
  let code = ctx.request.body.code;
  let userInfo = ctx.request.body.userInfo;
  if(typeof(userInfo) == 'string'){
    userInfo = JSON.parse(userInfo);
  }  
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.phone = userInfo.openid; 
  bodyObj.MsgBody.appKey = code;
  bodyObj.MsgBody.passWord = '123456';
  bodyObj.MsgBody.cusName = userInfo.nickname;
  bodyObj.MsgBody.nickName = userInfo.nickname;
  bodyObj.MsgBody.headUrl = userInfo.headimgurl;
  bodyObj.MsgBody.cusId = userInfo.openid;
  let address = userInfo.country;
  if(userInfo.province){
    address = `${address}·${userInfo.province}`;
  }
  if(userInfo.city){
    address = `${address}·${userInfo.city}`;
  }
  bodyObj.MsgBody.departMent = address;
  bodyObj.MsgBody.loginName = config.he_info.userName;
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/addWxUser');
  result = JSON.parse(result);
  ctx.body = {
    ret:Error.SUCCESS,
    data:result.MsgBody
  } 
});

module.exports = router
