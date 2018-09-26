let config = require('config')
let crypto = require('crypto')
let request = require('request')

class he_api {
  constructor(userName, pwd, activityId) {
    this.userInfo = {
      userName: userName,
      pwd: pwd,
      activityId: activityId
    }

    this.AuthInfo = {
      nonce: null,
      statusCode: null
    }

    // /** HTTP请L求消息头 HOST_KEY */
    this.REQUEST_HEADER_HOST_KEY = "Host";

    // /** HTTP请求消息头 USER_AGENT_KEY */
    this.REQUEST_HEADER_USER_AGENT_KEY = "User-Agent";

    // /** HTTP请求消息头 DATE_KEY */
    this.REQUEST_HEADER_DATE_KEY = "Date";

    // /** HTTP请求消息头 CONNECTION_KEY */
    this.REQUEST_HEADER_CONNECTION_KEY = "Connection";

    // /** HTTP请求消息头 CONTENT_TYPE_KEY */
    this.REQUEST_HEADER_CONTENT_TYPE_KEY = "Content-Type";

    // /** HTTP请求消息头 AUTHORIZATION_KEY */
    this.REQUEST_HEADER_AUTHORIZATION_KEY = "Authorization";

    // /** 到WSU鉴权时默认的nonce值 */
    this.DEFAULT_NONCE = config.he_info.default_nonce;

    // /** Digest认证的指定客户端对该消息应用的保护等级 */
    this.AUTHORIZATION_QOP_VALUE = "auth";

    // /**
    //  * NC计数参数 到WSU鉴权时默认的nc值 M xsd:string
    //  * 客户端请求的十六进制计数，以00000001开始，每次请求加1，目的是防止重放攻击。*
    //  */
    // /** 客户端nonce值 到WSU鉴权时默认的cnonce值 客户端用来鉴定服务器的摘要质询参数，本版本暂不实现客户端对服务器的认证* */
    this.DEFAULT_NC = "00000001";
    this.DEFAULT_CNONCE = "00000001";

    // /** 到WSU鉴权时默认的opaque值: 会话标识 由服务器指定，客户端须在请求二中返回该数据。采用十六进制数据 */
    this.DEFAULT_OPAQUE = "5ccc069c403ebaf9f0171e9517f40e41";

    // /** HTTP请求消息头 平台响应为401时的AUTHORIZATION_KEY */
    this.REQUEST_HEADER_AUTHORIZATION_KEY_RESP_401 = "WWW-Authenticate";
  }

  /**
   * 获取要请求options对象
   * bodyStr body里的数据
   * userinfo 用户信息
   * nonce 鉴权的nonce值
   * url 
   */
  getPostOptions(bodyStr, userInfo, nonce, url) {
    let username = userInfo.userName;
    let passWord = "";
    let realm = "";
    if ("anonymous" == username) {
      passWord = "andLive_visitor";
    } else {
      passWord = userInfo.pwd;
    }
    let strObj = `${nonce}${username}${passWord}POST${url}`
    var md5 = crypto.createHash("md5");
    md5.update(strObj);
    let md5String = md5.digest('hex');
    let authorization = `Digest username=${username},realm=${realm},nonce=${nonce},uri=${url},response=${md5String},cnonce=${this.DEFAULT_CNONCE},opaque=${this.DEFAULT_OPAQUE},qop=${this.AUTHORIZATION_QOP_VALUE},nc=${this.DEFAULT_NC}`
    let options = {
      url: url,
      method: "POST",
      headers: {
        "Host": url.split('/')[2],
        "User-Agent": 'Huawei SGW/V100R002C20',
        "Date": new Date().toGMTString(),
        "Connection": 'close',
        "Content-Type": 'application/json;charset=utf-8',
        "Authorization": authorization
      },
      body: bodyStr
    }
    return options;
  }

