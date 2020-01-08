import React, { Component } from "react";
import 'antd/dist/antd.css';
import style from './Menus.less';
import { Menu, Icon, Layout, Popover, Select, message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import QRCode from 'qrcode.react';
import { Link } from "dva/router";
import store from 'store';
import WrongTop from '../wrongReport/wrongTop/wrongTop';
import { serverType } from '../../config/dataCenter';
import moment from 'moment';
// import ydt from '../images/guideFigure.png';


const Option = Select.Option;
const {
  Header, Sider,
} = Layout;

//主界面内容
class HomePageLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      // guideState: true,
    }
  }
  //延迟改变hash切换组件
  ycgaihash(hahs) {
    //修改浏览器标题
    let that = this;
    let title = `咔嚓拍错题${store.get('wrongBookNews').schoolName}`
    switch (hahs) {
      case '/classReport':
        document.title = `${title}班级错题`
        break;
      case '/stuReport':
        document.title = `${title}学生错题`
        break;
      case '/workReport':
        document.title = `${title}作业报告`
        break;
      case '/classUser':
        document.title = `${title}班级管理`
        break;
      case '/schoolChart':
        document.title = `${title}使用数据`
        break;
      case '/classChart':
        document.title = `${title}使用数据`
        break;
      case '/intelligentDollors':
        document.title = `${title}智能组卷`
        break;
    }
    //延迟跳转的原因：解决menu样式切换卡顿
    setTimeout(function () {
      that.props.dispatch(
        routerRedux.push({
          pathname: hahs
        })
      )
    }, 300)
  }

  //返回导航栏目

  Menus() {
    let memuList = this.props.state.MenuList;
    let menus = [];
    let classList = this.props.state.classList1;
    let rodeType = 30
    if (!store.get('wrongBookNews') || store.get('wrongBookNews') == undefined) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/login'
        })
      )
    } else {
      rodeType = store.get('wrongBookNews').rodeType
    }
    let pathname = this.props.location.pathname;
    let hash = this.props.location.hash;
    let key = hash.substr(hash.indexOf("page=") + 5) * 1;
    if (key === 0) {
      key = 1
    }
    if (pathname === '/') {
      if (rodeType === 10) {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/school',
            hash: `page=1`
          })
        )
      } else if (rodeType === 30 || rodeType === 20) {
        document.title = `咔嚓拍错题${store.get('wrongBookNews').schoolName}班级错题`
        this.props.dispatch(
          routerRedux.push({
            pathname: '/classReport',
          })
        )
      }
    }

    // let leftMenus = store.get('leftMenus');
    // for (let i = 0; i < leftMenus.length; i++) {

    //   switch (leftMenus[i].permission) {
    //     case '学校管理':
    //       menus.push(<Menu.Item key="school" >
    //         <Link to='school#page=1' replace>
    //           <Icon type="bar-chart" /><span>学校管理</span>
    //         </Link>
    //       </Menu.Item>)
    //       break;
    //     case '班级错题':
    //       menus.push(<Menu.Item key="workDetail1" style={{ cursor: 'pointer' }} onClick={this.ycgaihash.bind(this, '/classReport')}>
    //         <Icon type="file-text" theme="filled" /><span style={{ cursor: 'pointer' }}>班级错题</span>
    //       </Menu.Item>)
    //       break;
    //     case '学生错题':
    //       menus.push(<Menu.Item key="workDetail2" style={{ cursor: 'pointer' }} onClick={this.ycgaihash.bind(this, '/stuReport')}>
    //         <Icon type="solution" /><span style={{ cursor: 'pointer' }}>学生错题</span>
    //       </Menu.Item>)
    //       break;
    //     case '作业报告':
    //       menus.push(<Menu.Item key="workDetail3" style={{ cursor: 'pointer' }} onClick={this.ycgaihash.bind(this, '/workReport')}>
    //         <Icon type="share-alt" /><span style={{ cursor: 'pointer' }}>作业报告</span>
    //       </Menu.Item>)
    //       break;
    //     case '班级管理':
    //       menus.push(<Menu.Item key="grade" onClick={this.ycgaihash.bind(this, '/classUser')}>
    //         <Icon type="align-left" /><span>班级管理</span>
    //       </Menu.Item>)
    //       break;
    //     case '使用数据':
    //       menus.push(
    //         <Menu.Item key="Chart" onClick={this.ycgaihash.bind(this, '/schoolChart')}>
    //           <Icon type="pie-chart" /><span>使用数据</span>
    //         </Menu.Item>
    //       )
    //       break;
    //   }
    // }

    // return menus;

    if (memuList !== '') {
      memuList.map((item, i) => {
        // 学校管理模块
        if (item === 100) {
          if (rodeType === 10) {
            menus.push(<Menu.Item key="school" >
              <Link to='school#page=1' replace>
                <Icon type="bar-chart" /><span>学校管理</span>
              </Link>
            </Menu.Item>)
            menus.push(<Menu.Item key="userImport" >
              <Link to='userImport'>
                <Icon type="import" /><span>用户导入</span>
              </Link>
            </Menu.Item>)
            // menus.push(<Menu.Item key="specialDownload" >
            //   <Link to='specialDownload'>
            //     <Icon type="select" /><span>专题下载</span>
            //   </Link>
            // </Menu.Item>)
          }
        }

        // 作业中心
        if (item === 300 && rodeType !== 10) {
          menus.push(<Menu.Item key="Dollors" onClick={this.ycgaihash.bind(this, '/intelligentDollors')}>
            <Icon type="diff" /><span>智能组卷</span>
          </Menu.Item>)
          menus.push(<Menu.Item key="workDetail1" style={{ cursor: 'pointer' }} onClick={this.ycgaihash.bind(this, '/classReport')}>
            <Icon type="file-text" theme="filled" /><span style={{ cursor: 'pointer' }}>班级错题</span>
          </Menu.Item>)
          menus.push(<Menu.Item key="workDetail2" style={{ cursor: 'pointer' }} onClick={this.ycgaihash.bind(this, '/stuReport')}>
            <Icon type="appstore" /><span style={{ cursor: 'pointer' }}>学生错题</span>
          </Menu.Item>)
          menus.push(<Menu.Item key="workDetail3" style={{ cursor: 'pointer' }} onClick={this.ycgaihash.bind(this, '/workReport')}>
            <Icon type="share-alt" /><span style={{ cursor: 'pointer' }}>作业报告</span>
          </Menu.Item>)
        }
        // 班级管理模块
        if (item === 200) {
          if (rodeType > 20) {
            menus.push(<Menu.Item key="grade" onClick={this.ycgaihash.bind(this, '/classUser')}>
              <Icon type="align-left" /><span>班级管理</span>
            </Menu.Item>)
          } else {
            if (rodeType !== 10) {
              menus.push(
                <Menu.Item key="grade" onClick={this.ycgaihash.bind(this, '/classUser')}>
                  <Icon type="team" /><span>班级管理</span>
                </Menu.Item>
              )
            }

          }
          if (rodeType !== 10) {
            menus.push(
              <Menu.Item key="Chart" onClick={this.ycgaihash.bind(this, '/schoolChart')}>
                <Icon type="pie-chart" /><span>使用数据</span>
              </Menu.Item>
            )
          }
        }
      })
      return (menus)
    }
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });

  }

  //顶部学年下拉框
  getyear() {
    let yearList = this.props.state.yearList;
    return (
      <Select value={`${this.props.state.years}-${Number(this.props.state.years) + 1}学年`}
        className={'academicBox'} onChange={(value) => {
          this.props.dispatch({
            type: 'temp/years',
            payload: value
          });

          //学年改变，重新渲染调用接口
          let classId = this.props.state.classId;
          let subId = this.props.state.subId;
          let year = value;

          if (store.get('wrongBookNews').rodeType === 10) {
            //超管页面下的班级管理的左侧班级
            this.props.dispatch({
              type: 'classHome/pageClass',
              payload: {
                schoolId: store.get('wrongBookNews').schoolId,
                pageSize: 9999,
                pageNum: 1,
                year,
              }
            });

            this.props.dispatch({
              type: 'homePage/teacherList',
              payload: {
                type: 1
              }
            })
            if (window.location.href.split('/#/')[1] == 'classChart') {
              console.log('classChart')
              //重置月份为0
              this.props.dispatch({
                type: 'report/changeMouth',
                payload: 0
              })
              //重新调用接口
              this.props.dispatch({
                type: 'reportChart/getReportTimeList',
                payload: {
                  classReport: true
                }
              });
            } else if (window.location.href.split('/#/')[1] == 'schoolChart') {
              console.log('schoolChart')
              //重置月份为0
              this.props.dispatch({
                type: 'report/changeMouth',
                payload: 0
              })
              //重新调用接口
              this.props.dispatch({
                type: 'reportChart/getReportTimeList',
                payload: {
                  classReport: false
                }
              });
            }
            return;
          }
          //切换学年重头重新调用
          this.props.dispatch({
            type: 'temp/getClassList',
            payload: {
              year,
              schoolId: store.get('wrongBookNews').schoolId
            }
          })
          if (store.get('wrongBookNews').rodeType !== 10) {
            this.props.dispatch({
              type: 'down/showPdfModal',
              payload: false
            });
            this.props.dispatch({
              type: 'report/propsPageNum',
              payload: 1
            });
          }
          if (window.location.href.split('/#/')[1].includes('classUser')) {
            console.log('classUser')
            this.props.dispatch({
              type: 'classHome/getClassList',
              payload: {
                year,
                schoolId: store.get('wrongBookNews').schoolId
              }
            });

            this.props.dispatch({
              type: 'homePage/teacherList',
              payload: {
                type: 1
              }
            })
          } else if (window.location.href.split('/#/')[1] == 'classChart') {
            if (classId !== '' && subId != '' && year !== '') {
              console.log('classChart')
              //重置月份为0
              this.props.dispatch({
                type: 'report/changeMouth',
                payload: 0
              })
              //重新调用接口
              this.props.dispatch({
                type: 'reportChart/getReportTimeList',
                payload: {
                  classReport: true
                }
              });
            }
          } else if (window.location.href.split('/#/')[1] == 'schoolChart') {
            console.log(classId, subId, year)

            if (classId !== '' && year !== '') {
              console.log('schoolChart')
              //重置月份为0
              this.props.dispatch({
                type: 'report/changeMouth',
                payload: 0
              })
              //重新调用接口
              this.props.dispatch({
                type: 'reportChart/getReportTimeList',
                payload: {
                  classReport: false
                }
              });
            }
          }

        }}>
        {yearList.data.map((item, i) => (
          <Option value={item} key={i}>{`${item}-${item + 1}学年`}</Option>
        ))
        }
      </Select>)
  }

  getUserPosition(type, orname) {
    let name = ''
    if (orname.indexOf("管理员") === -1) {
      name = '管理员'
    }
    if (type > 20) {
      name = '老师'
    }
    return name
  }

  //切换学校
  switchSchool(value, option) {
    //替换学校name和id和学校类型
    let wrongBookNews = store.get('wrongBookNews');
    let oldSchoolName = wrongBookNews.schoolName;
    let userData = store.get('userData');
    wrongBookNews.schoolId = value;
    wrongBookNews.schoolName = option.props.children;
    //判断学校是小学，初中，高中，全学段
    if (option.props.begingrade === 1 && option.props.endgrade === 6) {
      wrongBookNews.schoolType = '小学'
    } else if (option.props.begingrade === 7 && option.props.endgrade === 9) {
      wrongBookNews.schoolType = '初中'
    } else if (option.props.begingrade === 10 && option.props.endgrade === 12) {
      wrongBookNews.schoolType = '高中'
    } else {
      wrongBookNews.schoolType = '全学段'
    }
    userData.schoolId = value;
    userData.schoolName = option.props.children;
    //替换浏览器标题
    document.title = document.title.replace(oldSchoolName, option.props.children)

    store.set('wrongBookNews', wrongBookNews);
    store.set('userData', userData)


    this.props.dispatch({
      type: 'homePage/getEnableYears',
      payload: {
        schoolId: value
      }
    }).then(() => {
      let classId = this.props.state.classId;
      let subId = this.props.state.subId;
      let year = this.props.state.years;

      let hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "");

      //切换学校重头重新调用
      this.props.dispatch({
        type: 'temp/getClassList',
        payload: {
          year,
          schoolId: value
        }
      })
      if (hashStrings.includes('/classUser')) {
        console.log('classUser')
        this.props.dispatch({
          type: 'classHome/getClassList',
          payload: {
            year,
            schoolId: value
          }
        });


        this.props.dispatch({
          type: 'classHome/pageClass',
          payload: {
            schoolId: value,
            pageSize: 9999,
            pageNum: 1,
            year: this.props.state.years
          }
        });

        this.props.dispatch({
          type: 'homePage/infoSchool',
          payload: value
        })
        this.props.dispatch({
          type: 'homePage/teacherList',
          payload: {
            type: 1
          }
        })



      } else if (hashStrings == '/classChart') {
        if (classId !== '' && subId != '' && year !== '') {
          console.log('classChart')
          //重置月份为0
          this.props.dispatch({
            type: 'report/changeMouth',
            payload: 0
          })
          //重新调用接口
          this.props.dispatch({
            type: 'reportChart/getReportTimeList',
            payload: {
              classReport: true
            }
          });
        }
      } else if (hashStrings == '/schoolChart') {
        if (classId !== '' && subId != '' && year !== '') {
          console.log('schoolChart')
          //重置月份为0
          this.props.dispatch({
            type: 'report/changeMouth',
            payload: 0
          })
          //重新调用接口
          this.props.dispatch({
            type: 'reportChart/getReportTimeList',
            payload: {
              classReport: false
            }
          });
        }
      }
    })

  }

  render() {
    let value = ''
    let userNews = store.get('wrongBookNews')
    let moreschool = store.get('moreschool')
    let rodeType = '';
    let user = this.props.state.userData;

    if (!store.get('wrongBookNews') || store.get('wrongBookNews') == undefined) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/login'
        })
      )
    } else {
      let vstr = 'http://hw-test.mizholdings.com/static/'
      if (serverType === 2) {
        vstr = 'https://dy.kacha.xin/wx/'
      }
      value = `${vstr}sc?schoolId=${store.get('wrongBookNews').schoolId}&year=2018`
      rodeType = store.get('wrongBookNews').rodeType
    }
    let hash = this.props.location.pathname;
    if (!store.get('wrongBookNews')) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/login'
        })
      )
    }
    let defaultKey = hash.substr(hash.indexOf("/") + 1);
    if (defaultKey.indexOf('school') === 0) {
      defaultKey = 'school'
    } else if (defaultKey.indexOf('export') === 0) {
      defaultKey = 'export'
    } else if (defaultKey.indexOf('grade') === 0) {
      defaultKey = 'grade'
    } else if (defaultKey.indexOf('classReport') === 0) {
      defaultKey = 'workDetail1'
    } else if (defaultKey.indexOf('stuReport') === 0) {
      defaultKey = 'workDetail2'
    } else if (defaultKey.indexOf('workReport') === 0) {
      defaultKey = 'workDetail3'
    } else if (defaultKey.indexOf('classChart') === 0) {
      defaultKey = 'Chart'
    } else if (defaultKey.indexOf('schoolChart') === 0) {
      defaultKey = 'Chart'
    } else if (defaultKey.indexOf('classUser') === 0) {
      defaultKey = 'grade'
    } else if (defaultKey.indexOf('intelligentDollors') === 0) {
      defaultKey = 'Dollors'
    }
    if (defaultKey == '') {
      if (userNews) {
        if (userNews.rodeType == 10) {
          defaultKey = 'school'
        } else if (userNews.rodeType == 20) {
          defaultKey = 'grade'
        } else {
          defaultKey = 'workDetail1'
        }
      } else {
        this.props.dispatch(
          routerRedux.push({
            pathname: '/login'
          })
        )
      }
    }
    const content = (
      <div className={style.userPover}>
        <p onClick={() => {
          this.props.dispatch(
            routerRedux.push({
              pathname: '/UserInfo',
            })
          )
        }}>个人信息</p>
        <p onClick={() => {
          this.props.dispatch({
            type: 'login/phone',
            payload: user.phone
          });
          this.props.dispatch(
            routerRedux.push({
              pathname: '/fin_psd',
            })
          )
        }}>修改密码</p>
        <p onClick={() => {
          store.set('wrongBookNews', '')
          this.props.dispatch(
            routerRedux.push({
              pathname: '/login',
            })
          )
          this.props.dispatch({
            type: 'temp/className',
            payload: ''
          });
          this.props.dispatch({
            type: 'temp/classId',
            payload: ''
          });
          this.props.dispatch({
            type: 'temp/subId',
            payload: ''
          });
          this.props.dispatch({
            type: 'temp/subName',
            payload: ''
          });
          //退出帐号时候，重新刷新，清空mould。（暂时没有什么好办法）给测试那边切换帐号好测点
          window.location.reload(true)
        }}>退出</p>
      </div>
    );
    let code = (
      <div className={style.qrcode}>
        <QRCode className='qrcode' value={value} />
        <p style={{ textAlign: "center", margin: 0 }}>邀请学生加入班级</p>
      </div>
    )
    let leftName = ''
    if (this.props.type == 'findPsd') {
      leftName = '重置登录密码'
    } else {
      if (userNews && userNews.rodeType > 10) {
        leftName = userNews.schoolName
      }
    }
    return (
      <Layout className={style.homePageContaier + ' ' + 'chomePageContaier'}>
        {/*<div style={{ position: 'absolute', width: '1920px', height: '1080px', }} hidden={this.state.guideState ? false : true} >*/}
        {/*  <img src={ydt}*/}
        {/*    style={{ width: '100%', position: 'absolute', zIndex: '100' }} />*/}
        {/*  <div style={{*/}
        {/*    top: '875px',*/}
        {/*    right: '607px',*/}
        {/*    width: '150px',*/}
        {/*    height: '55px',*/}
        {/*    position: 'absolute',*/}
        {/*    zIndex: '105',*/}
        {/*  }}*/}
        {/*    onClick={() => {*/}
        {/*      this.setState({*/}
        {/*        guideState: false*/}
        {/*      });*/}
        {/*      // localStorage.setItem('guide1', store.get('wrongBookNews').userId)*/}
        {/*    }}>*/}
        {/*  </div>*/}
        {/*</div>*/}

        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[defaultKey]}
          >
            {this.Menus()}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              style={{ cursor: 'pointer' }}
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <div className="navClass">

              {userNews == undefined ? '' :
                <div>
                  {this.props.state.yearList.data ? this.getyear() : ''}

                  {userNews && userNews.rodeType > 10 ?
                    <Select defaultValue={userNews.schoolId} className={style.moreschool}
                      onChange={this.switchSchool.bind(this)}>
                      {moreschool && moreschool.map((item) => (
                        <Option value={item.schoolId} begingrade={item.beginGrade} endgrade={item.endGrade} key={item.schoolId}>{item.schoolName}</Option>
                      ))}
                    </Select> : ''
                  }

                  {/* <span className={style.usinfo}>
                    {leftName}
                  </span> */}

                  {this.props.type == 'findPsd' ? '' :
                    <div className={style.usinfo}>

                      {/* <img  alt='' src={userNews.avatarUrl !==null ? userNews.avatarUrl : 'http://images.mizholdings.com/face/default/02.gif' }/> */}
                      <img alt=''
                        src={userNews.avatarUrl != null || userNews.avatarUrl != 'null' ? 'http://images.mizholdings.com/face/default/02.gif' : userNews.avatarUrl} />
                      <Popover
                        content={content}
                        // trigger="click"
                        type="primary"
                        placement="bottom">
                        <div className="btnBack"
                          type="primary">
                          {/* {user != '' ?this.getUserPosition(rodeType,user.name):''} */}
                          <span>{user != '' ? user.name : ''}</span>
                          <Icon type="caret-down" style={{ color: "#e1e1e1" }} />
                        </div>
                      </Popover>
                    </div>
                  }
                </div>
              }

            </div>
          </Header>
          {
            defaultKey.indexOf('workDetail') != -1 || defaultKey.indexOf('Dollors') > -1 ?
              <Header style={{ background: '#a3b0c3', height: '50px', padding: 0 }}>
                <WrongTop type={this.props.location} />
              </Header> : ''
          }
          {this.props.children}
        </Layout>
      </Layout>
    )
  }

  componentWillMount() {
    //判断引导图是否出现。切换版本的时修改判断的缓存key来重新显示流程图
    // if (localStorage.getItem('guide1')) {
    //   let guide = localStorage.getItem('guide1');
    //   if (guide == store.get('wrongBookNews').userId) {
    //     //不显示流程图
    //     this.setState({
    //       guideState: false
    //     })
    //   }
    // } else {
    //   //显示流程图
    //   this.setState({
    //     guideState: true
    //   })
    // }


    // 9月1号 之前，是2018-2019学年，9月1号之后，是2019-2020学年 moment().format('YYYY')
    if (Number(moment().format('MM')) < 9) {
      let years = moment().format('YYYY') - 1;
      this.props.dispatch({
        type: 'temp/years',
        payload: years
      });
    } else {
      let years = moment().format('YYYY');
      this.props.dispatch({
        type: 'temp/years',
        payload: years
      });
    }


    //恢复上次记忆
    if (store.get('wrongBookNews').memoryYears) {
      //恢复时，时间默认为全部
      this.props.dispatch({
        type: 'report/changeMouth',
        payload: 0
      });
    }

    store.get('wrongBookNews').memoryYears && this.props.dispatch({
      type: 'temp/years',
      payload: store.get('wrongBookNews').memoryYears
    })

    store.get('wrongBookNews').memoryClassId && this.props.dispatch({
      type: 'temp/classId',
      payload: store.get('wrongBookNews').memoryClassId
    })
    store.get('wrongBookNews').memorySubId && this.props.dispatch({
      type: 'temp/subId',
      payload: store.get('wrongBookNews').memorySubId
    })

  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (!store.get('wrongBookNews')) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/login'
        })
      )
    } else if (store.get('wrongBookNews').rodeType !== 10) {

      dispatch({
        type: 'homePage/getEnableYears',
        payload: {
          schoolId: store.get('wrongBookNews').schoolId
        }
      }).then(() => {
        //调用这个接口时，里面的方法嵌套，获取班级，学科，时间，知识点
        dispatch({
          type: 'temp/getClassList',
          payload: {
            year: this.props.state.years,
            schoolId: store.get('wrongBookNews').schoolId
          }
        });
      })
    }

    dispatch({
      type: 'userInfo/getUserInfo',
    });


    dispatch({
      type: 'homePage/functionList'
    });
    // dispatch({
    //   type: 'report/getUserSubjectList'
    // });


    //关闭浏览器钱，进行记忆班级，学科，学年，学校功能
    window.onunload = () => {
      store.set('wrongBookNews', {
        ...store.get('wrongBookNews'), ...{
          memoryYears: this.props.state.years,
          memoryClassId: this.props.state.classId,
          memorySubId: this.props.state.subId,
        }
      })
    };
  }

}

export default connect((state) => ({
  state: {
    ...state.homePage,
    ...state.temp,
    ...state.userInfo,
    ...state.report,
  }
}))(HomePageLeft);
