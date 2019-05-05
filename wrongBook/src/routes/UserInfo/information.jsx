import React from 'react';
import { Layout, Input,Modal,Radio,Button,Select } from 'antd';
import {  Link, } from "dva/router";
import { connect } from 'dva';
import style from './information.less';
import store from 'store';
const { Content } = Layout;
// const Search = Input.Search;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const { TextArea } = Input;
const Option = Select.Option;
//作业中心界面内容
class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			changePhone:0,
			phone:store.get('wrongBookNews').phone,
			name:store.get('wrongBookNews').userName,
			headUrl:store.get('wrongBookNews').avatarUrl,
			subjectId:100
		}

	}
	getGradeName(){
		let userData=this.props.state.userData
		let str=''
		if(userData.subjectName!=null){
			str+=userData.subjectName
		}
		if(userData.gradeName!=null){
			str+='—'+userData.gradeName
		}
		return str
		
	}
	getSub() {
		//return
		let subList =  this.props.state.allSubList ;
		this.props.state.userData!==undefined?this.state.subjectId=this.props.state.userData.subjectId:100
		let subjectId = this.props.state.subjectId;
		if(subList && subList.length> 0 && subjectId != ''){
			return(
				<Select
						
						style={{ width: 300}}
						placeholder="学科"
						value={subjectId}
						optionFilterProp="children"
						onChange={(value)=>{
							this.props.dispatch({
								type: 'userInfo/subjectId',
								payload:value
							});
						}}
						
				>
					{
						subList.map((item,i) =>(
							<Option key={i} value={item.v}>{item.k}</Option>
						))
					}
			</Select>
			)
		}else{

		}
		} 
	render() {
		let userNews = store.get('wrongBookNews')
		let classArray = this.props.state.classList1.data
		let userData=this.props.state.userData
		// console.log(userNews,userData)
		return(
			<Layout>
				<Content style={{ overflow: 'initial',backgroundColor:'#fff'}} >
					<h3 style={{ background: '#fff',borderBottom:'1px solid #eee',margin:'0',padding:'10px 24px'}}>个人信息</h3>
					<div className={style.layout} style={{ padding: 24, background: '#fff',height:735   }}>
						<div className={style.headport_container}>
							<div className={style.headport}>
								<div className={style.avater_box}>
									<img  alt='' src={userData.avatarUrl!= null || userData.avatarUrl != 'null'?'http://images.mizholdings.com/face/default/02.gif': userData.avatarUrl  }/>
								</div>
								
								<div className={style.namebox} style={{display:'inline-block',verticalAlign:"bottom"}}>
									<p>{userData.name}</p>
									{
										classArray !== undefined&&userData.rodeType==30 ?
										<div style={{padding:'0 10px'}}>
										{
											classArray.map((item,i) =>(
												<span key={i} style={{}}>{item.className}{item.adminId==userNews.userId?<span className={style.banzhuren_icon}>
													<img  src={require('../images/banzhuren@2x.png')} alt=""/>
												</span>:''}{i===classArray.length-1?'':'，'}</span>
											))
											
										}
										
									</div>:''
									}
								
								</div>
								<div className={style.schoolbox}>
								{
									userData.rodeType==30?<p><img src={require('../images/nianji@2x.png')} alt=""/><span>
										{userData!=undefined? this.getGradeName():''}
									
									</span></p>:''
								}
							
										
										<p><img src={require('../images/school@2x.png')} alt=""/><span>{userData.schoolName}</span></p>	
								</div>
							</div>
						</div>
						
						<div style={{margin:'20px 10px'}}>
							<h3 style={{marginBottom:'30px',marginTop:'76px'}}>修改信息</h3>
							<div style={{marginBottom:'30px'}}>						
								<span style={{width:"100px",display:'inline-block'}}>姓名：</span>
								<Input maxLength={10} value={this.state.name}  style={{width:'300px'}}
								onChange={(e)=>{
									this.setState({name:e.target.value})
								}}/>
							</div>
							<div style={{marginBottom:'30px'}}>						
								<span style={{width:"100px",display:'inline-block'}}>电话：</span>
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
							<div style={{marginBottom:'30px'}}>						
								<span style={{width:"100px",display:'inline-block'}}>学科：</span>
								{
									this.getSub()
								}
							</div>
							<Button style={{margin:'10px 100px'}} type="primary"
								onClick={()=>{
									let data ={
										name:this.state.name,
										phone:this.state.phone,									
									}
									if(this.state.subjectId!==100){
										data.subjectId=this.props.state.subjectId
									}
									this.props.dispatch({
										type: 'userInfo/updateInfo',
										payload:data
									})
								}}
							>确认修改</Button>
						</div>
					</div>
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
		dispatch({
			type: 'classHome/getClassList',
		});
		dispatch({
			type: 'userInfo/getSubjectList',
		});
		dispatch({
			type: 'userInfo/getUserInfo',
		});
	}
}

export default connect((state) => ({
	state: {
		...state.userInfo,
		...state.classHome,
	}
}))(HomeworkCenter);