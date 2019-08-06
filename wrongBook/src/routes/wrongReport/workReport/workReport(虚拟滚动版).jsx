import React from 'react';
import {
  Table, Button, message, Modal, Select, Layout, Icon, Input, Row
} from 'antd';
import {connect} from 'dva';
import style from './workReport.less';
import store from 'store';
import observer from '../../../utils/observer'
import {VariableSizeGrid} from 'react-window';
import commonCss from '../../css/commonCss.css'
import MistakesTC from '../../components/mistakesTC/mistakesTC';
//作业中心界面内容 
const Option = Select.Option;
const {
  Header, Content,
} = Layout;
let hei = 0;
const {confirm} = Modal;

class ItemRenderer extends React.Component {
  render() {
    let columnIndex = this.props.columnIndex;
    let rowIndex = this.props.rowIndex;
    let data = this.props.data;
    let nowvalue = data[rowIndex * 2 + columnIndex];

    if (data.length%2===0) {
    }else{
      data.push({true:true})
    }
    if (nowvalue.true) {
      return (
        <div></div>
      )
    } else {
      return (
        <div style={{
          ...this.props.style,
          padding: '10px'
        }}>
          <div key={`${columnIndex}-${rowIndex}`}
               className={nowvalue.teacherCollect !== 0 ? (nowvalue.teacherCollect === 1 ? `${style.rightbox}  ${style.cuowubox} ` : `${style.rightbox}  ${style.duibox} `) : style.rightbox}
               onClick={() => {
                 observer.publish('trueOrFalse', (rowIndex * 2 + columnIndex))
               }} >
            <div className={style.ylbiaoq}>
              {nowvalue.name}
              {nowvalue.questionUrl.height}
            </div>
            {nowvalue.collect === 1 ?
              <div className={style.buhui}>不会</div> : ''}
            {nowvalue.teacherCollect !== 0 ?
              (nowvalue.teacherCollect === 1 ?
                <div className={style.cuowuhong}>错误</div> :
                <div className={style.truelv}>正确 </div>) :
              <div className={style.cuowuhui}>错误</div>}
            <img style={{width: '100%', height: 260}} src={nowvalue.questionUrl}/>
          </div>
        </div>)
    }
  }
}

class WorkReport extends React.Component {
  constructor(props) {
    super(props);
    this.Ref = ref => {
      this.refDom = ref
    };
    this.state = {
      visible: false,
      key: 0,
      wordUrl: '',
      aheadSelect: false,
      topicxy: true,
      timunumber: '',
      leftdaipi: 0,
      stugoto: false,
      xqtc: false,
      errorDetails: {},
      tcxuhao: 0,
      pull: false,
      similarTopic: 1,
      //预批改弹窗滚动条是否出现
      gundt: false
    };
    observer.addSubscribe('trueOrFalse', this.yupirightb.bind(this))
  }

  handleScroll(e) {
    const {clientHeight} = this.refDom;
    hei = clientHeight;
  }


