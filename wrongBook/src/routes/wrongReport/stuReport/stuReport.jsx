import React from 'react';
import {
  Layout, Menu, Button, message, Select, Modal, Icon, Row, Spin,
} from 'antd';
import {routerRedux, Link} from "dva/router";
import {connect} from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './stuReport.less';
import moment from 'moment';
import {dataCen, dataCenter, serverType} from '../../../config/dataCenter'
import store from 'store';
import commonCss from '../../css/commonCss.css'
import TracksVideo from "../TracksVideo/TracksVideo";
import QRCode from "qrcode.react";
//作业中心界面内容
const Option = Select.Option;
const {
  Header, Footer, Sider, Content,
} = Layout;
const antIcon = <Icon type="loading" style={{fontSize: 50}} spin/>;
const confirm = Modal.confirm;
let hei = 0;

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
      next: true,
      toupload: false,
      pull: false,
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
    fetch(dataCenter('/file/uploadFlie?token=' + token), {
      method: "POST",
      body: form
    })
      .then(response => response.json())
      .then(res => {
        if (res.result === 0) {
          This.props.dispatch({
            type: 'report/uploadVideo',
            payload: {
              uqId: This.props.state.uqId,
              url: res.data.path,
              // authorId:store.get('wrongBookNews').userId,
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
    if (serverType === 2) {
      value = 'https://dy.kacha.xin/wx/takevideoPreview/'
    }
    value += 'video?uqId=' + this.props.state.uqId + '&authorId=' + userId;
    let This = this;
    // console.log(this.props.state.visible1,this.props.state.toupload )
    if (!this.props.state.visible1 && !this.props.state.toupload) {
      var timestamp = new Date().getTime() + "";
      timestamp = timestamp.substring(0, timestamp.length - 3);
      var websocket = null;
      //判断当前浏览器是否支持WebSocket
      let url = dataCen('/wrongManage/teachVideoUpload?userId=' + userId + '&uqId=' + this.props.state.uqId)
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
      <div className={style.codeFram} style={{textAlign: 'center', overflow: "hidden"}}>
        <div className={style.questionBody}>
          {/*<div className={style.questionTop}>*/}
          {/*  <span>答错<span style={{color: "#1890ff", fontWeight: 'bold', padding: '0 5px'}}>{questionNews.wrongNum}</span>人</span>*/}
          {/*</div>*/}
          <div style={{padding: '10px', height: '250px', overflow: 'hidden'}}>
            {
              questionNews.questionUrl.split(',').map((item, i) => (
                <img key={i} style={{width: '100%'}} src={item}></img>
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
                      <QRCode className='qrcode' size={150} value={value}/>
                      <p style={{marginTop: 20, fontSize: '16px', color: '#606266'}}>手机微信扫码，录制视频讲解</p>

                      <label htmlFor="file">
                                            <span
                                              className={style.addButon}
                                            >本地上传</span>
                        <p style={{margin: '10px 0'}}>支持文件类型:mp4 </p>
                        <p style={{margin: '10px 0'}}>文件大小限制:50MB</p>
                      </label>
                      <input
                        type='file'
                        id='file'
                        accept='.mp4'
                        style={{display: 'none'}}
                        onChange={this.onImportExcel}
                      />
                    </div> :
                    <div>
                      <Spin style={{height: '155px', marginLeft: '-24px', lineHeight: "150px"}} indicator={antIcon}/>
                      {/* <Icon type="loading" style={{ fontSize: 24 }} spin /> */}
                      <p style={{marginTop: 20, fontSize: '16px', color: '#606266'}}>正在上传...</p>
                      <span
                        className={style.addButon}
                      >本地上传</span>
                      <p style={{margin: '10px 0'}}>支持文件类型：mp4 </p>
                      <p style={{margin: '10px 0'}}>文件大小限制：50MB</p>
                    </div>
                }
              </div>
              :
              <div>
                <video
                  id="video"
                  controls="controls"
                  width="100%"
                  style={{height: '210px'}}
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

  handleScroll(e) {
    const {clientHeight} = this.refDom;
    hei = clientHeight;
  }

  menulist() {
    let studentList = this.props.state.studentList;
    let current = this.props.state.userId;
    if (studentList.data.length > 0) {
      if (current !== '') {
        return (
          <Menu
            // theme="dark"
            mode="inline"
            defaultSelectedKeys={[current]}
            onClick={(e) => {
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
              this.props.dispatch({
                type: 'report/qrStudentDetailList',
                payload: []
              })
              let data = {
                classId: this.props.state.classId,
                year: this.props.state.years,
                subjectId: this.props.state.subId,
                userId: e.key,
                info: 0,
                pageSize: 50,
                pageNum: 1
              }
              if (this.props.state.mouNow != 0) {
                data.month = this.props.state.mouNow.v
              }
              this.props.dispatch({
                type: 'report/userQRdetail',
                payload: data
              });
              let dom = document.getElementsByClassName('down');
              for (let i = 0; i < dom.length; i++) {
                dom[i].innerHTML = "加入错题篮";
                dom[i].className = 'down'
              }
              this.props.dispatch({
                type: 'down/delAllStu',
              });
            }}
          >
            {
              studentList.data.map((item, i) => (
                <Menu.Item key={item.userId} style={{cursor: 'pointer'}} title={item.userName}>
                  <div key={i} style={{overflow: 'hidden'}}>
                    <span style={{
                      float: 'left',
                      width: "70%",
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{item.userName}</span>
                    <span style={{float: 'right'}}>{item.wrongNum}道</span>
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
    } else {

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
                  <div className={style.questionTop}>
                    <span style={{marginRight: '20px'}}>第{i + 1}题</span>
                    {/* <span>班级错误率：{}%（答错15人）</span> */}
                    {
                      item.num != 0 ?

                        <span style={{borderLeft: '1px solid #ccc', paddingLeft: '20px'}}>已出卷<span
                          style={{color: "#1890ff", fontWeight: 'bold', padding: '0 5px'}}>{item.num}</span>次</span>
                        : ''
                    }
                    <TracksVideo type={item} num={j}></TracksVideo>
                  </div>
                  <div style={{padding: '10px', height: '250px', overflow: "hidden"}} onClick={() => {
                    this.setState({visible: true, Img: item.userAnswerList[0].answer})
                    // if (item.wrongScore != 0) {
                    //   this.setState({visible: true, key: i, showAns: ans[0]})
                    // }
                    let w = document.getElementsByClassName('wrongNum');
                    if (w.length > 0) {
                      for (let j = 0; j < w.length; j++) {
                        w[j].className = 'wrongNum'
                      }
                      w[0].className = 'wrongNum wrongNumOn'
                    }
                  }}>
                    {item.userAnswerList[0].answer?
                      item.userAnswerList[0].answer.split(',').map((item, i) => (
                        <img key={i} style={{width: '100%'}} src={item}></img>
                      )):''
                    }
                  </div>

                  <div style={{overflow: 'hidden', paddingLeft: '10px', paddingTop: '20px'}}>
								
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
                        <img style={{marginTop: '-4px', marginRight: '4px'}}
                             src={require('../../images/sp-xt-n.png')}/> :
                        <img style={{marginTop: '-4px', marginRight: '4px'}} src={require('../../images/sp-yc-n.png')}/>

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

  render() {
    let mounthList = this.props.state.mounthList;
    let studentList = this.props.state.studentList;
    let detail = this.props.state.qrdetailList1;
    let fileLink = this.props.state.pdfUrl.fileLink;
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
          <iframe style={{display: 'none'}} src={this.state.wordUrl}/>
          <div style={{height: '50px', lineHeight: '50px'}}>
            <div style={{padding: '0 20px', background: "#fff", borderBottom: '1px solid #ccc'}}>
              <span>时间：</span>
              <span key={0} className={0 == this.props.state.mouNow ? 'choseMonthOn' : 'choseMonth'} onClick={() => {
                this.props.dispatch({
                  type: 'report/changeMouth',
                  payload: 0
                });
                this.props.dispatch({
                  type: 'report/propsPageNum',
                  payload: 1
                });
                this.props.dispatch({
                  type: 'report/qrStudentDetailList',
                  payload: []
                })
                let data = {
                  classId: this.props.state.classId,
                  year: this.props.state.years,
                  subjectId: this.props.state.subId,
                  info: 0,
                  pageSize: 50,
                  pageNum: 1
                  // month:item.v,
                }
                this.props.dispatch({
                  type: 'report/queryQrStudentCount',
                  payload: data
                });

                this.props.dispatch({
                  type: 'down/AllPdf',
                  payload: false
                });
              }}>全部</span>
              {
                mounthList.data ?
                  mounthList.data.map((item, i) => (
                    <span key={i} className={item.k == this.props.state.mouNow.k ? 'choseMonthOn' : 'choseMonth'}
                          onClick={() => {
                            this.props.dispatch({
                              type: 'report/changeMouth',
                              payload: item
                            });
                            this.props.dispatch({
                              type: 'report/propsPageNum',
                              payload: 1
                            });
                            this.props.dispatch({
                              type: 'report/qrStudentDetailList',
                              payload: []
                            })
                            let data = {
                              classId: this.props.state.classId,
                              year: this.props.state.years,
                              subjectId: this.props.state.subId,
                              info: 0,
                              month: item.v,
                              pageSize: 50,
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
                          }}>{item.k}</span>
                  ))
                  : ''
              }
              <div style={{float: 'right'}} onMouseEnter={() => {
                this.setState({pull: true})
              }} onMouseLeave={() => {
                this.setState({pull: false})
              }}>
                {detail.data && detail.data.questionList.length != 0 ? <Button
                  style={{background: '#67c23a', color: '#fff', float: 'right', marginTop: "9px", border: 'none'}}
                  loading={this.props.state.downQue}
                  disabled={this.props.state.stuDown.length === 0 && !this.props.state.downQue}
                  onClick={() => {
                    if (this.props.state.stuDown.length != 0) {
                      this.props.dispatch({
                        type: 'down/downQue',
                        payload: true
                      })


                      if (this.props.state.hastrace[0] == 1) {

                        this.props.dispatch({
                          type: 'down/getQuestionPdf',
                          payload: {
                            picIds: this.props.state.stuDownPic.join(','),
                            mode: 1,
                            clean: 1
                          }
                        })
                      } else {
                        this.props.dispatch({
                          type: 'down/getQuestionPdf',
                          payload: {
                            picIds: this.props.state.stuDownPic.join(','),
                            mode: 1,
                          }
                        })
                      }

                      // let url = dataCenter('/web/report/getQuestionPdf?picIds='+this.props.state.stuDownPic.join(','))
                      // // window.open(url,'_blank');
                      // this.setState({wordUrl:url})
                      // 添加导出次数
                      this.props.dispatch({
                        type: 'report/addStudentUp',
                        payload: this.props.state.stuDownPic
                      })
                      // 下载清空选题
                      this.props.dispatch({
                        type: 'down/delAllStu',
                      });
                    } else {
                      message.warning('请选择题目到错题篮')
                    }
                  }}>
                  <img style={{marginLeft: '10px', height: '15px', marginBottom: '4px'}}
                       src={require('../../images/xc-cl-n.png')}></img>
                  下载组卷({this.props.state.stuDown.length})
                </Button> : ''}
                {this.state.pull ?
                  <div className={style.buttonPull}
                       onClick={(e) => {
                         if (this.props.state.hastrace.indexOf('1') > -1) {
                           this.props.dispatch({
                             type: 'report/hastrace',
                             payload: ['2']
                           });
                         } else if (this.props.state.hastrace.indexOf('2') > -1) {
                           this.props.dispatch({
                             type: 'report/hastrace',
                             payload: ['1']
                           });
                         }
                       }}>
                    <Row style={{
                      height: '25px',
                      cursor: 'pointer',
                      margin: '10px 0 ',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>{this.props.state.hastrace[0] == 1 ?
                      <img style={{marginRight: '9px', height: '14px'}} src={require('../../images/lvxz.png')}></img> :
                      <img style={{marginRight: '9px', height: '14px'}} src={require('../../images/lvwxz.png')}></img>}
                      <span className={style.inputk} value="1">无答题痕迹</span>
                    </Row>
                    <Row style={{
                      height: '25px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      {this.props.state.hastrace[0] == 2 ?
                        <img style={{marginRight: '9px', height: '14px'}}
                             src={require('../../images/lvxz.png')}></img> :
                        <img style={{marginRight: '9px', height: '14px'}}
                             src={require('../../images/lvwxz.png')}></img>}
                      <span className={style.inputk} value="2">有答题痕迹</span>
                    </Row>
                  </div> : ''}
              </div>
              {
                (detail.data && detail.data.questionList.length != 0 && this.props.state.AllPdf && 0 != this.props.state.mouNow) ?
                  <Button
                    style={{
                      background: '#67c23a',
                      color: '#fff',
                      float: 'right',
                      marginTop: "9px",
                      border: 'none',
                      marginRight: '10px'
                    }}
                    loading={this.props.state.toDown}
                    onClick={() => {
                      if (this.props.state.hastrace[0] == 1){
                      this.props.dispatch({
                        type: 'down/getAllPdfV2ForQrc',
                        payload: {
                          classId: this.props.state.classId,
                          subjectId: this.props.state.subId,
                          year: this.props.state.years,
                          month: this.props.state.mouNow.v,
                          userId:  store.get('wrongBookNews').userId,
                          clean :1
                        }
                      });
                      }else {
                        this.props.dispatch({
                          type: 'down/getAllPdfV2ForQrc',
                          payload: {
                            classId: this.props.state.classId,
                            subjectId: this.props.state.subId,
                            year: this.props.state.years,
                            month: this.props.state.mouNow.v,
                            userId:  store.get('wrongBookNews').userId
                          }
                        });
                      }
                      let qlist = this.props.state.qrdetailList1.data.questionList;

                      this.props.dispatch({
                        type: 'down/allStuDown',
                        payload: qlist
                      });
                      this.props.dispatch({
                        type: 'report/addStudentUp',
                        payload: this.props.state.allStuDown
                      })

                      this.props.dispatch({
                        type: 'down/toDown',
                        payload: true
                      });
                      this.props.dispatch({
                        type: 'down/delAllStuDown',
                        payload: true
                      });


                    }}>

                    {
                      this.props.state.toDown ?
                        '组卷中' : '下载全部'
                    }
                  </Button> : ''
              }
              {/* <Button
								type="primary"
								style={{float:'right',marginTop:"9px",border:'none',marginRight:'10px'}}
								>
							查看原图
							</Button> */}
            </div>
          </div>
          <Layout className={style.innerOut}>
            {
              studentList.data && studentList.data.length > 0 ?
                <Sider className={style.sider}>
                  {this.menulist()}
                </Sider> : ''
            }
            <Content className={style.content}
                     ref='warpper'
                     onScroll={(e) => {
                       if (hei - 200 < e.target.scrollTop + e.target.clientHeight) {
                         if (this.state.next) {
                           let page = this.props.state.propsPageNum;
                           let classId = this.props.state.classId;
                           let subId = this.props.state.subId;
                           let year = this.props.state.years;
                           page++
                           this.setState({next: false})
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
                             pageSize: 50,
                             userId: this.props.state.userId
                           }
                           if (this.props.state.mouNow != 0) {
                             data.month = this.props.state.mouNow.v
                           }
                           this.props.dispatch({
                             type: 'report/userQRdetail1',
                             payload: data
                           });
                           let This = this
                           setTimeout(function () {
                             This.setState({next: true})
                           }, 1000)
                         }
                       }
                     }}>
              {
                detail.data && detail.data.questionList.length != 0 ? this.questions() :
                  <div style={{
                    textAlign: 'center',
                    position: 'relative',
                    top: '50%',
                    transform: 'translate(0%, -50%)',
                    width: '100%'
                  }}>
                    <img src={require('../../images/wsj-n.png')}></img>
                    <span
                      style={{fontSize: '30px', marginLeft: '50px', fontWeight: 'bold', color: "#434e59"}}>暂无数据</span>
                  </div>
              }
            </Content>
          </Layout>
          <Modal
            visible={this.state.visible}
            width='1000px'
            className="showques"
            footer={null}
            onOk={() => {
              this.setState({visible: false})
            }}
            onCancel={() => {
              this.setState({visible: false})
            }}
          >
            {
              this.state.Img.split(',').map((item, i) => (
                <img key={i} style={{width: '100%'}} src={item}></img>
              ))
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
            }}
            onCancel={() => {
              this.props.dispatch({
                type: 'report/visible',
                payload: false
              });
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
        </div>
      </Content>
    )
  }

  componentDidMount() {
    let classId = this.props.state.classId;
    let subId = this.props.state.subId;
    let year = this.props.state.years;
    let userId = this.props.state.userId;
    console.log(userId)
    this.props.dispatch({
      type: 'down/showPdfModal',
      payload: false
    });
    this.props.dispatch({
      type: 'report/propsPageNum',
      payload: 1
    });
    if (classId !== '' && subId != '' && year !== '' && userId != '') {
      let data = {
        classId: classId,
        year: year,
        subjectId: this.props.state.subId,
      }
      this.props.dispatch({
        type: 'report/queryQrStudentCount',
        payload: data
      });

    }
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
