import React from 'react';
import {
  Layout, Menu,Spin , Button, message,InputNumber, Select, Modal, Icon, Input, Checkbox
} from 'antd';
import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './questionFetch.less';
import moment from 'moment';
// import { dataCenter } from '../../../config/dataCenter'
import store from 'store';
import StudentList from './studentList/StudentList'
import * as XLSX from 'xlsx';
import observer from '../../utils/observer'
import fetchQuestions from '../../services/yukeService'

//作业中心界面内容
const Option = Select.Option;
const {
  Header, Footer, Sider, Content,
} = Layout;
const CheckboxGroup = Checkbox.Group;

class StuReport extends React.Component {
  constructor(props) {
    super(props);
    this.Ref = ref => {
      this.refDom = ref
    };
    this.state = {
      loading: false,
      visible: false,
      page: 1,
      next: true,
      whetherbz: false,
      nowclassid: '',
      reminder: false,
      upgradeClass: false,
      indeterminate: false,
      checkAll: false,
      checkedList: [],
      plainOptions: [],
      current: 'student',
      currentSudent:{},
      currentSubdata:{
        id:10,
        value:'科学'
      },
      questions:[],
      quering:false,
      file: [],
      uploadFile: {},
      queryDate:20,
      excelData:[],
      buttonLoading:[0,0],
      tableLoding:true,
      chechBtnLoaing:false
    }
  }
  checkQuestions(){
    this.setState({
      chechBtnLoaing:true
    })
    let _arr=this.props.state.tealist.data
    let prdata=[]
    for (let index = 0; index < _arr.length; index++) {
      const ele = _arr[index]
      let item={
        userId:ele.userId,
        uqIds:[]
      }
      if(ele&&ele.questionHook){
        for (let key in ele.questionHook) {
          let _keys=key.split('-')
          let _qid=_arr[parseInt(_keys[0])].qustionlist[parseInt(_keys[1])].questionId||0
          item.uqIds.push(_qid)
        }
      }
      item.uqIds=item.uqIds.toString()
      prdata.push(item)
    }
    
    let data=[{"userId":5035401752333312,"uqIds":"350986,350988"},{"userId":5035401752333318,"uqIds":""},{"userId":5035401752333317,"uqIds":""},{"userId":5035401752333316,"uqIds":""},{"userId":5035401752333315,"uqIds":""},{"userId":5035401752333314,"uqIds":""},{"userId":5035401752333320,"uqIds":""},{"userId":5035401752333313,"uqIds":""},{"userId":5035401752333319,"uqIds":""}]
    data=prdata
    this.props.dispatch({
      type: 'classHome/fetchQuestions',
      payload:  data
    }).then(()=>{
      this.setState({
        chechBtnLoaing:false
      })
    })
  }
  
