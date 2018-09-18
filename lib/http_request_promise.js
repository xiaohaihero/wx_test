
const http = require('http');

function httpPost(host, port, uri, postData, option) {
  //const content = JSON.stringify(postData);
  return new Promise((resolve, reject) => {
    let req = http.request({
      hostname: host,
      port: port,
      method: 'POST',
      path: uri,
      agent: false,
      timeout: (option && option.timeout) ? option.timeout : 1500,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      }
    }, (res) => {
      let rawData = ""
      res.on('data', (data) => {
        rawData += data;
      });
      res.on('end', () => {
        resolve(rawData);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });
    req.write(postData);
    req.end();
  });
};

function httpPut(host, port, uri, putData) {
    const content = JSON.stringify(putData);
    return new Promise((resolve, reject) => {
    let req = http.request({
      hostname: host,
      port: port,
      method: 'PUT',
      path: uri,
      agent: false,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content),
      }
    }, (res) => {
      let rawData = ""
      res.on('data', (data) => {
        rawData += data;
      });
      res.on('end', () => {
        resolve(rawData);
      });
    });

    req.on('error', (e) => {
      reject({
        code: 1111,
        message: e.message
      });
    });
    req.write(content);
    req.end();
  });
};

function httpGet(host, port, uri, postData) {
  const content = JSON.stringify(postData);
  return new Promise((resolve, reject) => {
    let req = http.request({
      hostname: host,
      port: port,
      method: 'GET',
      path: uri,
      agent: false,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content),
      }
    }, (res) => {
      let rawData = ""
      res.on('data', (data) => {
        rawData += data;
      });
      res.on('end', () => {
        resolve(rawData);
      });
    });

    req.on('error', (e) => {
      reject({
        code: 1111,
        message: e.message
      });
    });
    req.write(content);
    req.end();
  });
}
