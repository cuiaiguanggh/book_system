import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import { Input,Checkbox, message } from 'antd';
import { dataCen } from '../../config/dataCenter';
import style from './login.css';
import cookie from 'react-cookies'
import WxLogin from 'wxlogin.react';
let  loginType = [
	{key:0,cho:true,name:'扫码登陆'},
	{key:1,cho:false,name:'账号登陆'},
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
let urlIp = 'kacha'
let iframeVal = `https://open.weixin.qq.com/connect/qrconnect?appid=wx84919fd1783f83f8&redirect_uri=https%3a%2f%2flogin.kacha.xin%2fstatic%2f${urlIp}%2f%23%2fgetcode&response_type=code&scope=snsapi_login&state=${uuid}`
class Login extends Component {
	constructor(props) {
    super(props);
    this.Ref = ref => {this.refDom = ref};
    let name = '' ,pass = '' ;
    if(cookie.load('catchyName')!=undefined){
      // this.setState({name:cookie.load('catchyName')})
      name = cookie.load('catchyName')
    }
    
    if(cookie.load('catchyPass')!=undefined){
      // this.setState({name:cookie.load('catchyName')})
      pass = cookie.load('catchyPass')
    }
		this.state={
      name:name,
      pass:pass,
      checked:false,
      wxLog:false,
      websocket:false,
    }
	}
  handleChange(value) {
    console.log(`selected ${value}`);
  }
  getCode() {
    let This = this;
    var websocket = null;
    //判断当前浏览器是否支持WebSocket
    let url =  dataCen('/wrongManage-bate/wechatLogin?loginId='+uuid)
    if ('WebSocket' in window) {
        websocket = new WebSocket(url);
    }
    else {
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
        
    }
    //连接关闭的回调方法
    websocket.onclose = function () {
        console.log("WebSocket连接关闭");

        This.props.dispatch({
            type: 'report/toupload',
            payload:false
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
  render() {
    let cl1= '';
    let cl2 = style.tolog;
    if(this.state.wxLog){
      cl1= style.tolog;
      cl2 = '';
    }else{
      cl2 = style.tolog;
      cl1 = '';
    }
    return (
      <div className={style.normal}>
        <div className={style.loginInner}>
            <h2>咔嚓错题数据详情系统</h2>
            {/* <h2>账号登陆</h2> */}
            <div className={style.chooseType}>
              {
                loginType.map((item,i)=>(
                  <span className={item.key == 0 ? cl1:cl2} onClick={()=>{
                    if(item.cho){
                      this.getCode()
                    }
                    this.setState({wxLog:item.cho});
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
                  <p style={{color:'#00b1ff',margin:0}}>手机号码（11位）</p>
                  <Input type='text' value={this.state.name} style={{border:'none',padding:'0 10px',height:'42px'}}
                    onKeyUp ={ (e) =>{
                      if(e.keyCode === 13) {
                        cookie.save('catchyName', this.state.name, { path: '/' })
                        if(this.state.checked){
                          cookie.save('catchyPass', this.state.pass, { path: '/' })
                        }else{
                          cookie.remove('catchyPass', { path: '/' })
                        }
                        let data ={
                          username:this.state.name,
                          password:this.state.pass,
                          rem:this.state.checked,
                        }
                        if( this.state.name.replace(/(^\s*)|(\s*$)/g, "") == '' && this.state.pass == '') {
                          message.warning("账号或密码不能为空")
                        }else{
                          this.props.dispatch({
                            type : 'login/login',
                            payload:data
                          });
                        }
                      }
                    }
                  }
                  onChange={(e)=>{
                    this.setState({name:e.target.value})
                  }}/>
                </div>
              </div>
              <div className={style.loginPass}>
                <span className={style.passLogo}></span>
                <div className={style.inputLeft}></div>
                <div className={style.inputOut}>
                  <p style={{color:'#00b1ff',margin:0}}>密码（6-20位）</p>
                  <Input type="password" autoComplete="off" value={this.state.pass} style={{border:'none',padding:'0 10px',height:'42px'}} 
                    onKeyUp ={(e)=>{
                      if(e.keyCode === 13) {
                        cookie.save('catchyName', this.state.name, { path: '/' })
                        if(this.state.checked){
                          cookie.save('catchyPass', this.state.pass, { path: '/' })
                        }else{
                          cookie.remove('catchyPass', { path: '/' })
                        }
                        let data ={
                          username:this.state.name,
                          password:this.state.pass,
                          rem:this.state.checked,
                        }
                        if( this.state.name.replace(/(^\s*)|(\s*$)/g, "") == '' && this.state.pass == '') {
                          message.warning("账号或密码不能为空")
                        }else{
                          this.props.dispatch({
                            type : 'login/login',
                            payload:data
                          });
                        }
                      }}
                    }
                    onChange={(e)=>{
                      this.setState({pass:e.target.value})
                    }} />
                </div>
              </div>
              <div className={style.login}
            onClick={()=>{
            cookie.save('catchyName', this.state.name, { path: '/' })
            if(this.state.checked){
              cookie.save('catchyPass', this.state.pass, { path: '/' })
            }else{
              cookie.remove('catchyPass', { path: '/' })
            }
            let data ={
              username:this.state.name,
              password:this.state.pass,
              rem:this.state.checked,
            }
            if( this.state.name.replace(/(^\s*)|(\s*$)/g, "") == '' || this.state.pass == '') {
              message.warning("账号或密码不能为空")
            }else{
              this.props.dispatch({
                type : 'login/login',
                payload:data
              });
            }
            
          }}>登录</div>
          <div style={{margin:'0 30px',overflow:'hidden'}}>
            <Checkbox
              style={{float:'left'}}
              checked={this.state.checked}
              onChange={(e)=>{
                this.setState({checked:e.target.checked})
              }}
            ><span>记住密码</span>
            </Checkbox>
            <span className={style.forgotPassword}
              onClick={()=>{
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/fin_psd',
                    })
                )
              }}
            >忘记密码</span>
          </div>
          </div>:
          <div className='log'>
            <div id="login_container"></div>
            <iframe id='iframe' ref={this.Ref} className={style.iframe} src={iframeVal}  onLoad={this.getCode()}/>
          </div>
          }
        </div>
      </div>
    );
  }
  componentDidMount(){
    if(cookie.load('catchyName')!=undefined){
      this.setState({name:cookie.load('catchyName')})
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
      type : 'login/vcOk',
    });
    if(flag){
      this.props.dispatch(
        routerRedux.push({
          pathname: '/login',
          })
      )
    }else{
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