  //预批改(自动选择未全部批改题目)
  beforehandgai() {
    if (this.props.state.scoreDetail.length === 0) {
      return false;
    }
    let list = this.props.state.scoreDetail.data.questionScoreList;
    let uqId, timunumber;
    //没有题目可以给批改时，不给点击
    if (this.props.state.scoreDetail.data.collectNum === this.props.state.scoreDetail.data.allQuestionNum) {
      return false;
    }
    //选择出未批改的一道题目
    for (let i = 0; i < list.length; i++) {
      if (list[i].isAllCollect === 0) {
        this.props.dispatch({
          type: 'report/beforehand',
          payload: list[i],
        });
        uqId = list[i].uqId.split('uqid-')[1];
        timunumber = i + 1;
        break;
      }
    }
    //题目列表的待批改
    let leftdaipi = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i].isAllCollect === 0) {
        leftdaipi++;
      }
    }
    if (leftdaipi === -1) {
      leftdaipi = 0;
    }
    //左侧题目列表的题目序号
    if (timunumber < 10) {
      timunumber = `0${timunumber}`
    }
    //调用对应的学生错题
    if (uqId) {
      this.props.dispatch({
        type: 'report/getCorrection',
        payload: {
          uqId,
          classId: this.props.state.classId,
        }
      });
    }

    this.setState({
      aheadSelect: true,
      stugoto: false,
      timunumber,
      leftdaipi,
    })
  }

  //点击学错题，单个预批改
  danpigai(number) {
    //选择出未批改的一道题目
    let list = this.props.state.scoreDetail.data.questionScoreList;
    let uqId, timunumber;

    this.props.dispatch({
      type: 'report/beforehand',
      payload: list[number],
    });
    uqId = list[number].uqId.split('uqid-')[1];
    timunumber = number + 1;

    //题目列表的待批改
    let leftdaipi = -1;
    for (let i = 0; i < list.length; i++) {
      if (list[i].isAllCollect === 0) {
        leftdaipi++;
      }
    }
    //左侧题目列表的题目序号
    if (timunumber < 10) {
      timunumber = `0${timunumber}`
    }
    //调用对应的学生错题
    this.props.dispatch({
      type: 'report/getCorrection',
      payload: {
        uqId,
        classId: this.props.state.classId,
      }
    })
    this.setState({
      aheadSelect: true,
      timunumber,
      leftdaipi,
    })
  }

  //下载所选中的组卷事件
  downloadPitch(e) {
    e.stopPropagation();
    if (this.props.state.workDown.length !== 0) {
      //是否允许点击下载错题按钮事件
      this.props.dispatch({
        type: 'down/downQue',
        payload: true
      });
      //下载pdf
      let downparameters = {
        uqIdsStr: this.props.state.workDownPic.join(','),
        classId: this.props.state.classId,
      };
      if (this.state.similarTopic === 1) {
        downparameters.practise = 0
      } else {
        downparameters.practise = 1
      }
      ;
      this.props.dispatch({
        type: 'down/makeSelectWB',
        payload: downparameters
      });
      //关闭下拉弹窗
      this.setState({
        pull: false
      });
      // 下载清空选题
      this.props.dispatch({
        type: 'down/delAllWork',
      });

    } else {
      message.warning('请选择题目')
    }
  }

  getGrade() {
    let homeworkList = this.props.state.homeworkList;
    if (homeworkList.data && homeworkList.data.length > 0) {
      let name = this.props.state.homeworkName
      return (
        <div style={{paddingTop: 10}}>
          <span style={{fontSize: '14px', fontWeight: 'bold', color: 'rgba(96,98,102,1)'}}>选择作业：</span>
          <Select
            showSearch
            style={{width: 250, margin: '0 20px'}}
            placeholder="作业名称"
            value={name}
            optionFilterProp="children"
            onChange={(value, option) => {
              this.props.dispatch({
                type: 'report/homeworkName',
                payload: option.props.children
              });
              this.props.dispatch({
                type: 'report/homeworkId',
                payload: value
              });
              this.props.dispatch({
                type: 'report/queryHomeworkScoreDetail',
                payload: {
                  homeworkId: value
                }
              });
            }}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {
              homeworkList.data.map((item, i) => (
                <Option key={i} value={item.homeworkId}>{item.name}</Option>
              ))
            }
          </Select>
          {/*<Button type="primary"  onClick={()=>{*/}
          {/*  this.props.dispatch({*/}
          {/*    type:'report/homeworkRefresh'*/}
          {/*  })*/}
          {/*}}>生成报告</Button>*/}
          <div style={{float: 'right'}}>
            <Button style={{
              background: '#67c23a',
              color: '#fff',
              float: 'right',
              marginTop: "9px",
              border: 'none',
              width: 140
            }}
                    loading={this.props.state.downQue}
                    disabled={this.props.state.workDown.length === 0 && !this.props.state.downQue}
                    onClick={() => {
                      this.setState({pull: !this.state.pull})
                    }}>
              <img style={{margin: ' 0 5px 4px 0', height: '15px'}}
                   src={require('../../images/xc-cl-n.png')}></img>
              下载错题({this.props.state.workDown.length})
            </Button>
            {this.state.pull ?
              <div className={style.buttonPull}
                   onClick={(e) => {
                     if (this.state.similarTopic === 1) {
                       this.setState({
                         similarTopic: 2
                       })
                     } else if (this.state.similarTopic === 2) {
                       this.setState({
                         similarTopic: 1
                       })
                     }
                   }}>
                <Row className={style.downloadrow}>
                  {this.state.similarTopic === 1 ?
                    <img style={{margin: '0 9px 0 15px', height: '14px'}}
                         src={require('../../images/lvxz.png')}></img> :
                    <img style={{margin: '0 9px 0 15px', height: '14px'}}
                         src={require('../../images/lvwxz.png')}></img>}
                  <span className={style.inputk}>下载原错题</span>
                </Row>
                <Row className={style.downloadrow} style={{lineHeight: 1, textAlign: 'left'}}>
                  {this.state.similarTopic === 2 ?
                    <img style={{margin: '0 9px 0 15px', height: '14px'}}
                         src={require('../../images/lvxz.png')}></img> :
                    <img style={{margin: '0 9px 0 15px', height: '14px'}}
                         src={require('../../images/lvwxz.png')}></img>}
                  <span className={style.inputk}>
                      <p style={{margin: '15px 0 0 0'}}>下载原错题＋</p>
                      <p style={{margin: 0}}>优选练习</p> </span>
                </Row>
                <Row>
                  <div className={style.yulangbutton} onClick={this.downloadPitch.bind(this)}>
                    预览
                  </div>
                </Row>
              </div> : ''}
          </div>
        </div>
      )
    }
  }

  //搜索题目跳转链接
  tiaoz(picId) {
    this.props.dispatch({
      type: 'report/searchLink',
      payload: {picId},
    });
  }

  //错题列表
  questions() {
    let questionDetail = this.props.state.scoreDetail;
    if (questionDetail.data) {
      return (
        <div style={{overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
          {
            questionDetail.data.questionScoreList.map((item, i) => {
              let downs = this.props.state.workDown;
              let cls = 'down', name = '选题';
              for (let j = 0; j < downs.length; j++) {
                if (downs[j] == item.questionId) {
                  cls = 'down ndown';
                  name = '移除'
                }
              }
              return (
                <div key={i} className={style.questionBody}>
                  <div className={style.questionTop}>
                    <span style={{marginRight: "20px"}}>第{i + 1}题</span>
                    <span>答错<span
                      style={{color: "#1890ff", fontWeight: 400,}}
                    >{item.wrongNum}</span>人</span>
                  </div>
                  <div style={{padding: '20px', height: '217px', overflow: "hidden"}} onClick={() => {
                    this.danpigai(i);
                    this.setState({
                      stugoto: true,
                      topicxy: true
                    })
                  }}>
                    {item.title ?
                      <div dangerouslySetInnerHTML={{__html: item.title}}/>
                      :
                      <img key={i} style={{width: '100%'}} src={item.question.split(',')[0]}></img>
                    }
                  </div>
                  <div style={{overflow: 'hidden', paddingLeft: '10px',}}>
										<span style={{float: 'left', color: '#409eff', cursor: 'pointer', marginTop: 5,}} onClick={() => {
                      if (item.wrongScore != 0) {
                        let tcxuhao = i + 1;
                        let errorDetails = this.props.state.scoreDetail.data.questionScoreList[i];
                        this.setState({xqtc: true, errorDetails, tcxuhao})
                      }

                    }}> <img src={require('../../images/statistics.png')} style={{marginRight: '6px'}}/>
											查看统计</span>
                    <span style={{
                      marginLeft: '24px',
                      float: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#409eff',
                      cursor: 'pointer',
                      marginTop: 5,
                    }} onClick={this.tiaoz.bind(this, item.uqId)}>
											<img src={require('../../images/seek.png')} style={{marginRight: '6px'}}/>
											搜索题目</span>

                    <span className={cls} onClick={() => {
                      let dom = document.getElementsByClassName('down');
                      if (dom[i].innerText == '选题') {
                        this.props.dispatch({
                          type: 'down/workDown',
                          payload: item.questionId
                        });
                        this.props.dispatch({
                          type: 'down/workDownPic',
                          payload: item.uqId
                        });
                      } else {
                        this.props.dispatch({
                          type: 'down/delWorkDown',
                          payload: item.questionId
                        });
                        this.props.dispatch({
                          type: 'down/delWorkDownPic',
                          payload: item.uqId
                        });
                      }

                    }}>
											{
                        name == '选题' ?
                          <img style={{marginTop: '-4px', marginRight: '4px'}}
                               src={require('../../images/sp-xt-n.png')}/> :
                          <img style={{marginTop: '-4px', marginRight: '4px'}}
                               src={require('../../images/sp-yc-n.png')}/>
                      }
                      {name}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      )
    }
  }

  //单题错误率圆环图
  doughnut() {
    if (this.props.state.scoreDetail.data) {
      let list = this.props.state.scoreDetail.data.questionScoreList;
      return (
        list.map((item, i) => {
          if (item.wrongScore === 0) {
            return (
              <div key={i}>
                <div className={style.annulusbase} key={i}>
                  <div className={style.annulnei}>0%</div>
                  <div className={style.annulusfull}></div>
                </div>
                <div style={{textAlign: 'center', marginBottom: 5}}>{i + 1}</div>
              </div>
            )
          } else {
            return (
              <div key={i}>
                <div className={style.annulusbase}>
                  <div className={style.annulnei}>{(Math.floor(item.wrongScore * 1000) / 10).toFixed()}%</div>
                  <div className={style.annulusjd}></div>
                  {item.wrongScore > 0.5 ?
                    <div className={style.leftshade} style={{transform: `rotate(${180 * item.wrongScore}deg)`}}></div> :
                    <div className={style.leftshade}></div>}
                  {item.wrongScore < 0.5 ?
                    <div className={style.rightshade} style={{transform: `rotate(${360 * item.wrongScore}deg)`}}></div>
                    : <div className={style.rightshade} style={{zIndex: 7, background: '#FF7F69'}}></div>}
                </div>
                <div style={{textAlign: 'center', marginBottom: 5}}>{i + 1}</div>
              </div>
            )
          }
        })
      )
    }

  }

  //筛选错误人数,待批改人数，其余全对人数
  fornumber(beforstuTopic) {
    let cuowunumber = 0, dainumber = 0;
    for (let i = 0; i < beforstuTopic.length; i++) {
      if (beforstuTopic[i].teacherCollect === 1) {
        cuowunumber++;
      }
      if (beforstuTopic[i].teacherCollect === 0) {
        dainumber++;
      }
    }
    this.props.dispatch({
      type: 'report/cuowunumber',
      payload: cuowunumber
    });
    this.props.dispatch({
      type: 'report/dainumber',
      payload: dainumber
    })
  }

  //点击预批改弹窗右侧题目
  yupirightb(i) {
    let beforstuTopic = this.props.state.beforstuTopic;
    if (beforstuTopic[i].teacherCollect === 0) {
      //第一次未选中时点击
      beforstuTopic[i].teacherCollect = 1;
    } else {
      if (beforstuTopic[i].teacherCollect === 2) {
        beforstuTopic[i].teacherCollect = 1;
      } else {
        beforstuTopic[i].teacherCollect = 2;
      }
    }

    this.fornumber(beforstuTopic);
    this.props.dispatch({
      type: 'report/beforstuTopic',
      payload: beforstuTopic
    });
  }

  //预批改弹窗  完成按钮
  allOther() {
    //隐藏滚动条，和回复匹配错误
    this.setState({
      gundt: false,
      topicxy: true
    });
    let beforstuTopic = this.props.state.beforstuTopic;
    for (let i = 0; i < beforstuTopic.length; i++) {
      if (beforstuTopic[i].teacherCollect === 0) {
        beforstuTopic[i].teacherCollect = 2
      }
    }
    this.props.dispatch({
      type: 'report/CorrectionMarker',
      payload: {CorrectionMarkerList: JSON.stringify(beforstuTopic)}
    });

    if (this.state.stugoto) {
      //学生错题进入的预批改弹弹窗，则直接关闭
      this.setState({
        aheadSelect: false,
        stugoto: false,
      });
      //重新调用接口
      this.props.dispatch({
        type: 'report/queryHomeworkScoreDetail',
        payload: {
          homeworkId: this.props.state.homeworkId
        }
      });
      //清空关闭弹窗的有关数据
      this.props.dispatch({
        type: 'report/beforehand',
        payload: [],
      });
      this.props.dispatch({
        type: 'report/beforstuTopic',
        payload: []
      });
    } else {
      //点击预批改进入预批改弹窗
      if (this.state.leftdaipi === 0) {
        //批改到最后一题的时候，点击其余全对关闭窗口
        //重新调用接口
        this.props.dispatch({
          type: 'report/queryHomeworkScoreDetail',
          payload: {
            homeworkId: this.props.state.homeworkId
          }
        });
        this.setState({
          aheadSelect: false
        });
        //清空关闭弹窗的有关数据
        this.props.dispatch({
          type: 'report/beforehand',
          payload: [],
        });
        this.props.dispatch({
          type: 'report/beforstuTopic',
          payload: []
        });
      } else {
        //否则自动显示下一个未批改的题目
        let list = this.props.state.scoreDetail.data.questionScoreList;
        let uqId, timunumber = Number(this.state.timunumber), leftdaipi = this.state.leftdaipi;
        for (let i = timunumber; i < list.length; i++) {
          if (list.length >= i && list[i].isAllCollect === 0) {
            this.props.dispatch({
              type: 'report/beforehand',
              payload: list[i],
            });
            uqId = list[i].uqId.split('uqid-')[1];
            timunumber = i + 1;
            break;
          }
        }
        //题目列表的待批改
        leftdaipi--;
        //左侧题目列表的题目序号
        if (timunumber < 10) {
          timunumber = `0${timunumber}`
        }
        //调用对应的学生错题
        this.props.dispatch({
          type: 'report/getCorrection',
          payload: {
            uqId,
            classId: this.props.state.classId,
          }
        });
        this.setState({
          timunumber,
          leftdaipi
        })
      }
    }
  }

  //匹配错误按钮
  pipeicw(beforehand) {
    let that = this;
    confirm({
      title: '题目匹配错误',
      content: '取消匹配结果，以图片形式显示',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.setState({topicxy: false});
        let uqId = beforehand.uqId.split('uqid-')[1];
        that.props.dispatch({
          type: 'report/WrongQuestionMarker',
          payload: {
            uqId,
            userId: store.get('wrongBookNews').userId,
            way: 1
          }
        });
      },
    });
  }

//预批改关闭弹窗事件
  yptcCancel() {
    this.setState({
      aheadSelect: false,
      stugoto: false,
      gundt: false,
      topicxy: true
    },()=>{
      //关闭弹窗时，重新调用接口
      this.props.dispatch({
        type: 'report/queryHomeworkScoreDetail',
        payload: {
          homeworkId: this.props.state.homeworkId
        }
      });
      //关闭弹窗时，清空有关弹窗数据
      this.props.dispatch({
        type: 'report/beforehand',
        payload: [],
      });
      this.props.dispatch({
        type: 'report/beforstuTopic',
        payload: []
      });
    });
  }

  render() {
    let columns = [
      {
        title: <div style={{color: 'rgb(144, 147, 153)', fontWeight: 'bold'}}>姓名</div>,
        dataIndex: 'name',
        key: 'name',
        width: '140px',
        align: 'center',
        className: 'padb0',
        render: (text, record) => {
          return (
            <div className='space' style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => {
            }}>
              {text}
            </div>
          )
        }
      },
      {
        title: <div style={{color: 'rgb(144, 147, 153)', fontWeight: 'bold'}}>错误率</div>,
        dataIndex: 'wrong',
        key: 'wrong',
        width: '100px',
        align: 'center',
        className: 'padb0',
        render: (text, record) => {
          return (
            <div style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => {
            }}>
              {(text * 100).toFixed(0)}%
            </div>
          );
        }
      },
      {
        title: <div style={{color: 'rgb(144, 147, 153)', fontWeight: 'bold'}}>提交时间</div>,
        dataIndex: 'time',
        key: 'time',
        width: '140px',
        className: 'padb0',
        align: 'center',
        render: (text, record) => {
          return (
            <div style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => {
              store.set('wrong_hash', this.props.location.hash)
            }}>
              <Icon type="clock-circle" style={{marginRight: '10px'}}/>
              {text}
            </div>
          );
        }
      },
      {
        title: <div style={{lineHeight: '17px', minWidth: 400}}>
          <span style={{color: 'rgb(144, 147, 153)', fontWeight: 'bold', paddingLeft: 15}}>题目详情</span>
          <span style={{position: 'absolute', right: '260px', fontSize: '14px'}}>
						<img style={{marginLeft: '10px', height: '15px', marginBottom: '5px', marginRight: '5px'}}
                 src={require('../../images/gou.png')}></img>
						<span className={style.tablezi}>正确</span>
					</span>
          <span style={{position: 'absolute', right: '200px', fontSize: '14px'}}>
						<img style={{marginLeft: '10px', height: '15px', marginBottom: '5px', marginRight: '5px'}}
                 src={require('../../images/cha.png')}></img>
						<span className={style.tablezi}>错误</span>
					</span>
          <span style={{position: 'absolute', right: '125px', fontSize: '14px'}}>
						<div style={{
              width: 15,
              height: 15,
              borderRadius: '50%',
              background: '#FFF',
              margin: '2px 3px 0 0',
              float: 'left',
              border: '1px solid #E1E1E4'
            }}></div>
						<span className={style.tablezi}>未批改</span>
					</span>
          <span style={{position: 'absolute', right: '20px', fontSize: '14px'}}>
						<Icon type="exclamation-circle" theme='filled' style={{
              color: '#F3F3F4',
              marginRight: '5px',
              background: '#B8B8B9',
              borderRadius: '50%',
              fontSize: 15
            }}/>
						<span className={style.tablezi}>题目未匹配</span>
					</span>
        </div>,
        dataIndex: 'news',
        key: 'news',
        className: 'padb0',
        render: (text, record) => {
          let arr = []
          for (let i = 0; i < text.length; i++) {
            arr.push(
              text[i] == -1 ?
                <Icon key={`news-${i}`} type="exclamation-circle" theme='filled' className={'quicon'}/> :
                <span key={`news-${i}`}
                      className={text[i] === 0 ? 'qunot' : (text[i] === 1 ? 'quwrong' : 'qutrue')}>{i + 1}</span>
            )
          }
          return <div style={{display: 'flex', flexWrap: 'wrap'}}>{arr}</div>
        }
      }];
    const dataSource = [];
    let scoreDetail = this.props.state.scoreDetail;
    if (scoreDetail.data) {
      for (let i = 0; i < scoreDetail.data.userScoreList.length; i++) {
        let p = {};
        let det = scoreDetail.data.userScoreList[i];
        p["key"] = i;
        p["userId"] = det.userId;
        p["name"] = det.userName;
        p["wrong"] = det.wrongScore;
        p["time"] = det.joinTime != '' ? det.joinTime : "-------------";
        p["list"] = det;
        p["news"] = det.teacherCollect ? det.teacherCollect : [];
        dataSource[i] = p;
      }
    }
    let homeworkList = this.props.state.homeworkList;
    let fileLink = this.props.state.pdfUrl.fileLink;

    let classWrongScore;
    if (scoreDetail.data) {
      classWrongScore = scoreDetail.data.classWrongScore;
    }
    //预批改
    let beforehand = this.props.state.beforehand;
    let beforstuTopic = this.props.state.beforstuTopic;

    return (
      <Content style={{
        background: '#fff',
        minHeight: 280,
        overflow: 'hidden',
        position: 'relative'
      }}
               ref='warpper'
      >
        <Layout className={style.layout}>
          <Header className={style.layoutHead} style={{borderBottom: ' 1px solid #EBEEF5'}}>
            {homeworkList.data && homeworkList.data.length ? this.getGrade() : ''}
          </Header>
          <Content style={{overflow: 'auto', padding: '20px'}} id='bigwai'>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
              <div className={style.kuang}>
                <div className={style.kuangtop}>
                  班级平均错误率
                </div>
                <div style={{paddingLeft: 55}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
										<span style={{fontSize: 21, color: '#333333', margin: '30px 0 27px'}}> 错误率
                      {classWrongScore ? Math.floor(classWrongScore * 100) : '0'}%
										</span>
                  </div>
                  <div className={style.longellipse}>
                    <div className={style.jindu}
                         style={classWrongScore ? {width: `${Math.floor(classWrongScore * 100)}%`} : {width: 0}}>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.kuang} style={{position: 'relative', margin: '0 10px'}}>
                <div className={style.kuangtop}>
                  已批改题目
                </div>

                <div style={{fontSize: 21, color: '#333333', margin: '40px 0 0 0', textAlign: 'center'}}>
                  <img src={require('../../images/pentu.png')} style={{
                    margin: '-3px 10px 0 0',
                    width: 22
                  }}/>
                  <span style={{color: '#409EFF'}}>已批{scoreDetail.data ? scoreDetail.data.collectNum : '0'} 题次</span>
                  （已提交{scoreDetail.data ? scoreDetail.data.allQuestionNum : '0'}题次）
                </div>
                <div className={style.longellipse}
                     style={scoreDetail.data ?
                       {
                         width: `${scoreDetail.data.allQuestionNum / scoreDetail.data.totalNum * 58}%`,
                         position: 'absolute',
                         bottom: 52,
                         left: '22%'
                       }
                       : {width: '58%', position: 'absolute', bottom: 52, left: '22%'}
                     }>
                </div>
                <div className={style.jindublue}
                     style={scoreDetail.data ? {width: `${scoreDetail.data.collectNum / scoreDetail.data.totalNum * 58}%`,}
                       : {width: 0}}>
                </div>
                <div className={style.gopigai} onClick={this.beforehandgai.bind(this)}
                     style={!scoreDetail.data || (scoreDetail.data && scoreDetail.data.collectNum === scoreDetail.data.allQuestionNum) ? {
                       background: '#ccc',
                       cursor: 'no-drop'
                     } : {}}>
                  预批改
                </div>
              </div>
              <div className={style.kuang}>
                <div className={style.kuangtop}>
                  未提交人数
                  <div className={style.remind}
                    //      onClick={()=>{
                    //   this.props.dispatch({
                    //     type:'report/remindHomework',
                    //     payload:{
                    //       userId:,
                    //   subjectId:this.props.state.subId,
                    //     }
                    //   })
                    // }}
                  >提醒上交作业</div>
                </div>
                <div className={style.wtjrs} style={{padding: ' 0 20px 5px'}}>
                  <div style={{fontSize: 21, color: '#333333', margin: '25px 0px 20px'}}>
                    {scoreDetail.data && scoreDetail.data.unCommit ? `未提交${scoreDetail.data.unCommit}人` : '全部提交'}
                  </div>
                  <div
                    style={{lineHeight: '26px'}} className={style.mzall}>
                    {scoreDetail.data && scoreDetail.data.unCommitName.length > 0 ?
                      scoreDetail.data.unCommitName.map((item, i) => {
                        return <span key={i} className={style.notsubmit}>
													{item}
												</span>
                      }) : ''
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className={style.singleError}>
              <span className={style.singlefont}>单题错误率</span>
              <div style={{marginTop: 60, display: 'flex', flexWrap: 'wrap'}}>
                {this.doughnut()}
              </div>
            </div>

            <iframe style={{display: 'none'}} src={this.state.wordUrl}/>
            <div className={style.fenye} id='fenye'>
              {
                dataSource != [] ?
                  <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    rowClassName="editable-row"
                    rowClassName="editable-row"
                    style={{marginBottom: 25}}
                    onChange={() => {
                      let weizhi = document.getElementById('fenye').offsetTop - 60;
                      document.getElementById('bigwai').scrollTop = weizhi;
                    }}
                  /> : ''
              }
              {this.questions()}
            </div>
          </Content>
        </Layout>


        <Modal
          footer={null}
          visible={this.state.aheadSelect}
          className='aheadTc'
          width='1800px'
          onCancel={this.yptcCancel.bind(this)}
        >
          <div style={{display: 'flex', height: 850}}>
            <div className={style.aheadLeft}>
              <p className={style.aheadTitle}>
                {this.state.stugoto ? '当前题目：' : `题目列表：待批改${this.state.leftdaipi}题`}
              </p>
              <Content className={style.aheadLeftCon}>
                {beforehand ?
                  (beforehand.title && this.state.topicxy ?
                    <div key={beforehand.questionId} className={style.aheadbox} style={{paddingRight: 0}}>
                      <div className={style.bluetriangle}></div>
                      <div className={style.bulesz}>{this.state.timunumber}</div>

                      <div className={style.txlefttitle} style={{margin: 0}}>【题目{this.state.timunumber}】</div>
                      <div className={style.matchingError} onClick={this.pipeicw.bind(this, beforehand)}>
                        <Icon theme='filled' type="exclamation-circle"
                              style={{color: '#C0C8CF', fontSize: 16, marginRight: 8}}/> 题目匹配错题
                      </div>

                      <div
                        className={this.state.gundt || (document.getElementById('neiheight') && document.getElementById('neiheight').scrollWidth > 290) ? '' : 'yupitimu'}
                        id='neiheight'
                        onScroll={(e) => {
                          if (e.target.scrollTop > 0) {
                            this.setState({
                              gundt: true
                            })
                          }
                        }}
                        style={{
                          overflow: 'auto',
                          width: 290,
                          maxHeight: 630,
                        }}>
                        <div dangerouslySetInnerHTML={{__html: beforehand.title}}/>
                        <div className={style.txlefttitle}>【考点】</div>
                        <div dangerouslySetInnerHTML={{__html: beforehand.knowledgeName}}/>
                        <div className={style.txlefttitle}> 【答案与解析】</div>
                        <div dangerouslySetInnerHTML={{__html: beforehand.answer}}/>
                      </div>
                    </div>
                    :
                    <div className={style.aheadbox}>
                      <div className={style.bluetriangle}></div>
                      <div className={style.bulesz}>{this.state.timunumber}</div>
                      {beforehand.question ?
                        <img style={{width: '100%'}} src={beforehand.question.split(',')[0]}/>
                        : ''
                      }
                    </div>)
                  : ''
                }
              </Content>
            </div>
            <div className={style.aheadRight}>
              <div style={{height: 75, background: '#409EFF', color: '#fff', lineHeight: '75px', fontSize: 18}}>
                <span className={style.yupitctopzi}
                      style={{marginLeft: 45}}>{this.props.state.homeworkName}  &nbsp; 预批改</span>

                <span style={{margin: '0 70px 0 100px'}}> 点击标记错题，则其余未批题目默认判对  </span>
                <span>待批{this.props.state.dainumber}人 </span>
              </div>
              <div style={{padding: '30px 30px 20px 40px'}}>
                {beforstuTopic.length > 0 ?
                  <VariableSizeGrid
                    height={660}
                    columnWidth={() => 660}
                    rowHeight={() => 320}
                    width={1340}
                    columnCount={2}
                    rowCount={beforstuTopic.length / 2}
                    itemData={beforstuTopic}
                    className={'aheadRightCon'}
                  >
                    {ItemRenderer}
                  </VariableSizeGrid> : ''
                }
                <div style={{width: '100%', textAlign: 'right', padding: '15px 15px 0 0'}}>
                  <div className={style.jindukang}>
									<span className={style.jinduerr}
                        style={{width: `${Math.floor((this.props.state.cuowunumber / beforstuTopic.length) * 100)}%`}}>
										<span className={style.jinduzi}>错误{this.props.state.cuowunumber}人</span>
									</span>
                  </div>
                  <Button type="primary"
                          style={{width: 183, lineHeight: '44px', height: 44, fontSize: 16, borderRadius: 3}}
                          onClick={this.allOther.bind(this)}>完成</Button>
                </div>
              </div>
            </div>

          </div>
        </Modal>
        <MistakesTC tcxuhao={this.state.tcxuhao} xqtc={this.state.xqtc} guanbi={() => {
          this.setState({xqtc: false})
        }} errorDetails={this.state.errorDetails}/>
        {/*<Magnify/>*/}
        <Modal
          visible={this.props.state.showPdfModal}
          onOk={() => {
            window.location.href = this.props.state.pdfUrl.downloadLink
          }}
          onCancel={() => {
            this.props.dispatch({
              type: 'down/showPdfModal',
              payload: false
            });
          }}
          closable={false}
          cancelText='取消'
          okText='下载'
          className={commonCss.pdfModal}
        >
          <div style={{height: '700px'}}>
            <iframe src={fileLink} title='下载预览' style={{width: '100%', height: '100%', border: 0}}></iframe>
          </div>
        </Modal>
      </Content>
    );
  }

  componentDidMount() {

    if (this.props.state.classId != '' && this.props.state.subId != '') {
      this.props.dispatch({
        type: 'report/queryHomeworkList',
        payload: {
          classId: this.props.state.classId,
          subjectId: this.props.state.subId
        }
      });
    }

    this.props.dispatch({
      type: 'down/showPdfModal',
      payload: false
    });
    // 使用滚动时自动加载更多
    const loadMoreFn = this.props.loadMoreFn
    const wrapper = this.refs.wrapper
    let timeoutId

    function callback() {
      const top = wrapper.getBoundingClientRect().top
      const windowHeight = window.screen.height;
      if (top && top < windowHeight) {
        // 证明 wrapper 已经被滚动到暴露在页面可视范围之内了
        // loadMoreFn()
      }
    }
  }

}

export default connect((state) => ({
  state: {
    ...state.report,
    ...state.temp,
    ...state.down,
  }
}))(WorkReport, ItemRenderer);
