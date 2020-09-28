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
import { deleteTeachVideo } from '../../services/reportService';
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
              this.getWorkList({
                subjectId:value
              })
            }}>
          {children}
        </Select>
      </>
    )
  }
  renderClassList() {
    //内部维护一个班级
    let classes = this.props.state.workPageClass.list;
		const children = [];
    for (let i = 0; i < classes.length; i++) {
      let item = classes[i]
      children.push(	<Option key={i} value={item.classId}>{item.className}</Option>);
    }
    const _classData=this.props.location.data
    const _classValue=_classData?_classData.classId:this.props.state.workPageClass.singleValue
		return (
      <>
        <Select
          style={{ width: 140,marginRight:20 }}
          suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
          optionFilterProp="children"
          placeholder="班级"
          value={_classValue}
          onChange={(value) => {
              this.props.dispatch({
                type:"workManage/workPageClass",
                payload:{
                  list:classes,
                  value:[value]
                }
              })
              this.getWorkList({
                classId:value
              })
            }}>
          {children}
        </Select>
      </>
    )
  }

    async getWorkList(option){
      const{classId,subjectId}=option
      console.log('this.props.state.workPageClass.value: ', option);
      let res=await this.props.dispatch({
        type: 'workManage/getWorkList',
        payload:{
          subjectId:subjectId||this.props.state.schoolSubId,
          classId:classId||this.props.state.workPageClass.singleValue,
          schoolId:store.get('wrongBookNews').schoolId
        }
      })
      console.log('res: ', res);
      return res
    }
    async toDeleteWork(item){
      const key='deleteworkmodal'
      message.destroy()
      message.loading({ content: '正在删除作业...',  duration: 2,key })
      this.props.dispatch({
        type:'workManage/deleteWork',
        payload:{
          examId:item.examId
        }
      }).then( async (res)=>{
        if(res.data.result===0){
          await this.getWorkList({})
          message.success({ content: '作业删除成功！',  duration: 2,key });
        }else{
          message.error({ content: '作业删除失败！',  duration: 2,key });
        }
      })
    }
    addWork(){
        this.props.dispatch(routerRedux.push({ pathname: '/addWork',isCreate:true }))
    }
    render() {
      return (
      <>
        <div className={style.whoBox} style={{display:'flex',alignItems:'center'}}>
          {this.renderClassList()}
          { 
            this.renderSubjectList()
          }
          <Button onClick={()=>this.addWork()} type="primary">添加作业</Button>
        </div>
        <Content style={{ minHeight: 280, overflow: 'auto', position: 'relative' }} ref='warpper' >
          <div className={style.layout}>
            <Layout className={style.innerOut}>
              <Content className={style.content} ref='warpper'>
                
              <WorkList  current='student'
                editWork={(data)=>{
                  this.props.dispatch(routerRedux.push({pathname:'/addWork',examId:data.examId}))
                }}
                deleteWorkHnder={(item)=>{
                 this.toDeleteWork(item)
                }}
                logQuestions={(data)=>{
                  this.props.dispatch(routerRedux.push({pathname:'/LogQuestion',examId:data.examId}))
                }}
                lookReport={(data)=>{
                  this.props.dispatch(routerRedux.push({pathname:'/WorkReport',examId:data.examId}))
                }}
              >
              </WorkList>
                
              </Content>
            </Layout>
          </div>
        </Content>
      </>
    )
  }

  componentDidMount() {
    let query=this.props.location.data
    if(query&&query.subjectId&&query.classId){
      console.log('this.props.location.query',this.props.location.data)
      this.getWorkList({classId:query.classId,subjectId:query.subjectId})
      return
    }
    const { dispatch } = this.props;
    let userNews = store.get('wrongBookNews');
    let data = {
      schoolId: userNews.schoolId,
      year: this.props.state.years
    }
    dispatch({
      type: 'workManage/getWorkPageClass',
      payload: data
    }).then((classlist) => {
      dispatch({
        type: 'workManage/getSchoolSubjectList'
      }).then((res) => {
        console.log('this.props.state.schoolSubId: ', this.props.state.schoolSubId);
        if(classlist&&classlist.list&&classlist.list.length){
          this.getWorkList({classId:classlist.list[0].classId,subjectId:this.props.state.schoolSubId})
        }
      })
      
      
     
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
    workPageClass:state.workManage.workPageClass,
    years: state.temp.years,
    schoolSubjectList:state.workManage.schoolSubjectList,
    schoolSubId:state.workManage.schoolSubId
  }
}))(WorkManage);
