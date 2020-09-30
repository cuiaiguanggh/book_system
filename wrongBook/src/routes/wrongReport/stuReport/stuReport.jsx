import React from 'react';
import {
  Layout, Menu, Button, message, Select, Modal, Icon, Checkbox, Spin, DatePicker, Empty,Input,Pagination 
} from 'antd';
import { connect } from 'dva';
import style from './stuReport.less';
import moment from 'moment';
import { dataCen, dataCenter, serverType } from '../../../config/dataCenter'
import store from 'store';
import commonCss from '../../css/commonCss.css'
import TracksVideo from "../TracksVideo/TracksVideo";
import DownloadGroup from '../../components/downloadGroup/downloadGroup';
import QRCode from "qrcode.react";
import 'moment/locale/zh-cn';
//作业中心界面内容
const Option = Select.Option;
const { RangePicker } = DatePicker;
const {
  Header, Footer, Sider, Content,
} = Layout;
const { TextArea } = Input;
const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />;
const confirm = Modal.confirm;
let hei = 200;
let _currentQuestion={}
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
      next: true,
      toupload: false,
      begtoendTime: [],
      stbegtoendTime: [],
      topicxy: false,
      zoom: false,
      //匹配错误显示
      pptype: 0,
      nowWindows: {},
      optimizationcuotiMistakes: [],
      nowRecommendId: '',
      videoId: '',
      thvisilble:false,
      quering:{
        queryText:false,
        queryZsd:false,
        queryZsd1:false
      },
      zsds:[],
      zsdid:-1,
      currentPageIndex:1,
      queryQuestionsType:'text',
      _questionKeyword:'',
      _zsdKeyword:'',
      currentQuestionIndex:-1,
      currentQuestion:{}
    }
  }

  onImportExcel = file => {
    let form = new FormData();
    let fil = document.getElementById("file").files[0];
    if (fil.type.indexOf('mp4') < 0) {
      message.warning('上传文件只支持mp4')
      return false
    }
    if ((fil.size / 1024) / 1024 >= 50) {
      message.warning('上传文件大小需小于50Mb')
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
          });
        } else {
          message.error(res.msg)
        }
      })
      .catch(function (error) {
        message.error(error.msg)
      })

  }

  //添加视频
  addVie() {
    const userId = store.get('wrongBookNews').userId;
    let value = 'http://hw-test.mizholdings.com/wx/';
    //测试
    if (serverType === 0) {
      value = 'http://dev.kacha.xin/wx/';
    }

    if (this.state.videoId === '' && !this.props.state.visible1) {
      this.props.dispatch({
        type: 'report/videoPrepare',
        payload: {
          questionId: this.state.nowRecommendId,
          videoType: 2,
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
          // message.success('视频上传成功')
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
        closeWebSocket();
      }

      //关闭WebSocket连接
      function closeWebSocket() {
        websocket.close();
      }
    }
    let questionNews = this.props.state.questionNews;
    return (
      <div className={style.codeFram} style={{ textAlign: 'center', overflow: "hidden" }}>
        <div className={style.questionBody}>
          {/*<div className={style.questionTop}>*/}
          {/*  <span>答错<span style={{color: "#1890ff", fontWeight: 'bold', padding: '0 5px'}}>{questionNews.wrongNum}</span>人</span>*/}
          {/*</div>*/}
          <div style={{ padding: '10px', height: '250px', overflow: 'hidden' }}>
            {
              questionNews.questionUrl.split(',').map((item, i) => (
                <img key={i} style={{ width: '100%' }} src={item.indexOf('?') > 0 ? `${item}/thumbnail/1000x` : `${item}?imageMogr2/thumbnail/1000x`}></img>
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
                        accept='.mp4'
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

  handleScroll(e) {
    const { scrollHeight } = this.refDom;
    hei = scrollHeight;
  }

  //点击学生
  selectStu(e) {
    //滚动条回滚到顶部
    if (document.getElementById('stugdt')) {
      document.getElementById('stugdt').scrollTop = 0;
    }
    //清空知识点
    this.props.dispatch({
      type: 'report/knowledgenow',
      payload: []
    });

    this.props.dispatch({
      type: 'report/propsPageNum',
      payload: 1
    });
    this.props.dispatch({
      type: 'down/stuName',
      payload: e.key
    });
    this.props.dispatch({
      type: 'report/userId',
      payload: e.key
    });

    //获取知识点筛选
    this.props.dispatch({
      type: 'temp/getKnowledgeList',
      payload: {
        classId: this.props.state.classId,
        year: this.props.state.years,
        subjectId: this.props.state.subId,
        userId: e.key,
        type: 1
      }
    });

    let data = {
      classId: this.props.state.classId,
      year: this.props.state.years,
      subjectId: this.props.state.subId,
      userId: e.key,
      info: 0,
      pageSize: 20,
      pageNum: 1
    }
    //月份
    if (this.props.state.mouNow != 0) {
      data.month = this.props.state.mouNow.v
    }

    //时间段
    if (this.props.state.stbegtoendTime.length > 0) {
      data.startTime = this.props.state.stbegtoendTime[0];
      data.endTime = this.props.state.stbegtoendTime[1];
    }

    this.props.dispatch({
      type: 'report/userQRdetail',
      payload: data
    });
    // let dom = document.getElementsByClassName('down');
    // for (let i = 0; i < dom.length; i++) {
    //   dom[i].innerHTML = "加入错题篮";
    //   dom[i].className = 'down'
    // }
    this.props.dispatch({
      type: 'down/delAllStu',
    });
  }

  menulist() {
    let studentList = this.props.state.studentList;

    if (studentList.data && studentList.data.length > 0) {
      let current = this.props.state.userId;
      if (!current) {
        current = studentList.data[0].userId;
      }

      if (studentList.data.length > 0) {
        if (current !== '') {
          return (
            <Menu
              mode="inline"
              defaultSelectedKeys={[current]}
              onClick={this.selectStu.bind(this)}
            >
              {
                studentList.data.map((item, i) => (
                  <Menu.Item key={item.userId} style={{ cursor: 'pointer' }} title={item.userName}>
                    <div style={{ overflow: 'hidden' }}>
                      <span style={{
                        float: 'left',
                        width: "70%",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>{item.userName}</span>
                      <span style={{ float: 'right' }}>{item.wrongNum}道</span>
                    </div>
                  </Menu.Item>
                ))
              }
            </Menu>
          )
        } else {
          return (
            <Menu
              // theme="dark"
              mode="inline"
            >
            </Menu>
          )
        }
      }

    } else {
      return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无学生数据'} style={{
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
      }} />)
    }
  }

  questions() {
    let detail = this.props.state.qrdetailList1.data.questionList;
    if (detail.length > 0) {
      return (
        <div id='stugdt'
          className={style.outBody}
          style={{ overflow: 'auto' }}
          ref={this.Ref}
          onScroll={
            this.rollMistakes.bind(this)
          }

          onWheel={(e) => this.handleScroll(e)}>
          {
            detail.map((item, i) => {
              let downs = this.props.state.stuDown;
              let cls = 'down', name = '选题';
              for (let j = 0; j < downs.length; j++) {
                if (downs[j] == item.questionId) {
                  cls = 'down ndown';
                  name = '移除'
                }
              }
              let j = i;
              return (
                <div key={i} className={style.questionBody}>
                  <div className={style.questionTop} onClick={() => {
                    this.setState({
                      nowRecommendId: item.recommendId
                    })
                  }}>
                    <span style={{ marginRight: '20px' }}>第{i + 1}题</span>
                    {
                      item.num != 0 ?
                        <span style={{ borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>已出卷<span
                          style={{ color: "#1890ff" }}>{item.num}</span>次</span>
                        : ''
                    }
                    <span hidden={item.recommendId <= 0 ? true : false}>
                      <TracksVideo type={item} num={j} ></TracksVideo>
                    </span>
                  </div>
                  <div style={{ padding: '20px', height: '250px', overflow: "hidden" }} onClick={() => {
                    console.log('item: ', item);
                    if (item.picId) {
                      this.setState({
                        currentQuestion:item
                      })
                      _currentQuestion=item
                      this.props.dispatch({
                        type: 'report/recommend',
                        payload: {
                          uqId: item.picId.split('-')[1]
                        }
                      }).then((res) => {
                        this.setState({
                          optimizationcuotiMistakes: res
                        })
                      })
                    }else{
                      message.warn('没有picid')
                    }
                    this.setState({
                      nowWindows: item,
                      visible: true,
                      pptype: item.type
                    });
                  }}>
                    {/* type==2时候也显示匹配题目 type不清楚是什么 item.title&& item.type === 0|| !item.questionUrl */}
                    {item.title&&item.type === 0  ?
                      <div dangerouslySetInnerHTML={{ __html: item.title }} />
                      :
                      <img key={i} style={{ width: '100%' }}
                        src={item.questionUrl.split(',')[0].indexOf('?') > 0 ? `${item.questionUrl.split(',')[0]}/thumbnail/1000x` : `${item.questionUrl.split(',')[0]}?imageMogr2/thumbnail/1000x`} />
                    }
                  </div>

                  <div style={{ overflow: 'hidden', paddingLeft: '10px', paddingTop: '20px' }}>
                    <span className={cls} onClick={() => {
                      let dom = document.getElementsByClassName('down');
                      let downs = this.props.state.stuDown;
                      if (dom[i].innerText == '选题') {
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
    } else {
      return (
        <div></div>
      )
    }
  }

  //时间框
  quantumtime(date, dateString) {
    if (date.length === 0) {
      this.alltime()
      return;
    }
    //滚动条回滚到顶部
    if (document.getElementById('stugdt')) {
      document.getElementById('stugdt').scrollTop = 0;
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
        userId: this.props.state.userId,
        type: 1
      }
    });
    this.props.dispatch({
      type: 'report/queryQrStudentCount',
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
    this.props.dispatch({
      type: 'down/AllPdf',
      payload: true
    });
  }

  //点击不同月份的事件
  monthtime(item) {
    //滚动条回滚到顶部
    if (document.getElementById('stugdt')) {
      document.getElementById('stugdt').scrollTop = 0;
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
        userId: this.props.state.userId,
        type: 1
      }
    });
    let data = {
      classId: this.props.state.classId,
      year: this.props.state.years,
      subjectId: this.props.state.subId,
      info: 0,
      month: item.v,
      pageSize: 20,
      pageNum: 1
    }
    this.props.dispatch({
      type: 'report/queryQrStudentCount',
      payload: data
    });

    this.props.dispatch({
      type: 'down/AllPdf',
      payload: true
    });
  }

  //点击时间全部事件
  alltime() {
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
      payload: 0
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
        userId: this.props.state.userId,
        type: 1
      }
    });
    let data = {
      classId: this.props.state.classId,
      year: this.props.state.years,
      subjectId: this.props.state.subId,
      info: 0,
      pageSize: 20,
      pageNum: 1
    }
    this.props.dispatch({
      type: 'report/queryQrStudentCount',
      payload: data
    });
    this.props.dispatch({
      type: 'down/AllPdf',
      payload: false
    });

  }


  //点击知识点全部事件
  allknowledgenow() {
    //滚动条回滚到顶部
    if (document.getElementById('stugdt')) {
      document.getElementById('stugdt').scrollTop = 0;
    }
    this.props.dispatch({
      type: 'report/knowledgenow',
      payload: []
    });
    this.props.dispatch({
      type: 'report/qrdetailList',
      payload: []
    });
    let data = {
      classId: this.props.state.classId,
      year: this.props.state.years,
      subjectId: this.props.state.subId,
      userId: this.props.state.userId,
      info: 0,
      pageSize: 20,
      pageNum: 1
    }
    //月份
    if (this.props.state.mouNow != 0) {
      data.month = this.props.state.mouNow.v
    }
    //时间段
    if (this.props.state.stbegtoendTime.length > 0) {
      data.startTime = this.props.state.stbegtoendTime[0];
      data.endTime = this.props.state.stbegtoendTime[1];
    }

    if (!data.subjectId) {
      message.error('请选择学科');
      return;
    }
    this.props.dispatch({
      type: 'report/userQRdetail',
      payload: data
    });
  }

  //点击选中知识点
  knowledgenowPitch(name) {
    //滚动条回滚到顶部
    if (document.getElementById('stugdt')) {
      document.getElementById('stugdt').scrollTop = 0;
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
      type: 'report/qrdetailList',
      payload: []
    });
    let data = {
      classId: this.props.state.classId,
      year: this.props.state.years,
      subjectId: this.props.state.subId,
      userId: this.props.state.userId,
      info: 0,
      pageSize: 20,
      pageNum: 1
    }
    //月份
    if (this.props.state.mouNow != 0) {
      data.month = this.props.state.mouNow.v
    }
    //知识点
    if (knowledgenow.length !== 0) {
      data.knowledgeName = knowledgenow
    }

    //时间段
    if (this.props.state.stbegtoendTime.length > 0) {
      data.startTime = this.props.state.stbegtoendTime[0];
      data.endTime = this.props.state.stbegtoendTime[1];
    }
    this.props.dispatch({
      type: 'report/userQRdetail',
      payload: data
    });

  }

  //下载所选中的组卷事件
  downloadPitch(practise) {
    this.props.dispatch({
      type: 'report/maidian',
      payload: { functionId: 15, actId: 1 }
    })
    //是否允许点击下载错题按钮事件
    this.props.dispatch({
      type: 'down/downQue',
      payload: true
    });
    //下载pdf
    let downparameters = {
      uqIdsStr: this.props.state.stuDownPic.join(','),
      childId: this.props.state.userId,
      operationClass: this.props.state.classId,
      subjectId: this.props.state.subId,
      practise: practise
    };


    if (this.props.state.stbegtoendTime.length > 0) {
      downparameters.beginDate = this.props.state.stbegtoendTime[0];
      downparameters.endDate = this.props.state.stbegtoendTime[1];
    }

    this.props.dispatch({
      type: 'down/makeSelectWB',
      payload: downparameters
    }).then(() => {
      // 添加导出次数
      this.props.dispatch({
        type: 'report/addStudentUp',
        payload: this.props.state.stuDownPic
      });
      // 下载清空选题
      this.props.dispatch({
        type: 'down/delAllStu',
      });
    })



  }

  //滚动加载错题
  rollMistakes(e) {
    // 知识点样式缩放
    if (e.target.scrollTop !== 0) {
      this.setState({
        zoom: true
      })
    } else {
      this.setState({
        zoom: false
      })
    }
    if (hei - 200 < e.target.scrollTop + e.target.clientHeight && this.sfgun) {
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
          userId: this.props.state.userId
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

        this.props.dispatch({
          type: 'report/userQRdetail1',
          payload: data
        });
        let This = this;
        setTimeout(function () {
          This.setState({ next: true })
        }, 1000)
      }
    }
  }

  //匹配错误事件
  pipeicw() {
    let that = this;
    confirm({
      title: '题目匹配错误',
      content: '取消匹配结果，以图片形式显示',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        that.props.dispatch({
          type: 'report/WrongQuestionMarker',
          payload: {
            uqId: that.state.nowWindows.recommendId,
            userId: store.get('wrongBookNews').userId,
            way: 2
          }
        }).then(res=>{
          that.state.nowWindows.type = 2;
          that.setState({
            nowWindows:that.state.nowWindows
          })
        });
        // that.reFreshQueryQuestions()
        that.setState({ topicxy: true })
       
      },
    });
  }
  showPipei(){
    this.props.dispatch({
      type: 'report/doRecoverQuestion',
      payload: {
        uqId: this.state.nowWindows.recommendId,
        userId: store.get('wrongBookNews').userId
      }
    }).then(res=>{
      message.destroy()
      if(res.data.result===0){
        message.success('恢复匹配成功')
        this.reFreshQueryQuestions()
        this.setState({
          visible:false,
          topicxy:false
        })
      }else{
        message.error('恢复匹配失败')
      }
    });
  }
  getZsd=()=>{
    if(!this.state._zsdKeyword.length){
      message.destroy()
      message.warn('请输入要查询知识点的关键字')
      return
    }
    this.setState({
      quering:{
        ...this.state.quering,
        queryZsd:true
      }
    })
    this.props.dispatch({
      type:'report/getZsdByKeyWord',
      payload:this.state._zsdKeyword
    }).then((res)=>{
      if(res.length){
        this.setState({
          zsdid:res[0].id
        })
      }
      console.log(this.state.zsdid)
      this.setState({
        zsds:res||[]
      })
      this.setState({
        quering:{
          ...this.state.quering,
          queryZsd:false
        }
      })
    })
  }
  queryQuestionsBy=(text,index)=>{
    if(text==='text'){
      if(!this.state._questionKeyword.length){
        message.destroy()
        message.warn('请输入要查询题目的关键字')
        return
      }
      this.setState({
        quering:{
          ...this.state.quering,
          queryText:true
        },
        queryQuestionsType:'text'
      })
    }else{
      if(this.state.zsdid==-1){
        message.destroy()
        return message.warn('请选择知识点')
        
      }
      this.setState({
        quering:{
          ...this.state.quering,
          queryZsd1:true
        },
        queryQuestionsType:'zsd'
      })
    }
    console.log(this.state.zsdid)
    
    let data={
      
      pageNum:index||1,
      pageSize:20
    }

    if(text=='text') {
      data.questionKeyword=this.state._questionKeyword
    }else if(this.state.zsdid>-1){
      let zsdKeyword=this.state.zsds.find((v)=>{return(v.id===this.state.zsdid)}).knowledgeName
      data.knowledgeKeyword=zsdKeyword
    }
    this.props.dispatch({
      type:"report/queryQuestionsBy",
      payload:data
    }).then(res=>{
      console.log('res: ', res);
      this.setState({
        quering:{
          ...this.state.quering,
          queryText:false,
          queryZsd1:false
        }
      })
    })

  }

  resetThModal(){
    console.log('resetThModal: ');
    this.setState({
      quering:{
        queryText:false,
        queryZsd:false,
        queryZsd1:false
      },
      zsds:[],
      zsdid:-1,
      currentPageIndex:1,
      queryQuestionsType:'text',
      _questionKeyword:'',
      _zsdKeyword:'',
      currentQuestionIndex:-1,
      // currentQuestion:{},
    })
    //_currentQuestion={}
    this.props.dispatch({
      type:'report/_questiondata',
      payload:{
        count:0,
        qsList:[]
      }
    })
  }
  toUpdateOldQuestion(newquestion){
    console.log('oldquestion...: ',_currentQuestion,this.state.nowWindows);
    console.log('newquestion...: ',newquestion);
    _currentQuestion.questionId=newquestion.id?newquestion.id.toString():'-1'
    _currentQuestion.title=newquestion.title
    _currentQuestion.parse=newquestion.parse
    _currentQuestion.answer=newquestion.answer

    this.setState({
      nowWindows:_currentQuestion
    })
    // this.props.dispatch({
    //   type: 'report/recommend',
    //   payload: {
    //     uqId: _currentQuestion.picId.split('-')[1]
    //   }
    // }).then((res) => {
    //   this.setState({
    //     optimizationcuotiMistakes: res
    //   })
    // })
  }
  doUpdateQuestion=(item,index)=>{
    let _cuque=_currentQuestion
    let _uqId=_currentQuestion.picId?_currentQuestion.picId.split('-')[1]:0
    console.log('_currentQuestion: ',_currentQuestion,this.state.nowWindows);
    console.log('new question: ',item);
    let data={
      uqId:_uqId,
      oldQuestionId:_cuque.questionId,
      nowQuestionId:item.id,
    }
    // let currentRecommend=this.state.optimizationcuotiMistakes[0]
    if(this.state.updateRecommend){
      //替换优选错题
      data.adviseId=item.id
      // data.oldQuestionId=currentRecommend.questionId
      // data.oldQuestionId=currentRecommend.questionId
      delete data.nowQuestionId
    }else{
      //替换原题时候不保留优选错题
      // if(currentRecommend&&currentRecommend.adviseId){
      //   data.adviseId=currentRecommend.adviseId
      // }
    }
    console.log('request data: ', data);

    this.setState({
      currentQuestionIndex:index
    })
    setTimeout(() => {
      this.props.dispatch({
        type:"report/doUpdateQuestion",
        payload:data
      }).then(res=>{
        this.setState({
          currentQuestionIndex:-1
        })
        message.destroy()
        if(res.data.result===0){
          //这里题目不一定会替换成功
          //关掉model刷新页面
          //this.reFreshQueryQuestions()不做页面刷新
          this.toUpdateOldQuestion(item)
          this.setState({
            thvisilble:false,
            visible:false
          })
          let msg='题目替换成功'
          if(this.state.updateRecommend)msg='优选错题替换成功'
          message.success(msg)
        }else{
          message.warn('替换失败'+res.data.msg)
  
        }
      })
    }, 200);
  }
  reFreshQueryQuestions(){
    let data = {
      classId: this.props.state.classId,
      year: this.props.state.years,
      subjectId: this.props.state.subId,
      userId: this.props.state.userId,
      info: 0,
      pageSize: 20,
      pageNum: 1
    }
    //月份
    if (this.props.state.mouNow != 0) {
      data.month = this.props.state.mouNow.v
    }
    //时间段
    if (this.props.state.stbegtoendTime.length > 0) {
      data.startTime = this.props.state.stbegtoendTime[0];
      data.endTime = this.props.state.stbegtoendTime[1];
    }
    let knowledgenow = this.props.state.knowledgenow;
    
    //知识点
    if (knowledgenow.length !== 0) {
      data.knowledgeName = knowledgenow
    }
    if (!data.subjectId) {
      message.error('请选择学科');
      return;
    }
    this.props.dispatch({
      type: 'report/userQRdetail',
      payload: data
    });
  }
  changePagination=(page,pagesize)=>{
    console.log('page,pagesize: ', page,pagesize);
    this.setState({
      currentPageIndex:page
    })
    this.queryQuestionsBy(this.state.queryQuestionsType,page)
  }

  render() {
    let mounthList = this.props.state.mounthList;
    let knowledgeList = this.props.state.knowledgeList;
    let studentList = this.props.state.studentList;
    let detail = this.props.state.qrdetailList1;
    let fileLink = this.props.state.pdfUrl.fileLink;
    let items=[1,2,3]
    this.sfgun = detail.data && detail.data.end;
    return (
      <Content style={{ background: '#fff', minHeight: 280, overflow: 'auto', position: 'relative' }} ref='warpper'>
        <div className={style.layout}>
          <iframe style={{ display: 'none' }} src={this.state.wordUrl} />
          <div style={{ height: '50px', lineHeight: '50px' }}>
            <div style={{ padding: '0 20px', background: "#fff", borderBottom: '1px solid #ccc' }}>
              <span style={{ fontSize: 14, color: 'rgba(96,98,102,1)' }}>时间：</span>
              <span key={0} className={0 == this.props.state.mouNow ? 'choseMonthOn' : 'choseMonth'}
                onClick={this.alltime.bind(this)}>全部</span>
              {
                mounthList.data && mounthList.data.length > 0 ?
                  mounthList.data.map((item, i) => (
                    <span key={i} className={item.k == this.props.state.mouNow.k ? 'choseMonthOn' : 'choseMonth'}
                      onClick={this.monthtime.bind(this, item)}>{item.k}</span>
                  ))
                  : ''
              }
              <RangePicker
                style={{ width: 220 }}
                format="YYYY-MM-DD"
                placeholder={['开始时间', '结束时间']}
                value={this.props.state.begtoendTime}
                disabledDate={current => current && current > moment().endOf('day') || current < moment().subtract(2, 'year')}
                onChange={this.quantumtime.bind(this)} />

              <Checkbox style={{ marginLeft: 50 }}
                checked={this.props.state.qrdetailList1.data && this.props.state.stuDown.length === this.props.state.qrdetailList1.data.questionList.length&&this.props.state.stuDown.length>0}
                onChange={(e) => {
                  this.props.dispatch({
                    type: 'down/delAllStu',
                  });
                  if (e.target.checked) {
                    if(!this.props.state.qrdetailList1.data||!this.props.state.qrdetailList1.data.questionList.length)return
                    for (let obj of this.props.state.qrdetailList1.data.questionList) {
                      this.props.dispatch({
                        type: 'down/stuDown',
                        payload: obj.questionId
                      });
                      this.props.dispatch({
                        type: 'down/stuDownPic',
                        payload: obj.picId
                      });
                    }
                  }
                }}>题目全选</Checkbox>

            </div>
          </div>
          <DownloadGroup data={this.props.state.stuDown}
            right={26}
            loading={this.props.state.downQue}
            previewClick={(practise) => { this.downloadPitch(practise) }}
            qkongClick={() => {
              this.props.dispatch({
                type: 'down/delAllStu',
              });
            }} />
          <Layout className={style.innerOut}>
            <Sider className={style.sider}>
              {this.menulist()}
            </Sider>


            <Content className={style.content}
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              ref='warpper'
            >
              <div style={{ height: 'auto' }}>
                <div style={
                  this.state.zoom ?
                    {
                      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 20px',
                      marginBottom: 10,
                      padding: '0 20px',
                      background: "#fff",
                      float: 'left',
                      width: '100%',
                      overflow: 'hidden'
                    } :
                    { padding: '0 20px', background: "#fff", float: 'left', width: '100%' }
                }>
                  <span style={{
                    fontSize: 14,
                    fontFamily: 'MicrosoftYaHei-Bold',
                    fontWeight: 'bold',
                    color: 'rgba(96,98,102,1)',
                    float: 'left',
                    lineHeight: 2
                  }}>知识点：</span>
                  <div style={this.state.zoom ? {
                    float: 'left',
                    width: 'calc(100% - 60px)',
                    height: 35,
                    overflow: 'hidden',
                    position: 'relative',
                    top: -2,
                  } : {
                      float: 'left',
                      width: 'calc(100% - 60px)',
                      maxHeight: 352,
                      overflow: 'auto',
                      position: 'relative',
                      top: -2,
                    }}>
                    <span key={0} className={0 === this.props.state.knowledgenow.length ? 'choseMonthOn' : 'choseMonth'}
                      style={{ width: 48 }}
                      onClick={this.allknowledgenow.bind(this)}>全部</span>
                    {
                      knowledgeList.data ?
                        knowledgeList.data.map((item, i) => {
                          return (
                            <span key={item.knowledgeName}
                              className={this.props.state.knowledgenow.indexOf(item.knowledgeName) > -1 ? 'choseMonthOn' : 'choseMonth'}
                              onClick={this.knowledgenowPitch.bind(this, item.knowledgeName)}>{item.knowledgeName}({item.num})</span>
                          )
                        })
                        : ''
                    }
                  </div>
                </div>
              </div>
              {
                detail.data && detail.data.questionList.length != 0 ? this.questions() :
                  <div style={{
                    textAlign: 'center',
                    position: 'relative',
                    marginTop: '20%',
                    transform: 'translate(0%, -50%)',
                    width: '100%'
                  }}>
                    <img src={require('../../images/wsj-n.png')}></img>
                    <span
                      style={{ fontSize: '30px', marginLeft: '50px', fontWeight: 'bold', color: "#434e59" }}>暂无数据</span>
                  </div>
              }
            </Content>
          </Layout>
          <Modal
            zIndex={101}
            visible={this.state.visible}
            width={(this.state.nowWindows.title && this.state.pptype === 0 && !this.state.topicxy) ? '80%' : '50%'}
            className="showques"
            footer={null}
            onOk={() => {
              this.setState({ visible: false, topicxy: false, })
            }}
            onCancel={() => {
              this.setState({ visible: false, topicxy: false, })
            }}
          >
            
            {this.state.nowWindows.title && this.state.pptype === 0 && !this.state.topicxy ?
              <div style={{ display: 'flex',userSelect:'text' }}>
                <div className={style.topicbox} style={{ width: '40%' }}>
                  <h3 className={style.fonsfwc} style={{ marginBottom: 20,height:35,lineHeight:"35px" }}>
                    题目

                    <span className={style.matchingError} onClick={this.pipeicw.bind(this)}>
                      <Icon theme='filled' type="exclamation-circle" style={{ color: '#C0C8CF' }} /> 题目匹配报错
                    </span>

                    <Button style={{float:"right",marginRight:15}} onClick={()=>{
                      this.setState({thvisilble:true,updateRecommend:false})
                    }}>替换</Button>

                  </h3>
                  <div style={{ overflow: 'auto', maxHeight: '600px', minHeight: '230px' }}>
                    <div dangerouslySetInnerHTML={{ __html: this.state.nowWindows.title }} />
                    <div className={style.leftText}>【考点】 </div>
                    <div dangerouslySetInnerHTML={{ __html: this.state.nowWindows.knowledgeName }} />
                    <div className={style.leftText}> 【答案与解析】 </div>
                    <div dangerouslySetInnerHTML={{ __html: this.state.nowWindows.parse }} />
                    <h2 className={style.leftText}>
                      {serverType === 0 && this.state.optimizationcuotiMistakes.length > 0 && this.state.optimizationcuotiMistakes[0].isGood === 1 ? '【优选错题】' : '优选错题'}
                      {/* {
                        this.state.optimizationcuotiMistakes.length>0&&this.state.optimizationcuotiMistakes[0].adviseId?
                        <Button style={{float:"right",marginRight:15}} onClick={()=>{
                          this.setState({thvisilble:true,updateRecommend:true})
                        }}>替换</Button>:''
                      } */}
                      {
                        true?
                        <Button style={{float:"right",marginRight:15}} onClick={()=>{
                          this.setState({thvisilble:true,updateRecommend:true})
                        }}>替换</Button>:''
                      }
                    </h2>

                    {this.state.optimizationcuotiMistakes.length === 0 ?
                      '暂无优选错题' :
                      <>
                        <div dangerouslySetInnerHTML={{ __html: this.state.optimizationcuotiMistakes[0].title }} />
                        <div className={style.leftText}>【知识点】</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.optimizationcuotiMistakes[0].knowledges || '暂无知识点' }} />
                        <div className={style.leftText}>【答案】</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.optimizationcuotiMistakes[0].answer || '暂无答案' }} />
                        <div className={style.leftText}>【解析】</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.optimizationcuotiMistakes[0].parse || '暂无解析' }} />
                      </>
                    }

                  </div>
                </div>

                <div style={{
                  border: '1px solid  rgba(231,231,231,1)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px 25px 35px 30px',
                  width: '58%'
                }}>
                  <h3 className={style.fonsfwc}>原图</h3>
                  {this.state.nowWindows.userAnswerList && this.state.nowWindows.userAnswerList[0].answer.split(',').map((item, i) => (
                    <img key={i} className={style.yuantp} src={item.indexOf('?') > 0 ? `${item}/thumbnail/1000x` : `${item}?imageMogr2/thumbnail/1000x`}></img>
                  ))
                  }
                </div>
              </div> :
              <div>
                {
                   this.state.nowWindows.type === 0&&this.state.nowWindows.type!=2?
                   <div>
                      <Button style={{float:"right",marginBottom:15}} onClick={()=>{
                        this.setState({thvisilble:true,updateRecommend:false})
                      }}>替换</Button>
                  </div>:''
                }
                {
                  (this.state.nowWindows.type===2||this.state.nowWindows.type===1)?
                  <span className={style.matchingError} style={{marginBottom:10}} onClick={this.showPipei.bind(this)}>
                    恢复匹配
                  </span>:''
                }
                {this.state.nowWindows.userAnswerList && this.state.nowWindows.userAnswerList[0].answer.split(',').map((item, i) => (
                  <img key={i} style={{ width: '100%', margin: 'auto' }} src={item.indexOf('?') > 0 ? `${item}/thumbnail/1000x` : `${item}?imageMogr2/thumbnail/1000x`}></img>
                ))}
              </div>
            }
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
            {
              this.props.state.visible ? this.addVie() : ''
            }
          </Modal>

          <Modal
            keyboard={false}
            maskClosable={false}
            visible={this.props.state.showPdfModal}
            onOk={() => {
              window.location.href = this.props.state.pdfUrl.downloadLink;
              this.props.dispatch({
                type: 'report/maidian',
                payload: { functionId: 16, actId: 1 }
              })
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
            <div style={{ height: '700px' }}>
              <iframe src={fileLink} title='下载预览' style={{ width: '100%', height: '100%', border: 0 }}></iframe>
            </div>

          </Modal>



          <Modal
            zIndex={102}
            maskClosable={false}
            afterClose={()=>this.resetThModal()}
            visible={this.state.thvisilble}
            destroyOnClose={true}
            footer={null}
            style={{top:50,minWidth:950}}
            width='950px'
            title='选择题目替换'
            onCancel={()=>{
              this.setState({
                thvisilble: false
              })
            }}
            >
            <div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div>
                    <TextArea 
                      onChange={(e)=>{
                        console.log('e: ', e,e.target.value);
                        this.setState({
                          _questionKeyword:e.target.value
                        })
                      }} 
                      style={{width:"260px",marginRight:15,height:75}}></TextArea> 
                    <Button loading={this.state.quering.queryText} onClick={()=>this.queryQuestionsBy('text')}>按关键字匹配</Button>
                  </div>

                  <div style={{width:350}}>
                    <Input style={{width:"200px",marginRight:15}} placeholder='输入关键字查询知识点'
                      onChange={(e)=>{
                        this.setState({
                          _zsdKeyword:e.target.value
                        })
                      }} 
                    ></Input> 
                    <Button loading={this.state.quering.queryZsd} onClick={()=>this.getZsd()}>搜索知识点</Button>
                    <div style={{marginTop:10}}>
                      <Select
                          style={{ width: 200 }}
                          placeholder="选择知识点"
                          value={this.state.zsdid>-1?this.state.zsdid:'选择知识点'}
                          onChange={(value)=>{
                            this.setState({
                              zsdid:value
                            })
                          }}
                        >
                        {this.state.zsds.length&&this.state.zsds.map(item => (
                          <Option key={item.id} value={item.id}>{item.knowledgeName}</Option>
                        ))}
                      </Select>
                      <Button style={{marginLeft:15}} onClick={()=>this.queryQuestionsBy('zsd')}> 按知识点匹配</Button>
                    </div>
                  </div>
                </div>
                <Spin spinning={this.state.quering.queryText||this.state.quering.queryZsd1}>
                  <div style={{border:'1px solid #eee',padding:'10px',marginTop:15,maxHeight:600,overflowY:'auto',minHeight:200}}>
                    <h3 style={{color:"#1890FF"}}>{this.props.state._questiondata.count?"请从下面的搜索结果中选择一道题，点击确定":''}</h3>
                    {this.props.state._questiondata.count?this.props.state._questiondata.qsList.map((item,index) => (
                        <div className='clearfix' key={item.title} style={{borderBottom:'1px solid #eee',padding:10}}>
                          <div dangerouslySetInnerHTML={{ __html: item.title }}></div>
                          <div>【知识点】<span>{item.knowledgeName}</span></div>
                          <div>
                            【答案】
                            <div dangerouslySetInnerHTML={{ __html: item.answer }}></div>
                          </div>
                          <Button loading={this.state.currentQuestionIndex===index} type='primary' style={{float:'right'}} onClick={()=>this.doUpdateQuestion(item,index)}>确定</Button>
                        </div>
                    )):<Empty description='暂无题目'></Empty>}
  
                  </div>
                </Spin>
                <div style={{paddingTop:15}}>
                  <Pagination  current={this.state.currentPageIndex} hideOnSinglePage={true} onChange={(page,pagesize)=>this.changePagination(page,pagesize)} total={this.props.state._questiondata.count} />
                </div>
            </div>
          </Modal>
        </div>
      </Content>
    )
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
    if (classId !== '' && subId != '' && year !== '') {

      let data = {
        classId: classId,
        year: year,
        subjectId: this.props.state.subId,
      };
      this.props.dispatch({
        type: 'report/queryQrStudentCount',
        payload: data
      }).then(() => {
        //获取知识点筛选
        this.props.dispatch({
          type: 'temp/getKnowledgeList',
          payload: {
            classId,
            year,
            subjectId: this.props.state.subId,
            userId: this.props.state.userId,
            type: 1
          }
        });
      })
    }
    this.props.dispatch({
      type: 'report/maidian',
      payload: { functionId: 7, actId: 2 }
    })

  }

  componentWillUnmount() {
    //清空知识点
    this.props.dispatch({
      type: 'report/knowledgenow',
      payload: []
    });
    //卸载组件前清空数据，减少加载组件时，渲染之前的数据,提升组件初始加载速度
    this.props.dispatch({
      type: 'report/qrStudentDetailList',
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
}))(StuReport);
