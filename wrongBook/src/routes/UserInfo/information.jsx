import React from 'react';
import { Layout, Input,Modal,Radio,Button } from 'antd';
import {  Link, } from "dva/router";
import { connect } from 'dva';
import style from './information.less';
import store from 'store';
const { Content } = Layout;
// const Search = Input.Search;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const { TextArea } = Input;
//作业中心界面内容
class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			changePhone:0,
			phone:store.get('wrongBookNews').phone,
			name:store.get('wrongBookNews').userName,
			headUrl:store.get('wrongBookNews').avatarUrl  
		}
	}
	render() {
		let userNews = store.get('wrongBookNews')
		console.log(userNews)
		return(
			<Layout>
				<Content style={{ overflow: 'initial',position:'relative'}} style={{background:'#fff',borderTop:'1px solid #eee'}}>
					<div className={style.userBorder}>
						<div className={style.userNews}>
							<img className={style.userImg}  alt='' src={userNews.avatarUrl!= null || userNews.avatarUrl != 'null'?'http://images.mizholdings.com/face/default/02.gif': userNews.avatarUrl  }></img>
							<p className={style.userName}>{userNews.userName}</p>
							<div>
								
							</div>
						</div>
						<div className={style.newsBorder}>
							<p></p>
							<p></p>
						</div>
					</div>
					{/* <div className={style.layout} style={{ padding: 24, background: '#fff',height:735   }}>
						<div className={style.headport}>
							<img alt='' src={userNews.avatarUrl !==null ? userNews.avatarUrl :'http://images.mizholdings.com/face/default/02.gif'}/>
							
							<div style={{display:'inline-block',verticalAlign:"bottom"}}>
								<p>{userNews.userName}</p>
								<p>{userNews.schoolName}</p>
							</div>
						</div>
						{
							userNews.classes !== null ?
							<div style={{margin:'20px 10px'}}>
								<h3 style={{marginBottom:'30px'}}>班级</h3>
								<div>
									{
										userNews.classes.map((item,i) =>(
											<span key={i} style={{margin:'0 10px'}}>{item}</span>
										))
									}
								</div>
							</div>:''
						}
						<div style={{margin:'20px 10px'}}>
							<h3 style={{marginBottom:'30px'}}>修改信息</h3>
							<div style={{marginBottom:'30px'}}>						
								<span style={{width:"100px",display:'inline-block'}}>姓名</span>
								<Input maxLength={10} value={this.state.name}  style={{width:'300px'}}
								onChange={(e)=>{
									this.setState({name:e.target.value})
								}}/>
							</div>
							<div style={{marginBottom:'30px'}}>						
								<span style={{width:"100px",display:'inline-block'}}>电话</span>
								<Input  value={this.state.phone}
									onFocus={()=>{
										if(this.state.changePhone == 0){
											let This = this;
											confirm({
												title: '确定修改手机号么?',
												content: '如果修改手机号您的登陆账号将会变成修改后的账号',
												okText:'确定',
												cancelText:'取消',
												onOk() {
													This.setState(
														{changePhone:1}
													)
												},
												onCancel() {
													This.setState(
														{changePhone:2}
													)
												},
											  });
										}
									}}
									onBlur={()=>{
										if(this.state.changePhone !== 1){
											this.setState({
												changePhone:0
											})
										}
									}}
									style={{width:'300px'}}
									onChange={(e)=>{
										if(this.state.changePhone == 1){
											this.setState({
												phone:e.target.value
											})
										}
									}}/>
							</div>
							<Button style={{margin:'50px 150px'}} type="primary"
								onClick={()=>{
									let data ={
										name:this.state.name,
										phone:this.state.phone,
										headUrl:this.state.headUrl
									}
									this.props.dispatch({
										type: 'userInfo/updateInfo',
										payload:data
									})
								}}
							>完成</Button>
						</div>
					</div> */}
				</Content>
			</Layout>
		);
	}
	componentDidMount(){
		let schoolId = store.get('wrongBookNews').schoolId
		let data ={
			schoolId:schoolId
		}
		const {dispatch} = this.props;
	}
}

export default connect((state) => ({
	state: {
		...state.userInfo,
	}
}))(HomeworkCenter);