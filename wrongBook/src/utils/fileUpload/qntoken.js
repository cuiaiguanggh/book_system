 import {getFileToken} from '../../services/workService'
// let options = {
//   region: 'SCN', // 华南区
//   // uptokenURL: 'https://yourserver.com/api/uptoken',
//   uptoken: '',
//   domain: 'http://homework.mizholdings.com/'
// }
// export async function getQiniuToken (call) {
//   let res=await getFileToken()
//   console.error("getQiniuToken -> res", res)
//   return res

// }
const qiniuUploader = require('../fileUpload/qiniuUploader')
let options = {
  region: 'SCN', // 华南区
  // uptokenURL: 'https://yourserver.com/api/uptoken',
  uptoken: '',
  domain: 'http://homework.mizholdings.com/'
}
export async function getQiniuToken (resolve) {
  let res=await getFileToken()
  console.error("getQiniuToken -> res", res)
  if (res.data.result === 0) {
    options.uptoken = res.data.data
    qiniuUploader.init(options, function () {
      console.error("getQiniuToken -> res", 111)
      resolve(res)
    })
  } 
  // return new Promise((resolve, reject) => {
  //   getFileToken().then(res => {
  //     if (res.result === 0) {
  //       options.uptoken = res.data
  //       qiniuUploader.init(options, function () {
  //         resolve(res)
  //       })
  //     } else {
  //       reject(res)
  //     }
  //   }).catch(res => {
  //     console.error('qntoken失败', res)
  //     reject(res)
  //   })
  // })
}