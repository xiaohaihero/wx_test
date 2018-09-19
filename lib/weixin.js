let config = require('config')
let fs = require('fs');
import { httpsGet, httpsPost2, httpsGetRequest } from './https_request_promise'
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
  if (pwd == signature)
    return echostr
  else
    return ""
}

/**
* 获取微信token
*/
async function get_wx_token() {
  let need_check = check_wx_token();
  if (!need_check) {
    console.info('token已经存在,并且有效时间大于5分钟，不需要更新,直接返回旧的token信息');
    let return_obj = {
      success: true
    };
    Object.assign(return_obj, wx_token_info);
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
  if (result.code == 1111) {
    result.success = false;
    result;
  } else {
    if (result.errcode != null && result.errcode != 0) {
      result.success = false;
      switch (result.errcode) {
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
    } else {
      result.dateTime = new Date().getTime();
      wx_token_info = result;
      result.success = true;
    }
  }
  return result;
}

exports.get_wx_token = get_wx_token

/**
* 验证token是否需要更新
*/
function check_wx_token() {
  let need_check = true;
  //如果已经存在token信息并且，有效时间高于5分钟就不用刷新刷新，反之需要刷新
  if (wx_token_info != null) {
    //过期的时间
    let eff_time = wx_token_info.dateTime + 1000 * wx_token_info.expires_in;
    //当前时间
    let new_time = new Date().getTime();
    if ((eff_time > new_time) && ((eff_time - new_time) > (300 * 1000))) {
      need_check = false;
    }
  }
  return need_check;
}

export function wx_oprate_by_type(obj_info) {
  let obj = {
    toUser: obj_info.FromUserName,
    fromUser: obj_info.ToUserName,
    createTime: new Date().getTime(),
    content: '你好，哈哈哈'
  }
  let xml = get_text_tmp(obj);
  return xml;
}

/**
 * 程序启动的时候去请求创建button
 */
export async function create_btn() {
  let but_json_path = __dirname + config.weixin_info.btn_json_path;
  //配置的文件地址需要存在，并且不能是文件夹
  console.info(but_json_path);
  if (fs.existsSync(but_json_path)) {
    let file_info = fs.statSync(but_json_path);
    console.info(file_info);
    if (!file_info.isDirectory()) {
      let token_result = await get_wx_token();
      if (token_result.success) {
        //获取文件内容，然后根据内容去请求微信服务器创建按钮
        let btn_json = fs.readFileSync(but_json_path);
        let host = 'api.weixin.qq.com';
        let port = '443';
        console.info(token_result.access_token);
        let uri = `/cgi-bin/menu/create?access_token=${token_result.access_token}`;
        let btn_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.weixin_info.appID}&redirect_uri=${encodeURI('http://www.tsml520.cn/wx/he_live')}&response_type=code&scope=snsapi_userinfo&state=params#wechat_redirect`;
        btn_json.replace('${url}', btn_url);
        let result = await httpsPost2(host, port, uri, JSON.parse(btn_json));
        result = JSON.parse(result);
        if (result.code == 1111) {
          console.info('请求微信服务器失败.');
        } else {
          console.info(result);
        }
      }
    }
  }
}
