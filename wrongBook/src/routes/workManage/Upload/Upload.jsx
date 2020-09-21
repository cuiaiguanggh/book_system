import style from './Upload.less';
import React, { useState, useEffect } from 'react';
import {ImageUploader,putb64,uploadBase64} from '../../../utils/ImageUploader'
import { message, Modal, Spin} from 'antd';

export default function Upload1(props) {
    const [uploadFinish, setUploadFinish] = useState(false);
    const [discernFail, setDiscernFail] = useState(false);
    useEffect(() => {
        console.log('upload load')
        setTimeout(() => {
          // setUploadFinish(true)
          // if(props.index==1){
          //   setDiscernFail(true)
          // }
          //props.lookPicture(props.picture,props.index)
        }, 100);
        // props.lookPicture(props.picture,props.index)
        // uploadImage()
        
    },[]);

		function deletePictureHander(p,index){
      Modal.confirm({
        title: '提示',
        content: '确定要删除该图片吗',
        okText: '确认',
        cancelText: '取消',
        onOk(e){
          Modal.destroyAll()
          props.deletePictureHander(p,index)
        }
      })
    }
    function uploadImage(){
      console.log('workPages: ', props.picture);
			let imgStr=props.picture.url.substring(props.picture.url.indexOf(',/')+1)
			uploadBase64(imgStr,(res)=>{
				console.log('upload res: ', res.data);
				if(res.code===0){
          props.uploadFinish(
            res.data,
            props.index
          )
          if(res.data.questions){
            setDiscernFail(true)
          }else{
            setDiscernFail(false)
          }
        }else{

        }
        setUploadFinish(true)
			})
    }

		return (
      <Spin spinning={props.picture.resCode<0} tip="正在识别...">
        <div className={style.uploadin}>
          <div className={style.num}>{props.index+1}</div>
          <img onClick={()=>{
            if(props.picture.resCode==1){
              return message.warn('上传失败的图片无法手动框题目')
            }
            props.lookPicture(props.picture,props.index)
            }} 
          src={props.picture.url} alt=""/>
          <img className={style.delpng} onClick={()=>deletePictureHander(props.picture,props.index)} src={require('../../images/pdelete.png')} alt=""/>
          {props.picture.resCode==-2?<div className={style.fail_box}>识别失败，请手动框题</div>:''}
          {props.picture.resCode==1?<div className={style.fail_box}>上传失败</div>:''}
        </div>
      </Spin>
    )

}
