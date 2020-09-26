/*
 * @Author: your name
 * @Date: 2020-09-24 15:18:30
 * @LastEditTime: 2020-09-25 10:16:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \wrongBook\src\utils\ImageUploader.js
 */

import {getFileToken} from '../services/workService'
import { createPartAndDiscover } from '../services/yukeService'
import { message } from 'antd'
import axios from 'axios';
class ImageUploader {
  constructor (option) {
    console.log('option: ', option);
    //-1正在处理  0 识别成功  1上传失败  2 识别失败
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
      let _partInfo=initReposeData(res1.data.data.partInfo)
      console.log('_data222222222222: ', _partInfo);
      _partInfo.serUrl=redata.partUrl
      return {code:_partInfo.questions&&_partInfo.questions.length?0:2,data:_partInfo}
    }else{
      message.error('识别失败')
      return{code:2}
    }
  }

}

export {ImageUploader}



export function initReposeData (data) {
  let questions = data.questions
  if (questions && questions.length) {
    for (let i = 0; i < questions.length; i++) {
      const {areaHeight,
        areaId,
        areaUrl,
        areaWidth,
        pointX,
        pointY,
        qusId} =data.questions[i].areaList[0]
      data.questions[i].area ={
        x:pointX,
        y:pointY,
        height:areaHeight,
        width:areaWidth,
        qusId,
        areaId,
        imgUrl:areaUrl
      }
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
