const router = require('koa-router')();
let logUtil = require('../lib/log_utils');
let he_api = require('../lib/he_api');
const config = require('config')

router.prefix('/he_live')

let request_obj = {
	"MsgBody": {
		"activityId": config.he_info.activityId,
		"cuType": "WEB",
		"cuVersion": "1.0.1",
		"cuVersionDesc": "V1.0",
		"loginName": config.he_info.userName,
		"systemVersion": "string",
		"urlType": "0",
		"userLan": "zh"
	},
	"MsgHead": {
		"direction": "request",
		"msgType": "string",
		"version": "1.0"
	}
}

//获取活动列表
router.get('/getActivityList', async (ctx, next) => {
  let api = new he_api(config.he_info.userName, config.he_info.pwd, config.he_info.activityId);
  let bodyObj = api.getBodyObj();
  bodyObj.MsgBody.loginName = config.he_info.userName;
  bodyObj.MsgBody.type = '2';
  bodyObj.MsgBody.contentId = '';
  let result = await api.sendMsgToBpc(bodyObj, api.userInfo, config.he_info.default_nonce, 'http://access.hezhibo.com:8008/bpc/api/app/getActivityList');
  ctx.body = {
    ret:0,
    result
  }
})





//

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
router.get('/getCommentList', async (ctx, next) => {
  request_obj.MsgBody.userId = '00000000000000000000000000000000';
  let api = new he_api();
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