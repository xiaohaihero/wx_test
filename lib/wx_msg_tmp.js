
/**
 * 获取文本消息模板
 */
export function get_text_tmp(obj){
  let xml = `<xml><ToUserName><![CDATA[${obj.toUser}]]></ToUserName><FromUserName><![CDATA[${obj.fromUser}]]></FromUserName><CreateTime>${obj.createTime}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${obj.content}]]></Content></xml>`;
  return xml;
}
