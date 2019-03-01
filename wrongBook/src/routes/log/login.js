import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import { Input } from 'antd';
import style from './login.css';


class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state={
      name:'',
      pass:'',
		}
	}
  handleChange(value) {
    console.log(`selected ${value}`);
  }
  render() {
    return (
      <div className={style.normal}>
        <div className={style.loginInner}>
            <h2>账号登陆</h2>
            <div className='log'>
                <div className={style.loginName}>
                  {/* <img src={require('../../images/dl-sj-n@3x.png')} /> */}
                  <span className={style.nameLogo}></span>
                  <div className={style.inputLeft}></div>
                  <div className={style.inputOut}>
                    <p style={{color:'#00b1ff',margin:0}}>手机号码（11位）</p>
                    <Input value={this.state.name} style={{border:'none',padding:'0 10px',height:'42px'}} onChange={(e)=>{
                      this.setState({name:e.target.value})
                    }}/>
                  </div>
                </div>
                <div className={style.loginPass}>
                  <span className={style.passLogo}></span>
                  <div className={style.inputLeft}></div>
                  <div className={style.inputOut}>
                    <p style={{color:'#00b1ff',margin:0}}>密码（6-20位）</p>
                    <Input type="password" value={this.state.pass} style={{border:'none',padding:'0 10px',height:'42px'}} onChange={(e)=>{
                      this.setState({pass:e.target.value})
                    }} />
                  </div>
                </div>
            </div>
            <div className={style.login} onClick={()=>{
              let data ={
                username:this.state.name,
                password:this.state.pass
              }
              this.props.dispatch({
                type : 'login/login',
                payload:data
              });
              // this.props.
            }}>登陆</div>
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