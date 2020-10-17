import {getFileToken} from '../services/workService'
// import { createPartAndDiscover } from '../services/yukeService'
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
      message.error('获取qiniutoken错误')
      return{
        code:-1
      }
    }

    let uploadParams = {
      token : res.data.data,
      key : `kacha/xcx/page/${new Date().getTime()}.jpg`,
      filename : file.name,
      size : file.size,
      file : file
    }
    let qiuniudata=await uploadQiniu.post('/',uploadParams)
    if(qiuniudata.data&&qiuniudata.data.key){
      return {
        code:0,
        img:'https://homework.mizholdings.com/' + qiuniudata.data.key
      }
    }else{
      return{
        code:-1
      }
    }

  }

  // async createPartAndDiscover(redata){
  //   let res1= await createPartAndDiscover(redata)
  //   if(res1.data.result===0){
  //     let _partInfo=res1.data.data.partInfo
  //     _partInfo.serUrl=redata.partUrl
  //     console.log('this part data: ', _partInfo);
  //     return {code:_partInfo.questions&&_partInfo.questions.length?0:2,data:_partInfo}
  //   }else{
  //     message.error('识别失败')
  //     return{code:2}
  //   }
  // }

}

export {ImageUploader}



export function initReposeData (data) {
  console.log('data: ', data);
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
