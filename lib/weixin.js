let config = require('config')

//微信验证方法
exports.msg_auth = (data) => {
  signature = data.signature
  timestamp = data.timestamp
  nonce = data.nonce
  echostr = data.echostr
  token = config.weixin_info.token
  list = [token, timestamp, nonce]
  list.sort()
  
}
