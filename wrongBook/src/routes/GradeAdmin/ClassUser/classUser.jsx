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
//作业中心界面内容
const Option = Select.Option;
const {
  Header, Footer, Sider, Content,
} = Layout;
const CheckboxGroup = Checkbox.Group;

let hei = 0

class StuReport extends React.Component {
  constructor(props) {
    super(props);
    this.Ref = ref => {
      this.refDom = ref
    };
    this.state = {
      current: '',
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
      plainOptions: []
    }
  }

  handleScroll(e) {
    const { clientHeight } = this.refDom;
    hei = clientHeight;
  }

  menuClick = (e) => {
    const { dispatch } = this.props;
    let location = this.props.location.hash;
    let hash = location.substr(location.indexOf("sId=") + 4);
    let id = location.substr(location.indexOf("&id=") + 4);
    let head = hash.split('&id=');
    let link = `classUser#${head[0]}&id=`
    let userNews = store.get('wrongBookNews')
    if (e.key !== id) {
      if (userNews.rodeType === 10) {

        dispatch({
          type: 'homePage/infoClass',
          payload: e.key
        });
      } else {
        let id = hash.substr(hash.indexOf("&id=") + 4);
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
      }, this.props.dispatch({
        type: 'classHome/pageClass',
        payload: {
          schoolId: store.get('wrongBookNews').schoolId,
          pageSize: 9999,
          pageNum: 1,
          year: this.props.state.years
        }
      }))
    }
    this.setState({
      whetherbz: false
    })
  }

  menulist() {
    let userNews = store.get('wrongBookNews')
    let location = this.props.location.hash;
    let classList = [];
    let hash = location.substr(location.indexOf("sId=") + 4);
    let id = location.substr(location.indexOf("&id=") + 4);

    //  if(!id && this.props.state.classId){
    //       id= String(this.props.state.classId);
    //     }

    // if(!id && store.get('wrongBookNews').rodeType > 20 && this.props.state.classList1.data){
    //   id= String(this.props.state.classList1.data[0].classId);
    // }
    // let head = hash.split('&id=');
    // let ha = store.get('wrong_hash');
    // let link = `/grade#${ha.substr(ha.indexOf("#") + 1)}`
    const rodeType = store.get('wrongBookNews').rodeType
    if (rodeType <= 20) {
      classList = this.props.state.classList;
    } else {
      classList = this.props.state.classList1;
    }
    if (classList.data) {
      return (
        <div className={style.leftInfo}>

          <Menu onSelect={(item, key, keyPath, selectedKeys) => {
            this.setState({
              nowclassid: item.key
            })
            this.props.dispatch({
              type: 'classHome/classId',
              payload: item.key
            })
          }}
            mode="inline"
            defaultSelectedKeys={[id]}
            style={{ height: 'calc(100% - 120px)' }}
            className={style.menu}
            onClick={this.menuClick}
            defaultOpenKeys={['sub']} >
            {
              rodeType <= 20 ?
                classList.data.list.map((item, i) => {
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

                      （ {item.studentNum}人）
                      </Menu.Item>
                  )
                }) :
                classList.data.map((item, i) => {
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
              一键升级班级
          <Icon type="question-circle" theme="filled" style={{ marginLeft: 10, color: '#ccc' }}
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
              <Icon type="plus-circle" style={{ paddingRight: 10 }} />导入班级
              </div>
            : ''
          }
          {this.state.reminder ?
            <div className={style.explain}>
              <img src={require('../../images/explain.png')}></img>
            </div> : ""
          }
        </div>
      )
    }
  }

  questions() {
    let detail = this.props.state.qrdetailList1.data.questionList;
    if (detail.length > 0) {
      return (
        <div className={style.outBody}
          ref={this.Ref}
          onWheel={(e) => this.handleScroll(e)}>
          {
            detail.map((item, i) => {
              let cls = 'down', name = '加入错题篮'
              let downs = this.props.state.stuDown;
              for (let j = 0; j < downs.length; j++) {
                if (downs[j] == item.questionId) {
                  cls = 'down ndown';
                  name = '移出错题篮'
                }
              }
              return (
                <div key={i} className={style.questionBody}>
                  <div className={style.questionTop}>
                    <span style={{ marginRight: '20px' }}>第{i + 1}题</span>
                    {/* <span>班级错误率：{}%（答错15人）</span> */}
                  </div>
                  <div style={{ padding: '10px', height: '250px', overflow: "hidden" }} onClick={() => {
                    this.setState({ visible: true, Img: item.userAnswerList[0].answer })
                  }}>
                    {
                      item.userAnswerList[0].answer.split(',').map((item, i) => (
                        <img key={i} style={{ width: '100%' }} src={item}></img>
                      ))
                    }
                  </div>
                  <div style={{ overflow: 'hidden', padding: '10px' }}>

                    <span className={cls} onClick={() => {
                      let dom = document.getElementsByClassName('down');
                      let downs = this.props.state.stuDown;
                      if (dom[i].innerHTML == '加入错题篮') {
                        this.props.dispatch({
                          type: 'down/stuDown',
                          payload: item.questionId
                        });
                        this.props.dispatch({
                          type: 'down/stuDownPic',
                          payload: item.picId
                        });
                      } else {
                        this.props.dispatch({
                          type: 'down/delstuDown',
                          payload: item.questionId
                        });
                        this.props.dispatch({
                          type: 'down/delstuDownPic',
                          payload: item.picId
                        });
                      }
                    }}>{name}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }

  render() {
    let mounthList = this.props.state.mounthList;
    let studentList = this.props.state.studentList;
    let detail = this.props.state.qrdetailList1;
    return (
      <Content style={{
        background: '#fff',
        minHeight: 280,
        overflow: 'auto',
        position: 'relative'
      }}
        ref='warpper'
      >
        <div className={style.layout}>
          <Layout className={style.innerOut}>
            <Sider className={style.sider}>
              {this.menulist()}
            </Sider>
            <Content className={style.content}
              ref='warpper'>
              <ClassAdmin location={this.props.location}></ClassAdmin>
            </Content>
          </Layout>

          <Modal
            title="一键升级班级"
            visible={this.state.upgradeClass}
            cancelText='取消'
            okText='确认'
            className={'shenji'}
            width={950}
            onOk={() => {
              if(this.state.checkedList.length>0){
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
              }else{
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
              checked={this.state.checkAll}
            >
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
      });

      dispatch({
        type: 'homePage/infoClass',
        payload: id[1]
      });
      dispatch({
        type: 'homePage/infoSchool',
        payload: id[0]
      });
    } else if (userNews.rodeType == 20) {

      let ids = hash.substr(hash.indexOf("&id=") + 4);
      let data = {
        schoolId: userNews.schoolId,
        pageSize: 9999,
        pageNum: 1,
        year: this.props.state.years
      }
      dispatch({
        type: 'classHome/pageClass',
        payload: data
      });

      dispatch({
        type: 'homePage/infoClass',
        payload: ids
      });
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
      });
    }

    // this.props.dispatch({
    //   type: 'homePage/schoolTeacher',
    // });
    // if(this.props.state.infoClass!='' || store.get('wrongBookNews').rodeType <= 20){
    this.props.dispatch({
      type: 'homePage/teacherList',
      payload: {
        type: 1
      }
    });
    // }
    this.props.dispatch({
      type: 'homePage/subjectNodeList',
    });
  }

  componentWillUnmount() {
    if (store.get('wrongBookNews').rodeType === 10) {
      this.props.dispatch({
        type: 'homePage/yearList',
        payload: {
          yearList: []
        }
      })
    }
  }

}

export default connect((state) => ({
  state: {
    ...state.classHome,
    ...state.homePage,
    years: state.temp.years
  }
}))(StuReport);
