/*
 * @Author: your name
 * @Date: 2020-09-03 14:32:40
 * @LastEditTime: 2020-09-29 13:43:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\utils\requestYk.js
 */
import fetch from 'dva/fetch';

function parseJSON(response, options, dataBody) {
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
    return response;
  }

}


export default function requestYk(url, options) {
  options = options || {};
  options.method = options.method || 'post';
  options.headers={}
  options.headers['Content-Type'] =  'application/json';
  let data = options.data || {}
  if (options.method === 'post') {
    options.body = JSON.stringify(data);
  } else {
    url = `${url}?${formatOpt(data)}`;
  }

  return fetch(url, options)
    .then(checkStatus)
    .then(res => parseJSON(res, options))
    .then(data => ({ data }))
    .catch(err => console.log('error is', err))
}
