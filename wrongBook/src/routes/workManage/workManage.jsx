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
      nowclassid: '',
      currentSudent:{},
      questions:[],
      file: [],
      uploadFileName: '请选择EXCEL文件导入',
      chechBtnLoaing:false,
      classLoding:true,
      sdate:'',
      edate:'',
      defaultDate:moment().locale('zh-cn').format('YYYY-MM-DD'),
      excelMatching:false
    }
  }
  timeHanderChange(dates, dateString) {
    console.log('dateString: ', dateString);
    this.setState({
          sdate: dateString[0],
          edate: dateString[1]
      }, () => {
          // this.callInterface();
      })
  }
  checkQuestions(){
    if(this.state.chechBtnLoaing){
      console.log('this.state.chechBtnLoaing: ', this.state.chechBtnLoaing,'正在提交');
      return 
    }
    this.setState({
      chechBtnLoaing:true
    })
    let _arr=this.props.state.classStudentList
    let prdata=[]
    for (let index = 0; index < _arr.length; index++) {
      const ele = _arr[index]
      let item={
        userId:ele.userId,
        uqIds:[]
      }
      if(this.props.state.saleId&&ele.userId===this.props.state.saleId){
       
        if(ele.qustionlist){
          for (let index = 0; index < ele.qustionlist.length; index++) {
            let picid=ele.qustionlist[index].picId
            // console.log('picid: ', picid);
            if(picid){
              picid=picid.substring(5)
              // console.log('new picid: ', picid);
              item.uqIds.push('')
            }
          }
        }
      }else if(ele&&ele.questionHook){
        for (let key in ele.questionHook) {
          let _keys=key.split('-')
//           let _qid=_arr[parseInt(_keys[0])].qustionlist[parseInt(_keys[1])].questionId||0
          let _qid=_arr[parseInt(_keys[0])].qustionlist[parseInt(_keys[1])].picId
          _qid=_qid.substring(5)
          item.uqIds.push(_qid)
        }
      }
      
      item.uqIds=item.uqIds.toString()
      prdata.push(item)
    }
    console.log('prdata: ', prdata,JSON.stringify(prdata));
    this.props.dispatch({
      type: 'classHome/fetchQuestions',
      payload:  {
        data:prdata
      }
    }).then(()=>{
      this.setState({
        chechBtnLoaing:false
      })
    })
  }
  
  menuClick = (e) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'homePage/infoClass',
    //   payload: e.key
    // });
    // dispatch({
    //   type: 'classHome/classId',
    //   payload:  e.key
    // })
    this.setState({
      nowclassid: e.key
    })
    dispatch({
      type: 'classModel/checkClassId',
      payload: e.key
    })
    dispatch({
      type: 'classModel/getClassSubjectList',
      payload: {
        classId:e.key,
        year:this.props.state.years
      }
    });
    
    dispatch({
      type: 'classModel/getClassMembers',
      payload: {
        type: 3,
        classId:e.key
      }
    })

  }


  

  classMenuList() {
    let classList  = this.props.state.pageClassList;
    return (
      <div className={style.leftInfo}>
      <Spin spinning={!this.props.state.getPageClassFinish} >
        {
          classList.length?<Menu onSelect={(item,) => {
            this.props.dispatch({
              type: 'classHome/classId',
              payload: item.key
            })
          }}
            selectedKeys={[`${this.state.nowclassid}`]}
            style={{ height: '100%' }}
            className={style.menu}
            onClick={(item)=>this.menuClick(item)}  >
            {
              classList.map((item, i) => {
                return (
                      <Menu.Item key={item.classId}>
                      <span> {item.className}</span>
                    </Menu.Item>
                  
                  )
                })
            }
            
          </Menu>:this.props.state.getClassMembersFinish?<Empty className='noclass' description='暂无班级' style={{ position: 'relative', top: '50%', transform: 'translate(0, -50%)' }} />:''
        }
       <div>
        </div> 
       </Spin>
     </div>
      

    )
    
  }

  
  getQuestions=(newSubid)=>{
    if(!this.props.state.getClassMembersFinish){
      return console.log('正在查询...')
    }
    if(!this.state.currentSudent.userId){
      message.destroy()
      message.warn('请选择一个要查询的学生')
      return
    }
    if(!this.state.nowclassid||!this.props.state.years||!this.props.state.subId){
      return
    }
    this.props.dispatch({
      type: 'classModel/getClassMembersFinish',
      payload: false
    })

    let data = {
      classId: this.state.nowclassid,
      year: this.props.state.years,
      subjectId: newSubid||this.props.state.subId,
      userId: this.state.currentSudent.userId||5035401752333312,
      info: 0,
      pageSize: 9999,
      pageNum: 1,
      startTime:this.state.sdate||this.state.defaultDate,//'2020-06-02'||
      endTime:this.state.edate||this.state.defaultDate
    }
    this.props.dispatch({
      type: 'report/userQRdetail',
      payload: data
    }).then(res=>{
      console.log('res: ', res);  
      if(res.data&&res.data.questionList&&res.data.questionList.length){
        this.setState({
          questions:res.data.questionList
        })
        this.props.dispatch({
          type: 'classModel/initStudentList',
          payload: res.data.questionList
        })
      }else{
        message.destroy()
        message.warn(`当前学生在这个时间段没有题目`)
        this.setState({
          questions:[]
        })
        this.props.dispatch({
          type: 'classModel/initStudentList',
          payload: []
        })
      }
      this.props.dispatch({
        type: 'classModel/getClassMembersFinish',
        payload: true
      })
    })
  }
  selectStudentFun(student){
    this.setState({
      currentSudent:student
    })
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
          value={this.props.state.classSubjectData.value}
          onChange={(value) => {
              this.props.dispatch({
                type:"classModel/classSubjectData",
                payload:{
                  list:subList,
                  value
                }
              })
              this.getQuestions(value)
            }}>
          {children}
        </Select>
      </>
    )
  }
  renderClassList() {
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
  onImportExcel = file => {

    const { files } = file.target
    if(!files||files.length===0||!files[0].name) {
        return message.warning('文件读取错误');
    }

		this.setState({
      uploadFileName:files[0].name,
      excelMatching:true
    })
    readExcelToJson(files[0],{
      complete:(res)=>{
        console.log("WorkManage -> res", res)
        this.initQuestionChecked(res)
        this.setState({
          excelMatching:false
        })
      }
    })
    
  }
  updateClassMembers(_classId){
    this.props.dispatch({
      type: 'homePage/infoClass',
      payload: _classId
    });
    this.setState({
      nowclassid: _classId
    })
    //学科查询是题目查询的先决条件
    this.props.dispatch({
      type: 'classModel/getClassSubjectList',
      payload: {
        classId:_classId,
        year:this.props.state.years
      },
    });
    this.props.dispatch({
      type: 'classModel/getClassMembers',
      payload: {
        type: 3,
        classId:_classId
      }
    });
  }
  initQuestionChecked(data){
		let _tes = this.props.state.classStudentList

    let _length=_tes.length>data.length?data.length:_tes.length
		for (let index = 0; index < _length; index++) {
        const e = data[index]
        for (let j = 0; j < e.length; j++) {
          if(j<e.length-1){
            let key=`${index}-${j}`
            const a = e[j+1]
            if(a===0){
              if(!_tes[index].questionHook){
                _tes[index].questionHook={}
              }
              _tes[index].questionHook[key]=true
            }else{
              if(_tes[index].questionHook)
              delete _tes[index].questionHook[key]
            }
          }
          
        }
    }
    
		this.props.dispatch({
			type: 'classModel/classStudentList',
			payload: _tes
		})
    console.log('excel match data', _tes);
    var f = document.getElementById('file');
    f.value = ''; //重置了file的outerHTML
    message.success('数据导入成功');
	}
    addWork(){
        this.props.dispatch(routerRedux.push('/addWork'))
    }
  render() {
    const content = (
      <div>
        <p>{this.state.uploadFileName||'请选择EXCEL文件导入'}</p>
      </div>
    )
      return (
      <>
      {this.props.state.pageClassList.length?<div className={style.whoBox}> 
            {this.renderClassList()}
            { 
              this.renderSubjectList()
            }
            <Button onClick={()=>this.addWork()} type="primary">添加作业</Button>
            {/* <div style={{display:'inline-block',margin:'0 20px 0 0'}}>
              时间:
              <RangePicker
                style={{ width: 240, marginLeft: 10 }}
                format="YYYY-MM-DD"
                placeholder={[this.state.defaultDate,this.state.defaultDate]}
                disabledDate={current => current && current > moment().endOf('day') || current < moment().subtract(30, 'day')}
                onChange={this.timeHanderChange.bind(this)} />
            </div>
            <Button style={{marginRight:'20px'}} type="primary" onClick={()=>{this.getQuestions()}} >查询</Button>
            <span >{this.state.questions.length}题</span> */}
        </div>:""}

        <Content style={{ minHeight: 280, overflow: 'auto', position: 'relative' }} ref='warpper' >
          <div className={style.layout}>
            <Layout className={style.innerOut}>
              {/* <Sider className={style.sider}>
                {this.classMenuList()}
              </Sider> */}
              <Content className={style.content} ref='warpper'>
                
              <WorkList  current='student'  selectStudentHander={this.selectStudentFun.bind(this)} location={this.props.location}>
                </WorkList>
                {
                  
                  this.props.state.classStudentList&&this.props.state.classStudentList.length?
                  <div className={style.queFetchFooter}>
                    <a href="http://test.kacha.xin/static/book_h5/demo.xlsx">
                    <Button type="link">
                      模板下载
                    </Button>
                    </a>
                    
                    <Popover content={content} >
                    <Button loading={this.state.excelMatching} className={style.fetchBtn}  >批量匹配
                      <input
                        type='file'
                        id='file'
                        accept='.xlsx, .xls'
                        title=''
                        onChange={this.onImportExcel}             
                      ></input>
                    </Button>
                    </Popover>

                  
                  <Button type="primary" loading={this.state.chechBtnLoaing}  onClick={this.checkQuestions.bind(this)} >提交</Button>
                  </div>
                  :''
                }
							{/* </Spin> */}
                
              </Content>
            </Layout>
          </div>
        </Content>
      </>
    )
  }

  componentDidMount() {
    observer.addSubscribe('updateClass', () => {
      console.log('questionFetch page updateClass..',this.props.state.pageClassList.length,this.props.state.pageClassList);
      if(this.props.state.pageClassList.length){

        this.updateClassMembers(this.props.state.checkClassId)
      }
    })
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
      
      if (classlist && classlist.length > 0) {
        let classId=classlist[0].classId||0
        this.updateClassMembers(classId)
      }
    })
    dispatch({
        type: 'workManage/getSchoolSubjectList'
      }).then((res) => {
          console.log('res: ', res);
       
      })

  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'classModel/classSubjectData',
      payload: {
        list:[],
        value:''
      }
    })
  }



}

export default connect((state) => ({
  state: {
    ...state.report,
    ...state.classHome,
    ...state.homePage,
    // ...state.temp,
    pageClassList:state.classModel.pageClassList,
    getClassMembersFinish:state.classModel.getClassMembersFinish,
    classStudentList:state.classModel.classStudentList,
    years: state.temp.years,
    subList: state.temp.subList,
    subId:state.temp.subId,
    checkClassId:state.classModel.checkClassId,
    classSubjectData:state.classModel.classSubjectData,
    schoolSubjectList:state.workManage.schoolSubjectList
  }
}))(WorkManage);