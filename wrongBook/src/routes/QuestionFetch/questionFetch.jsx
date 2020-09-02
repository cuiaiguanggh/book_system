import React from 'react';
import {
  Layout, Menu, Button, message,InputNumber, Select, Modal, Icon, Input, Checkbox
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
      wordUrl: '',
      visible: false,
      Img: '',
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
    }
  }
  checkQuestions(){
    let _arr=this.props.state.tealist.data
    let prdata=[]
    for (let index = 0; index < _arr.length; index++) {
      const ele = _arr[index]
      let item={
        userId:ele.userId,
        uqIds:[]
      }
      if(ele&&ele.bb){
        for (let key in ele.bb) {
          item.uqIds.push(key)
        }
      }
      item.uqIds=item.uqIds.toString()
      prdata.push(item)
    }
    let op={
      body:[{"userId":5035401752333312,"uqIds":"350986,350988"},{"userId":5035401752333318,"uqIds":""},{"userId":5035401752333317,"uqIds":""},{"userId":5035401752333316,"uqIds":""},{"userId":5035401752333315,"uqIds":""},{"userId":5035401752333314,"uqIds":""},{"userId":5035401752333320,"uqIds":""},{"userId":5035401752333313,"uqIds":""},{"userId":5035401752333319,"uqIds":""}],
      headers : {
        'Content-Type':'application/json'
      }
    }
    console.log('prdata',prdata,JSON.stringify(prdata))
    this.request('http://dayour.mizholdings.com:8080/mizhu/api/exam/quick?token=FC255FDF-0618-4B41-B8C5-671A7640BE25',op)
  
  }
  request(url, op) {
    let options =op;
    options.method = options.method || 'post';
    // options.mode = options.mode || 'cors';
    let data = options.data || {};
    let dataBody;
    // let loginSession = store.get('wrongBookToken');
    // // if(loginSession !== '' && data.token == undefined  ){
    // //     data.token = loginSession;
    // // }
    // if (loginSession !== '' && data.token == undefined) {
    //   options.headers.Authorization = loginSession;
    // }
    // dataBody = formatOpt(data);
    // if (options.body && dataBody) {
    //   dataBody = options.body + '&' + dataBody;
    // }
    // if (options.method === 'post') {
    //   options.body = dataBody;
    // } else {
    //   url = `${url}?${dataBody}`;
    // }
  
    // if (options.headers['Content-Type'] === 'application/json') {
    //   options.body = JSON.stringify(data);
    // }
    options.body = JSON.stringify(options.body)
    return fetch(url, options)
      .then(this.checkStatus)
      .then(res => res.json())
      .then(data => ({ data }))
      .catch(err => console.log('error is', err))
  }
  checkStatus(response) {
    if (response.status >= 200 && response.status <= 500) {
      // if (response.status >= 200 && response.status < 300) {
      return response;
    }
  
    // const error = new Error(response.statusText);
    // error.response = response;
    // throw error;
  }
  menuClick = (e) => {
    console.log('e: ', e);
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
    });
    // this.getQuestions(e.key)
    return
    let location = this.props.location.hash;
    let hash = location.substr(location.indexOf("sId=") + 4);
    let id = location.substr(location.indexOf("&id=") + 4);
    let head = hash.split('&id=');
    let userNews = store.get('wrongBookNews')
    if (e.key !== id) {
      if (userNews.rodeType === 10) {
        dispatch({
          type: 'homePage/infoClass',
          payload: e.key
        });
      } else {
        dispatch({
          type: 'homePage/infoClass',
          payload: e.key
        });

      }
      dispatch(
        routerRedux.push({
          pathname: '/classUser',
          hash: `sId=${head[0]}&id=${e.key}`
        })
      )
      dispatch({
        type: 'homePage/teacherList',
        payload: {
          type: this.props.state.memType
        }
      });

    }

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
            style={{ height: 'calc(100% - 115px)' }}
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

          {/* {store.get('wrongBookNews').rodeType <= 20 ?
            <div className={style.daorubj} onClick={() => {
              this.props.dispatch(
                routerRedux.push({
                  pathname: '/addclass',
                })
              )
            }}>
              <img src={require('../images/sp-xt-n.png')} style={{ width: 12, margin: '0 4px 4px' }} />导入班级 </div> : ''} */}

          {this.state.reminder ?
            <div className={style.explain}>
              <img src={require('../images/explain.png')}></img>
            </div> : ""
          }
        </div>
      )
    }
  }

  
  getQuestions=()=>{
    this.setState({
      quering:true
    })
    // console.log('this.state: ', this.state);
    //return
    let data = {
      classId: this.state.nowclassid,
      year: this.props.state.years,
      subjectId: this.state.currentSubdata.id,
      userId: 5035401752333312||4813307222198274||0||this.state.currentSudent.userId,
      info: 0,
      pageSize: 20,
      pageNum: 1,
      startTime:'2020-08-10'
    }
    console.log('this.state.currentSudent: ', this.state.currentSudent);
    console.log('data: ', data);

    //时间段
    // if (this.props.state.stbegtoendTime.length > 0) {
    //   data.startTime = this.props.state.stbegtoendTime[0];
    //   // data.endTime = this.props.state.stbegtoendTime[1];
    // }

    this.props.dispatch({
      type: 'report/userQRdetail',
      payload: data
    }).then(res=>{
      console.log('res: ', res);  
      if(res.data&&res.data.questionList){
        let arr=res.data.questionList.map(item => {
					console.log('item: ', item);
					return {...item,aa:[]}
        })
        this.setState({
          questions:arr
        })
        this.props.dispatch({
          type: 'homePage/initStudentList',
          payload: {
            init:true,
            data:arr
          }
        })
      }else{
        this.setState({
          questions:[]
        })
      }
      this.setState({
        quering:false
      })
    })

  }
  selectStudentFun(student){
    this.setState({
      currentSudent:student
    })
  }
  getStudentListPageSub() {
    let beginTime = moment()
    .subtract(30, "days")
    .format("YYYY-MM-DD");
    console.log('beginTime: ', beginTime);
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
          onChange={(value,a) => {
            this.setState({
              currentSubdata:{
                id:value
              }
            })
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
        console.log('data: ', data);
        
			} catch (e) {
				// 这里可以抛出文件类型错误不正确的相关提示
				message.warning('文件类型不正确')
				return;
			}
		};
		// 以二进制方式打开文件
		fileReader.readAsBinaryString(files[0]);
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
            <InputNumber  style={{width:60,margin:'0 5px'}} min={1} max={30} defaultValue={3} />
            天
          </div>
          <Button type="primary" onClick={this.getQuestions} loading={this.state.quering}>查询</Button>
          <span style={{marginLeft:'20px'}}>{this.state.questions.length}题</span>
        </div>
        <Content style={{ minHeight: 280, overflow: 'auto', position: 'relative' }} ref='warpper' >
          <div className={style.layout}>
            <Layout className={style.innerOut}>
              <Sider className={style.sider}>
                {this.menulist()}
              </Sider>
              <Content className={style.content} ref='warpper'>
                <StudentList current='student' selectStudentHander={this.selectStudentFun.bind(this)} location={this.props.location}></StudentList>
                {
                  this.props.state.tealist.data&&this.props.state.tealist.data.length?
                  <>
                  <input
                    type='file'
                    id='file'
                    accept='.xlsx, .xls'
                   
                    onChange={this.onImportExcel}
                    
                  ></input>
                  <Button type="primary" style={{float:'right',marginTop:'10px'}} onClick={this.checkQuestions.bind(this)} >提交</Button>
                  </>
                  :''
                }
                
              </Content>
            </Layout>

            <Modal
              title="一键升级"
              visible={this.state.upgradeClass}
              cancelText='取消'
              okText='确认'
              className={'shenji'}
              width={950}
              onOk={() => {
                if (this.state.checkedList.length > 0) {
                  this.props.dispatch({
                    type: 'classHome/upgrade',
                    payload: {
                      OldClassId: this.state.checkedList,
                    }
                  });
                  this.setState({
                    upgradeClass: false,
                    indeterminate: false,
                    checkAll: false,
                    checkedList: [],
                    plainOptions: []
                  });
                } else {
                  message.warning('未选中班级')
                }

              }}
              onCancel={() => {
                this.setState({
                  upgradeClass: false,
                  indeterminate: false,
                  checkAll: false,
                  checkedList: [],
                  plainOptions: []
                });
              }} >
              <p className={style.title}>请勾选需要升级的班级（可多选）</p>

              <Checkbox
                indeterminate={this.state.indeterminate}
                onChange={(e) => {
                  let all = [];
                  for (let i = 0; i < this.state.plainOptions.length; i++) {
                    all.push(this.state.plainOptions[i].value)
                  }

                  this.setState({
                    checkedList: e.target.checked ? all : [],
                    indeterminate: false,
                    checkAll: e.target.checked,
                  });
                }}
                checked={this.state.checkAll} >
                全选
          </Checkbox>
              <CheckboxGroup
                options={this.state.plainOptions}
                value={this.state.checkedList}
                onChange={(checkedList) => {
                  this.setState({
                    checkedList,
                    indeterminate: !!checkedList.length && checkedList.length < this.state.plainOptions.length,
                    checkAll: checkedList.length === this.state.plainOptions.length,
                  });
                }} />

              <p className={style.bottom}>注：进入新的学年后，可一键升级班级的学年，自动更新班级名称；同时班级内的错题数据仍可查看。</p>
            </Modal>

            <Modal
              visible={this.state.visible}
              width='1000px'
              className="showques"
              footer={null}
              onOk={() => {
                this.setState({ visible: false })
              }}
              onCancel={() => {
                this.setState({ visible: false })
              }}
            >
              {
                this.state.Img.split(',').map((item, i) => (
                  <img key={i} style={{ width: '100%' }} src={item}></img>
                ))
              }
            </Modal>
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
    console.log(222)
    if (store.get('wrongBookNews').rodeType === 10) {
      this.props.dispatch({
        type: 'homePage/yearList',
        payload: {
          yearList: []
        }
      })
    }
    this.props.dispatch({
      type: 'homePage/memType',
      payload: 3
    });
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
