import React from 'react';
import {
  Layout, Menu,Spin , Button, message,DatePicker, Select, Popover, Icon, Checkbox,Empty,Modal
} from 'antd';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './workManage.less';
import moment from 'moment';
// import { dataCenter } from '../../../config/dataCenter'
import store from 'store';
import WorkList from './WorkList/WorkList'
import * as XLSX from 'xlsx';
import {readExcelToJson}  from '../../utils/file';
import observer from '../../utils/observer'
const { RangePicker } = DatePicker;

//作业中心界面内容
const Option = Select.Option;
const { Sider, Content,
} = Layout;

class WorkManage extends React.Component {
  constructor(props) {
    super(props);
    this.Ref = ref => {
      this.refDom = ref
    };
    this.state = {

    }
  }



  renderSubjectList() {
    let subList = this.props.state.schoolSubjectList;
		const children = [];
    for (let i = 0; i < subList.length; i++) {
      let item = subList[i]
      children.push(	<Option key={i} value={item.k}>{item.v}</Option>);
    }
		return (
      <>
        <Select
          style={{ width: 90,marginRight:20 }}
          suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
          optionFilterProp="children"
          placeholder="学科"
          value={this.props.state.schoolSubId}
          onChange={(value) => {
              this.props.dispatch({
                type:"workManage/schoolSubId",
                payload:value
              })
            }}>
          {children}
        </Select>
      </>
    )
  }
  renderClassList() {
    //内部维护一个班级
    let classes = this.props.state.pageClassList;
		const children = [];
    for (let i = 0; i < classes.length; i++) {
      let item = classes[i]
      children.push(	<Option key={i} value={item.classId}>{item.className}</Option>);
    }
		return (
      <>
        <Select
          style={{ width: 90,marginRight:20 }}
          suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
          optionFilterProp="children"
          placeholder="班级"
          onChange={(value) => {
            //   this.props.dispatch({
            //     type:"classModel/classSubjectData",
            //     payload:{
            //       list:classes,
            //       value
            //     }
            //   })
            //   this.getQuestions(value)
            }}>
          {children}
        </Select>
      </>
    )
  }


    addWork(){
        this.props.dispatch(routerRedux.push('/addWork'))
    }
    render() {
      return (
      <>
      {this.props.state.pageClassList.length?<div className={style.whoBox}> 
            {this.renderClassList()}
            { 
              this.renderSubjectList()
            }
            <Button onClick={()=>this.addWork()} type="primary">添加作业</Button>
           
        </div>:""}

        <Content style={{ minHeight: 280, overflow: 'auto', position: 'relative' }} ref='warpper' >
          <div className={style.layout}>
            <Layout className={style.innerOut}>
              <Content className={style.content} ref='warpper'>
                
              <WorkList  current='student'  location={this.props.location}>
              </WorkList>
                
              </Content>
            </Layout>
          </div>
        </Content>
      </>
    )
  }

  componentDidMount() {
    
    const { dispatch } = this.props;
    let userNews = store.get('wrongBookNews');
    let data = {
      schoolId: userNews.schoolId,
      year: this.props.state.years
    }
    dispatch({
      type: 'classModel/getPageClass',
      payload: data
    }).then((classlist) => {
      
      
    })
    dispatch({
        type: 'workManage/getSchoolSubjectList'
      }).then((res) => {
          console.log('res: ', res);
       
      })

  }

  componentWillUnmount() {

  }



}

export default connect((state) => ({
  state: {
    ...state.report,
    ...state.classHome,
    ...state.homePage,
    pageClassList:state.classModel.pageClassList,
    years: state.temp.years,
    classSubjectData:state.classModel.classSubjectData,
    schoolSubjectList:state.workManage.schoolSubjectList,
    schoolSubId:state.workManage.schoolSubId
  }
}))(WorkManage);
