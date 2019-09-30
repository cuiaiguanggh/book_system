import React from 'react';
import {
  Button, message, Layout, Modal, Select, Icon, Spin, Checkbox, Row, Col, DatePicker, Popover
} from 'antd';
import { dataCenter, dataCen, serverType } from '../../../config/dataCenter'
// import { routerRedux, } from "dva/router";
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import moment from 'moment';
import 'moment/locale/zh-cn';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './classReport.less';

import { request } from 'http';
import TracksVideo from '../TracksVideo/TracksVideo';
import store from 'store';
import commonCss from '../../css/commonCss.css';
import MistakesTC from '../../components/mistakesTC/mistakesTC';
import Guidance from '../../components/guidance/guidance';
//作业中心界面内容
const Option = Select.Option;
const confirm = Modal.confirm;
const {
  Header, Footer, Sider, Content,
} = Layout;
const { RangePicker } = DatePicker;
const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;
let hei = 200;
class wrongTop extends React.Component {
  constructor(props) {
    super(props);
    this.Ref = ref => {
      this.refDom = ref
    };
    this.state = {
      visible: false,
      wordUrl: '',
      loading: false,
      hei: 0,
      next: true,
      visible1: false,
      userId: '',
      uqId: '',
      allPdf: false,
      toupload: false,
      pull: false,
      topicxy: false,
      xqtc: false,
      errorDetails: {},
      tcxuhao: 0,
      zoom: false,
      similarTopic:1
    };
  }

  //搜索题目跳转链接
  tiaoz(picId) {
    let wi = window.open('about:blank', '_blank');
    this.props.dispatch({
      type: 'report/searchLink',
      payload: { picId,wi },
    });
  }

  handleScroll(e) {
    const { clientHeight } = this.refDom;
    hei = clientHeight;
  }

