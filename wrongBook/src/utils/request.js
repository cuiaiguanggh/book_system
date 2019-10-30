import fetch from 'dva/fetch';
var store = require('store');

function parseJSON(response) {
  return response.json();
}

function formatOpt(data) {
  let arr = [];
  if (data) {
    for (let name in data) {
      if (data[name] !== undefined) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
      }
    };
  }
  // 添加一个随机数，防止缓存
  arr.push('_r=' + Math.floor(Math.random() * 10000 + 500));
  return arr.join('&');
}

function checkStatus(response) {
  if (response.status >= 200 && response.status <= 500) {
    // if (response.status >= 200 && response.status < 300) {
    return response;
  }

  // const error = new Error(response.statusText);
  // error.response = response;
  // throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  options = options || {};
  options.method = options.method || 'post';
  options.mode = options.mode || 'cors';
  options.headers = options.headers || { userType: 1, version: 'd1.0.0' };
  options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/x-www-form-urlencoded';
  let data = options.data || {};
  let dataBody;
  let loginSession = store.get('wrongBookToken');

  // if(loginSession !== '' && data.token == undefined  ){
  //     data.token = loginSession;
  // }
  if (loginSession !== '' && data.token == undefined) {
    options.headers.Authorization = loginSession;
  } 
  dataBody = formatOpt(data);
  if (options.body && dataBody) {
    dataBody = options.body + '&' + dataBody;
  }

  if (options.method === 'post') {
    options.body = dataBody;
  } else {
    url = `${url}?${dataBody}`
  }
  if (options.headers['Content-Type'] === 'application/json') {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => console.log('error is', err));
}
