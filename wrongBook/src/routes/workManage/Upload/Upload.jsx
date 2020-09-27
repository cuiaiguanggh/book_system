import style from './Upload.less';
import React from 'react';
import {ImageUploader,putb64,uploadBase64} from '../../../utils/ImageUploader'
import { message, Modal, Spin} from 'antd';



class Upload1 extends React.Component {
  constructor(props) {
	super(props);
    this.state = {
  
    }
  }
  
  deletePictureHander(p,index){
    Modal.confirm({
      title: '提示',
      content: '删除之后无法恢复，确定要删除该图片吗',
      okText: '确认',
      cancelText: '取消',
      okType:'danger',
      onOk:(e)=>{
        Modal.destroyAll()
        this.props.deletePictureHander(p,index)
      }
    })
  }
  uploadImage(){
    console.log('workPages: ', this.props.picture);
    let imgStr=this.props.picture.url.substring(this.props.picture.url.indexOf(',/')+1)
    uploadBase64(imgStr,(res)=>{
      console.log('upload res: ', res.data);
      if(res.code===0){
        this.props.uploadFinish(
          res.data,
          this.props.index
        )
        if(res.data.questions){
          // setDiscernFail(true)
        }else{
          // setDiscernFail(false)
        }
      }else{

      }
      // setUploadFinish(true)
    })
  }


  render() {
    {console.log('...')}
		return(
      <Spin spinning={this.props.picture.resCode<0} tip="正在识别...">
      <div className={style.uploadin}>
        <div className={style.num}>{this.props.index+1}</div>
        <img onClick={()=>{
          if(this.props.picture.resCode==1){
            return message.warn('上传失败的图片无法手动框题目')
          }
          this.props.lookPicture(this.props.index)
          }} 
        src={this.props.picture.url||this.props.picture.partUrl} alt=""/>
        <img className={style.delpng} onClick={()=>this.deletePictureHander(this.props.picture,this.props.index)} src={require('../../images/pdelete.png')} alt=""/>
        {this.props.picture.resCode==2?<div className={style.fail_box}>识别失败，请手动框题</div>:''}
        {this.props.picture.resCode==1?<div className={style.fail_box}>上传失败</div>:''}
      </div>
    </Spin>
    )
  }

  componentDidMount() {

		
  }

  componentWillUnmount() {
  }



}

export default Upload1