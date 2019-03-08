import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd';
import {connect} from 'dva';
import style from './LoginPage.css';
const FormItem = Form.Item;

class LoginPage extends Component {
	render() {
		const { state: {identity, certification}, dispatch } = this.props;
		return(
			 <div className='loginPageContaier wrap'>
			 	<div className='backTop'>
			 		<p className='loginTopContO'>咔嚓错题数据详情系统</p>
			 		<p className='loginTopContT'>欢迎登录</p>
			 	</div>
			 	<div className={style.loginCont}>
					 <Form onSubmit={this.handleSubmit} className="login-form">
						<FormItem>
								<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" value={identity} onChange={(e) => {
									this.setState({name:e.target.value})
								}} />
						</FormItem>
						<FormItem>
								<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" value={certification} onChange={(e) => {
									this.setState({pass:e.target.value})
								}}/>
						</FormItem>
						<FormItem>
							{/* {getFieldDecorator('remember', {
								valuePropName: 'checked',
								initialValue: true,
							})( */}
								{/* <Checkbox>记住我</Checkbox> */}
							{/* )} */}
							{/* <a className="login-form-forgot" href="">忘记密码</a> */}
							<Button type="primary" className="login-form-button" onClick={() => {
								let data ={
									username:this.state.name,
									password:this.state.pass,
								  }
								  this.props.dispatch({
									type : 'login/login',
									payload:data
								  });
							}}>
								登录
							</Button>
							{/* 或 <a href="#">马上注册</a> */}
						</FormItem>
					</Form>
				</div>
			</div>
		);
	}

}
//const WrappedNormalLoginForm = Form.create()(LoginPage);
//ReactDOM.render(<WrappedNormalLoginForm />, mountNode);

export default connect((state) => ({
	state: {
		...state.login,
	}
}))(LoginPage);