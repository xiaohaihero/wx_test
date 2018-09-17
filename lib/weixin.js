let config = require('config')
import { sha1 } from './utils'

//微信验证方法
exports.msg_auth = (data) => {
  signature = data.signature
  timestamp = data.timestamp
  nonce = data.nonce
  echostr = data.echostr
  token = config.weixin_info.token
  list = [token, timestamp, nonce]
  list.sort()
  let pwd = sha1(list);
  if(pwd == signature)
    return  echostr
  else 
    return ""
}
