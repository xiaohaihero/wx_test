
const https = require('https');
const request = require('request');

function httpsPost(host, port, uri, postData, option) {
  //const content = JSON.stringify(postData);
  return new Promise((resolve, reject) => {
    let req = https.request({
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

function httpsPut(host, port, uri, putData) {
  const content = JSON.stringify(putData);
  return new Promise((resolve, reject) => {
    let req = https.request({
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

function httpsGet(host, port, uri, postData) {
  const content = JSON.stringify(postData);
  return new Promise((resolve, reject) => {
    let req = https.request({
      hostname: host,
      port: port,
      method: 'GET',
      path: uri,
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

function httpsOption(options, xml) {
  return new Promise((resolve, reject) => {
    let req = https.request(options, (res) => {
      let rawData = "";
      res.on('data', (data) => {
        rawData += data;
      });
      res.on('end', () => {
        resolve(rawData);
      });
    });
    req.on("error", (e) => {
      reject({
        code: 1111,
        message: e.message
      });
    });
    req.write(xml);
    req.end();
  });
}


function httpsPost2(host, port, uri, postData) {
  const content = JSON.stringify(postData);
  return new Promise((resolve, reject) => {
    let req = https.request({
      hostname: host,
      port: port,
      method: 'POST',
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

function httpsDelete(host, port, uri, deleteData) {
  const content = JSON.stringify(deleteData);
  return new Promise((resolve, reject) => {
    let req = https.request({
      hostname: host,
      port: port,
      method: 'DELETE',
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

async function httpsGetRequest(host, port, uri, data){
  let url = `https://${host}/${uri}`;
  let result = await request({url:url,json:true});
  return result;  
} 

export { httpsPost, httpsGet, httpsPut, httpsOption, httpsPost2, httpsDelete, httpsGetRequest }

