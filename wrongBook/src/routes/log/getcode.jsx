import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import { Input,Checkbox, message } from 'antd';
import style from './login.css';
import cookie from 'react-cookies'
import WxLogin from 'wxlogin.react';
let  loginType = [
	{key:0,cho:true,name:'扫码登陆'},
	{key:1,cho:false,name:'账号登陆'},
]
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
        }
    }
  handleChange(value) {
  }
  getCode(obj) {
  }
  render() {
    return (
        <div>
        </div>
    );
  }
  componentDidMount(){
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    let href =  window.location.href;
    let hash = href.substr(href.indexOf("code=")+5);
    let arr = hash.split('&state=');
    this.props.dispatch({
        type: 'login/codelog',
        payload:{
            code:arr[0],
            loginId:uuid
        }
    });
  }
}
export default connect((state) => ({
	state: {
			...state.userManage,
	}
}))(Login);