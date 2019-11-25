import React from 'react';
import {
  Table, Button, message, Modal, Select, Layout, Icon, Input, Row, Spin, Popover
} from 'antd';
import { connect } from 'dva';
import style from './workReport.less';
import store from 'store';
import observer from '../../../utils/observer'
import { VariableSizeGrid } from 'react-window';
import commonCss from '../../css/commonCss.css'
import MistakesTC from '../../components/mistakesTC/mistakesTC';
import Guidance from '../../components/guidance/guidance';
import AutoSizer from "react-virtualized-auto-sizer";
import TracksVideo from '../TracksVideo/TracksVideo';
import QRCode from 'qrcode.react';
import { dataCenter, dataCen, serverType } from '../../../config/dataCenter'
import { Spring, animated } from 'react-spring/renderprops'

import PhotoLayer from '../../components/photoLayer/photoLayer';

//作业中心界面内容 
const Option = Select.Option;
const {
  Header, Content,
} = Layout;
let hei = 0;
const { confirm } = Modal;
const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;


//预批改弹窗右边的学生题目
class ItemRenderer extends React.Component {
  render() {
    let columnIndex = this.props.columnIndex;
    let rowIndex = this.props.rowIndex;
    let data = this.props.data;
    let nowvalue;
    if (window.screen.width <= 1280) {
      nowvalue = data[rowIndex];
    } else {
      nowvalue = data[rowIndex * 2 + columnIndex];
    }

    if (data.length % 2 !== 0 && window.screen.width > 1280) {
      data.push({ true: true })
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
              if (window.screen.width <= 1280) {
                observer.publish('trueOrFalse', (rowIndex))
              } else {
                observer.publish('trueOrFalse', (rowIndex * 2 + columnIndex))
              }
            }}>
            <div className={style.ylbiaoq}>
              {nowvalue.name}
              {nowvalue.questionUrl.height}
            </div>

            {nowvalue.collect === 1 ? <div className={style.buhui}>不懂</div> : ''}

            {nowvalue.teacherCollect !== 0 ?
              (nowvalue.teacherCollect === 1 ?
                <>  <div className={style.cuowuhui} style={{ right: 94 }}>   <img src={require('../../images/dui.png')} /></div>
                  <div className={style.cuowuhong}> <img src={require('../../images/cuo.png')} /></div></> :
                <><div className={style.truelv} style={{ right: 94 }}>   <img src={require('../../images/dui.png')} /> </div>
                  <div className={style.cuowuhui}>  <img src={require('../../images/cuo.png')} /></div></>) :
              <> <div className={style.cuowuhui} style={{ right: 94 }}>  <img src={require('../../images/dui.png')} /></div>
                <div className={style.cuowuhui}>  <img src={require('../../images/cuo.png')} /></div></>}

