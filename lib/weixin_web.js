import { get_wx_user_token } from './weixin'
import { httpsGet, httpsPost2 } from './https_request_promise'
let Error = require('./error');

/**
 * 获取jsapi_ticket
 */

let jsapi_ticket_info = null;

export async function get_jsapi_ticket(access_token){
  let need_check = check_jsapi_ticket();
  if(!need_check){
    return jsapi_ticket_info.ticket;
  }
  let host = 'api.weixin.qq.com';
  let port = '443';
  let uri = `/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;
  let result = await httpsGet(host, port, uri, {});
  result = JSON.parse(result);
  if(typeof(result) == 'string'){
    result = JSON.parse(result);
  }
  if(result.code == 1111){
    return null;
  }
  result.dateTime = new Date().getTime();
  jsapi_ticket_info = result;
  return jsapi_ticket_info.expires_in;
}

/**
* 验证token是否需要更新
*/
function check_jsapi_ticket() {
  let need_check = true;
  //如果已经存在jsapi_ticket信息并且，有效时间高于5分钟就不用刷新刷新，反之需要刷新
  if (jsapi_ticket_info != null) {
    //过期的时间
    let eff_time = jsapi_ticket_info.dateTime + 1000 * jsapi_ticket_info.expires_in;
    //当前时间
    let new_time = new Date().getTime();
    if ((eff_time > new_time) && ((eff_time - new_time) > (300 * 1000))) {
      need_check = false;
    }
  }
  return need_check;
}



export { jsapi_ticket_info }