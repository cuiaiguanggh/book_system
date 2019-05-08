import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import { Input,Button, message } from 'antd';
import style from './findPsd.less';
import {routerRedux} from 'dva/router';
import Top from '../Layout/top';


function Trim(){
	String.prototype.trim = function(){
					return this.replace(/(^\s*) | (\s*$)/g,'');
	}
}

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state={
      phone:'',
      code:'',
      checked:false,
      verification:'',
      pc:0,
      time:59,
      passa:'',
      pass:'',
		}
	}
  render() {
    let Time = this.state.time;
    return (
      <div className={style.normal}>
        <Top type='findPsd'></Top>
        <img className={style.innerImg}  src={require('../images/dl-pig-n.png')} />
        {
          this.props.state.upd == 0?
          <div className={style.loginInner}>
            {
              this.props.state.vc == 0?
              <div className ={style.findMenu}>
                <span style={{color:'#00b1ff',cursor:'pointer'}} onClick={()=>{
                  this.props.dispatch({
                    type : 'login/vcOk',
                  });
                }}>1.验证手机号</span> 
                <span>></span>
                <span>2.设置新密码</span> 
              </div>:
              <div className ={style.findMenu}>
                <span style={{color:'#00b1ff',cursor:'pointer'}} onClick={()=>{
                  this.props.dispatch({
                    type : 'login/vcOk',
                  });
                }}>1.验证手机号</span> 
                <span>></span>
                <span style={{color:'#00b1ff',fontWeight:'bold'}}>2.设置新密码</span> 
              </div>
            }
            {
              this.props.state.vc == 0 ?
                <div className={style.log}>
                  <div className={style.loginName}>
                    {/* <img src={require('../../images/dl-sj-n@3x.png')} /> */}
                    <div className={style.inputOut}>
                      <p style={{color:'#00b1ff',margin:0}}>手机号码（11位）</p>
                      <Input value={this.props.state.phone} maxLength={11} style={{border:'none',padding:'0 10px',width:'100%',height:'42px'}} onChange={(e)=>{
                        if(/^[0-9]+$/.test(e.target.value) || e.target.value == '' ){
                          this.props.dispatch({
                            type : 'login/phone',
                            payload:e.target.value
                          });
                        }
                      }}/>
                    </div>
                  </div>
                  <div className={style.loginPass}>
                    <div className={style.inputOutP}>
                      <p style={{color:'#00b1ff',margin:0}}>验证码</p>
                      <Input value={this.state.code} style={{border:'none',padding:'0 10px',height:'42px'}} maxLength={6} onChange={(e)=>{
                        if(/^[0-9]+$/.test(e.target.value)  || e.target.value == ''){
                          this.setState({code:e.target.value})
                        }
                      }} />
                    </div>
                    {
                      this.props.state.pc == 0?
                      <Button className={style.codeButton} onClick={()=>{
                          Trim();
                          if(this.props.state.phone.trim()!= '' &&this.props.state.phone.length == 11){
                            this.setState({pc:1})
                            this.props.dispatch({
                              type : 'login/pc',
                              payload:1
                            });
                            this.props.dispatch({
                              type : 'login/getVC',
                              payload:{
                                phone:this.props.state.phone
                              }
                            });
                            let time = this.state.time;
                            let This = this;
                            let t = setInterval(function (){
                              if(time == -1){
                                clearInterval(t)
                                This.setState({time:59,pc:0})
                                This.props.dispatch({
                                  type : 'login/pc',
                                  payload:0
                                });
                              }
                              This.setState({time:time--})
                            },1000)
                          }else{
                            message.warning("请输入正确的手机格式")
                          }
                          
                      }} type="primary">获取验证码</Button>:
                      <Button className={style.codeButton} type="primary" >
                        重新发送( {Time}s )
                      </Button>
                    }
                  </div>
                </div>:
                <div className={style.log}>
                  <div className={style.loginName}>
                    {/* <img src={require('../../images/dl-sj-n@3x.png')} /> */}
                    <div className={style.inputOut}>
                      <p style={{color:'#00b1ff',margin:0}}>新密码</p>
                      <Input type="password" value={this.state.pass} style={{border:'none',padding:'0 10px',width:'100%',height:'42px'}} onChange={(e)=>{
                        this.setState({pass:e.target.value})
                      }}/>
                    </div>
                  </div>
                  <div className={style.loginPass}>
                    <div className={style.inputOut}>
                      <p style={{color:'#00b1ff',margin:0}}></p>
                      <Input type="password" value={this.state.passa}  placeholder="再次输入新密码" style={{border:'none',padding:'0 10px',height:'42px'}} onChange={(e)=>{
                        this.setState({passa:e.target.value})
                      }} />
                    </div>
                  </div>
              </div>
            }
            {
              this.props.state.vc == 0 ?
              <div className={style.login} onClick={()=>{
                Trim();
                if(this.props.state.phone.trim() == '' || this.state.code.trim() == ''){
                  message.warning('手机号或验证码不能为空')
                }else{
                  let data ={
                    phone:this.props.state.phone,
                    vc:this.state.code,
                  }
                  this.props.dispatch({
                    type : 'login/checkVC',
                    payload:data
                  });
                }
              }}>下一步</div>:
              <div className={style.login} onClick={()=>{
                console.log(this.state.pass,this.state.passa,this.state.pass == '' || this.state.passa == '')
                if(this.state.pass == '' || this.state.passa == ''){
                  message.warning('密码不能为空')
                }else if(this.state.pass == this.state.passa){
                  if(this.state.pass.length >= 6 && this.state.pass.length <= 20){
                    this.props.dispatch({
                      type : 'login/updateInfo',
                      payload:{
                        password:this.state.pass,
                        token:this.props.state.token,
                      }
                    });
                  }else{
                    message.warning('密码长度需在6-20之间')
                  }
                }else{
                  message.warning('两次密码必须一致')
                }
              }}>提交</div>
            }
           
        </div>:
          <div className={style.loginInner}>
              <img src= {require('../images/dl-cg-n.png')}></img>
              <p className={style.uploadSucc}>
              修改密码成功
              </p>
              <p className= { style.toLogin} onClick={()=>{
                this.props.dispatch({
                  type : 'login/vcOk',
                });
                this.props.dispatch(
                  routerRedux.push({
                    pathname: '/loginPhone',
                    })
                )
              }
              }>
                3秒后自动跳转
              </p>
          </div>
        }
        
      </div>
    );
  }
}
export default connect((state) => ({
	state: {
			...state.login,
	}
}))(HomePage);