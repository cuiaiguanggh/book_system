import React from 'react';
import {
  Layout, Menu,Spin , Button, message,DatePicker, Select, Popover, Icon, Checkbox,Empty,Modal
} from 'antd';

import { connect } from 'dva';
import style from './LogQuestion.less';
import moment from 'moment';
import store from 'store';
import RenderCrop from './RenderCrop/RenderCrop'
import RenderCropItem from './RenderCropItem/RenderCropItem'
const { RangePicker } = DatePicker;

//作业中心界面内容
const Option = Select.Option;
const { Sider, Content,
} = Layout;

class StuReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowclassid: '',
      currentSudent:{},
      chechBtnLoaing:false,
      classLoding:true,
      initWroking:false,
      nowuserid:-1,
      _work:{
        partList:[],
        info:{
          examName:''
        }
      },
      studentName:"",
      hideLoggedStudent:false,
      loggedStudents:[4694151917145088,4694151914916864,111],
      _students:{
        students:[],
        loggedStudents:[]
      },
      isCommitWrongQues:false
    }
  }


  
 


  menuClick(item){
    console.log('item: ', item);

  }
  initStudents(arr1) {
    let arr2=this.state.loggedStudents
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
            if(arr1[j].userId === arr2[i]){
                newArr.push(arr1[j]);
                arr1.splice(j,1)
            }
        }
    }
    console.log('newArr: ', newArr,arr1);

    let currentStudent=newArr.length?newArr:arr1
    this.setState({
      nowuserid:currentStudent[0].userId,
      studentName:currentStudent[0].userName
    })
    
    this.setState({
      _students:{
        loggedStudents:newArr,
        students:arr1
      }
    })
    this.getStudentWork(currentStudent[0].userId)
  }
  onclickStudentItem(item){
    console.log('item: ', item);

    this.setState({
      nowuserid:item.userId,
      studentName:item.userName
    })
    this.getStudentWork(item.userId)
  }
  initStudents1(_students){
    this.getArrEqual(_students,this.state.loggedStudents)
    return 
    console.log('_students: ', _students);
    let loggeds=this.state.loggedStudents
    let loggedStudents=[],
    students=[];


    
    let _arr = [];
    let _arr1=[]
    for (let i = 0; i < _students.length; i++) {
      let isExit;
      for (let j = 0; j < loggeds.length; j++) {
          if(loggeds[j] === _students[i].userId){
              isExit = true;
          }else{
            isExit = false
          }
      }
      isExit?_arr.push(_students[i]):''

    }

    // for (let index = 0; index < _students.length; index++) {
    //   const ele = _students[index]
    //   for (let i = 0; i < loggeds.length; i++) {
    //     if(ele.userId===loggeds[i]){
    //       loggedStudents.push(ele)
    //     }else{
    //       students.push(ele)
    //     }
       
    //   }
      
    // }
    // this.setState({
    //   _students:{
    //     loggedStudents,
    //     students
    //   }
    // })
    console.log('22',_arr)

  }
  hideLogged(e){
    console.log('e: ', e);
    let currentStudent=this.state._students.students
    this.setState({
      hideLoggedStudent:e.target.checked,
      nowuserid:currentStudent[0].userId,
      studentName:currentStudent[0].userName
    })
  }
  renderStudentMenu() {
    let students  = this.props.state.students;
    let loggedStudents= this.state._students.loggedStudents
    let _students= this.state._students.students
    return (
      <div className={style.leftInfo}>
        <div style={{height:44,borderBottom:'1px solid #e7e7e7', display: "flex",
                      alignItems: "center",
                      justifyContent: "center"}}>
            <Checkbox checked={this.state.hideLoggedStudent} onChange={(e)=>{this.hideLogged(e)}}> 隐藏已录入</Checkbox>
        </div>
      <Spin spinning={false} >
        {
          students.length?<ul  className={style.my_ul}
              >
                {
                  !this.state.hideLoggedStudent?loggedStudents.map((item, i) => {
                    return (
                      <li key={item.userId} className={['islog',this.state.nowuserid===item.userId?'checked':''].join(' ')} onClick={()=>{
                        this.onclickStudentItem(item)
                      }}>
                        <span> {item.userName}</span>
                        <img style={{float:'right'}} src={require('../../images/islog.png')}></img>
                      </li>
                      
                      )
                    }):""
                }
                {
                  _students.map((item, i) => {
                    return (
                      <li key={item.userId} className={this.state.nowuserid===item.userId?'checked':''} onClick={()=>{
                        this.onclickStudentItem(item)
                      }}>
                        <span> {item.userName}</span>
                      </li>
                      
                      )
                    })
                }
            
          </ul>:this.props.state.getClassMembersFinish?<Empty className='noclass' description='暂无学生' style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)' }} />:''
        }
       <div>
        </div> 
       </Spin>
     </div>
      

    )
    
  }


  selectStudentFun(student){
    this.setState({
      currentSudent:student
    })
  }

  renderSubjectList() {
    let subList = this.props.state.classSubjectData.list;
		const children = [];
    for (let i = 0; i < subList.length; i++) {
      let item = subList[i]
      children.push(	<Option key={i} value={item.v}>{item.k}</Option>);
    }
		return (
      <>
        <Select
          style={{ width: 90,marginRight:20 }}
          suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
          optionFilterProp="children"
          placeholder="学科"
          value={this.props.state.classSubjectData.value}
          onChange={(value) => {
              this.props.dispatch({
                type:"classModel/classSubjectData",
                payload:{
                  list:subList,
                  value
                }
              })

            }}>
          {children}
        </Select>
      </>
    )
  }




  renderClassSelect() {
    let classes = this.props.state.pageClassList;
		const children = [];
    for (let i = 0; i < classes.length; i++) {
      let item = classes[i]
      children.push(	<Option key={i} value={item.classId}>{item.className}</Option>);
    }
		return (
      <>
        <Select
          style={{ width: 120,marginRight:20 }}
          suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
          optionFilterProp="children"
          placeholder="班级"
          onChange={(value) => {
              this.props.dispatch({
                type:"classModel/classSubjectData",
                payload:{
                  list:classes,
                  value
                }
              })
            }}>
          {children}
        </Select>
      </>
    )
  }
  swicthLog(){
    this.setState({
      initWroking:true
    })
    let _type=this.props.state.logType
    setTimeout(() => {
      this.props.dispatch({
        type:'workManage/logType',
        payload:!_type
      })
      this.setState({
        initWroking:false
      })
    }, 300);
  }
  updateChecked (index,i) {
    let _pl=this.state._work.partList
    console.log('_pl: ', _pl);
    _pl[index].questions[i]['iscuowu']=! _pl[index].questions[i]['iscuowu']
    let _work=this.state._work
    this.setState({
      _work:{
        ..._work,
        partList:_pl
      }
    })
    
  }
  getStudentWork(_userId){
    this.setState({
      initWroking:true
    })
    this.props.dispatch({
      type:"workManage/doGetStudentQuestions",
      payload:{
        userId:_userId,
        examId:10,
      }
    }).then(res=>{
      console.log('doGetStudentQuestions: ', res);
      if(res.data&&res.data.list){
        //提交过错题
        
        this.setState({
          _work:{
            ...this.state._work,
            partList:this.initThisStudentWork(res.data.list)
          }
        })
      }
      this.setState({
        initWroking:false
      })
    })
  }
  commitStudentQuestions(){
    this.setState({
      isCommitWrongQues:true
    })
    let userQuids=this.getUserWrongQuestionIds()
    this.props.dispatch({
      type:"workManage/doCommitQuestions",
      payload:{
        userId:this.state.nowuserid,
        examId:10,
        qusIds:userQuids.length&&userQuids.join(',')
      }
    }).then(res=>{
      if(res.data.result===0){
				message.destroy()
				message.success(`【${this.state.studentName}】的错题提交成功!`)
			}else{
        message.destroy()
				message.error(`【${this.state.studentName}】的错题提交失败!`)
      }
      this.setState({
        isCommitWrongQues:false
      })
    })
  }
  _getStudentQuestionIds(_stuques){
    let _qids=[]
    for (let index = 0; index < _stuques.length; index++) {
      const stuque = _stuques[index]
      _qids.push(stuque.qusId)
    }
    return _qids
  }

  initThisStudentWork(_stuques){
    let _partList=this.state._work.partList
    let _userhasQids=this._getStudentQuestionIds(_stuques)

    if(_partList.length){
      for (let index = 0; index < _partList.length; index++) {
        const part = _partList[index];
        for (let j = 0; j < part.questions.length; j++) {
          part.questions[j].iscuowu=_userhasQids.includes(part.questions[j].qusId)
        }
      }
    }
    console.log('new user _partList: ', _partList);
    return _partList

  }

  getUserWrongQuestionIds(){
    let _partList=this.state._work.partList
    let _qids=[]
    if(_partList.length){
      for (let index = 0; index < _partList.length; index++) {
        const part = _partList[index];
        for (let j = 0; j < part.questions.length; j++) {
          const question = part.questions[j];
          if(question.iscuowu) {
            _qids.push(question.qusId) 
          }
        }
      }
    }
    return _qids
  }
  render() {
      return (
      <>
      {this.props.state.pageClassList.length?<div className={style.whoBox}> 
            {this.renderClassSelect()}
            {/* { 
              this.renderSubjectList()
            }
            <Button onClick={()=>this.addWork()} type="primary">添加作业</Button> */}
        </div>:""}

        <Content style={{ minHeight: 500, overflow: 'hidden', position: 'relative',padding:20 }}  >
          <div className={style.top_bar}>
            <span>{this.state._work.info.examName}</span> <span style={{marginLeft:10,marginRight:10}}>&gt;</span> <span>数据录入</span> <span style={{marginLeft:10,marginRight:10}}>&gt;</span> <span style={{color:'#8E8E8E'}}>{this.state.studentName}</span> 

              <div className={style.r_b_box}>
                <Button type="primary" loading={this.state.isCommitWrongQues} onClick={()=>this.commitStudentQuestions()}>提交</Button>
                <div className={style.swicth_box} onClick={()=>this.swicthLog()}>
                  <Spin spinning={this.state.initWroking}>
                    <Icon type="swap" style={{marginRight:4}}/>
                        切换录入方式
                  </Spin>
                </div>
              </div>
          </div>
          <div className={style.layout} style={{paddingBottom:56,width:'100%',height:'100%',boxSizing:'border-box'}}>
            <Layout style={{width:'100%',height:'100%',boxSizing:'border-box'}}>
              <Sider className={style.sider}>
                {this.renderStudentMenu()}
              </Sider>

              <Content className={style.content}>
                <Spin spinning={this.state.initWroking}>
                  {/* <LogContent  _updateChecked={(j,i,p)=>this.updateChecked(j,i,p)}  selectStudentHander={this.selectStudentFun.bind(this)} _prop_partList={this.state._work.partList}>
                  </LogContent> */}
                  <div>
                    {
                      <div style={{padding:!this.props.state.logType?'20px':''}}>
                        {
                          !this.state._work.partList.length?
                          <Empty className='noclass' description='该份作业暂无内容' style={{ position: 'relative',marginTop:100 }} />:
                          <>
                            {!this.props.state.logType?
                            <RenderCropItem _updateChecked={(index,i,p)=>{this.updateChecked(index,i,p)}} _partList={this.state._work.partList}></RenderCropItem>:
                            <RenderCrop  _updateChecked={(index,i,p)=>{this.updateChecked(index,i,p)}} _partList={this.state._work.partList}></RenderCrop>}
                          </>
                        }
                        
                      </div>
                    }
                  </div>
                </Spin>
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
      console.log('classlist: ', classlist);
      
      if (classlist && classlist.length > 0) {
        this.props.dispatch({
          type: 'workManage/getStudents',
          payload: {
            classId:classlist[0].classId||0
          }
        }).then(res=>{
          if(res.length>0){
            
            this.initStudents(res)
          }
        })
      }
    })

    dispatch({
			type:"workManage/getExamInfo",
			payload:{
				examId:this.props.location.examId||17
			}
		}).then(workdata=>{
			console.log('workdata: ', workdata);
      //调用partinfo接口
      if(workdata.info){
        this.setState({
          _work:workdata
        })
      }
			



		})

  }

  componentWillUnmount() {
    
  }



}

export default connect((state) => ({
  state: {
    pageClassList:state.classModel.pageClassList,
    getClassMembersFinish:state.classModel.getClassMembersFinish,
    students:state.workManage.students,
    years: state.temp.years,
    subList: state.temp.subList,
    classSubjectData:state.classModel.classSubjectData,
    schoolSubjectList:state.workManage.schoolSubjectList,
    logType:state.workManage.logType
  }
}))(StuReport);