  quesList() {
    let ques = this.props.state.qrdetailList.data;
    return (
      <div className={style.outBody}
        onWheel={(e) => this.handleScroll(e)}
           style={{position: 'relative'}}
        ref={this.Ref}
      >
          {
            ques.questionList.map((item, i) => {
              let ans = []
              for (let i = 0; i < item.userAnswerList.length; i++) {
                if (item.userAnswerList[i].result == 0) {
                  ans.push(item.userAnswerList[i].answer)
                }
              }
              let downs = this.props.state.classDown;
              let cls = 'down', name = '选题';
              if (this.state.allPdf) {
                cls = 'down ndown';
                name = '移除';
              }
              for (let j = 0; j < downs.length; j++) {
                if (downs[j] == item.questionId) {
                  cls = 'down ndown';
                  name = '移除'
                }
              }
              let j = i;
              return (
                <div key={i} className={style.questionBody}>
                  <div className={style.questionTop}>
                    <span style={{ marginRight: '20px' }}>第{i + 1}题</span>
                    <span>答错<span style={{ color: "#409EFF" }}>{item.wrongNum}</span>人</span>
                    {
                      item.num != 0 ?
                        <span style={{ marginLeft: '10px', borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>已出卷<span
                          style={{ color: "#409EFF" }}>{item.num}</span>次</span>
                        : ''
                    }
                    <div style={{float:'right',position: 'relative',zIndex: 1}}>
                    <TracksVideo type={item} num={j}></TracksVideo>
                    {i===1?<Guidance title='录视频' content='微信扫码，可录制或上传讲解视频'/>:''}
                  </div>
                  </div>
                  <div style={{ padding: '20px', height: '217px', overflow: 'hidden' }} onClick={() => {
                    if (item.wrongScore != 0) {
                      let errorDetails = this.props.state.qrdetailList.data.questionList[i];
                      let tcxuhao = i + 1;
                      this.setState({ xqtc: true, errorDetails, tcxuhao })
                    }
                  }}>

                    {item.title  && item.type===0?
                      <div dangerouslySetInnerHTML={{ __html: item.title }} />
                      :
                      item.questionUrl && item.questionUrl.split(',').map((item, i) => (
                        <img key={i} style={{ width: '100%' }} src={item}></img>
                      ))
                    }
                  </div>
                  <div style={{ overflow: 'hidden', paddingLeft: '10px', }}>
                    <span className={style.wrongbluezi}
                    style={item.wrongScore===0?{cursor:'no-drop'}:{cursor: 'pointer'}} 
                      onClick={() => {
                        if (item.wrongScore != 0) {
                          let tcxuhao = i + 1;
                          let errorDetails = this.props.state.qrdetailList.data.questionList[i];
                          this.setState({ xqtc: true, errorDetails, tcxuhao })
                        }
                      }}> <img src={require('../../images/statistics.png')} style={{ marginRight: '6px' }} />
                      查看统计</span>

                    <span style={{ marginLeft: '24px' }}
                      className={style.wrongbluezi}
                      onClick={this.tiaoz.bind(this, item.picId)}>
                      <img src={require('../../images/seek.png')} style={{ marginRight: '6px' }} />
                      搜索题目
                      {i===0?<Guidance title='搜索题目' content='点击可自动复制题目并跳转网页搜题'    />:''}
                    </span>

                    <span className={cls} onClick={() => {
                      let dom = document.getElementsByClassName('down');
                      let downs = this.props.state.classDown;
                      if (dom[i].innerText == '选题') {
                        cls = 'down ndown';
                        name = '移除'
                        this.props.dispatch({
                          type: 'down/classDown',
                          payload: item.questionId
                        });
                        this.props.dispatch({
                          type: 'down/classDownPic',
                          payload: item.picId
                        });
                      } else {
                        cls = 'down';
                        name = '选题'
                        this.props.dispatch({
                          type: 'down/delClassDown',
                          payload: item.questionId
                        });
                        this.props.dispatch({
                          type: 'down/delClassDownPic',
                          payload: item.picId
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
      headers:{
        "Authorization":token
      }
    })
      .then(response => response.json())
      .then(res => {
        if (res.result === 0) {
          This.props.dispatch({
            type: 'report/uploadVideo',
            payload: {
              uqId: This.props.state.questionId,
              url: res.data.path,
              duration: parseInt(duration)
            }
          });


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
    value += 'video?uqId=' + this.props.state.questionId + '&authorId=' + userId
    let This = this;
    // console.log(this.props.state.visible1,this.props.state.toupload )
    if (!this.props.state.visible1 && !this.props.state.toupload) {
      var timestamp = new Date().getTime() + "";
      timestamp = timestamp.substring(0, timestamp.length - 3);
      var websocket = null;
      //判断当前浏览器是否支持WebSocket
      let url = dataCen('/report/ws/teachVideoUpload?userId=' + userId + '&uqId=' + this.props.state.questionId)
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
              key: This.props.state.num
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
              questionNews.questionUrl.split(',').map((item, i) => (
                <img key={i} style={{ width: '100%' }} src={item}></img>
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
                      <span
                        className={style.addButon}
                      >本地上传</span>
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
                    console.log(This.props.state.num, questionNews.teachVideo.videoId)
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
                        });
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

  //点击时间全部事件
  alltime() {
    //滚动条回滚到顶部,知识点展开
    if (document.getElementById('gundt')) {
      document.getElementById('gundt').scrollTop = 0;
      this.setState({
        zoom: false
      })
    }
    this.props.dispatch({
      type: 'report/begtoendTime',
      payload: []
    });
    this.props.dispatch({
      type: 'report/stbegtoendTime',
      payload: []
    });
    this.props.dispatch({
      type: 'report/changeMouth',
      payload: 0
    });
    this.props.dispatch({
      type: 'report/propsPageNum',
      payload: 1
    });
    this.props.dispatch({
      type: 'report/queryQrDetail',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        info: 0,
        pageSize: 20,
        pageNum: 1
      }
    });
    //获取知识点筛选
    this.props.dispatch({
      type: 'temp/getKnowledgeList',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        type:0,
      }
    });
    this.props.dispatch({
      type: 'down/AllPdf',
      payload: false
    });

  }
  //点击不同月份的事件
  monthtime(item) {
    //滚动条回滚到顶部,知识点展开
    if (document.getElementById('gundt')) {
      document.getElementById('gundt').scrollTop = 0;
      this.setState({
        zoom: false
      })
    }

    this.props.dispatch({
      type: 'report/begtoendTime',
      payload: []
    });
    this.props.dispatch({
      type: 'report/stbegtoendTime',
      payload: []
    });
    this.props.dispatch({
      type: 'report/knowledgenow',
      payload: []
    });
    this.props.dispatch({
      type: 'report/changeMouth',
      payload: item
    });

    this.props.dispatch({
      type: 'report/propsPageNum',
      payload: 1
    });
    //获取知识点筛选
    this.props.dispatch({
      type: 'temp/getKnowledgeList',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        type:0,
      }
    });

    this.props.dispatch({
      type: 'report/queryQrDetail',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        info: 0,
        month: item.v,
        pageSize: 20,
        pageNum: 1
      }
    });
    this.props.dispatch({
      type: 'down/AllPdf',
      payload: true
    });
  }
  //时间框
  quantumtime(date, dateString) {
    //滚动条回滚到顶部,知识点展开
    if (document.getElementById('gundt')) {
      document.getElementById('gundt').scrollTop = 0;
      this.setState({
        zoom: false
      })
    }
    this.props.dispatch({
      type: 'report/changeMouth',
      payload: -1
    });

    this.props.dispatch({
      type: 'report/propsPageNum',
      payload: 1
    });
    this.props.dispatch({
      type: 'report/knowledgenow',
      payload: []
    });
    this.props.dispatch({
      type: 'report/begtoendTime',
      payload: date
    });
    this.props.dispatch({
      type: 'report/stbegtoendTime',
      payload: dateString
    });
    //获取知识点筛选
    this.props.dispatch({
      type: 'temp/getKnowledgeList',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        startTime: dateString[0],
        endTime: dateString[1],
        type:0,
      }
    });
    this.props.dispatch({
      type: 'report/queryQrDetail',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        info: 0,
        pageSize: 20,
        pageNum: 1,
        startTime: dateString[0],
        endTime: dateString[1],
      }
    });

  }
  //页面滚动事件
  pageScroll(e) {

    // 知识点样式缩放
    if (e.target.scrollTop > 0) {
      this.setState({
        zoom: true
      })
    } else if(e.target.clientHeight !== e.target.scrollHeight){
      this.setState({
        zoom: false
      })
    }

    if (hei - 200 < e.target.scrollTop + e.target.clientHeight) {
      if (this.state.next) {
        let page = this.props.state.propsPageNum;
        let classId = this.props.state.classId;
        let subId = this.props.state.subId;
        let year = this.props.state.years;

        page++;
        this.setState({ next: false });
        this.props.dispatch({
          type: 'report/propsPageNum',
          payload: page
        });
        let data = {
          classId: classId,
          year: year,
          subjectId: subId,
          info: 0,
          pageNum: page,
          pageSize: 20,
        };
        //月份
        if (this.props.state.mouNow !== 0) {
          data.month = this.props.state.mouNow.v
        }
        //知识点
        if (this.props.state.knowledgenow.length !== 0) {
          data.knowledgeName = this.props.state.knowledgenow
        }
        //时间段
        if (this.props.state.stbegtoendTime.length > 0) {
          data.startTime = this.props.state.stbegtoendTime[0];
          data.endTime = this.props.state.stbegtoendTime[1];
        }
        console.log('滚动');
        this.props.dispatch({
          type: 'report/queryQrDetail1',
          payload: data
        });
        let This = this
        setTimeout(function () {
          This.setState({ next: true })
        }, 1000)
      }
    }
  }

  //下载所选中的组卷事件
  downloadPitch(e) {
    e.stopPropagation();
    if (this.props.state.classDown.length != 0) {
      //是否允许点击下载错题按钮事件
      this.props.dispatch({
        type: 'down/downQue',
        payload: true
      });
      //下载pdf
      let downparameters={
        uqIdsStr: this.props.state.classDownPic.join(','),
        classId:this.props.state.classId,
      };
      console.log(this.state.similarTopic);
      if(this.state.similarTopic===1){
        downparameters.practise=0
      }else{
        downparameters.practise=1
      };
      this.props.dispatch({
        type: 'down/makeSelectWB',
        payload: downparameters
      });
      //关闭下拉弹窗
      this.setState({
        pull:false
      });
      // 添加导出次数
      this.props.dispatch({
        type: 'report/addClassup',
        payload: this.props.state.classDownPic
      });
      // 下载清空选题
      this.props.dispatch({
        type: 'down/delAllClass',
      });

    } else {
      message.warning('请选择题目')
    }
  }


  //点击知识点全部事件
  allknowledgenow() {

    //滚动条回滚到顶部,知识点展开
    if (document.getElementById('gundt')) {
      document.getElementById('gundt').scrollTop = 0;
      this.setState({
        zoom: false
      })
    }
    this.props.dispatch({
      type: 'report/knowledgenow',
      payload: []
    });

    this.props.dispatch({
      type: 'report/queryQrDetail',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        info: 0,
        pageSize: 20,
        pageNum: 1
      }
    });
  }
  //点击选中知识点
  knowledgenowPitch(name) {
    //滚动条回滚到顶部
    if (document.getElementById('gundt')) {
      document.getElementById('gundt').scrollTop = 0;
    }
    let knowledgenow = this.props.state.knowledgenow;
    let weizhi = knowledgenow.indexOf(name);
    if (weizhi > -1) {
      knowledgenow.splice(weizhi, 1)
    } else {
      knowledgenow.push(name)
    }

    this.props.dispatch({
      type: 'report/knowledgenow',
      payload: knowledgenow
    });
    this.props.dispatch({
      type: 'report/queryQrDetail',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        info: 0,
        pageSize: 20,
        pageNum: 1
      }
    });
  }
//匹配错误事件
  pipeicw(uqId) {
    this.props.dispatch({
          type: 'report/WrongQuestionMarker',
          payload: {
            uqId: uqId,
            userId: store.get('wrongBookNews').userId,
            way: 1
          }
        });
  }

  render() {
    let mounthList = this.props.state.mounthList;
    let knowledgeList = this.props.state.knowledgeList;
    let QuestionDetail = this.props.state.qrdetailList;
    let fileLink = this.props.state.pdfUrl.fileLink;

    return (
      <Content style={{ position: 'relative' }}>
        <iframe style={{ display: 'none' }} src={this.state.wordUrl} />
        <Layout className={style.layout}>
          <Header className={style.layoutHead} style={{zIndex:2}}>
            <span style={{
              fontSize: 14,
              fontFamily: 'MicrosoftYaHei-Bold',
              fontWeight: 'bold',
              color: 'rgba(96,98,102,1)',
            }}>时间：</span>
            <span key={0} className={0 == this.props.state.mouNow ? 'choseMonthOn' : 'choseMonth'}
              style={{ marginLeft: 24 }} onClick={this.alltime.bind(this)}>全部</span>
            {
              mounthList.data && mounthList.data.length>0?
                mounthList.data.map((item, i) => {
                  return (
                    <span key={i} className={item.k == this.props.state.mouNow.k ? 'choseMonthOn' : 'choseMonth'}
                      onClick={
                        this.monthtime.bind(this, item)
                      }>{item.k}</span>
                  )
                })
                : ''
            }
            <RangePicker
              style={{ width: 220 }}
              format="YYYY-MM-DD"
              placeholder={['开始时间', '结束时间']}
              value={this.props.state.begtoendTime}
              disabledDate={current => current && current > moment().endOf('day') || current < moment().subtract(2, 'year')}
              onChange={
                this.quantumtime.bind(this)
              } />
            <div style={{ float: 'right',position: 'relative' }}>
              {QuestionDetail.data && QuestionDetail.data.questionList && QuestionDetail.data.questionList.length > 0 ?
                <Button style={{ background: '#67c23a', color: '#fff', float: 'right', marginTop: "9px", border: 'none',width:140 }}
                  loading={this.props.state.downQue}
                  disabled={this.props.state.classDown.length === 0 && !this.props.state.downQue}
                 onClick={() => {this.setState({ pull: !this.state.pull })}}>
                  <img style={{ margin: ' 0 5px 4px 0', height: '15px' }}
                    src={require('../../images/xc-cl-n.png')}></img>
                  下载错题({this.props.state.classDown.length})
              </Button> : ''}
              {/*引导流程*/}
              {QuestionDetail.data && QuestionDetail.data.questionList && QuestionDetail.data.questionList.length > 0 ?
              <Guidance title='下载错题' content='选择组卷后，可选择下载错题或优选错题'/>
              : ''}
              {this.state.pull ?
                <div className={style.buttonPull}
                     style={{right:0}}
                  onClick={(e) => {
                    if(this.state.similarTopic===1){
                      this.setState({
                        similarTopic:2
                      })
                    }else if(this.state.similarTopic===2){
                      this.setState({
                        similarTopic:1
                      })
                    }
                  }}>
                  <Row className={style.downloadrow}>
                    {this.state.similarTopic === 1 ?
                      <img style={{ margin: '0 9px 0 15px', height: '14px' }} src={require('../../images/lvxz.png')}></img> :
                      <img style={{ margin: '0 9px 0 15px', height: '14px' }} src={require('../../images/lvwxz.png')}></img>}
                    <span className={style.inputk} >下载原错题</span>
                  </Row>
                  <Row className={style.downloadrow} style={{lineHeight: 1,textAlign:'left'}}>
                    {this.state.similarTopic === 2 ?
                      <img style={{ margin: '0 9px 0 15px', height: '14px' }} src={require('../../images/lvxz.png')}></img> :
                      <img style={{ margin: '0 9px 0 15px', height: '14px' }} src={require('../../images/lvwxz.png')}></img>}
                    <span className={style.inputk} >
                      <p style={{ margin: '15px 0 0 0'}}>下载原错题＋</p>
                      <p style={{ margin:0}}>优选练习</p> </span>
                  </Row>
                  <Row>
                    <div className={style.yulangbutton}  onClick={this.downloadPitch.bind(this)}>
                      预览
                    </div>
                  </Row>
                </div> : ''}
            </div>
          </Header>
          <Header className={style.layoutHead}
            style={this.state.zoom ? { lineHeight: 3, height: 50,boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 20px',marginBottom: 10,overflow:'hidden' } :
              { lineHeight: 1.5, height: 'auto',}}>
            <span style={{
              fontSize: 14,
              fontFamily: 'MicrosoftYaHei-Bold',
              fontWeight: 'bold',
              color: 'rgba(96,98,102,1)',
            }}>知识点：</span>
            <div className={this.state.zoom ? `xiaoshi` :''} style={{float: 'right', maxHeight: 350,overflow: 'auto',width: 'calc(100% - 56px)',paddingBottom: 15}}>
            <span key={0} className={0 == this.props.state.knowledgenow.length ? 'choseMonthOn' : 'choseMonth'}
              onClick={this.allknowledgenow.bind(this)}>全部</span>
            {knowledgeList.data ?
                knowledgeList.data.map((item, i) => {
                  return (
                    <span key={item.knowledgeName} className={this.props.state.knowledgenow.indexOf(item.knowledgeName)>-1 ? 'choseMonthOn' : 'choseMonth'}
                        onClick={this.knowledgenowPitch.bind(this, item.knowledgeName)}
                    >{item.knowledgeName}({item.num})</span>
                  )
                })
                : ''
            }
            </div>
          </Header>

          <Content id='gundt'
            style={{ background: '#fff', overflow: 'auto', position: 'relative' }}
            ref='warpper'
            onScroll={(e) => { this.pageScroll(e) }}
          >
            { this.props.state.qrdetailList.data && this.props.state.qrdetailList.data.questionList && this.props.state.qrdetailList.data.questionList.length !== 0 ?
                this.quesList() :
                <div style={{ textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
                  <img src={require('../../images/wsj-n.png')}></img>
                  <span style={{ fontSize: '30px', marginLeft: '50px', fontWeight: 'bold', color: "#434e59" }}>暂无数据</span>
                </div> }
          </Content>
        </Layout>
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
          }}
          onCancel={() => {
            this.props.dispatch({
              type: 'report/visible',
              payload: false
            });
          }}>
          {this.props.state.visible ? this.addVie() : ''}
        </Modal>

        <Modal
          visible={this.props.state.showPdfModal}
          maskClosable={false}
          keyboard={false}
          onOk={() => {
            window.location.href = this.props.state.pdfUrl.downloadLink
          }}
          onCancel={() => {
            this.props.dispatch({
              type: 'down/showPdfModal',
              payload: false
            });
          }}
          className={commonCss.pdfModal}
          closable={false}
          cancelText='取消'
          okText='下载'
        >
          <div style={{ height: '700px' }}>
            {/* <PDF
                            file="http://homework.mizholdings.com/pdf/240CA1A5-E7A9-4CF3-8CE2-5CD48B1FADB4.pdf"
                        /> */}

            {/* <embed src={fileLink} type="application/pdf" width="100%" height="100%"></embed> */}
            <iframe src={fileLink} title='下载预览' style={{ width: '100%', height: '100%', border: 0 }}></iframe>
          </div>
        </Modal>

        <MistakesTC
          tcxuhao={this.state.tcxuhao}
          xqtc={this.state.xqtc}
          guanbi={() => { this.setState({ xqtc: false }) }}
          errorDetails={this.state.errorDetails}
          pipeicw={this.pipeicw.bind(this)}/>
      </Content>
    );
  }

  componentDidMount() {

    let classId = this.props.state.classId;
    let subId = this.props.state.subId;
    let year = this.props.state.years;
    this.props.dispatch({
      type: 'down/showPdfModal',
      payload: false
    });
    this.props.dispatch({
      type: 'report/propsPageNum',
      payload: 1
    });
    if (classId !== '' && subId !== '' && year !== '') {
          //获取知识点筛选
    this.props.dispatch({
      type: 'temp/getKnowledgeList',
      payload: {
        classId,
        year,
        subjectId:subId,
        type:0,
      }
    });
      let data = {
        classId,
        year: year,
        subjectId: subId,
        info: 0,
        pageNum: 1,
        pageSize: 20,
      }
      this.props.dispatch({
        type: 'report/queryQrDetail',
        payload: data
      });
    }
  }
  componentWillMount() {
    //清空知识点
    this.props.dispatch({
      type: 'report/knowledgenow',
      payload: []
    });
    //卸载组件前清空数据，减少加载组件时，渲染之前的数据,提升组件初始加载速度
    this.props.dispatch({
      type: 'report/qrdetailList',
      payload: []
    })
  }
}

export default connect((state) => ({
  state: {
    ...state.temp,
    ...state.down,
    ...state.example,
    ...state.report,
  }
}))(wrongTop);
