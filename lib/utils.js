const crypto = require('crypto');
const getRawBody = require('raw-body');
let xml2js = require('xml2js')

/**
 * sha1加密
 * @param {*} str 需要加密的字符串 
 */
export function sha1(str) {
  var md5sum = crypto.createHash('sha1');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}


/**
 * 获取request的原生数据，xml
 * @param {*} ctx 
 */
export async function post_format_xml(ctx) {
  ctx.text = await getRawBody(ctx.req, {
    length: ctx.req.headers['content-length'],
    limit: '1mb',
  });
  let b = new Buffer(ctx.text);
  let xml = b.toString('utf-8');
  return xml;
}

/**
 * xml转换成obj
 * @param {*} xml 需要转换的xml 
 */
export async function xml_obj(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {
      trim: true
    }, (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  });
}

/**
 * 把微信xml转换成的obj对象转换成我们常用的obj对象
 */
export function formatMessage(result) {
  var data = {}
  if (typeof result == 'object') {
    let keys = Object.keys(result)
    for (var i = 0; i < keys.length; i++) {
      var item = result[keys[i]]
      var key = keys[i]
      if (item.length == 0 || !(item instanceof Array)) {
        continue
      } else if (item.length == 1) {
        var val = item[0]
        if (typeof val === 'object') {
          data[key] = formatMessage(val)
        } else {
          data[key] = (val || '').trim()
        }
      }
      else {
        data[key] = []
        for (var j = 0, k = item.length; j < k; j++) {
          data[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return data;
}