            <img style={{ width: '100%', height: 'auto' }} src={nowvalue.questionUrl.indexOf('?') > 0 ? `${nowvalue.questionUrl}/thumbnail/1000x` : `${nowvalue.questionUrl}?imageMogr2/thumbnail/1000x`} />
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
      gundt: false,
      //预批改是否收藏
      collect: 1,
      masters: [],
      buttonGo: false,
      cqxq: false,
      optimizationcuotiMistakes: [],
      nowRecommendId: '',
      videoId: ''
    };
    observer.addSubscribe('trueOrFalse', this.yupirightb.bind(this))
  }
  onImportExcel = file => {
    let form = new FormData();
    let fil = document.getElementById("file").files[0];
    if (fil.type.indexOf('mp4') < 0) {
      message.warning('上传文件只支持mp4');
      return false
    }
    console.log(fil.size)
    if ((fil.size / 1024) / 1024 >= 50) {
      message.warning('上传文件大小需小于50Mb');
      return false
    }
    form.append('file', document.getElementById("file").files[0]);


    var url = URL.createObjectURL(document.getElementById("file").files[0]);
    var audioElement = new Audio(url);
    var duration;
    audioElement.addEventListener("loadedmetadata", function (_event) {
      duration = audioElement.duration;
    });
    let This = this;
    This.props.dispatch({
      type: 'report/toupload',
      payload: true
    });
    let token = store.get('wrongBookToken');
    fetch(dataCenter('/file/uploadFile?token=' + token), {
      method: "POST",
      body: form,
      headers: {
        "Authorization": token
      }
    })
      .then(response => response.json())
      .then(res => {
        if (res.result === 0) {
          This.props.dispatch({
            type: 'report/uploadVideo',
            payload: {
              videoId: This.state.videoId,
              url: res.data.path,
              duration: parseInt(duration)
            }
          })
        } else {
          message.error(res.msg)
        }
      })
      .catch(function (error) {
        message.error(error.msg)
      })

  }

  addVie() {
    const userId = store.get('wrongBookNews').userId;
    let value = 'http://hw-test.mizholdings.com/wx/';
    //测试
    if (serverType === 0) {
      value = 'http://dev.kacha.xin/wx/';
    }
    if (this.state.videoId === ''&& !this.props.state.visible1) {
      this.props.dispatch({
        type: 'report/videoPrepare',
        payload: {
          questionId: this.state.nowRecommendId,
          videoType: 3,
          schoolId: store.get('wrongBookNews').schoolId,
        }
      }).then((res) => {
        this.setState({
          videoId: res
        })
      })
    }

    value += 'video?videoId=' + this.state.videoId;
    let This = this;
    // console.log(this.props.state.visible1,this.props.state.toupload )
    if (!this.props.state.visible1 && !this.props.state.toupload && this.state.videoId !== '') {
      var timestamp = new Date().getTime() + "";
      timestamp = timestamp.substring(0, timestamp.length - 3);
      var websocket = null;
      //判断当前浏览器是否支持WebSocket
      let url = dataCen('/report/ws/teachVideoUpload?videoId=' + this.state.videoId)
      if ('WebSocket' in window) {
        websocket = new WebSocket(url);
      } else {
        alert('当前浏览器  Not support websocket');
      }
      //连接发生错误的回调方法
      websocket.onerror = function () {
        console.log("WebSocket连接发生错误");
      };
      //连接成功建立的回调方法
      websocket.onopen = function () {
        console.log("WebSocket连接成功");
      }
      //接收到消息的回调方法
      websocket.onmessage = function (event) {
        console.log(event)
        let data = JSON.parse(event.data);
        let json;
        if (data.status == 2) {
          This.props.dispatch({
            type: 'report/toupload',
            payload: true
          });

        }
        if (data.url) {
          json = JSON.parse(data.url)
          message.success('视频已发送至学生端，可提醒学生及时复习')

          This.props.dispatch({
            type: 'report/updataVideo',
            payload: {
              video: json,
            }
          });
          This.props.dispatch({
            type: 'report/videlUrl',
            payload: json.url
          });
          This.props.dispatch({
            type: 'report/visible1',
            payload: true
          });
          This.props.dispatch({
            type: 'report/toupload',
            payload: false
          });

        }

      }
      //连接关闭的回调方法
      websocket.onclose = function () {
        console.log("WebSocket连接关闭");

        This.props.dispatch({
          type: 'report/toupload',
          payload: false
        });
      }

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，
      //防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function () {
        //关闭WebSocket连接
        websocket.close();
      }

    }
    let questionNews = this.props.state.questionNews;

    return (
      <div className={style.codeFram} style={{ textAlign: 'center', overflow: "hidden" }}>
        <div className={style.questionBody}>
          <div className={style.questionTop}>
            <span>答错<span
              style={{ color: "#1890ff", fontWeight: 'bold', padding: '0 5px' }}>{questionNews.wrongNum}</span>人</span>
          </div>
          <div style={{ padding: '10px', height: '250px', overflow: 'hidden' }}>
            {
              questionNews.question.split(',').map((item, i) => (
                <img key={i} style={{ width: '100%' }}
                  src={item.indexOf('?') > 0 ? `${item}/thumbnail/1000x` : `${item}?imageMogr2/thumbnail/1000x`} ></img>
              ))
            }
          </div>
        </div>
        <div className={style.phoneCode}>
          {
            !this.props.state.visible1 ?
              <div>
                {
                  !this.props.state.toupload ?
                    <div>
                      <QRCode className='qrcode' size={150} value={value} />
                      <p style={{ marginTop: 20, fontSize: '16px', color: '#606266' }}>手机微信扫码，录制视频讲解</p>

                      <label htmlFor="file">
                        <span className={style.addButon}>本地上传</span>
                        <p style={{ margin: '10px 0' }}>支持文件类型:mp4 </p>
                        <p style={{ margin: '10px 0' }}>文件大小限制:50MB</p>
                      </label>
                      <input
                        type='file'
                        id='file'
                        accept='video/mp4'
                        style={{ display: 'none' }}
                        onChange={this.onImportExcel}
                      />
                    </div> :
                    <div>
                      <Spin style={{ height: '155px', marginLeft: '-24px', lineHeight: "150px" }} indicator={antIcon} />
                      {/* <Icon type="loading" style={{ fontSize: 24 }} spin /> */}
                      <p style={{ marginTop: 20, fontSize: '16px', color: '#606266' }}>正在上传...</p>
                      <span className={style.addButon}>本地上传</span>
                      <p style={{ margin: '10px 0' }}>支持文件类型：mp4 </p>
                      <p style={{ margin: '10px 0' }}>文件大小限制：50MB</p>
                    </div>
                }
              </div>
              :
              <div>
                <video
                  id="video"
                  controls="controls"
                  width="100%"
                  style={{ height: '210px' }}
                  src={this.props.state.videlUrl}
                  controls>
                </video>
                <span
                  className={style.addButon}
                  onClick={() => {
                    let This = this;
                    console.log(This.props.state.num)
                    console.log(questionNews.teachVideo)
                    confirm({
                      title: '确认删除讲解视频？',
                      okText: '是',
                      cancelText: '否',
                      onOk() {
                        This.props.dispatch({
                          type: 'report/deleteTeachVideo',
                          payload: {
                            videoId: questionNews.teachVideo.videoId,
                            key: This.props.state.num
                          }
                        })
                      },
                      onCancel() {
                      },
                    });
                  }}
                >删除视频</span>
              </div>
          }
        </div>
      </div>
    )
  }

  handleScroll(e) {
    const { clientHeight } = this.refDom;
    hei = clientHeight;
  }


  //预批改(自动选择未全部批改题目)
  beforehandgai() {
    if (this.props.state.scoreDetail.length === 0) {
      return false;
    }
    //标记是从预批改按钮进入
    this.setState({
      buttonGo: true
    })

    let list = this.props.state.scoreDetail.data.questionScoreList;
    let timunumber, collect, uqIds = [];
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

        let cun = list[i].userAnswerList;
        for (let i = 0; cun.length > i; i++) {
          uqIds.push(cun[i].uqId)
        }

        timunumber = i + 1;
        collect = list[i].isMarker;
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
    if (uqIds.length > 0) {
      this.props.dispatch({
        type: 'report/getCorrection',
        payload: {
          uqIds
        }
      });
    }

    this.setState({
      aheadSelect: true,
      stugoto: false,
      timunumber,
      leftdaipi,
      collect
    })
  }

  //点击学错题，单个预批改
  danpigai(number) {
    //选择出未批改的一道题目
    let list = this.props.state.scoreDetail.data.questionScoreList;
    let uqId, timunumber, collect;

    this.props.dispatch({
      type: 'report/beforehand',
      payload: list[number],
    });
    // uqId = list[number].uqId.split('uqid-')[1];
    timunumber = number + 1;
    collect = list[number].isMarker;

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
    let cun = list[number].userAnswerList
    let uqIds = [];
    for (let i = 0; cun.length > i; i++) {
      uqIds.push(cun[i].uqId)
    }
    //调用对应的学生错题
    if (uqIds.length > 0) {
      this.props.dispatch({
        type: 'report/getCorrection',
        payload: {
          uqIds: uqIds
          // uqId,
          // classId: this.props.state.classId,
        }
      })
    }
    this.setState({
      aheadSelect: true,
      timunumber,
      leftdaipi,
      collect,
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
        subjectId: this.props.state.subId,
      };
      if (this.state.similarTopic === 1) {
        downparameters.practise = 0
      } else {
        downparameters.practise = 1
      };
      this.props.dispatch({
        type: 'down/makeTestPagePdf',
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
      let name = this.props.state.homeworkName;
      return (
        <div style={{ paddingTop: 10 }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'rgba(96,98,102,1)' }}>选择作业：</span>
          <Select
            // showSearch
            style={{ width: 250, margin: '0 20px' }}
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
          <div style={{ float: 'right' }}>
            <Button style={{
              background: '#67c23a',
              color: '#fff',
              float: 'right',
              marginTop: "9px",
              border: 'none',
              width: 140,
              padding: '0 15px'
            }}
              loading={this.props.state.downQue}
              disabled={this.props.state.workDown.length === 0 && !this.props.state.downQue}
              onClick={() => {
                this.setState({ pull: !this.state.pull })
              }}>
              <img style={{ margin: '0 3px 4px 2px', height: '15px' }}
                src={require('../../images/xc-cl-n.png')}></img>
              下载组卷({this.props.state.workDown.length})
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
                    <img style={{ margin: '0 9px 0 15px', height: '14px' }}
                      src={require('../../images/lvxz.png')}></img> :
                    <img style={{ margin: '0 9px 0 15px', height: '14px' }}
                      src={require('../../images/lvwxz.png')}></img>}
                  <span className={style.inputk}>下载原错题</span>
                </Row>
                <Row className={style.downloadrow} style={{ lineHeight: 1, textAlign: 'left' }}>
                  {this.state.similarTopic === 2 ?
                    <img style={{ margin: '0 9px 0 15px', height: '14px' }}
                      src={require('../../images/lvxz.png')}></img> :
                    <img style={{ margin: '0 9px 0 15px', height: '14px' }}
                      src={require('../../images/lvwxz.png')}></img>}
                  <span className={style.inputk}>
                    <p style={{ margin: '15px 0 0 0' }}>下载原错题＋</p>
                    <p style={{ margin: 0 }}>优选练习</p> </span>
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
    let wi = window.open('about:blank', '_blank');
    this.props.dispatch({
      type: 'report/searchLink',
      payload: { picId, wi },
    });
  }

  //错题列表
  questions() {
    let questionDetail = this.props.state.scoreDetail;
    if (questionDetail.data) {
      return (
        <div style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
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
                    <span style={{ marginRight: "20px" }}>第{i + 1}题</span>
                    <span>答错
                      <span style={{ color: "#1890ff", fontWeight: 400, }}
                      >{item.wrongNum}</span>人</span>
                    {item.isMarker === 0 ?
                      <Icon type="heart" theme="filled" style={{ color: '#FF8551', marginLeft: 5 }} /> : ''}
                  </div>
                  <div style={{ padding: '20px', height: '217px', overflow: "hidden" }} onClick={() => {
                    this.danpigai(i);
                    this.setState({
                      stugoto: true,
                      topicxy: true
                    })
                  }}>
                    {item.title && item.type === 0 ?
                      <div dangerouslySetInnerHTML={{ __html: item.title }} />
                      :
                      <img key={i} style={{ width: '100%' }}
                        src={item.question.split(',')[0].indexOf('?') > 0 ? `${item.question.split(',')[0]}/thumbnail/1000x` : `${item.question.split(',')[0]}?imageMogr2/thumbnail/1000x`}></img>
                    }
                  </div>
                  <div style={{ overflow: 'hidden', paddingLeft: '10px', }}>
                    <span style={item.wrongScore === 0 ? { float: 'left', color: '#409eff', marginTop: 5, cursor: 'no-drop' } : { float: 'left', color: '#409eff', cursor: 'pointer', marginTop: 5 }}
                      onClick={() => {
                        if (item.wrongScore !== 0) {
                          let tcxuhao = i + 1;
                          let errorDetails = this.props.state.scoreDetail.data.questionScoreList[i];

                          if (errorDetails.recommendId !== 0) {
                            this.props.dispatch({
                              type: 'report/recommend',
                              payload: {
                                uqId: errorDetails.recommendId
                              }
                            }).then((res) => {
                              this.setState({
                                optimizationcuotiMistakes: res
                              })
                            })
                          }

                          this.setState({ xqtc: true, errorDetails, tcxuhao })
                        }

                      }}> <img src={require('../../images/statistics.png')} style={{ marginRight: '6px' }} />
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
                      <img src={require('../../images/seek.png')} style={{ marginRight: '6px' }} />
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
                          <img style={{ marginTop: '-4px', marginRight: '4px' }}
                            src={require('../../images/sp-xt-n.png')} /> :
                          <img style={{ marginTop: '-4px', marginRight: '4px' }}
                            src={require('../../images/sp-yc-n.png')} />
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
              <div key={i} style={i === 0 ? { zIndex: 20 } : {}}>
                <div className={style.annulusbase} key={i}>
                  <div className={style.annulnei}>0%</div>
                  <div className={style.annulusfull}></div>
                </div>
                <div style={{ textAlign: 'center', marginBottom: 5, position: 'relative' }}>{i + 1}
                  {item.isMarker === 0 ?
                    <Icon type="heart" theme="filled" style={{ color: '#FF8551', marginLeft: 2 }} /> : ''}
                  {/*引导图*/}
                  {i === 0 ? <Guidance title='单题题号' content='单击红色题号，查看本题答题详情' /> : ''}
                </div>
              </div>
            )
          } else {
            return (
              <div key={i} style={i === 0 ? { cursor: 'pointer', zIndex: 20 } : { cursor: 'pointer' }}
                onClick={() => {
                  let tcxuhao = i + 1;
                  let errorDetails = item;
                  if (item.recommendId !== 0) {
                    this.props.dispatch({
                      type: 'report/recommend',
                      payload: {
                        uqId: item.recommendId
                      }
                    }).then((res) => {
                      this.setState({
                        optimizationcuotiMistakes: res
                      })
                    })
                  }

                  this.setState({ xqtc: true, errorDetails, tcxuhao })
                }}>
                <div className={style.annulusbase}>
                  <div className={style.annulnei}>{(Math.floor(item.wrongScore * 1000) / 10).toFixed()}%</div>
                  <div className={style.annulusjd}></div>
                  {item.wrongScore > 0.5 ?
                    <div className={style.leftshade} style={{ transform: `rotate(${180 * item.wrongScore}deg)` }}></div> :
                    <div className={style.leftshade}></div>}
                  {item.wrongScore < 0.5 ?
                    <div className={style.rightshade} style={{ transform: `rotate(${360 * item.wrongScore}deg)` }}></div>
                    : <div className={style.rightshade} style={{ background: '#FF7F69' }}></div>}
                  {/*加下面一个div是因为hidde在移动端失效导致样式不对*/}
                  <div className={style.coverCircle}></div>
                </div>
                <div style={{ textAlign: 'center', marginBottom: 5, position: 'relative', zIndex: 15 }}>{i + 1}
                  {item.isMarker === 0 ?
                    <Icon type="heart" theme="filled" style={{ color: '#FF8551', marginLeft: 2 }} /> : ''}
                  {/*引导图*/}
                  {i === 0 ? <Guidance title='单题题号' content='单击红色题号，查看本题答题详情' /> : ''}
                </div>
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
      topicxy: true,
      collect: 1
    });
    let beforstuTopic = this.props.state.beforstuTopic;
    for (let i = 0; i < beforstuTopic.length; i++) {
      if (beforstuTopic[i].teacherCollect === 0) {
        beforstuTopic[i].teacherCollect = 2
      }
    }
    if (beforstuTopic[beforstuTopic.length - 1].true) {
      beforstuTopic.length = beforstuTopic.length - 1
    }
    this.props.dispatch({
      type: 'report/CorrectionMarker',
      payload: { CorrectionMarkerList: JSON.stringify(beforstuTopic) }
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
      }, () => {
        //清空关闭弹窗的有关数据
        this.props.dispatch({
          type: 'report/beforehand',
          payload: [],
        });
        this.props.dispatch({
          type: 'report/beforstuTopic',
          payload: []
        });
      });
    } else {
      //点击预批改进入预批改弹窗
      if (this.state.leftdaipi === 0) {
        //批改到最后一题的时候，点击其余全对关闭窗口
        //重新调用接口
        this.setState({
          aheadSelect: false
        });
        this.props.dispatch({
          type: 'report/queryHomeworkScoreDetail',
          payload: {
            homeworkId: this.props.state.homeworkId
          }
        }).then(() => {
          //清空关闭弹窗的有关数据
          this.props.dispatch({
            type: 'report/beforehand',
            payload: [],
          });
          this.props.dispatch({
            type: 'report/beforstuTopic',
            payload: []
          });
        });
      } else {
        //否则自动显示下一个未批改的题目
        let list = this.props.state.scoreDetail.data.questionScoreList;
        let timunumber = Number(this.state.timunumber), leftdaipi = this.state.leftdaipi, uqIds = [];
        for (let i = timunumber; i < list.length; i++) {
          if (list.length >= i && list[i].isAllCollect === 0) {
            this.props.dispatch({
              type: 'report/beforehand',
              payload: list[i],
            });

            let cun = list[i].userAnswerList
            for (let i = 0; cun.length > i; i++) {
              uqIds.push(cun[i].uqId)
            }
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
          type: 'report/beforstuTopic',
          payload: [],
        });
        if (uqIds.length > 0) {
          this.props.dispatch({
            type: 'report/getCorrection',
            payload: {
              uqIds
            }
          });
        }
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
        that.setState({ topicxy: false });
        let uqId = beforehand.uqId.split('uqid-')[1];
        that.props.dispatch({
          type: 'report/WrongQuestionMarker',
          payload: {
            uqId,
            userId: store.get('wrongBookNews').userId,
            way: 3
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
      topicxy: true,
      collect: 1
    }, () => {
      //如果从预批改按钮进入，关闭弹窗时，重新调用接口
      if (this.state.buttonGo) {
        this.props.dispatch({
          type: 'report/queryHomeworkScoreDetail',
          payload: {
            homeworkId: this.props.state.homeworkId
          }
        });
      }
      this.setState({
        buttonGo: false
      })
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
        title: <div style={{ color: 'rgb(144, 147, 153)', fontWeight: 'bold' }}>序号</div>,
        key: 'index',
        width: '80px',
        align: 'center',
        className: 'padb0',
        render: (text, record, index) => {
          return (
            <div className='space' style={{ textAlign: 'center' }} >
              {`${index + 1}`}
            </div>
          )
        }
      },
      {
        title: <div style={{ color: 'rgb(144, 147, 153)', fontWeight: 'bold' }}>姓名</div>,
        dataIndex: 'name',
        key: 'name',
        width: '140px',
        align: 'center',
        className: 'padb0',
        render: (text, record, index) => {
          return (
            <div className='space' style={{ textAlign: 'center' }}>
              {text}
            </div>
          )
        }
      },
      {
        title: <div style={{ color: 'rgb(144, 147, 153)', fontWeight: 'bold' }}>错误率</div>,
        dataIndex: 'wrong',
        key: 'wrong',
        width: '100px',
        align: 'center',
        className: 'padb0',
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }} onClick={() => {
            }}>
              {(text * 100).toFixed(0)}%
            </div>
          );
        }
      },
      {
        title: <div style={{ color: 'rgb(144, 147, 153)', fontWeight: 'bold' }}>提交时间</div>,
        dataIndex: 'time',
        key: 'time',
        width: '140px',
        className: 'padb0',
        align: 'center',
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              <Icon type="clock-circle" style={{ marginRight: '10px' }} />
              {text}
            </div>
          );
        }
      },
      {
        title: <div style={{ lineHeight: '17px', minWidth: 400 }}>
          <span style={{ color: 'rgb(144, 147, 153)', fontWeight: 'bold', paddingLeft: 15 }}>题目详情</span>
          <span style={{ position: 'absolute', right: '400px', fontSize: '14px' }}>
            <img className={style.tabletu} src={require('../../images/gou.png')}></img>
            <span className={style.tablezi}>正确</span>
          </span>
          <span style={{ position: 'absolute', right: '340px', fontSize: '14px' }}>
            <img className={style.tabletu} src={require('../../images/cha.png')}></img>
            <span className={style.tablezi}>错误</span>
          </span>
          <span style={{ position: 'absolute', right: '265px', fontSize: '14px' }}>
            <div className={style.baiyuan}></div>
            <span className={style.tablezi}>未批改</span>
          </span>
          <span style={{ position: 'absolute', right: '160px', fontSize: '14px' }}>
            <Icon type="exclamation-circle" theme='filled' style={{
              color: '#F3F3F4',
              marginRight: '5px',
              background: '#B8B8B9',
              borderRadius: '50%',
              fontSize: 15
            }} />
            <span className={style.tablezi}>题目未匹配</span>
          </span>
        </div>,
        dataIndex: 'news',
        key: 'news',
        className: 'padb0',
        render: (text, record, index) => {
          let arr = []
          for (let i = 0; i < text.length; i++) {
            arr.push(
              text[i] == -1 ?
                <Icon key={`news-${i}`} type="exclamation-circle" theme='filled' className={'quicon'} />
                :
                <span key={`news-${i}`} className={text[i] === 0 ? 'qunot' : (text[i] === 1 ? 'quwrong' : 'qutrue')}>{i + 1}</span>
            )
          }
          return <div style={{ display: 'flex', flexWrap: 'wrap' }}>{arr}</div>
        }
      }, {
        title: <div style={{ color: 'rgb(144, 147, 153)', fontWeight: 'bold' }}>操作</div>,
        width: '140px',
        className: 'padb0',
        align: 'center',
        render: (text, record) => {
          return (
            <div style={{ textAlign: 'center', color: 'rgba(64,158,255,1)', cursor: 'pointer' }} onClick={() => {
              this.props.dispatch({
                type: 'report/getyuantu',
                payload: {
                  homeworkId: this.props.state.homeworkId,
                  userId: record.userId
                }
              }).then((res) => {
                this.setState({
                  masters: res
                })
              })
            }}>
              查看原图
            </div>
          );
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
          <Header className={style.layoutHead} style={{ borderBottom: ' 1px solid #EBEEF5' }}>
            {homeworkList.data && homeworkList.data.length ? this.getGrade() : ''}
          </Header>
          <Content style={{ overflow: 'auto', padding: '20px' }} id='bigwai'>
            <div style={{ display: 'flex', marginBottom: 20, flexWrap: 'wrap' }}>
              <div className={style.kuang} style={document.documentElement.clientWidth <= 1200 ? {} : { minWidth: 470 }}>
                <div className={style.kuangtop}>
                  班级平均错误率
                </div>

                <div style={document.documentElement.clientWidth <= 1200 ? { paddingLeft: '2%', position: 'relative' } : { paddingLeft: '15%', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={style.leftText}>
                      错误率
                        </span>
                    <span className={style.right} >

                      <Spring native to={{ number: classWrongScore ? classWrongScore : 0 }}>
                        {props => (<animated.span className={style.number}>
                          {props.number.interpolate(x => (x * 100).toFixed(0))}
                        </animated.span>
                        )}
                      </Spring>

                      {/* <span className={style.number}>{classWrongScore ? (classWrongScore * 100).toFixed(0) : '0'}
                      </span> */}
                      %
                    </span>
                  </div>
                  <div className={style.textzytg}>

                    比上一份作业{this.props.state.improveRate < 0 ? '降低' : '提高'}
                    <img style={this.props.state.improveRate < 0 ? { transform: 'rotate(180deg)', position: 'relative', top: -3 } : { position: 'relative', top: -3 }} src={require('../../images/uParrow.png')} />

                    <Spring native to={{ number: this.props.state.improveRate ? this.props.state.improveRate : 0 }}>
                      {props => (<animated.span>
                        {props.number.interpolate(x => Math.abs(x * 100).toFixed(0))}
                      </animated.span>
                      )}
                    </Spring>

                    {/* {Math.round(Math.abs(this.props.state.improveRate * 100))} */}
                    %
                  </div>

                  <div className={style.yuanzuo} style={document.documentElement.clientWidth <= 1200 ? { right: '32%' } : {}}>

                    <Spring native to={{ number: classWrongScore ? classWrongScore : 0 }}>
                      {props => (<animated.span>
                        {props.number.interpolate(x => (x * 100).toFixed(0))}
                      </animated.span>
                      )}
                    </Spring>

                    {/* {classWrongScore ? (classWrongScore * 100).toFixed(0) : '0'} */}
                    %
                  </div>


                  <div className={style.annulusBasics} style={document.documentElement.clientWidth <= 1200 ? { right: '1%' } : {}} >
                    <div className={style.centerCircle}></div>
                    <div className={style.annulusOuter}></div>
                    <Spring native to={{ number: classWrongScore ? classWrongScore : 0 }}>
                      {props => <>
                        <animated.div className={style.leftRectangle} style={{
                          transform: props.number.interpolate(x => (x > 0.5 ? `rotate(${180 * x}deg)` : 'rotate(0deg)'))
                        }}></animated.div>
                        <animated.div className={style.rightRectangle} style={{
                          transform: props.number.interpolate(x => (x <= 0.5 ? `rotate(${360 * x}deg)` : 'rotate(0deg)')),
                          background: props.number.interpolate(x => (x > 0.5 ? '#FF7F69' : '#EDEDED'))
                        }} ></animated.div>
                      </>}
                    </Spring>
                    <div className={style.repairAnnulus}></div>
                  </div>


                  {/* <div className={style.annulusBasics} style={document.documentElement.clientWidth <= 1200 ? { right: '1%' } : {}} >
                    <div className={style.centerCircle}></div>
                    <div className={style.annulusOuter}></div>
                    {classWrongScore > 0.5 ?
                      <div className={style.leftRectangle} style={{ transform: `rotate(${180 * classWrongScore}deg)` }}></div> :
                      <div className={style.leftRectangle} ></div>}
                    {classWrongScore < 0.5 ?
                      <div className={style.rightRectangle} style={{ transform: `rotate(${360 * classWrongScore}deg)` }}></div>
                      : <div className={style.rightRectangle} style={{ background: '#FF7F69' }} ></div>}

                    <div className={style.repairAnnulus}></div>
                  </div> */}



                </div>
              </div>
              <div className={style.kuang} style={document.documentElement.clientWidth <= 1200 ? { position: 'relative', zIndex: 25 } : { position: 'relative', zIndex: 25, minWidth: 470 }} >
                <div className={style.kuangtop}>
                  已批改题目
                </div>

                <div style={document.documentElement.clientWidth <= 1200 ? { display: 'flex', alignItems: 'center', paddingLeft: '5%' }
                  : { display: 'flex', alignItems: 'center', paddingLeft: '18%' }}>
                  <span className={style.leftText}>
                    已批改
                   </span>
                  <span className={style.right}>

                    <Spring native to={{ number: scoreDetail.data ? scoreDetail.data.collectNum : 0 }}>
                      {props => (<animated.span className={style.number}>
                        {props.number.interpolate(x => x.toFixed(0))}
                      </animated.span>
                      )}
                    </Spring>

                    {/* <span className={style.number}>{scoreDetail.data ? scoreDetail.data.collectNum : '0'}
                    </span> */}
                    题
                    </span>
                </div>

                <div className={style.texttj}
                  style={document.documentElement.clientWidth <= 1200 ? { paddingLeft: '5%' } : {}}>
                  共提交    <Spring native to={{ number: scoreDetail.data ? scoreDetail.data.allQuestionNum : 0 }}>
                    {props => (<animated.span className={style.number}>
                      {props.number.interpolate(x => x.toFixed(0))}
                    </animated.span>
                    )}
                  </Spring>
                  {/* {scoreDetail.data ? scoreDetail.data.allQuestionNum : '0'} */}
                  题次
                  </div>

                <Spring native to={{ number: scoreDetail.data ? (scoreDetail.data.allQuestionNum / scoreDetail.data.totalNum * 30) : 30 }}>
                  {props => (<animated.div className={style.longellipse} style={{ width: props.number.interpolate(x => `${x}%`) }}>
                  </animated.div>
                  )}
                </Spring>
                <Spring native to={{ number: scoreDetail.data ? (scoreDetail.data.collectNum / scoreDetail.data.totalNum * 30) : 0 }}>
                  {props => (<animated.div className={style.jindublue} style={{ width: props.number.interpolate(x => `${x}%`) }}>
                  </animated.div>
                  )}
                </Spring>
                {/* <div className={style.longellipse}
                  style={scoreDetail.data ? { width: `${scoreDetail.data.allQuestionNum / scoreDetail.data.totalNum * 30}%` } : { width: '30%' }
                  }>
                </div>

                <div className={style.jindublue}
                  style={scoreDetail.data ? { width: `${scoreDetail.data.collectNum / scoreDetail.data.totalNum * 30}%` } : { width: 0 }}>
                </div> */}

                <div className={style.gopigai} onClick={this.beforehandgai.bind(this)}
                  style={!scoreDetail.data || (scoreDetail.data && scoreDetail.data.collectNum === scoreDetail.data.allQuestionNum) ? {
                    background: '#ccc',
                    cursor: 'no-drop',
                  } : {}}>
                  预批改

                  {scoreDetail.data ? <Guidance title='预批改' content='通过标记错误，快速批改学生作业，及时了解全班作业详情' /> : ''}
                </div>

              </div>
              <div className={style.kuang} style={document.documentElement.clientWidth <= 1200 ? { zIndex: 22, position: 'relative' } : { minWidth: 470, zIndex: 22, position: 'relative', }} >
                <div className={style.kuangtop}>
                  未提交人数
                  <div className={style.chakanxq} onClick={() => { this.setState({ cqxq: true }) }}>
                    查看详情
                  </div>
                </div>

                <div style={document.documentElement.clientWidth <= 1200 ? { display: 'flex', alignItems: 'center', paddingLeft: '5%' } : { display: 'flex', alignItems: 'center', paddingLeft: '18%' }}>
                  <span className={style.leftText}>
                    未提交
                   </span>

                  <span className={style.right}>
                    <span className={style.number}>
                      <Spring native to={{ number: scoreDetail.data ? scoreDetail.data.unCommit : 0 }}>
                        {props => (<animated.span className={style.number}>
                          {props.number.interpolate(x => x.toFixed(0))}
                        </animated.span>
                        )}
                      </Spring>
                      {/* {scoreDetail.data ? scoreDetail.data.unCommit : 0} */}
                    </span>人
                    </span>
                </div>

                <div className={style.longellipse}> </div>


                <Spring native to={{ number: scoreDetail.data ? (scoreDetail.data.allQuestionNum / (scoreDetail.data.unCommit + scoreDetail.data.allQuestionNum) * 30) : 0 }}>
                  {props => (
                    <animated.div className={style.jindublue} style={{ width: props.number.interpolate(x => `${x}%`), background: 'rgba(89,215,80,1)' }}>
                    </animated.div>
                  )}
                </Spring>

                {/* <div className={style.jindublue} style={scoreDetail.data ?
                  { width: `${scoreDetail.data.allQuestionNum / (scoreDetail.data.unCommit + scoreDetail.data.allQuestionNum) * 30}%`, background: 'rgba(89,215,80,1)' } : { width: 0, background: 'rgba(89,215,80,1)' }}>
                </div> */}


                <div className={style.texttj} style={document.documentElement.clientWidth <= 1200 ? { paddingLeft: '5%' } : {}}>
                  已提交作业 <Spring native to={{ number: scoreDetail.data ? scoreDetail.data.commit : 0 }}>
                    {props => (<animated.span className={style.number}>
                      {props.number.interpolate(x => x.toFixed(0))}
                    </animated.span>
                    )}
                  </Spring>
                  {/* {scoreDetail.data ? scoreDetail.data.commit : 0} */}
                  人
                </div>

                <div className={style.remind} style={document.documentElement.clientWidth <= 1200 ? { left: '50%' } : {}}
                  onClick={() => {
                    if (scoreDetail.length === 0) {
                      return false
                    }
                    if (scoreDetail.data && scoreDetail.data.unCommitId.length > 0) {
                      this.props.dispatch({
                        type: 'report/remindHomework',
                        payload: {
                          userId: scoreDetail.data.unCommitId,
                          subjectId: this.props.state.subId,
                        }
                      })
                    } else {
                      message.info('已全部提交')
                    }
                  }}>提醒上交作业
                    {scoreDetail.data ? <Guidance title='未交作业一键提醒' content='点击可通过公众号提醒家长及时上交作业' /> : ''}
                </div>


              </div>
            </div>

            <div className={style.singleError}>
              <span className={style.singlefont}>单题错误率</span>
              <div style={{ marginTop: 60, display: 'flex', flexWrap: 'wrap' }}>
                {this.doughnut()}
              </div>
            </div>

            <iframe style={{ display: 'none' }} src={this.state.wordUrl} />
            <div className={style.fenye} id='fenye'>
              {
                dataSource != [] ?
                  <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    rowClassName="editable-row"
                    style={{ marginBottom: 25 }}
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
          width={window.screen.width <= 1280 ? '1180px' : '90%'}
          onCancel={this.yptcCancel.bind(this)} >
          <div style={{ display: 'flex', height: 850 }}>
            <div className={style.aheadLeft}>
              <p className={style.aheadTitle}>
                {this.state.stugoto ? '当前题目：' : `题目列表：待批改${this.state.leftdaipi}题`}
                <span style={{ fontSize: 16, cursor: 'pointer' }} onClick={() => {
                  let collect = this.state.collect;
                  if (collect === 1) {
                    //0收藏
                    collect = 0;
                  } else {
                    collect = 1;
                  }
                  this.setState({
                    collect
                  });
                  this.props.dispatch({
                    type: 'report/teacherCollect',
                    payload: {
                      uqId: beforehand.uqId.split('uqid-')[1],
                      type: collect
                    }
                  }).then(function (res) {
                    if (collect === 0) {
                      message.success('题目收藏成功！');
                    }
                  }).then(() => {
                    this.props.dispatch({
                      type: 'report/queryHomeworkScoreDetail',
                      payload: {
                        homeworkId: this.props.state.homeworkId
                      }
                    })
                  })
                }}>
                  {this.state.collect === 0 ?
                    <><Icon type="heart" theme="filled" style={{ color: '#FF8551', marginRight: 5 }} /> 已收藏</> :
                    <><Icon type="heart" theme="filled" style={{ color: '#B6BAC3', marginRight: 5 }} /> 收藏</>
                  }
                </span>
              </p>
              <Content className={style.aheadLeftCon}>
                {beforehand ?
                  (beforehand.title && beforehand.type === 0 && this.state.topicxy ?
                    <div key={beforehand.questionId} className={style.aheadbox} style={{ padding: 30, paddingRight: 0 }}>

                      <div className={style.bluetriangle} style={{ borderTopWidth: 40, zIndex: 1 }}></div>
                      <div className={style.bulesz} style={{ zIndex: 1 }}>{this.state.timunumber}</div>
                      <div style={{ position: 'absolute', right: 0, top: 0, padding: ' 5px 15px 0 0', background: '#F7F8FC', width: '100%', height: 30 }}
                        onClick={() => {
                          this.setState({
                            nowRecommendId: beforehand.recommendId
                          })
                        }}>
                        <span hidden={beforehand.recommendId <= 0 ? true : false}>
                          <TracksVideo type={beforehand} num={this.state.timunumber - 1}></TracksVideo>
                        </span>

                      </div>

                      <div className={style.matchingErrorBottom} onClick={this.pipeicw.bind(this, beforehand)}>
                        <Icon theme='filled' type="exclamation-circle"
                          style={{ color: '#C0C8CF', fontSize: 16, marginRight: 8 }} /> 题目匹配报错
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
                        <div dangerouslySetInnerHTML={{ __html: beforehand.title }} />
                        <div className={style.txlefttitle}>【考点】</div>
                        <div dangerouslySetInnerHTML={{ __html: beforehand.knowledgeName || '暂无考点' }} />
                        <div className={style.txlefttitle}> 【答案与解析】</div>
                        <div dangerouslySetInnerHTML={{ __html: beforehand.answer }} />
                      </div>
                    </div>
                    :
                    <div className={style.aheadbox}>
                      <div className={style.bluetriangle} style={{ borderTopWidth: 40, zIndex: 1 }}></div>
                      <div className={style.bulesz} style={{ zIndex: 1 }}>{this.state.timunumber}</div>
                      <div style={{ position: 'absolute', right: 0, top: 0, padding: ' 5px 15px 0 0', background: '#F7F8FC', width: '100%', height: 30 }}>
                        <span hidden={beforehand.recommendId <= 0 ? true : false}>
                          <TracksVideo type={beforehand} num={this.state.timunumber - 1}></TracksVideo>
                        </span>
                      </div>

                      {beforehand.question ?
                        <img style={{ width: '100%' }}
                          src={beforehand.question.split(',')[0].indexOf('?') > 0 ? `${beforehand.question.split(',')[0]}/thumbnail/1000x` : `${beforehand.question.split(',')[0]}?imageMogr2/thumbnail/1000x`} />
                        : ''
                      }
                    </div>)
                  : ''
                }
              </Content>
            </div>
            <div className={style.aheadRight} style={{ width: 'calc(100% - 380px)' }}>

              <div className={style.yupitctopzi}>{this.props.state.homeworkName}  &nbsp; 预批改</div>
              <div style={{ fontSize: 18, padding: '0 40px 0 50px', color: 'rgba(85,91,108,1)' }}>
                <span style={{ position: 'absolute' }}>答题列表：待批{this.props.state.dainumber}人 </span>
                <span style={{ display: 'block', textAlign: 'center' }}>点击标记错题 </span>
              </div>

              <div style={{ padding: '10px 30px 20px 40px' }}>
                {beforstuTopic.length > 0 ?
                  <AutoSizer>
                    {({ height, width }) => (
                      <VariableSizeGrid
                        height={650}
                        columnWidth={() => '50%'}
                        rowHeight={index => {
                          let one = beforstuTopic[(2 * index)],
                            two = beforstuTopic[(2 * index + 1)],
                            hanggao;
                          try {
                            //取同一行中高度值最高的进行计算
                            if (two && one.height / one.width < two.height / two.width) {
                              hanggao = (610 * two.height) / two.width + 60;
                            } else {
                              hanggao = (610 * one.height) / one.width + 60;
                            }
                          } catch (e) {
                            console.error('虚拟滚动高度计算')
                          }
                          //设置最小高度
                          if (hanggao > 150) {
                            return hanggao
                          } else {
                            return 150;
                          }
                        }}
                        width={window.screen.width <= 1280 ? 680 : width}
                        columnCount={window.screen.width <= 1280 ? 1 : 2}
                        rowCount={window.screen.width <= 1280 ? beforstuTopic.length : (beforstuTopic.length / 2)}
                        itemData={beforstuTopic}
                        className={'aheadRightCon'}
                      >
                        {ItemRenderer}
                      </VariableSizeGrid>
                    )}
                  </AutoSizer> : ''
                }
                {beforstuTopic.length > 0 ?
                  <div style={{ width: '100%', textAlign: 'right', bottom: '-670px', position: 'relative' }}>
                    <div className={style.jindukang}>
                      <span className={style.jinduerr}
                        style={
                          beforstuTopic.length > 0 && beforstuTopic[beforstuTopic.length - 1].hasOwnProperty('true') ?
                            { width: `${Math.floor((this.props.state.cuowunumber / (beforstuTopic.length - 1)) * 100)}%` } :
                            { width: `${Math.floor((this.props.state.cuowunumber / beforstuTopic.length) * 100)}%` }
                        }>
                      </span>
                      <span className={style.jinduzi}>错误{this.props.state.cuowunumber}人
                      <span style={{ color: '#A7ABAF' }}>
                          （共{beforstuTopic[beforstuTopic.length - 1].true ? beforstuTopic.length - 1 : beforstuTopic.length}人）</span></span>

                    </div>
                    <Button type="primary" style={{ width: 183, lineHeight: '44px', height: 44, fontSize: 16, borderRadius: 3 }}
                      onClick={this.allOther.bind(this)}>完成</Button>
                  </div> : ''
                }

              </div>
            </div>

          </div>
        </Modal>
        <MistakesTC
          tcxuhao={this.state.tcxuhao}
          xqtc={this.state.xqtc}
          guanbi={() => { this.setState({ xqtc: false }) }}
          errorDetails={this.state.errorDetails}
          optimizationcuotiMistakes={this.state.optimizationcuotiMistakes}
          pipeicw={(uqId) => {
            this.props.dispatch({
              type: 'report/WrongQuestionMarker',
              payload: {
                uqId: uqId,
                userId: store.get('wrongBookNews').userId,
                way: 3
              }
            });
          }} />
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
          className={commonCss.pdfModal} >
          <div style={{ height: '700px' }}>
            <iframe src={fileLink} title='下载预览' style={{ width: '100%', height: '100%', border: 0 }}></iframe>
          </div>
        </Modal>

        <Modal
          visible={this.props.state.visible}
          footer={null}
          width='950px'
          title='添加讲解视频'
          className={style.vidioCode}
          onOk={() => {
            this.props.dispatch({
              type: 'report/visible',
              payload: false
            });
            this.setState({
              videoId: ''
            })
          }}
          onCancel={() => {
            this.props.dispatch({
              type: 'report/visible',
              payload: false
            });
            this.setState({
              videoId: ''
            })
          }}>
          {this.props.state.visible ? this.addVie() : ''}
        </Modal>

        <Modal
          footer={null}
          title={false}
          visible={this.state.cqxq}
          width='60%'
          onCancel={() => {
            this.setState({
              cqxq: false
            })
          }}>
          <p style={{ fontSize: 18, color: 'rgba(48, 49, 51, 1)', margin: '0 0 30px 0' }}>提交详情</p>
          <p style={{ fontSize: 13, color: '#606266', borderBottom: '1px dashed #ECEDEE' }}>未提交<span style={{ fontSize: 16, color: '#409EFF' }}>
            &nbsp; {scoreDetail.data ? scoreDetail.data.unCommit : 0}人</span> </p>
          <div style={{ lineHeight: '26px', padding: '0 28px', maxHeight: 380, overflow: 'auto' }} >
            {scoreDetail.data && scoreDetail.data.hasOwnProperty('unCommitName') && scoreDetail.data.unCommitName.length > 0 ?
              scoreDetail.data.unCommitName.map((item, i) => {
                return <span key={i} className={style.notsubmit}>
                  {item}
                </span>
              }) : ''
            }
          </div>
          <p style={{ fontSize: 13, color: '#606266', borderBottom: '1px dashed #ECEDEE', marginTop: 50 }}>已提交<span style={{ fontSize: 16, color: '#409EFF' }}>
            &nbsp; {scoreDetail.data ? scoreDetail.data.commit : 0}人</span> </p>
          <div style={{ lineHeight: '26px', padding: '0 30px' }} >
            {scoreDetail.data && scoreDetail.data.commitName.length > 0 ?
              scoreDetail.data.commitName.map((item, i) => {
                return <span key={i} className={style.notsubmit}>
                  {item}
                </span>
              }) : ''
            }
          </div>
        </Modal>


        <PhotoLayer masters={this.state.masters} clearMasters={() => {
          this.setState({
            masters: []
          })
        }} />
      </Content >
    );
  }

  componentDidMount() {

    if (this.props.state.classId != '' && this.props.state.subId != '') {
      console.log(111)
      this.props.dispatch({
        type: 'report/queryHomeworkList',
        payload: {
          classId: this.props.state.classId,
          subjectId: this.props.state.subId
        }
      })
    }

    this.props.dispatch({
      type: 'down/showPdfModal',
      payload: false
    });
    // 使用滚动时自动加载更多
    const loadMoreFn = this.props.loadMoreFn
    const wrapper = this.refs.wrapper

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
    ...state.example
  }
}))(WorkReport);