  /**
   * 统一请求方法
   */
  httpRequest(options) {
    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        let result;
        if (err) {
          result = {
            success: false,
            error: err
          }
        } else {
          result = {
            success: true,
            response: response,
            body: body
          }
        }
        resolve(result)
      })
    });
  }

  /**
   * 获取请求body的公共对象
   */

  getBodyObj() {
    let body = {
      "MsgBody": {
        "cuType": "WEB",
        "cuVersion": "1.0.1",
        "cuVersionDesc": "V1.0",
        "systemVersion": "string",
        "urlType": "0",
        "userLan": "zh",
        "activityId":config.he_info.activityId
      },
      "MsgHead": {
        "direction": "request",
        "msgType": "string",
        "version": "1.0"
      }
    }
    return body;
  }

  /**
   * 鉴权方法
   */
  async authentication(bodyObj, userInfo, nonce, url) {
    let bodyStr = JSON.stringify(bodyObj);
    let options = this.getPostOptions(bodyStr, userInfo, nonce, url);
    let result = await this.httpRequest(options);
    return result;
  }

  /**
   * 总的请求方法
   */
  async sendMsgToBpc(bodyObj, userInfo, nonce, url) {
    //对密码进行加密
    let pwd = userInfo.pwd;
    pwd = this.encryption(pwd, config.he_info.key);
    pwd = this.he_encryption(pwd).toUpperCase();
    userInfo.pwd = pwd;
    if(userInfo.userName == 'anonymous'){
      userInfo.pwd = 'andLive_visitor'
    }
    let authResult = await this.authentication(bodyObj, userInfo, nonce, url);
    if (authResult.response.statusCode == 401) {
      nonce = this.getNonce(authResult.response);
      let result = await this.authentication(bodyObj, userInfo, nonce, url);
      if(result.response.statusCode == 200){
        result = result.body;
      }
      return result;
    } else {
      return authResult;
    }
  }

  /**
   * 根据字符串截取到里面的noce值
   */
  getNonce(response) {
    let authenticate = response.headers['www-authenticate'];
    var reg = /[,=]/;
    var res = authenticate.split(reg);
    var nonce = ""
    for (var i = 0; i < res.length; i++) {
      if (res[i].toString() == "nonce") {
        nonce = res[i + 1];
        break;
      }
    }
    return nonce;
  }

  /**
   * AES 加密
   * @param {*} data 
   * @param {*} key 
   */
  encryption(data, key) {
    let skey = this.getkey(key);
    let iv = "";
    let clearEncoding = 'utf8';
    let cipherEncoding = 'hex';
    let cipherChunks = [];
    let buf = Buffer(this.oneZeroPadding(data));
    let cipher = crypto.createCipheriv('aes-128-ecb', skey, iv);
    cipher.setAutoPadding(false);
    cipherChunks.push(cipher.update(buf, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
  }

  /**
   * 矫正Key
   * @param {*} key 
   */
  getkey(key) {
    let tempkey;
    if (key.length >= 16) {
      tempkey = key.substr(key.length - 16, key.length);
    } else {
      tempkey = key;
      for (var i = 0; i < 16 - key.length; i++)
        tempkey = `0${tempkey}`;
    }
    return tempkey
  };

  /**
   * 进行0 填充
   * @param {*} data 
   */
  oneZeroPadding(data) {
    let buf = Buffer.from(data, 'ascii');
    let iFinalLen = parseInt((buf.length / 16 + 1)) * 16;
    let iPadLen = (buf.length % 16 == 0) ? 0 : (iFinalLen - buf.length);
    if (iPadLen != 0) {
      let dstText = new Buffer(iFinalLen);
      for (let i = 0; i < buf.length; i++) {
        dstText[i] = buf[i];
      }
      dstText[buf.length] = 0x80;
      for (let k = buf.length + 1; k < iFinalLen; k++) {
        dstText[k] = 0x00;
      }
      return dstText;
    } else {
      return buf;
    }
  };

  /**
   * 把16进制数据转换成和直播那边对应的加密格式
   * @param {*} str 
   */
  he_encryption(str) {
    let pos = 0;
    let len = str.length;
    if (len % 2 != 0) {
      return null;
    }
    len /= 2;
    let hexA = new Array();
    for (let i = 0; i < len; i++) {
      let s = str.substr(pos, 2);
      let dec = parseInt(s, 16);
      let v = (dec & 15) + 65;
      let v2 = ((dec >> 4) & 15) + 65;
      hexA.push(v);
      hexA.push(v2);
      pos += 2;

    }
    return String.fromCharCode.apply(0, hexA);
  }


}

module.exports = he_api

// let api = new he_api(config.he_info.userName, config.he_info.pwd, config.he_info.activityId);
// console.info(api.userInfo.pwd);
// let pwd = api.encryption(api.userInfo.pwd, '00000000');
// console.info(pwd);
// console.info(api.he_encryption(pwd));