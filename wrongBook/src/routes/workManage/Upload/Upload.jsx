import style from './Upload.less';
import React, { useState, useEffect } from 'react';
import { Modal, Spin} from 'antd';

export default function Upload(props) {
    const [uploadFinish, setUploadFinish] = useState(false);
    const [discernFail, setDiscernFail] = useState(false);
    useEffect(() => {
        console.log('load')
        setTimeout(() => {
          setUploadFinish(true)
          if(props.index==1){
            setDiscernFail(true)
          }
        }, 100);
        // props.lookPicture(props.picture,props.index)
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

		return (
      <Spin spinning={!uploadFinish} tip="正在识别...">
        <div className={style.uploadin}>
          <div className={style.num}>{props.index+1}</div>
          <img onClick={()=>props.lookPicture(props.picture,props.index)} src={props.picture.serUrl} alt=""/>
          <img className={style.delpng} onClick={()=>deletePictureHander(props.picture,props.index)} src={require('../../images/pdelete.png')} alt=""/>
          {discernFail?<div className={style.fail_box}>识别失败，请手动框题</div>:''}
        </div>
      </Spin>
    )

}
