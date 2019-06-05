import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import { Input,Checkbox, message } from 'antd';
import style from './login.css';
import cookie from 'react-cookies'

let  loginType = [
	{key:0,cho:true,name:'扫码登陆'},
	{key:1,cho:false,name:'账号登陆'},
]
class Login extends Component {
	constructor(props) {
    super(props);
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
    }
	}
  handleChange(value) {
    console.log(`selected ${value}`);
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
            {/* <WxLogin
              option={{
                appid: 'wx2683f546552bc572',
                scope: 'snsapi_base',
                state: '11111',
                href: window.location.href,
                userServiceAPI: 'https://api.smartstudy.com/usert/third/oauth?',
                userServiceParams: {
                  source: 'crm2.smartstudy.tech',
                  from: 'pc',
                  group: 'B',
                  flag: 'signin',
                  type: 'weixin',
                  env: 'development',
                  accountId: undefined,
                },
                smartRedirect:window.location.href,
              }}
              style={{
                width: '300px',
                height: '400px',
              }}
            ></WxLogin> */}
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