
import { getQiniuToken } from './fileUpload/qntoken'
import { testPage,getFileToken } from '../services/workService'
import { message } from 'antd'
const qiniuUploader = require('./fileUpload/qiniuUploader')
class ImageUploader {
  constructor (option) {
    const {picture, pageUrl} = option
    this.picture = picture
    this.res = {
      code: 0, // 0上传java成功  -1:失败  1:上传咔嚓成功
      msg: '操作成功'
    }
    this.pageUrl = pageUrl || ''
  };
  isBreak () {
    // let pages = getCurrentPages()
    // let _bool = pages[pages.length - 1].route !== this.pageUrl
    // if (_bool) { console.error('页面退出跳出进程...') }
    // return _bool
    return false
  };
  newRespose (_code, _msg, _data) {
    this.res = {
      code: _code,
      msg: _msg,
      data: _data
    }
    return this.res
  }



}

export {ImageUploader}

export async function uploadBase64 (picBase,complete){
  let res=await getFileToken()
  console.log('token: ', res);
  if(res.data.result===0){
    putb64(picBase,res.data.data,async (imgurl)=>{
      let res1= await testPage(imgurl)
      if(res1.data.result===0){
        let _data=initReposeData(res1.data.data)
        _data.serUrl=imgurl
        complete({code:0,data:_data})
      }else{
        message.error('识别失败')
        complete({code:1})
      }
    })
  }else{
    message.error('token获取失败')
    complete({code:1})
  }
  
}
function initReposeData (data) {
  let questions = data.questions
  if (questions && questions.length) {
    for (let i = 0; i < questions.length; i++) {
      data.questions[i].area = data.questions[i].areas[0]
    }
  }
  return data
}

export function putb64(picBase,myUptoken,call) {
  var picUrl;
  function fileSize(str) {
        var fileSize;
        if (str.indexOf('=') > 0) {
              var indexOf = str.indexOf('=');
              str = str.substring(0, indexOf); 
        }
        fileSize = parseInt(str.length - (str.length / 8) * 2);
        return fileSize;
  }
  function strToJson(str) {
        var json = eval('(' + str + ')');
        return json;
  }
  var url = "http://up-z2.qiniup.com/putb64/" + fileSize(picBase)+'/key/'+window.btoa(`kacha/xcx/page/${new Date().getTime()}.jpg`);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
              var keyText = xhr.responseText;
              keyText = strToJson(keyText);
              picUrl = "https://homework.mizholdings.com/" + keyText.key
              call(picUrl)
        }
  }
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  xhr.setRequestHeader("Authorization", "UpToken "+myUptoken);
  xhr.send(picBase);
}