module.exports = {
  'SUCCESS':{ 
    code: 0,
    cn:"成功",
    en:"success"
  },
  'GENERAL_ERROR': {
    code:1000,
    cn:"常规错误",
    en:"general error"
  },
  'CONNECT_DB_FAIL': {
    code:1100,
    cn:"数据库连接失败",
    en:"connect db fail"
  },
  //超时
  'TIMEOUT': {
    code:1101,
    cn:"超时",
    en:"timeout"
  },
  //网络错误
  'NETWORK_ERROR': {
    code:1102,
    cn:"网络错误",
    en:"network error"
  },
  'RECORDER_EXIST':{
    code:10009,
    cn:"记录已存在，无法插入",
    en:"recorder exist"
  },
  /*
   * 缺少参数
   */
  'LACK_OF_PARAMS': {
    code:10010,
    cn:"缺少参数",
    en:"lack of params"
  },
  /*
   * 无效的状态，如频道运行中，不能删除频道
   */
  'INVALID_STATUS': {
    code:10011,
    cn:"无效的状态",
    en:"invalid status"
  },
  /*无权限，例如不允许删除系统固有的频道*/
  'NOT_PERMIT': {
    code:10012,
    cn:"缺少权限",
    en:"node permit"
  },
  /** 超出最大值 */
  'GREATER_THAN_MAXIMUM': {
    code:10013,
    cn:"超出最大值",
    en:"greater than maximum"
  },
  'REQUEST_ACCESS_TOKEN_ERROR':{
    code:10014,
    cn:"获取access_token有误",
    en:"request access_token error"
  },
  'REQUEST_JSAPI_TICKET_ERROR':{
    code:10015,
    cn:"获取jsapi_ticket有误",
    en:"request jsapi_ticket error"
  },
}
