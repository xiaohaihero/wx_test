const crypto = require('crypto');
const getRawBody = require('raw-body');
let xml2js = require('xml2js')

export function sha1(str) {
	var md5sum = crypto.createHash('sha1');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}

export async function post_format_xml(ctx) {
  ctx.text = await getRawBody(ctx.req, {
    length: ctx.req.headers['content-length'],
    limit: '1mb',
  });
  let b = new Buffer(ctx.text);
  let xml = b.toString('utf-8');
  return xml;
}

export async function xml_obj(xml){
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

