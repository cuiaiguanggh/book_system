import React from 'react';
import {
  Layout, Modal,Spin , Button, message,DatePicker, Select, Popover, Icon, Checkbox,Empty,Input
} from 'antd';

import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './Upload.less';
import moment from 'moment';
// import { dataCenter } from '../../../config/dataCenter'
import store from 'store';

import * as XLSX from 'xlsx';
import observer from '../../../utils/observer'
const { RangePicker } = DatePicker;

//作业中心界面内容
const Option = Select.Option;
const { Sider, Content,
} = Layout;

class Upload extends React.Component {
  constructor(props) {
      super(props);
      this.state={
        uploadFinish:false
      }
    }

  
    lookPicture(p,index){
      this.props.getFun(p,index)
    }



    
    render() {
      return (
      <>
        <Spin spinning={false&&!this.state.uploadFinish}>
          <div className={style.uploadin}>
            <div className={style.num}>{this.props.index+1}</div>
            <img onClick={()=>this.lookPicture(this.props.picture,this.props.index)} src={this.props.picture.serUrl} alt=""/>
          </div>
        </Spin>
        
      </>
    )
  }

  componentDidMount() {
    console.log('this.props',this.props)
    this.setState({
      cpicture:this.props.picture
    })
    // this.lookPicture(this.props.picture)
    // this.props.dispatch({
    //   type:'workManage/testPage'
    // }).then((res)=>{
    //   console.log('res: ', res);
    //   this.setState({
    //     uploadFinish:true
    //   })
    // })
  }

  componentWillUnmount() {
    
  }



}

export default connect((state) => ({
  state: {
    ...state.workManage
  }
}))(Upload);
