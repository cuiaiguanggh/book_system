import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Form, Icon, Input, Button} from 'antd';
// import Icon from '../../../components/Icon';
import store from 'store';
import {connect} from 'dva';
import style from '../css/loginPage.css';
const FormItem = Form.Item;

class LoginPage extends Component {
	
	render() {
		store.set('wrongBookToken','')
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
									dispatch({
										type:'login/changeUsername',
										payload:e.target.value
									});
								}} />
						</FormItem>
						<FormItem>
								<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" value={certification} onChange={(e) => {
									dispatch({
										type:'login/changePassword',
										payload:e.target.value
									});
								}}/>
						</FormItem>
						<FormItem>
							<Button type="primary" className="login-form-button" onClick={() => {
								dispatch({
									type: 'login/login'
								});
							}}>
								登录
							</Button>
							<div className="viFooter">
								版本号:V2.0.0
							</div>
						</FormItem>
					</Form>
				</div>
			</div>
		);
	}

}

export default connect((state) => ({
	state: {
		...state.login,
	}
}))(LoginPage);