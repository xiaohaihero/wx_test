let config = require('config');

//日志根目录
var baseLogPath = config.log_dir +'/wx_test';

//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// var errorLogPath = path.resolve(__dirname, "../logs/error/error");
 

//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// var responseLogPath = path.resolve(__dirname, "../logs/response/response");

//info日志目录
var infoPath = "/info";
//info日志文件名
var infoFileName = "info";
//响应日志输出完整路径
var infoLogPath = baseLogPath + infoPath + "/" + infoFileName;
// var responseLogPath = path.resolve(__dirname, "../logs/response/response");

module.exports = {
    "appenders":{
      "errorLogger":{
        "type": "dateFile",                   //日志类型
        "filename": errorLogPath,             //日志输出位置
        "alwaysIncludePattern":true,          //是否总是有后缀名
        "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
        "path": errorPath,                     //自定义属性，错误日志的根目录        
      },
      "resLogger":{
        "type": "dateFile",
        "filename": responseLogPath,
        "alwaysIncludePattern":true,
        "pattern": "-yyyy-MM-dd-hh.log",
        "path": responsePath,
      },
      "info":{
        "type": "dateFile",
        "filename": infoLogPath,
        "alwaysIncludePattern":true,
        "pattern": "-yyyy-MM-dd-hh.log",
        "path": infoPath,
      }
    },
    categories: { 
      default: { appenders: ['errorLogger'], level: 'error' },
      errorLogger : { appenders: ['errorLogger'], level: 'error' },
      resLogger : { appenders: ['errorLogger'], level: 'all' },
      info : { appenders: ['info'], level: 'all' },
    },
    "baseLogPath": baseLogPath                  //logs根目录
}