  menuClick = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'homePage/infoClass',
      payload: e.key
    });
    dispatch({
      type: 'classHome/classId',
      payload:  e.key
    })
    dispatch({
      type: 'homePage/teacherList',
      payload: {
        type: 3,
      }
    }).then(()=>{
      this.setState({
        tableLoding:false
      })
    });

  }


  loseFocus(e) {
    if (!e.currentTarget.value) {
      message.warning('班级名称不能为空')
    } else {
      this.props.dispatch({
        type: 'classHome/className',
        payload: e.currentTarget.value
      });
      this.props.dispatch({
        type: 'classHome/classId',
        payload: this.state.nowclassid
      })
      this.props.dispatch({
        type: 'classHome/updateClass',
      })
    }
    this.setState({
      whetherbz: false
    })
  }

  menulist() {
    let classList = [];

    const rodeType = store.get('wrongBookNews').rodeType
    if (rodeType <= 20) {
      classList = this.props.state.classList;
    } else {
      classList = this.props.state.classList1;
    }
    if (classList.data) {
      return (
        <div className={style.leftInfo}>

          <Menu onSelect={(item,) => {
            this.setState({
              nowclassid: item.key
            })
            this.props.dispatch({
              type: 'classHome/classId',
              payload: item.key
            })
            // //清空班级邀请码
            // observer.publish('fuyuan')
          }}
            selectedKeys={[`${this.state.nowclassid}`]}
            style={{ height: '100%' }}
            className={style.menu}
            onClick={this.menuClick}  >
            {
              rodeType <= 20 ?
                classList.data.list.map((item, i) => {
                  return (
                    <Menu.Item key={item.classId}>
                      <span> {item.className}</span>
                    </Menu.Item>
                  )
                }) : classList.data.map((item, i) => {
                  return (
                    <Menu.Item key={item.classId}
                      onDoubleClick={(e) => {
                        this.setState({
                          whetherbz: true
                        })
                      }}>
                      {this.state.whetherbz ?
                        <Input className={style.classCase}
                          autoFocus={item.classId == this.state.nowclassid ? true : false}
                          onBlur={(e) => {
                            this.loseFocus(e)
                          }} defaultValue={item.className} /> : <span> {item.className}</span>}（ {item.studentNum}人）
                    </Menu.Item>
                  )
                })
            }
          </Menu>

          {store.get('wrongBookNews').rodeType < 20 ?
            <div className={style.shenjibj} onClick={(e) => {
              const rodeType = store.get('wrongBookNews').rodeType
              if (rodeType <= 20) {
                classList = this.props.state.classList;
              } else {
                classList = this.props.state.classList1;
              }

              if (classList.data.list.length > 0) {
                let plainOptions = []
                for (let i = 0; i < classList.data.list.length; i++) {
                  plainOptions.push({
                    label: classList.data.list[i].className,
                    value: classList.data.list[i].classId,
                  })
                }
                this.setState({
                  plainOptions,
                  upgradeClass: true
                })
              }

            }}>
              一键升级
              <Icon type="question-circle" style={{ marginLeft: 10 }}
                onMouseOver={() => { this.setState({ reminder: true }) }}
                onMouseOut={() => { this.setState({ reminder: false }) }} />

            </div>
            : ''
          }

          {this.state.reminder ?
            <div className={style.explain}>
              <img src={require('../images/explain.png')}></img>
            </div> : ""
          }
        </div>
      )
    }
  }

  
  getQuestions=(newSubid)=>{
    if(!this.state.currentSudent.userId){
      message.destroy()
      if(!newSubid){
        message.warn('请选择一个要查询的学生')
      }
      return
    }
    if(!this.state.nowclassid||!this.props.state.years||!this.state.currentSubdata.id){
      return
    }
    this.setState({
      tableLoding:true
    })
    let beginTime = moment()
    .subtract(this.state.queryDate, "days")
    .format("YYYY-MM-DD");
    let data = {
      classId: this.state.nowclassid,
      year: this.props.state.years,
      subjectId: newSubid||this.state.currentSubdata.id,
      userId: this.state.currentSudent.userId||5035401752333312,
      info: 0,
      pageSize: 20,
      pageNum: 1,
      startTime:beginTime||'2020-08-10'
    }
    this.props.dispatch({
      type: 'report/userQRdetail',
      payload: data
    }).then(res=>{
      console.log('res: ', res);  
      if(res.data&&res.data.questionList){
        this.setState({
          questions:res.data.questionList
        })
        this.props.dispatch({
          type: 'homePage/initStudentList',
          payload: {
            init:true,
            data:res.data.questionList
          }
        })
      }else{
        message.destroy()
        message.warn(`当前学生最近${this.state.queryDate}天没有题目`)
        this.setState({
          questions:[]
        })
        this.props.dispatch({
          type: 'homePage/initStudentList',
          payload: {
            init:true,
            data:[]
          }
        })
      }
      this.setState({
        tableLoding:false
      })
    }).catch(()=>{
      this.setState({
        tableLoding:false
      })
    })

  }
  selectStudentFun(student){
    this.setState({
      currentSudent:student
    })
  }
  getStudentListPageSub() {

    let sublist = this.props.state.sublist;
		const children = [];
		if (sublist.data) {
			for (let i = 0; i < sublist.data.length; i++) {
				let data = sublist.data[i]
				children.push(<Option key={data.k}>{data.v}</Option>);
			}
		}

		if (sublist&&sublist.data && sublist.data.length > 0) {
			return (
        <>
        <Select
          style={{ width: 90, marginLeft: 5 }}
					suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
					optionFilterProp="children"
          defaultValue={this.state.currentSubdata.value}
          onChange={(value) => {
            this.setState({
              currentSubdata:{
                id:value
              }
            })
            this.getQuestions(value)
        }}>
          {children}
      </Select>
        </>
			)
		}
  }
  onImportExcel = file => {
		const { files } = file.target;
		if (files[0].name.indexOf('xls') < 0 && files[0].name.indexOf('xlsx') < 0 && files[0].name.indexOf('XLS') < 0 && files[0].name.indexOf('XLSX') < 0) {
			message.warning('文件类型不正确,请上传xls、xlsx类型');
			return false;
		}
		const fileReader = new FileReader();
		this.setState({ file: files, uploadFile: file.target.files[0] })
		fileReader.onload = event => {
			try {
				this.setState({ file: fileReader })

				const { result } = event.target;
				// 以二进制流方式读取得到整份excel表格对象
				const workbook = XLSX.read(result, { type: 'binary' });
				let data = []; // 存储获取到的数据
				// 遍历每张工作表进行读取（这里默认只读取第一张表）
				for (const sheet in workbook.Sheets) {
					if (workbook.Sheets.hasOwnProperty(sheet)) {
						// 利用 sheet_to_json 方法将 excel 转成 json 数据
						data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
						break; // 如果只取第一张表，就取消注释这行
					}
				}
        // this.setState({ fileArr: data })
        console.log('原始excel数据', data);
        let _arr=[]
				for (let index = 0; index < data.length; index++) {
					const d = data[index]
          console.log('Object.values(d): ', Object.values(d));
          _arr.push(Object.values(d))
        }
        for (let index = 0; index < _arr.length; index++) {
          const e = _arr[index]
          for (let j = 0; j < e.length; j++) {
            const a = e[j]
            
          }
        }
        this.setState({
          excelData:_arr
        })
        console.log('excelData: ', this.state.excelData);
        this.initQuestionChecked()
			} catch (e) {
				// 这里可以抛出文件类型错误不正确的相关提示
				message.warning('文件类型不正确')
				return;
			}
		};
		// 以二进制方式打开文件
		fileReader.readAsBinaryString(files[0]);
  }
  initQuestionChecked(){
		let _tes = this.props.state.tealist.data
    let data=this.state.excelData||[[1,1],[0,0]]
		for (let index = 0; index < data.length; index++) {
			const e = data[index]
			for (let j = 0; j < e.length; j++) {
				const a = e[j]
				let key=`${index}-${j}`
				if(a===1){
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
		this.props.dispatch({
			type: 'homePage/initStudentList1',
			payload: {
				init:false,
				data:{...this.props.state.tealist,data:_tes}
			}
		})
    console.log('excel match data', _tes);
    message.success('数据导入成功');
	}
  onChangeDate(value) {
    this.setState({
      queryDate:value
    })
  }
  render() {
    return (
      <>
        <div className={style.whoBox}>  
          {
            this.getStudentListPageSub()
          }
          <div style={{display:'inline-block',margin:'0 20px'}}>
            最近
            <InputNumber  style={{width:60,margin:'0 5px'}} min={0} max={30} defaultValue={this.state.queryDate} onChange={this.onChangeDate.bind(this)} />
            天
          </div>
          <Button type="primary" onClick={()=>{this.getQuestions()}} disabled={this.state.tableLoding}>查询</Button>
          <span style={{marginLeft:'20px'}}>{this.state.questions.length}题</span>
        </div>
        <Content style={{ minHeight: 280, overflow: 'auto', position: 'relative' }} ref='warpper' >
          <div className={style.layout}>
            <Layout className={style.innerOut}>
              <Sider className={style.sider}>
                {this.menulist()}
              </Sider>
              <Content className={style.content} ref='warpper'>
              <Spin spinning={this.state.tableLoding}>
              <StudentList  current='student' selectStudentHander={this.selectStudentFun.bind(this)} location={this.props.location}>
                </StudentList>
                {
                  this.props.state.tealist.data&&this.props.state.tealist.data.length?
                  <div className={style.queFetchFooter}>
                  
                   <Button loading={false} className={style.fetchBtn}  >批量匹配
                    <input
                      type='file'
                      id='file'
                      accept='.xlsx, .xls'
                      onChange={this.onImportExcel}             
                    ></input>
                   </Button>
                  <Button type="primary" loading={this.state.chechBtnLoaing}  onClick={this.checkQuestions.bind(this)} >提交</Button>
                  </div>
                  :''
                }
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

    let hash = this.props.location.hash;

    let userNews = store.get('wrongBookNews');
    if (userNews.rodeType < 20) {
      let ids = hash.substr(hash.indexOf("sId=") + 4);
      let id = ids.split('&id=');
      dispatch({
        type: 'homePage/getEnableYears',
        payload: {
          schoolId: id[0]
        }
      })

      let data = {
        schoolId: id[0],
        pageSize: 9999,
        pageNum: 1,
        year: this.props.state.years
      }
      dispatch({
        type: 'classHome/pageClass',
        payload: data
      }).then(() => {
        if (this.props.state.classList && this.props.state.classList.data.list.length > 0 && this.props.state.classList.data.list[0].classId) {
          dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.classList.data.list[0].classId
          });
          this.setState({
            nowclassid: this.props.state.classList.data.list[0].classId
          })
          // this.props.dispatch({
          //   type: 'homePage/teacherList',
          //   payload: {
          //     type: 1,
          //   }
          // });
        }
      })


      dispatch({
        type: 'homePage/infoSchool',
        payload: id[0]
      });
    } else if (userNews.rodeType == 20) {

      let data = {
        schoolId: userNews.schoolId,
        pageSize: 9999,
        pageNum: 1,
        year: this.props.state.years
      }
      dispatch({
        type: 'classHome/pageClass',
        payload: data
      }).then(() => {
        if (this.props.state.classList && this.props.state.classList.data.list.length > 0 && this.props.state.classList.data.list[0].classId) {
          dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.classList.data.list[0].classId
          });
          this.setState({
            nowclassid: this.props.state.classList.data.list[0].classId
          })
          this.props.dispatch({
            type: 'homePage/teacherList',
            payload: {
              type: 3,
            }
          }).then(()=>{
            this.setState({
              tableLoding:false
            })
          });//查询班级学生信息
        }
      })


      dispatch({
        type: 'homePage/infoSchool',
        payload: userNews.schoolId
      });
    } else {
      let id = hash.substr(hash.indexOf("&id=") + 4);
      dispatch({
        type: 'homePage/infoClass',
        payload: id
      });
      dispatch({
        type: 'homePage/infoSchool',
        payload: userNews.schoolId
      });
      dispatch({
        type: 'classHome/getClassList',
        payload: {
          year: this.props.state.years,
          schoolId: store.get('wrongBookNews').schoolId
        }
      }).then(() => {
        if (this.props.state.classList1 && this.props.state.classList1.data.length > 0 && this.props.state.classList1.data[0].classId) {
          dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.classList1.data[0].classId
          });
          this.setState({
            nowclassid: this.props.state.classList1.data[0].classId
          })
          this.props.dispatch({
            type: 'homePage/teacherList',
            payload: {
              type: 1,
            }
          });
        }
      })
    }

  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {

    if (this.props.state.infoClass != this.state.nowclassid) {

      try {

        if (store.get('wrongBookNews').rodeType <= 20) {

          this.props.dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.classList.data.list[0].classId
          });
          this.setState({ nowclassid: this.props.state.classList.data.list[0].classId })

        } else {
          this.props.dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.classList1.data[0].classId
          });

          this.setState({ nowclassid: this.props.state.classList1.data[0].classId })

        }
      } catch (e) {
        console.error(e)
      }
      this.props.dispatch({
        type: 'homePage/teacherList',
        payload: {
          type: 1,
        }
      });
    }

  }


}

export default connect((state) => ({
  state: {
    ...state.report,
    ...state.classHome,
    ...state.homePage,
    years: state.temp.years
  }
}))(StuReport);
