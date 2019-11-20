import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Input, Checkbox, message, Popover, Modal } from 'antd';
import { dataCen } from '../../config/dataCenter';
import style from './login.css';
import cookie from 'react-cookies'
import WxLogin from 'wxlogin.react';
let loginType = [
  { key: 0, cho: true, name: '扫码登录' },
  { key: 1, cho: false, name: '账号登录' },
]
var d = new Date().getTime();
if (window.performance && typeof window.performance.now === "function") {
  d += performance.now(); //use high-precision timer if available
}
var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  var r = (d + Math.random() * 16) % 16 | 0;
  d = Math.floor(d / 16);
  return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});
//正式
let urlIp = 'kacha';
//预备
// let urlIp = 'kacha2';
let iframeVal = `https://open.weixin.qq.com/connect/qrconnect?appid=wx84919fd1783f83f8&redirect_uri=https%3a%2f%2flogin.kacha.xin%2fstatic%2f${urlIp}%2f%23%2fgetcode&response_type=code&scope=snsapi_login&state=${uuid}`

class Login extends Component {
  constructor(props) {
    super(props);
    this.Ref = ref => { this.refDom = ref };
    let name = '', pass = '';
    if (cookie.load('catchyName') != undefined) {
      // this.setState({name:cookie.load('catchyName')})
      name = cookie.load('catchyName')
    }

    if (cookie.load('catchyPass') != undefined) {
      // this.setState({name:cookie.load('catchyName')})
      pass = cookie.load('catchyPass')
    }
    this.state = {
      name: name,
      pass: pass,
      checked: false,
      wxLog: false,
      websocket: false,
      visible: false,
      applySchoolName: '',
      applyPhone: '',
      applyyzm: '',
      time: 0
    }
  }
  handleChange(value) {
    console.log(`selected ${value}`);
  }

