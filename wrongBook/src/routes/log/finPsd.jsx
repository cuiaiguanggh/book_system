import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import { Input,Button } from 'antd';
import style from './findPsd.less';
import {routerRedux} from 'dva/router';
import Top from '../Layout/top';

class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state={
      phone:'',
      code:1,
      checked:false,
      verification:''
		}
	}
  handleChange(value) {
    console.log(`selected ${value}`);
  }
  render() {
    return (
      <div className={style.normal}>
        <Top type='findPsd'></Top>
        <img className={style.innerImg}  src={require('../images/dl-pig-n.png')}
          
        />
        <div className={style.loginInner}>
            {
              this.state.verification == ''?
              <div className ={style.findMenu}>
                <span style={{color:'#00b1ff'}}>1.验证手机号</span> 
                <span>></span>
                <span>2.设置新密码</span> 
              </div>:
              <div className ={style.findMenu}>
                <span style={{color:'#00b1ff'}}>1.验证手机号</span> 
                <span>></span>
                <span style={{color:'#00b1ff',fontWeight:'bold'}}>2.设置新密码</span> 
              </div>
            }
            {
              this.state.verification == '' ?
                <div className={style.log}>
                  <div className={style.loginName}>
                    {/* <img src={require('../../images/dl-sj-n@3x.png')} /> */}
                    <div className={style.inputOut}>
                      <p style={{color:'#00b1ff',margin:0}}>手机号码（11位）</p>
                      <Input  style={{border:'none',padding:'0 10px',width:'100%',height:'42px'}} onChange={(e)=>{
                        this.setState({phone:e.target.value})
                      }}/>
                    </div>
                  </div>
                  <div className={style.loginPass}>
                    <div className={style.inputOutP}>
                      <p style={{color:'#00b1ff',margin:0}}>验证码</p>
                      <Input  style={{border:'none',padding:'0 10px',height:'42px'}} onChange={(e)=>{
                        this.setState({code:e.target.value})
                      }} />
                    </div>
                    {
                      this.state.code !=''?
                      <Button className={style.codeButton} type="primary">获取验证码</Button>:
                      <Button className={style.codeButton} type="primary" disabled>获取验证码</Button>
                    }
                  </div>
                </div>:
                <div className={style.log}>
                  <div className={style.loginName}>
                    {/* <img src={require('../../images/dl-sj-n@3x.png')} /> */}
                    <div className={style.inputOut}>
                      <p style={{color:'#00b1ff',margin:0}}>新密码</p>
                      <Input  style={{border:'none',padding:'0 10px',width:'100%',height:'42px'}} onChange={(e)=>{
                        this.setState({phone:e.target.value})
                      }}/>
                    </div>
                  </div>
                  <div className={style.loginPass}>
                    <div className={style.inputOut}>
                      <p style={{color:'#00b1ff',margin:0}}></p>
                      <Input placeholder="再次输入新密码" style={{border:'none',padding:'0 10px',height:'42px'}} onChange={(e)=>{
                        this.setState({code:e.target.value})
                      }} />
                    </div>
                  </div>
              </div>
            }
            {
              this.state.verification == '' ?
              <div className={style.login} onClick={()=>{
                let data ={
                  username:this.state.name,
                  password:this.state.pass,
                  rem:this.state.checked,
                }
                this.props.dispatch({
                  type : 'login/login',
                  payload:data
                });
                // this.props.
              }}>下一步</div>:
              <div className={style.login} onClick={()=>{
                let data ={
                  username:this.state.name,
                  password:this.state.pass,
                  rem:this.state.checked,
                }
                this.props.dispatch({
                  type : 'login/login',
                  payload:data
                });
                // this.props.
              }}>提交</div>
            }
           
        </div>
      </div>
    );
  }
}
export default connect((state) => ({
	state: {
			...state.userManage,
	}
}))(HomePage);