let config = require('config')
import { httpsGet, httpsPosts, httpsGetRequest } from './https_request_promise'
import { sha1 } from './utils'
import { get_text_tmp } from './wx_msg_tmp'

/**
* 定义微信token信息
*/
let wx_token_info = null;
exports.wx_token_info = wx_token_info;

/**
* 微信接口验证方法
*/
exports.msg_auth = (data) => {
  let signature = data.signature
  let timestamp = data.timestamp
  let nonce = data.nonce
  let echostr = data.echostr
  let token = config.weixin_info.token
  let list = [token, timestamp, nonce]
  list.sort()
  let pwd = sha1(list.join(''));
  if(pwd == signature)
    return  echostr
  else 
    return ""
}

/**
* 获取微信token
*/
exports.get_wx_token = async () => {
  let need_check = check_wx_token();
  if(!need_check){
    console.info('token已经存在,并且有效时间大于5分钟，不需要更新,直接返回旧的token信息');
    let return_obj = {
      success:true
    };
    Object.assign(return_obj,wx_token_info);
    return return_obj;
  }
  let grant_type = 'client_credential';
  let appid = config.weixin_info.appID;
  let appSecret = config.weixin_info.appSecret;
  let host = 'api.weixin.qq.com';
  let port = '443';
  let uri = `/cgi-bin/token?grant_type=${grant_type}&appid=${appid}&secret=${appSecret}`;
  let result = await httpsGet(host, port, uri, {});
  result = JSON.parse(result);
  if(result.code == 1111 ){
    result.success = false;
    result;
  }else{
    if(result.errcode != null && result.errcode != 0){
      result.success = false;
      switch(result.errcode){
        case -1:
          result.message = '系统繁忙，此时请开发者稍候再试';
          break;
        case 40001:
          result.message = 'AppSecret错误或者AppSecret不属于这个公众号，请开发者确认AppSecret的正确性';
          break;
        case 40002:
          result.message = '请确保grant_type字段值为client_credential';
          break;
        case 40164:
          result.message = '调用接口的IP地址不在白名单中，请在接口IP白名单中进行设置。'
          break;
      }
    }else{
     result.dateTime = new Date().getTime();
     wx_token_info = result;
     result.success = true;
    }
  }
  return result;
}

/**
* 验证token是否需要更新
*/
function check_wx_token(){
  let need_check = true;
  //如果已经存在token信息并且，有效时间高于5分钟就不用刷新刷新，反之需要刷新
  if(wx_token_info != null){
    //过期的时间
    let eff_time = wx_token_info.dateTime + 1000*wx_token_info.expires_in;
    //当前时间
    let new_time = new Date().getTime();
    if((eff_time > new_time) && ((eff_time - new_time) > (300 * 1000))){
      need_check = false;
    }
  }
  return need_check;
}

export function wx_oprate_by_type(obj_info){
  let obj = {
    toUser:obj_info.FromUserName,
    fromUser:obj_info.ToUserName,
    createTime:new Date().getTime(),
    content:'你好，哈哈哈'
  }
  let xml = get_text_tmp(obj);
  return xml;
}
