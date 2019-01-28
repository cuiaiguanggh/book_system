import React from 'react';
import { Layout, Table, Input,message,  Popover, Pagination, Form,Rate ,Modal,Select, Icon
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './UserList.less';
import store from 'store';

const confirm = Modal.confirm;
const Option = Select.Option;
const { Content } = Layout;
const Search = Input.Search;
//作业中心界面内容

class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			editingKey: '',
			visible: false,
			visible1:false,
			schoolId:'',
	};
		this.columns = [
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title:'手机号',
				dataIndex:'phone',
				key:'phone',
			},
			{
				title:'所在班级',
				dataIndex:'class',
				key:'class',
				render: (text, record) => {
					let str = record.list.classes;
					if(str!=null){
						let classes = str.split(',')
						const content = (
							<div style={{paddingBottom:"10px"}}>
								{
									classes.map((item,i)=>(
										<p key={i}
											style={{padding:'10px',paddingBottom:'0',margin:'0'}}
										>{item}</p>
									))
								}
							</div>
						  )
						return(
							<div style={{textAlign:'center',position:"relative"}}>
								<span>{classes[0]}</span>
								<Popover trigger="click" content={content} >
									<Icon type="plus-circle"  style={{position:'absolute',right:'10px',fontSize:'18px'}}></Icon>
								</Popover>
							</div>
						)
					}else{
						return (
							<div style={{textAlign:'center'}}>暂无班级</div>
							);
					}
				},
			},
			{
			title: '操作',
			dataIndex: 'operation',
			render: (text, record) => {
				const editable = this.isEditing(record);
				return (
				<div>
					<span style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}} onClick={()=>{
						// this.setState({
						// 	visible:true,
						// })
						// let data ={
						// 	schoolId:store.get('wrongBookNews').schoolId,
						// 	page:1,
						// 	pageSize:9999,
						// }
						// this.props.dispatch({
						// 	type: 'userInfo/pageClass',
						// 	payload:data
						// });
					}}>加入班级</span>
					
					<span style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}} onClick={()=>{
						// 	let This = this;
						// 	confirm({
						// 		title: `确定删除${record.name}么?`,
						// 		okText: '是',
						// 		cancelText: '否',
						// 		onOk() {
						// 			let data = {
						// 				classId:record.key
						// 			}
						// 			This.props.dispatch({
						// 				type: 'userInfo/deleteClass',
						// 				payload:data
						// 			});
						// 		},
						// 		onCancel() {
						// 			console.log('Cancel');
						// 		},
						//   });
					}}>踢出班级</span>
				</div>
				);
			},
			},
		];
	}

	isEditing = record => record.key === this.state.editingKey;

	cancel = () => {
	this.setState({ editingKey: '' });
	};
	
	save(form, key) {
	form.validateFields((error, row) => {
		message.warning('修改功能暂未开放');
		this.setState({ editingKey: '' });
	});
	}

	edit(key) {
		this.setState({ editingKey: key });
	}
	chooseSchool(){
		const rodeType = store.get('wrongBookNews').rodeType
		if(rodeType === 10){
			let schoolList = this.props.state.schoolList;
			const children = [];
			if(schoolList.data){
				for (let i = 0; i < schoolList.data.list.length; i++) {
					let data = schoolList.data.list[i]
					children.push(<Option key={data.schoolId}>{data.schoolName}</Option>);
				}
				return(
					<Select
						showSearch
						style={{ width: 200,marginRight:'10px' }}
						optionFilterProp="children"
						placeholder='请选择学校'
						onChange={(value)=>{
							this.props.dispatch(
								routerRedux.push({
									pathname: '/user',
									hash:'page=1'
									})
							)
							this.setState({schoolId:value})
							let data ={
								schoolId:value,
								pageNum:1,
								pageSize:10
							}
							this.props.dispatch({
								type: 'userInfo/schoolId',
								payload:value
							});
							this.props.dispatch({
								type: 'userInfo/pageUser',
								payload:data
							});
						}}
						filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					>
						{children}
					</Select>
				)
			}
			
		}else if(rodeType === 20){
			let classList = this.props.state.classList;
			const children = [];
			if(classList.data){
				for (let i = 0; i < classList.data.list.length; i++) {
					let data = classList.data.list[i]
					children.push(<Option key={data.classId}>{data.className}</Option>);
				}
				return(
					<Select
						showSearch
						style={{ width: 200,marginRight:'10px' }}
						optionFilterProp="children"
						placeholder='请选择班级'
						onChange={(value)=>{
							this.props.dispatch(
								routerRedux.push({
									pathname: '/user',
									hash:'page=1'
									})
							)
							let data ={
								classId:value,
								pageNum:1,
								pageSize:10
							}
							this.props.dispatch({
								type: 'userInfo/classId',
								payload:value
							});
							this.props.dispatch({
								type: 'userInfo/pageUser',
								payload:data
							});
						}}
						filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					>
						{children}
					</Select>
				)
			}
			
		}
		
		{
			return(
				<span style={{marginRight:'10px'}}>班级列表</span>
			)
		}		
	}
	render() {
		let state = this.props.state;
		let userList = state.userList;
		const dataSource = [];
		let total = 0;
		let pages = 1;
		if(userList.data ){
			total = userList.data.total
			pages = userList.data.pages
			for(let i = 0;i < userList.data.list.length; i ++){
				let p = {};
				let det = userList.data.list[i];
				p["key"] = det.userId;
				p["name"] = det.userName;
				p["phone"] = det.phone;
				p["list"] = det;
				dataSource[i]=p;
			}
		}
		let classInfo = state.classNews;
		const hash = this.props.location.hash;
		let cur = hash.substr(hash.indexOf("page=")+5)*1;
		if(cur === 0){
			cur = 1
		}
		let classList = state.classList;
		const children = [];
		if(classList.data){
			for (let i = 0; i < classList.data.length; i++) {
				let data = classList.data[i]
				children.push(<Option key={data.classId}>{data.className}</Option>);
			}
		}
		const rodeType = store.get('wrongBookNews').rodeType
		return (
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.gradeboder} >
						<div className={style.gradeTop}>
							{this.chooseSchool()}
							<span>共{total}个用户</span>
							{
								rodeType === 10?
								<div className={style.addGrade} onClick={()=>{
									this.setState({visible:true})
									
								}}>添加</div>:''
							}
								
							<Search
								style={{float:'right',width:'300px',marginRight:'10px'}}
								placeholder="班级名称"
								enterButton="搜索"
								onSearch={value => console.log(value)}
							/>
						</div>
						<Table
							bordered
							dataSource={dataSource}
							columns={this.columns}
							rowClassName="editable-row"
						/>
						{
							 pages>1?
							 <Pagination defaultCurrent={cur} 
							 	onChange={(pageNumber)=>{
									this.props.dispatch(
										routerRedux.push({
											pathname: '/user',
											hash:`page=${pageNumber}`
											})
									)
									const rodeType = store.get('wrongBookNews').rodeType

									if(rodeType === 10){
										
										let data ={
											schoolId:this.props.state.schoolId,
											pageNum:pageNumber,
											pageSize:10
										}
										this.props.dispatch({
											type: 'userInfo/pageUser',
											payload:data
										});
									}else if(rodeType === 20){
										
										let data ={
											classId:this.props.state.classId,
											pageNum:pageNumber,
											pageSize:10
										}
										this.props.dispatch({
											type: 'userInfo/pageUser',
											payload:data
										});
									}
								 }}
							 	pageSize={10} defaultPageSize={10}  total={total} />:
							 ''
						}
					</div>
				</Content>
				<Modal
						title="添加用户"
						visible={this.state.visible}
						onOk={()=>{
							this.setState({
								visible: false,
							});
							let data ={
								classId:1,
								userId:1,
							}
							this.props.dispatch({
								type: 'userInfo/updateClass',
							});
						}}
						onCancel={()=>{
							this.setState({
								visible: false,
							});
						}}
						okText='确定'
						cancelText='取消'
						>
							<div style={{marginBottom:'10px'}}>
								<span style={{width:"80px",display:'inline-block'}} >手机号</span>
								<Input 
									onChange={(e)=>{
									}}
									style={{width:'200px'}}/>
							</div>
							<div style={{marginBottom:'10px'}}>
								<span style={{width:"80px",display:'inline-block'}}>姓名</span>
								<Input 
									onChange={(e)=>{
										
									}}  style={{width:'200px'}}/>
							</div>
					</Modal>
					
			</Layout>
		);
	  }

	componentDidMount(){
		const hash = this.props.location.hash;
		let page = hash.substr(hash.indexOf("page=")+5)*1;
		if(page === 0){
			page = 1
		}
		const {dispatch} = this.props;
		const rodeType = store.get('wrongBookNews').rodeType
		if(rodeType === 10){
			let data1 = {
				pageNum:1,
				pageSize:9999
			}
			dispatch({
				type: 'userInfo/pageRelevantSchool',
				payload:data1
			});
		}else if(rodeType === 20){
			let data1 = {
				schoolId:store.get('wrongBookNews').schoolId,
				pageNum:1,
				pageSize:9999
			}
			dispatch({
				type: 'userInfo/pageClass',
				payload:data1
			});

			let data ={
				schoolId:store.get('wrongBookNews').schoolId,
				pageNum:1,
				pageSize:10
			}
			this.props.dispatch({
				type: 'userInfo/schoolId',
				payload:store.get('wrongBookNews').schoolId
			});
			this.props.dispatch({
				type: 'userInfo/pageUser',
				payload:data
			});
		}
	}
}

export default connect((state) => ({
	state: {
		...state.userInfo,
	}
}))(HomeworkCenter);