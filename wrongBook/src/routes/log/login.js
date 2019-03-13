import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import { Input,Checkbox } from 'antd';
import style from './login.css';
import cookie from 'react-cookies'

class HomePage extends Component {
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
    console.log('123123123123')
		this.state={
      name:name,
      pass:pass,
      checked:false,
    }
	}
  handleChange(value) {
    console.log(`selected ${value}`);
  }
  render() {
    return (
      <div className={style.normal}>
        <div className={style.loginInner}>
            <h2>咔嚓错题数据详情系统</h2>
            {/* <h2>账号登陆</h2> */}
            <div className='log'>
                <div className={style.loginName}>
                  {/* <img src={require('../../images/dl-sj-n@3x.png')} /> */}
                  <span className={style.nameLogo}></span>
                  <div className={style.inputLeft}></div>
                  <div className={style.inputOut}>
                    <p style={{color:'#00b1ff',margin:0}}>手机号码（11位）</p>
                    <Input type='text' value={this.state.name} style={{border:'none',padding:'0 10px',height:'42px'}} onChange={(e)=>{
                      this.setState({name:e.target.value})
                    }}/>
                  </div>
                </div>
                <div className={style.loginPass}>
                  <span className={style.passLogo}></span>
                  <div className={style.inputLeft}></div>
                  <div className={style.inputOut}>
                    <p style={{color:'#00b1ff',margin:0}}>密码（6-20位）</p>
                    <Input type="password" autoComplete="off" value={this.state.pass} style={{border:'none',padding:'0 10px',height:'42px'}} onChange={(e)=>{
                      this.setState({pass:e.target.value})
                    }} />
                  </div>
                </div>
            </div>
            <div className={style.login} onClick={()=>{
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
              this.props.dispatch({
                type : 'login/login',
                payload:data
              });
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
        </div>
      </div>
    );
  }
  componentDidMount(){
    if(cookie.load('catchyName')!=undefined){
      this.setState({name:cookie.load('catchyName')})
    }
	}
}
export default connect((state) => ({
	state: {
			...state.userManage,
	}
}))(HomePage);