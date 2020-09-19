// created by gpake
(function () {
  var config = {
    qiniuRegion: '',
    qiniuImageURLPrefix: '',
    qiniuUploadToken: '',
    qiniuUploadTokenURL: '',
    qiniuUploadTokenFunction: null
  }

  module.exports = {
    init: init,
    upload: upload
  }

  // 在整个程序生命周期中，只需要 init 一次即可
  // 如果需要变更参数，再调用 init 即可
  function init (options, callback) {
    console.log("init -> options, callback", options, callback)
    config = {
      qiniuRegion: '',
      qiniuImageURLPrefix: '',
      qiniuUploadToken: '',
      qiniuUploadTokenURL: '',
      qiniuUploadTokenFunction: null
    }
    updateConfigWithOptions(options, callback)
  }

  function updateConfigWithOptions (options, callback) {
    if (options.region) {
      config.qiniuRegion = options.region
    } else {
      console.error('qiniu uploader need your bucket region')
    }
    if (options.uptoken) {
      config.qiniuUploadToken = options.uptoken
    } else if (options.uptokenURL) {
      config.qiniuUploadTokenURL = options.uptokenURL
    } else if (options.uptokenFunc) {
      config.qiniuUploadTokenFunction = options.uptokenFunc
    }
    if (options.domain) {
      config.qiniuImageURLPrefix = options.domain
    }
    console.log('qiniu init finish')
    if (callback) callback()
  }
  /**
   * 上传七牛图片
   * @param {*} filePath
   * @param {*} success
   * @param {*} fail
   * @param {*} options
   * 返回 uploadTask
   */
  function upload (filePath, success, fail, up, options) {
    if (filePath == null) {
      console.error('qiniu uploader need filePath to upload')
      return
    }
    if (options) {
      init(options)
    }

    if (config.qiniuUploadToken) {
      return doUpload(filePath, success, fail, up, options)
    } else if (config.qiniuUploadTokenURL) {
      // return getQiniuToken(function () {
      //   doUpload(filePath, success, fail, up, options)
      // })
    } else if (config.qiniuUploadTokenFunction) {
      config.qiniuUploadToken = config.qiniuUploadTokenFunction()
    } else {
      console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]')
      fail('fail')
    }
  }
  function getFileName(){
    return 'kacha/xcx/page/' + new Date().getTime() + '.jpeg'
  }
  function uploadBase64Image(imgStr, success){
    let fileName = getFileName()
    var url = "https://upload-z2.qiniup.com/putb64/-1/key/"+window.btoa(fileName) 
    //var url = "http://up-z2.qiniup.com/putb64/-1/"
    var xhr = new XMLHttpRequest();
    //let uploadUrl='http://up-z2.qiniup.com/putb64/-1/key/'+window.btoa(`kacha/xcx/page/${new Date().getTime()}.jpg`)
    xhr.open("POST", url, true);
    //文本类型
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    //七牛认证信息 注意空格
    xhr.setRequestHeader("Authorization", "UpToken " + config.qiniuUploadToken);
    xhr.send(imgStr);
    //监听状态
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        var res = xhr.responseText;
        console.log('上传请求结果数据:' , res);
        var dataObject = res
        dataObject=JSON.parse(dataObject)
        var imageUrl = config.qiniuImageURLPrefix + dataObject.key
        dataObject.imageURL = imageUrl
        console.log('qiniu respose', dataObject, config.qiniuUploadToken)
        success(dataObject)
      }
    }
    // uni.request({
    //   url: url, //仅为示例，并非真实接口地址。
    //   data: pic,
    //   method: 'post',
    //   header: {
    //     "Content-Type": "application/octet-stream", //自定义请求头信息
    //     "Authorization": "UpToken " + config.qiniuUploadToken
    //   },
    //   success: (res) => {
    //     console.log(res.data);
    //     var dataObject = res.data
    //     var imageUrl = config.qiniuImageURLPrefix + dataObject.key
    //     dataObject.imageURL = imageUrl
    //     console.log('qiniu respose', dataObject, config.qiniuUploadToken)
    //     success(dataObject)
    //   }
    // })
  }


  function doUpload (file, success, fail) {
    uploadBase64Image(file.url, success, fail)
    
  }



  function uploadURLFromRegionCode (code) {
    var uploadURL = null
    switch (code) {
      case 'ECN': uploadURL = 'https://up.qbox.me'; break
      case 'NCN': uploadURL = 'https://up-z1.qbox.me'; break
      case 'SCN': uploadURL = 'https://up-z2.qbox.me'; break
      case 'NA': uploadURL = 'https://up-na0.qbox.me'; break
      default: console.error('please make the region is with one of [ECN, SCN, NCN, NA]')
    }
    return uploadURL
  }
})()
