let config = require('config')
import { sha1 } from './utils'

//微信验证方法
exports.msg_auth = (data) => {
  let signature = data.signature
  let timestamp = data.timestamp
  let nonce = data.nonce
  let echostr = data.echostr
  let token = config.weixin_info.token
  let list = [token, timestamp, nonce]
  list.sort()
  let pwd = sha1(list);
  if(pwd == signature)
    return  echostr
  else 
    return ""
}
