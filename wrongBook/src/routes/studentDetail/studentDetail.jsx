import React, {Component} from "react";
import 'antd/dist/antd.css';
import {Menu, Icon, Tabs} from 'antd';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Link} from "dva/router";
import store from 'store';
import style from './studentDetail.less';
import Top from '../Layout/top'

const TabPane = Tabs.TabPane;

//主界面内容
class StudentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'home',
      type: 1
    }
  }

  menuClick = (e) => {
    const {dispatch} = this.props;
    let hash = this.props.location.hash;

    let ids = hash.substr(hash.indexOf("workId=") + 7);
    let id = ids.split('&stId=');

    if (e.key !== id) {
      dispatch(
        routerRedux.push({
          pathname: '/studentDetail',
          hash: `workId=${id[0]}&stId=${e.key}`
        })
      )
      let data1 = {
        homeworkId: id[0],
        studentId: e.key
      }
      this.props.dispatch({
        type: 'temp/homeworkDetail',
        payload: data1
      });

    }

  }
  showConfirm = () => {
    // confirm({
    // 	title: '',
    // 	content: '确认退出',
    // 	onOk() {
    //         dispatch(
    //             routerRedux.push({
    //                 pathname: '/login',
    //               })
    //         )
    // 	},
    // 	onCancel() {
    // 		console.log('Cancel');
    // 	},
    // });
  }

  //返回导航栏目
  Menus() {
    let testScoreInfo = this.props.state.scoreList;
    let link = 'workDetail';
    let hash = this.props.location.hash;

    let ids = hash.substr(hash.indexOf("workId=") + 7);
    let id = ids.split('&stId=');
    if (testScoreInfo.data) {
      return (
        <div className={style.leftInfo}>
          <div className={style.leftTop}>
            <Link to={link}>
              <Icon type="left" className={style.goBack}/>
            </Link>
            <span>作业详情</span>
          </div>
          {/* <h3 style={{padding:'5px 20px',textAlign:'center'}}>
                        <Link to={link}>
                            <Icon type="left" style={{float:'left',fontSize:'20px',lineHeight:'30px',cursor:'pointer'}}/>
                        </Link>作业详情
                    </h3> */}
          <Menu
            mode="inline"

            defaultSelectedKeys={[id[1]]}
            style={{width: 200}}
            onClick={this.menuClick}
            // defaultSelectedKeys={['sub']}
            defaultOpenKeys={['sub']}
            // inlineCollapsed={col}
          >
            {
              testScoreInfo.data.userScoreList.map((item, i) => {
                  return (
                    <Menu.Item key={item.userId} style={{paddingLeft: '50px'}}>
                      {item.userName}
                    </Menu.Item>
                  )
                }
              )
            }
          </Menu>
        </div>
      )
    }

  }

  onChange = (activeKey) => {
    this.setState({activeKey});
  }

  workDetail() {
    let testScoreInfo = this.props.state.scoreList;
    let userList = testScoreInfo.data.userScoreList;
    let workDetail = this.props.state.workDetail;
    let hash = this.props.location.hash;
    let id = hash.substr(hash.indexOf("&stId=") + 6);
    let key = 0
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].userId == id) {
        key = i;
      }
    }
    let num = 0
    for (let i = 0; i < workDetail.data.pages.length; i++) {
      let page = workDetail.data.pages[i]
      num += page.questions.length
    }
    let cnt = 1;
    return (
      <div className={style.rightInner}>
        <div className={style.userNews}>
          <span>{userList[key].userName}</span>
          <span>{workDetail.data.name}</span>
          <span style={{color: "#1890ff"}}>错误率：{(userList[key].wrongScore * 100).toFixed(0)}%</span>
        </div>
        <div style={{fontSize: '16px', fontWeight: '600'}}>共{num}小题</div>
        {
          workDetail.data.pages.map((item, i) => (
            <div key={i}>
              {
                item.questions.map((em, j) => {
                  return (
                    <div className={style.questionBody} key={j}>
                      <div className={style.questionnum}>
                        <span>第{cnt++}题</span>
                        <img className={style.tOrf}
                             src={em.isCollected == 1 ? require('../images/zb-cw-n.png') : require('../images/zb-zq-n.png')}/>
                      </div>
                      <div style={{padding: '12px 20px'}}>
                        {
                          em.imageUrl.map((e, k) => (
                            <img style={{width: '80%'}} key={k} src={e}></img>
                          ))
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          ))
        }
      </div>
    )
  }

  allImg() {
    let workDetail = this.props.state.workDetail;
    return (
      <div className={style.rightInner}>
        {
          workDetail.data.pages.map((item, i) => (
            <div key={i} className={style.allImg}>
              <img src={item.url}/>
            </div>
          ))
        }
      </div>
    )
  }

  render() {
    let testScoreInfo = this.props.state.scoreList;
    let workDetail = this.props.state.workDetail;
    return (
      <div className={style.homePageContaier}>
        <Top/>
        <div className={style.HomePageCent}>

          <div className={style.pageLeftCont}>
            <div className={style.homePageLeft}>
              {this.Menus()}
              <p className={style.phoneNum}>400-889-1291</p>
            </div>
            <div className={style.rightCont}>
              <Tabs defaultActiveKey="1" value='large'
                    style={{background: '#fff'}}
                // tabBarExtraContent={this.operations()}
                    onChange={this.onChange}>
                <TabPane tab="习题详情" key="1">
                  {testScoreInfo.data && workDetail.data ? this.workDetail() : ''}
                </TabPane>
                <TabPane tab="查看原图" key="2">
                  {testScoreInfo.data && workDetail.data ? this.allImg() : ''}

                </TabPane>
              </Tabs>
              {/* <ClassAdmin location={this.props.location}></ClassAdmin> */}
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    let hash = this.props.location.hash;
    let ids = hash.substr(hash.indexOf("workId=") + 7);
    let id = ids.split('&stId=');
    let data = {
      homeworkId: id[0]
    }
    this.props.dispatch({
      type: 'temp/queryScoreDetail',
      payload: data
    });

    let data1 = {
      homeworkId: id[0],
      studentId: id[1]
    }
    this.props.dispatch({
      type: 'temp/homeworkDetail',
      payload: data1
    });


  }
}

export default connect((state) => ({
  state: {
    ...state.classHome,
    ...state.temp,
  }
}))(StudentDetail);
