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
      isCommitWrongQues:false,
      _userhasQids:[],
      needCommitQuesData:{
        commit:false,
        studentId:''
      }
    }
  }

  initStudents(arr1,arr2,noupdateCheckMenu) {
    console.log("StuReport -> initStudents -> arr1,arr2", arr1,arr2)
    // arr2=[5084815555692544]
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
            if(arr1[j].userId === arr2[i]){
                newArr.push(arr1[j]);
                arr1.splice(j,1)
            }
        }
    }
    let currentStudent=newArr.length?newArr:arr1

    if(!noupdateCheckMenu){
      this.setState({
        nowuserid:currentStudent[0].userId,
        studentName:currentStudent[0].userName
      })
    }
    this.setState({
      _students:{
        loggedStudents:newArr,
        students:arr1
      }
    })
    this.getStudentQuestions(this.state.nowuserid)
  }
  onclickStudentItem(item){
    this.setState({
      nowuserid:item.userId,
      studentName:item.userName
    })
    this.getStudentQuestions(item.userId)
    if(item.userId===this.state.nowuserid){
      console.log('点击当前子女...')
    }else{
      console.log('切换子女...')
      this.onlyCommitStudentQuestions()
    }
    
  }
  hideLogged(e){
    let currentStudent=this.state._students.loggedStudents
    this.setState({
      hideLoggedStudent:e.target.checked
    })
    if(e.target.checked){ 
      //隐藏已录入的情况 判断当前子女是否在已录入的子女里面
      if(currentStudent.findIndex((value)=>{return value.userId===this.state.nowuserid })>-1){
        currentStudent=this.state._students.students
        this.setState({
          nowuserid:currentStudent[0].userId,
          studentName:currentStudent[0].userName
        })
        this.getStudentQuestions(currentStudent[0].userId)
      }
      
    }
    
   

  }
  renderStudentMenu() {
    let loggedStudents= this.state._students.loggedStudents
    let _students= this.state._students.students
    return (
      <div className={style.leftInfo}>
        <div style={{height:44,borderBottom:'1px solid #e7e7e7', display: "flex",
                      alignItems: "center",
                      justifyContent: "center"}}>
            <Checkbox disabled={!this.state._students.students.length} checked={this.state.hideLoggedStudent} onChange={(e)=>{this.hideLogged(e)}}> 隐藏已录入</Checkbox>
        </div>
      <Spin spinning={!this.props.state.getClassStudentsFinish} >
        {
         ( loggedStudents.length||_students.length)?<ul className={style.my_ul}
              >
                {
                  !this.state.hideLoggedStudent?loggedStudents.map((item, i) => {
                    return (
                      <li key={item.userId} className={['islog',this.state.nowuserid===item.userId?'checked':''].join(' ')} 
                        onClick={()=>{
                          this.onclickStudentItem(item)
                        }}>
                        <span style={{maxWidth: 75,
                          display: "inline-block",
                          overflow: "hidden",
                          textOverflow: "ellipsis"}}> {item.userName}</span>
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
                        <span > {item.userName}</span>
                      </li>
                      
                      )
                    })
                }
            
          </ul>:<Empty className='noclass' description='暂无学生' style={{ position: 'relative', top: '50%', transform: 'translate(0, -100px)' }} />
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
    let classes = this.props.state.workPageClass.list;
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
          value={this.props.state.workPageClass.singleValue}
          onChange={(value) => {
              this.props.dispatch({
                type:"workManage/workPageClass",
                payload:{
                  list:classes,
                  value:this.props.state.workPageClass.value,
                  singleValue:value
                }
              })
              if (value) {
                this.props.dispatch({
                  type: 'workManage/getStudents',
                  payload: {
                    classId:value
                  }
                }).then(allstudent=>{
                  if(!allstudent.length>0)return
                  this.props.dispatch({
                    type: 'workManage/hasLoggedStudents',
                    payload: {
                      classIds:value,
                      examId:this.props.location.examId||25
                    }
                  }).then(wusers=>{
                    this.initStudents(allstudent,wusers)
                  })
        
                })
        
        
              }
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
    this.setState({
      needCommitQuesData:{
        commit:true,
        studentId:this.state.nowuserid
      }
    })
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
  getStudentQuestions(_userId){
    
    this.setState({
      initWroking:true
    })
    this.props.dispatch({
      type:"workManage/doGetStudentQuestions",
      payload:{
        userId:_userId,
        examId:this.props.location.examId||25,
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

  //只提交题目
  onlyCommitStudentQuestions(){
    console.log('切换子女是否需要提交题目...',this.state.needCommitQuesData.commit)
    let userQuids=this.getUserWrongQuestionIds()
    // console.log('_userhasQids',this.state._userhasQids,...this.state._userhasQids)
    // console.log('_userhasQids',userQuids,...userQuids,userQuids.join(',')==this.state._userhasQids.join(','))
    //比对两次题目数据不能作为提交标准，可能存在没有请求到结果//userQuids.join(',')==this.state._userhasQids.join(',')
    // this.setState({
    //   needCommitQuesData:{
    //     commit:true,
    //     studentId:this.state.nowuserid
    //   }
    // })
    if(this.state.needCommitQuesData.commit){
      this.props.dispatch({
        type:"workManage/doCommitQuestions",
        payload:{
          userId:this.state.needCommitQuesData.studentId,
          examId:this.props.location.examId||25,
          qusIds:userQuids.length?userQuids.join(','):'',
          allRight:userQuids.length?0:1
        }
      }).then(res=>{
      //   if(res.data.result===0){
      //     message.destroy()
      //     message.success(`【${this.state.studentName}】的错题提交成功!`)
      //     this.setState({
      //       isCommitWrongQues:false
      //     })
      //   }else{
      //     message.destroy()
      //     message.error(`【${this.state.studentName}】的错题提交失败!`)
      //   }
       })
    }
    this.setState({
      needCommitQuesData:{
        commit:false,
        studentId:''
      }
    })
  }
  //提交题目
  commitStudentQuestions(){
    message.loading(`【${this.state.studentName}】的错题正在提交..`)
    this.setState({
      isCommitWrongQues:true
    })
    let userQuids=this.getUserWrongQuestionIds()
    this.props.dispatch({
      type:"workManage/doCommitQuestions",
      payload:{
        userId:this.state.nowuserid,
        examId:this.props.location.examId||25,
        qusIds:userQuids.length?userQuids.join(','):'',
        allRight:userQuids.length?0:1
      }
    }).then(res=>{

      if(res.data.result===0){
        this.props.dispatch({
          type: 'workManage/hasLoggedStudents',
          payload: {
            classIds:this.props.state.workPageClass.singleValue,
            examId:this.props.location.examId||25
          }
        }).then(wusers=>{
          console.log('wusers',wusers)
          this.initStudents(this.state._students.students.concat(this.state._students.loggedStudents),wusers,true)

        })
				message.destroy()
        message.success(`【${this.state.studentName}】的错题提交成功!`)
        this.setState({
          isCommitWrongQues:false
        })
			}else{
        message.destroy()
        message.error(`【${this.state.studentName}】的错题提交失败!`)
        this.setState({
          isCommitWrongQues:false
        })
      }

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
    // let _userhasQids=this._getStudentQuestionIds(_stuques)
    this.setState({
      _userhasQids:this._getStudentQuestionIds(_stuques)
    })
    if(_partList.length){
      for (let index = 0; index < _partList.length; index++) {
        const part = _partList[index];
        for (let j = 0; j < part.questions.length; j++) {
          part.questions[j].iscuowu=this.state._userhasQids.includes(part.questions[j].qusId)
        }
      }
    }
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
      {this.props.state.workPageClass.list.length?<div className={style.whoBox}> 
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
                {/* <Button type="primary" disabled={this.state._work.partList.length==0} loading={this.state.isCommitWrongQues} onClick={()=>this.commitStudentQuestions()}>提交</Button> */}
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
                  <div style={{padding:!this.props.state.logType?'20px':'',height:'100%',boxSizing:'border-box',position:'relative'}}>
                      {
                        !this.state._work.partList.length?
                        <Empty className={style.nowork} description='该份作业暂无内容' />:
                        <>
                          {!this.props.state.logType?
                          <RenderCropItem _updateChecked={(index,i,p)=>{this.updateChecked(index,i,p)}} _partList={this.state._work.partList}></RenderCropItem>:
                          <RenderCrop  _updateChecked={(index,i,p)=>{this.updateChecked(index,i,p)}} _partList={this.state._work.partList}></RenderCrop>}
                        </>
                      }     
                  </div>
                </Spin>
              </Content>
            </Layout>
          </div>
          <Button  className={style.commitQuestionRadiusBtn}
            disabled={this.state._work.partList.length==0} 
            loading={this.state.isCommitWrongQues} 
            onClick={()=>this.commitStudentQuestions()}
          >{this.state.isCommitWrongQues?'':'提交'}</Button>
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
      type: 'workManage/getWorkPageClass',
      payload: data
    }).then((classData) => {
      console.log('classlist: ', classData);
      
      if (classData && classData.list.length > 0) {
        this.props.dispatch({
          type: 'workManage/getStudents',
          payload: {
            classId:classData.singleValue
          }
        }).then(allstudent=>{
          if(!allstudent.length>0)return
          dispatch({
            type: 'workManage/hasLoggedStudents',
            payload: {
              classIds:classData.singleValue,
              examId:this.props.location.examId||25
            }
          }).then(wusers=>{
            console.log('wusers',wusers)
            this.initStudents(allstudent,wusers)

          })

        })


      }
    })

    dispatch({
			type:"workManage/getExamInfo",
			payload:{
				examId:this.props.location.examId||25
			}
		}).then(workdata=>{
      console.log('workdata: ', workdata);
      this.setState({
        initWroking:false
      })
      //调用partinfo接口
      if(workdata&&workdata.info){
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
    workPageClass:state.workManage.workPageClass,
    getClassStudentsFinish:state.workManage.getClassStudentsFinish,
    students:state.workManage.students,
    years: state.temp.years,
    subList: state.temp.subList,
    classSubjectData:state.classModel.classSubjectData,
    schoolSubjectList:state.workManage.schoolSubjectList,
    logType:state.workManage.logType
  }
}))(StuReport);
