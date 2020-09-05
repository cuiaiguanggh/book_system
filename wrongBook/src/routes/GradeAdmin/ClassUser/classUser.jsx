import React from 'react';
import {
  Layout, Menu, Button, message, Select, Modal, Icon, Input, Checkbox
} from 'antd';
import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './classUser.less';
import moment from 'moment';
import { dataCenter } from '../../../config/dataCenter'
import store from 'store';
import ClassAdmin from '../ClassAdmin/classAdmin'
import observer from '../../../utils/observer'

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
      current: 'teacher',

    }
  }

  menuClick = (e) => {
   // return
    const { dispatch } = this.props;
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
    classList = this.props.state.classList;
    if (classList.length) {
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
            //清空班级邀请码
            observer.publish('fuyuan')
          }}
            selectedKeys={[`${this.state.nowclassid}`]}
            style={{ height: 'calc(100% - 115px)' }}
            className={style.menu}
            onClick={this.menuClick}  >
            {
               
              rodeType <= 20 ?
                classList.map((item, i) => {
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
                          }} defaultValue={item.className} /> : <span> {item.className}</span>}

                    </Menu.Item>
                  )
                }) : classList.map((item, i) => {
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
                classList = this.props.state.classList;
              }

              if (classList.length > 0) {
                let plainOptions = []
                for (let i = 0; i < classList.length; i++) {
                  plainOptions.push({
                    label: classList[i].className,
                    value: classList[i].classId,
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

          {store.get('wrongBookNews').rodeType <= 20 ?
            <div className={style.daorubj} onClick={() => {
              this.props.dispatch(
                routerRedux.push({
                  pathname: '/addclass',
                })
              )
            }}>
              <img src={require('../../images/sp-xt-n.png')} style={{ width: 12, margin: '0 4px 4px' }} />导入班级 </div> : ''}

          {this.state.reminder ?
            <div className={style.explain}>
              <img src={require('../../images/explain.png')}></img>
            </div> : ""
          }
        </div>
      )
    }
  }

  onWho(who) {
    this.setState({ current: who })
    this.props.dispatch({
      type: 'homePage/showMen',
      payload: ''
    });
    this.props.dispatch({
      type: 'homePage/tealist',
      payload: []
    });
    if (who === 'teacher') {
      this.props.dispatch({
        type: 'homePage/memType',
        payload: 1
      });
      this.props.dispatch({
        type: 'homePage/teacherList',
        payload: {
          type: 1
        }
      });

    } else {
      this.props.dispatch({
        type: 'homePage/memType',
        payload: 3
      });
      this.props.dispatch({
        type: 'homePage/teacherList',
        payload: {
          type: 3
        }
      });
    }
  }

  render() {
    return (
      <>
        <div className={style.whoBox}>
          <span style={this.state.current === 'teacher' ? { background: '#2593FC' } : { color: '#161616' }} onClick={() => { this.onWho('teacher') }}>教师</span>
          <span style={this.state.current === 'student' ? { background: '#2593FC' } : { color: '#161616' }} onClick={() => { this.onWho('student') }}>学生</span>
        </div>
        <Content style={{ minHeight: 280, overflow: 'auto', position: 'relative' }} ref='warpper' >
          <div className={style.layout}>
            <Layout className={style.innerOut}>
              <Sider className={style.sider}>
                {this.menulist()}
              </Sider>
              <Content className={style.content} ref='warpper'>
                <ClassAdmin current={this.state.current} location={this.props.location}></ClassAdmin>
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
        if (this.props.state.classList.length ) {
          dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.classList[0].classId
          });
          this.setState({
            nowclassid: this.props.state.classList[0].classId
          })
          this.props.dispatch({
            type: 'homePage/teacherList',
            payload: {
              type: 1,
            }
          });
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
        if (this.props.state.classList.length) {
          dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.classList[0].classId
          });
          this.setState({
            nowclassid: this.props.state.classList[0].classId
          })
          this.props.dispatch({
            type: 'homePage/teacherList',
            payload: {
              type: 1,
            }
          });
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
        if (this.props.state.classList.length) {
          dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.classList[0].classId
          });
          this.setState({
            nowclassid: this.props.state.classList[0].classId
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
      payload: 1
    });
  }
  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.sth !== this.props.sth) {
  //     // sth值发生改变下一步工作
  //   }
  // }
  componentDidUpdate(prevProps) {
    console.log("StuReport -> componentDidUpdate", this.props.state.checkClassId,this.state.nowclassid)
    if(this.state.nowclassid&&this.props.state.checkClassId!==this.state.nowclassid){
      try {
        if(this.props.state.classList.length){
          this.props.dispatch({
            type: 'homePage/infoClass',
            payload: this.props.state.checkClassId
          });
          this.setState({ nowclassid: this.props.state.checkClassId })
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
    ...state.classHome,
    ...state.homePage,
    years: state.temp.years,
    checkClassId:state.classModel.checkClassId
  }
}))(StuReport);
