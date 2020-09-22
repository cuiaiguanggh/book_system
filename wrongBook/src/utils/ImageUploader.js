
import {getFileToken} from '../services/workService'
import { createPartAndDiscover } from '../services/yukeService'
import { message } from 'antd'
import axios from 'axios';
class ImageUploader {
  constructor (option) {
    console.log('option: ', option);
    
  };
  
  async uploadToQiniu(file){
    let res=await getFileToken()//获取token
    if(res.data.result!=0){
      message.destroy()
      return message.error('获取qiniutoken错误')
    }

    let uploadParams = {
      token : res.data.data,
      key : `kacha/xcx/page/${new Date().getTime()}.jpg`,
      filename : file.name,
      size : file.size,
      file : file
    }
    let qiuniudata=await uploadQiniu.post('/',uploadParams)
    return 'https://homework.mizholdings.com/' + qiuniudata.data.key
  }

  async createPartAndDiscover(redata){
    let res1= await createPartAndDiscover(redata)
    if(res1.data.result===0){
      let _data=initReposeData(res1.data.data)
      _data.serUrl=redata.partUrl
      return {code:_data.questions?0:2,data:_data}
    }else{
      message.error('识别失败')
      return{code:-2}
    }
  }

}

export {ImageUploader}



function initReposeData (data) {
  let questions = data.questions
  if (questions && questions.length) {
    for (let i = 0; i < questions.length; i++) {
      data.questions[i].area = data.questions[i].areas[0]
    }
  }
  return data
}





export const uploadQiniu = axios.create({
  baseURL: 'https://upload-z2.qiniup.com',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
  },
  transformRequest: (body) => {
    const data = new FormData()
    data.append('token', body.token)
    data.append('key', body.key)
    data.append('x:filename', body.filename)
    data.append('x:size', body.size)
    data.append('file', body.file)
    return data
  }
})