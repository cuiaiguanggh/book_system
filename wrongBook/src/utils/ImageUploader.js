import { getQiniuToken } from './fileUpload/qntoken'
import { testPage } from '../services/workService'
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

  async uploadQn (base64) {
    
     getQiniuToken(function(res){
        console.log("ImageUploader -> uploadQn -> ttt", res)
        if(res.data.result===0){
          toUploadQn(res.data.data,base64)
        }
      })
      // this.toUploadQn(ttt.data,base64)
     
      // this.toUploadQn(ttt,base64)
      // getQiniuToken().then((res) => {
      //   console.log('2:获取qiniu token', res)
      //   if (this.isBreak()) return
      //   return this.toUploadQn()
      // }).then((res) => {
      //   console.log('3:上传qiniu的结果', res)
      //   if (this.isBreak()) return
      //   resolve(res)
      // }).catch(res => {
      //   console.error('catch', res)
      //   reject(res)
      //   this.newRespose(-1, res)
      // })

  };



  // uploadQnBack (res) {
  //   res.imageURL = res.imageURL.replace('http:', 'https:')
  //   if (res.imageURL.indexOf('homework.mizholdings.com') > -1) {
  //     res.imageURL += '?imageMogr2/auto-orient'
  //     this.picture.serUrl = res.imageURL
  //     return this.newRespose(0, '', {serUrl: this.picture.serUrl})
  //   } else {
  //     return this.newRespose(-1, '图片返回不合法')
  //   }
  // };
  // uploadKacha (data) {
  //   return new Promise((resolve, reject) => {
  //     const {serUrl, childId, workType} = data
  //     // uploadPageImage2({url: serUrl || this.picture.serUrl, childId: childId, workType: workType}).then(res => {
  //     //   if (!res.data.previewImage) {
  //     //     res.data.previewImage = this.picture.serUrl
  //     //   }
  //     //   console.log('4:识别结果', res)
  //     //   resolve(this.newRespose(1, '', res.data))
  //     // }).catch(error => {
  //     //   reject(this.newRespose(-1, error))
  //     //   console.error('uploadPageImage2 ctach:', error)
  //     // })
  //     let a=testPage()
  //     console.log("ImageUploader -> uploadKacha -> a", a)
  //   })
  // };
  uploadFail (data) {
    console.error(data)
    // ....
  }
}

export {ImageUploader}


function uploadImg(qiniutoken,imgStr) {
  var xhr = new XMLHttpRequest();
  let uploadUrl='https://upload-z2.qiniup.com/putb64/-1/key/'+window.btoa(`kacha/xcx/page/${new Date().getTime()}.jpg`)
  xhr.open("POST", uploadUrl, true);
  //文本类型
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  //七牛认证信息 注意空格
  xhr.setRequestHeader("Authorization", "UpToken " + qiniutoken);
  xhr.send(imgStr);
  //监听状态
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4) {
      var result = xhr.responseText;
      console.log('上传请求结果数据:' + result);
    }
  }

}

function toUploadQn (token,img) {
  console.log("ImageUploader -> toUploadQn -> token", token)
  // return new Promise((resolve, reject) => {
  //   qiniuUploader.upload(
  //     this.picture.url,
  //     (res) => {
  //       resolve(this.uploadQnBack(res))
  //     },
  //     (error) => {
  //       console.log('上传失败:', error)
  //       reject(this.newRespose(-1, error))
  //       this.uploadFail('上传失败')
  //     })
  // })
  // uploadImg(token,img)
  qiniuUploader.upload(img,(res)=>{
  console.log("toUploadQn -> res", res)
  testPage(res.imageURL)
  })
};

export function putb64(picBase,myUptoken) {
  /*picUrl用来存储返回来的url*/
  myUptoken='q_Za3hpOf8elLvd3scwkkC9-_UCm-mKrHcszjPGW:YP06068Mfaq-GtwAmVaTE1xjCTk=:eyJzY29wZSI6ImhvbWV3b3JrIiwiZGVhZGxpbmUiOjE2MDA1ODIzNzV9'
  var picUrl;
  /*把头部的data:image/png;base64,去掉。（注意：base64后面的逗号也去掉）*/
  // picBase = picBase.substring(22);
  /*通过base64编码字符流计算文件流大小函数*/
  function fileSize(str) {
        var fileSize;
        if (str.indexOf('=') > 0) {
              var indexOf = str.indexOf('=');
              str = str.substring(0, indexOf); //把末尾的’=‘号去掉
        }
        fileSize = parseInt(str.length - (str.length / 8) * 2);
        return fileSize;
  }
  /*把字符串转换成json*/
  function strToJson(str) {
        var json = eval('(' + str + ')');
        return json;
  }
  var url = "http://up-z2.qiniup.com/putb64/" + fileSize(picBase)+'/key/'+window.btoa(`kacha/xcx/page/${new Date().getTime()}.jpg`);
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
              var keyText = xhr.responseText;
              /*返回的key是字符串，需要装换成json*/
              keyText = strToJson(keyText);
              /* 前面是七牛云空间网址，keyText.key 是返回的图片文件名，这里得到的picUrl就是我们需要的图片地址了*/
              picUrl = "https://homework.mizholdings.com/" + keyText.key
              testPage(picUrl)
              console.error("xhr.onreadystatechange -> picUrl", picUrl)
              /*调用个人中页面的js来保存头像并刷新页面*/
             
        }
  }
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/octet-stream");
  xhr.setRequestHeader("Authorization", "UpToken "+myUptoken);
  xhr.send(picBase);
}