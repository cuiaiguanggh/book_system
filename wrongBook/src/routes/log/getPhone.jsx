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
          <div className={style.loginInner}>
              <div className ={style.findMenu}>
                <span style={{color:'#00b1ff',cursor:'pointer'}}>关联教师账号信息</span> 
              </div>
                <div className={style.log}>
                  <div className={style.loginName}>
                    {/* <img src={require('../../images/dl-sj-n@3x.png')} /> */}
                    <div className={style.inputOut}>
                      <p style={{color:'#00b1ff',margin:0}}>教师账号</p>
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
                    <div className={style.inputOut}>
                      <p style={{color:'#00b1ff',margin:0}}>教师密码</p>
                      <Input value={this.state.code} style={{border:'none',padding:'0 10px',width:'100%',height:'42px'}} maxLength={6} onChange={(e)=>{
                        if(/^[0-9]+$/.test(e.target.value)  || e.target.value == ''){
                          this.setState({code:e.target.value})
                        }
                      }} />
                    </div>
                    
                  </div>
                </div>
              <div className={style.login} onClick={()=>{
                Trim();
                if(this.props.state.phone.trim() == '' || this.state.code.trim() == ''){
                  message.warning('手机号或密码不能为空')
                }else{
                  let data ={
                    username:this.props.state.phone,
                    password:this.state.code,
                  }
                  this.props.dispatch({
                    type : 'login/phoneLogin',
                    payload:data
                  });
                }
              }}>点击关联</div>
        </div>
        
      </div>
    );
  }
}
export default connect((state) => ({
	state: {
			...state.login,
	}
}))(HomePage);