  getCode() {
    // let This = this;
    // var websocket = null;
    // //判断当前浏览器是否支持WebSocket
    // let url =  dataCen('/wrongManage-bate/wechatLogin?loginId='+uuid)
    // if ('WebSocket' in window) {
    //     websocket = new WebSocket(url);
    // }
    // else {
    //     alert('当前浏览器  Not support websocket');
    // }
    // //连接发生错误的回调方法
    // websocket.onerror = function () {
    //     console.log("WebSocket连接发生错误");
    // };
    // //连接成功建立的回调方法
    // websocket.onopen = function () {
    //     console.log("WebSocket连接成功");
    // }
    // //接收到消息的回调方法
    // websocket.onmessage = function (event) {
    //     console.log(event)
    //
    // }
    // //连接关闭的回调方法
    // websocket.onclose = function () {
    //     console.log("WebSocket连接关闭");
    //
    //     This.props.dispatch({
    //         type: 'report/toupload',
    //         payload:false
    //     });
    // }
    // //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，
    // //防止连接还没断开就关闭窗口，server端会抛异常。
    // window.onbeforeunload = function () {
    //     closeWebSocket();
    // }
    // //关闭WebSocket连接
    // function closeWebSocket() {
    //     websocket.close();
    // }
  }
  render() {
    let cl1 = '';
    let cl2 = style.tolog;
    if (this.state.wxLog) {
      cl1 = style.tolog;
      cl2 = '';
    } else {
      cl2 = style.tolog;
      cl1 = '';
    }
    return (
      <div>
        <div className={style.loginTop}>
          <div className={style.box}>
            <span onClick={() => { window.location.href = "http://kacha.xin/" }}>
              咔嚓官网
          </span>
            <Popover placement="bottom" trigger="hover" content={(
              <div style={{ textAlign: "center" }}>
                <img src={require('../images/gzQR.png')} />
                <div>扫描二维码加我微信</div>
              </div>
            )} trigger="click">
              <span>联系我们</span>
            </Popover>
            <span onClick={() => [
              this.setState({
                visible: true
              })
            ]}>
              免费试用
          </span>
          </div>
        </div>
        <div className={style.normal}>
          <div className={style.loginInner}>
            <h2>咔嚓错题数据详情系统</h2>
            {/* <h2>账号登陆</h2> */}
            <div className={style.chooseType}>
              {
                loginType.map((item, i) => (
                  <span key={i} className={item.key == 0 ? cl1 : cl2} onClick={() => {
                    if (item.cho) {
                      this.getCode()
                    }
                    this.setState({ wxLog: item.cho });
                  }}>{item.name}</span>
                ))
              }
            </div>
            {
              !this.state.wxLog ?
                <div className='log'>
                  <div className={style.loginName}>
                    {/* <img src={require('../../images/dl-sj-n@3x.png')} /> */}
                    <span className={style.nameLogo}></span>
                    <div className={style.inputLeft}></div>
                    <div className={style.inputOut}>
                      <p style={{ color: '#00b1ff', margin: 0 }}>手机号码（11位）</p>
                      <Input type='text' value={this.state.name} style={{ border: 'none', padding: '0 10px', height: '42px' }}
                        onKeyUp={(e) => {
                          if (e.keyCode === 13) {
                            cookie.save('catchyName', this.state.name, { path: '/' })
                            if (this.state.checked) {
                              cookie.save('catchyPass', this.state.pass, { path: '/' })
                            } else {
                              cookie.remove('catchyPass', { path: '/' })
                            }
                            let data = {
                              account: this.state.name,
                              password: this.state.pass,
                              // rem:this.state.checked,
                            }
                            if (this.state.name.replace(/(^\s*)|(\s*$)/g, "") == '' && this.state.pass == '') {
                              message.warning("账号或密码不能为空")
                            } else {
                              this.props.dispatch({
                                type: 'login/login',
                                payload: data
                              });
                            }
                          }
                        }
                        }
                        onChange={(e) => {
                          this.setState({ name: e.target.value })
                        }} />
                    </div>
                  </div>
                  <div className={style.loginPass}>
                    <span className={style.passLogo}></span>
                    <div className={style.inputLeft}></div>
                    <div className={style.inputOut}>
                      <p style={{ color: '#00b1ff', margin: 0 }}>密码（6-20位）</p>
                      <Input type="password" autoComplete="off" value={this.state.pass} style={{ border: 'none', padding: '0 10px', height: '42px' }}
                        onKeyUp={(e) => {
                          if (e.keyCode === 13) {
                            cookie.save('catchyName', this.state.name, { path: '/' })
                            if (this.state.checked) {
                              cookie.save('catchyPass', this.state.pass, { path: '/' })
                            } else {
                              cookie.remove('catchyPass', { path: '/' })
                            }
                            let data = {
                              account: this.state.name,
                              password: this.state.pass,
                              // rem:this.state.checked,
                            }
                            if (this.state.name.replace(/(^\s*)|(\s*$)/g, "") == '' && this.state.pass == '') {
                              message.warning("账号或密码不能为空")
                            } else {
                              this.props.dispatch({
                                type: 'login/login',
                                payload: data
                              });
                            }
                          }
                        }
                        }
                        onChange={(e) => {
                          this.setState({ pass: e.target.value })
                        }} />
                    </div>
                  </div>
                  <div className={style.login}
                    onClick={() => {
                      cookie.save('catchyName', this.state.name, { path: '/' })
                      if (this.state.checked) {
                        cookie.save('catchyPass', this.state.pass, { path: '/' })
                      } else {
                        cookie.remove('catchyPass', { path: '/' })
                      }
                      let data = {
                        account: this.state.name,
                        password: this.state.pass,
                      }
                      if (this.state.name.replace(/(^\s*)|(\s*$)/g, "") == '' || this.state.pass == '') {
                        message.warning("账号或密码不能为空")
                      } else {
                        this.props.dispatch({
                          type: 'login/login',
                          payload: data
                        })
                      }

                    }}>登录</div>
                  <div style={{ margin: '0 30px', overflow: 'hidden' }}>
                    <Checkbox
                      style={{ float: 'left' }}
                      checked={this.state.checked}
                      onChange={(e) => {
                        this.setState({ checked: e.target.checked })
                      }}
                    ><span>记住密码</span>
                    </Checkbox>
                    <span className={style.forgotPassword}
                      onClick={() => {
                        this.props.dispatch(
                          routerRedux.push({
                            pathname: '/fin_psd',
                          })
                        )
                      }}
                    >忘记密码</span>
                  </div>
                </div> :
                <div className='log'>
                  <div id="login_container"></div>
                  <iframe id='iframe' ref={this.Ref} sandbox="allow-top-navigation allow-popups-to-escape-sandbox allow-same-origin allow-scripts" className={style.iframe} src={iframeVal} onLoad={this.getCode()} />
                </div>
            }
          </div>
        </div>
        <Modal
          visible={this.state.visible}
          footer={null}
          width={600}
          destroyOnClose={true}
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 18, color: 'rgba(110, 114, 121, 1)', marginBottom: 45 }}>免费试用</p>
            <Input placeholder='请输入学校名称' style={{ marginBottom: 20, width: 360, height: 40 }} onChange={(e) => {
              this.setState({
                applySchoolName: e.currentTarget.value
              })
            }} />
            <Input placeholder='请输入联系电话' style={{ marginBottom: 20, width: 360, height: 40 }} onChange={(e) => {
              this.setState({
                applyPhone: e.currentTarget.value
              })
            }} />
            <Input placeholder='输入验证码' style={{ marginBottom: 55, width: 220, height: 40 }} onChange={(e) => {
              this.setState({
                applyyzm: e.currentTarget.value
              })
            }} />
            <div className={style.getQR} onClick={() => {
              if (this.state.time !== 0) {
                return false
              }
              if (!(/^1[3456789]\d{9}$/.test(this.state.applyPhone))) {
                message.error("手机号码有误，请重填");
              } else {
                this.props.dispatch({
                  type: 'login/getVC',
                  payload: {
                    phone: this.state.applyPhone
                  }
                });
                this.setState({
                  time: 60
                })
                let that = this;
                setInterval(function interval() {
                  if (that.state.time === 0) {
                    clearInterval(interval);
                    return false;
                  }
                  that.setState({
                    time: that.state.time - 1
                  })
                }, 1000);
              }
            }
            }>
              {this.state.time === 0 ? '获取短信验证码' : `重新发送${this.state.time}`}
            </div>
            <div className={style.applyButton} onClick={() => {
              if (this.state.applyPhone === '') {
                message.error("请输入手机号码");
                return false
              } else if (this.state.applySchoolName === '') {
                message.error("请输入学校名称");
                return false
              } else if (this.state.applyyzm === '') {
                message.error("请输入验证码");
                return false
              }
              this.props.dispatch({
                type: 'login/checkVC',
                payload: {
                  phone: this.state.applyPhone,
                  random: this.state.applyyzm,
                }
              }).then((res) => {
                if (res) {
                  this.props.dispatch({
                    type: 'login/trial',
                    payload: {
                      schoolName: this.state.applySchoolName,
                      phone: this.state.applyPhone,
                    }
                  }).then((res) => {
                    if (res) {
                      message.success('申请成功！客服人员将会在24小时内电话联系您，请注意接听')
                      this.setState({
                        visible: false,
                        applySchoolName: '',
                        applyPhone: '',
                        applyyzm: '',
                        time: 0
                      })
                    }
                  })
                }
              })
            }}>
              立即申请
            </div>
          </div>
        </Modal>
      </div >
    );
  }
  componentWillMount() {
    let token = window.location.hash.indexOf('token') > 0 ? window.location.hash.split('token=')[1] : ""
    if (token) {
      this.props.dispatch({
        type: 'login/tokenLogin',
        payload: {
          token
        }
      })
    }
  }
  componentDidMount() {
    if (cookie.load('catchyName') != undefined) {
      this.setState({ name: cookie.load('catchyName') })
    }
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
      "SymbianOS", "Windows Phone",
      "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    this.props.dispatch({
      type: 'login/vcOk',
    });
    if (!flag) {
      //   this.props.dispatch(
      //     routerRedux.push({
      //       pathname: '/login',
      //       })
      //   )
      // }else{
      this.props.dispatch(
        routerRedux.push({
          pathname: '/loginPhone',
        })
      )
    }
  }
}
export default connect((state) => ({
  state: {
    ...state.userManage,
  }
}))(Login);
