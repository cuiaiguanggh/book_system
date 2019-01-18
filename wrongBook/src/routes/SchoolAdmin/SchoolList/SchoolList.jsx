import React from 'react';
import { Layout, Table, Input,Breadcrumb,Modal,Radio,Button,Pagination  } from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
import style from './SchoolList.less';
// import store from 'store';
const { Content } = Layout;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
//作业中心界面内容
class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			editingKey: '',
			current:'student',
		  visible1: false,
		  visible:false,
			phaseId:1,
			schoolId:'',
		};
	}
	handleOk = (e) => {
		this.setState({
		  visible1: false,
		  visible: false,
		});
		this.props.dispatch({
			type: 'homePage/changeSchool',
			payload:this.state.schoolId
		});
	}
	  handleCancel = (e) => {
		this.setState({
		  visible1: false,
		  visible: false,
		});
	  }
	render() {
		let dispatch = this.props.dispatch;
		let state = this.props.state;
		const columns = [{
		title: '学校名称',
			dataIndex: 'name',
			key: 'name',
			width: '20%',
			render: (text, record) => (
				<div
					onClick={() =>{
					}}>
					{text}
				</div>
			)
		},
		{
			title: '位置',
			dataIndex: 'position',
			key: 'position',
			width: '15%',
			render: (text, record) => (
				<div
					onClick={() =>{
						dispatch(
							routerRedux.push({
								pathname: '/homeworkDetails',
								hash:`${record.key}`
								})
						)
					}}>
					{text}
				</div>
			)
		},
		{
			title: '类型',
			dataIndex: 'type',
			key: 'type',
			width: '10%',
			render: (text, record) => (
				<div
					onClick={() =>{
						dispatch(
							routerRedux.push({
								pathname: '/homeworkDetails',
								hash:`${record.key}`
								})
						)
					}}>
					{text}
				</div>
			)
		},
		{
			title: '校长',
			dataIndex: 'principal',
			key: 'principal',
			width: '10%',
			render: (text, record) => (
				<div 
					onClick={() =>{
						dispatch(
							routerRedux.push({
								pathname: '/homeworkDetails',
								hash:`${record.key}`
								})
						)
					}}>
					{text}
				</div>
			)
		},
		{
			title: '介绍',
			dataIndex: 'introduce',
			key: 'introduce',
			width: '30%',
			render: (text, record) => (
				<div

					onClick={() =>{
						dispatch(
							routerRedux.push({
								pathname: '/homeworkDetails',
								hash:`${record.key}`
								})
						)
					}}>
					{text}
				</div>
			)
		},
		{
		title: '操作',
		width: '15%',
			dataIndex: 'operate',
			key: 'operate',
			render: (text, record) => (
				<div className="operateLink"
					>
					<span
					style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}}
					onClick={()=>{
						
						let data = {
							schoolId:record.key
						}
						this.setState({visible:true,schoolId:record.key})
						this.props.dispatch({
							type: 'homePage/schoolInfo',
							payload:data
						});
					}
					}>编辑</span>
					<span
					style={{cursor:'pointer',margin:'0 10px',color:'#1890ff'}}
					onClick={()=>{
						let This = this;
						confirm({
							title: '确定删除此学校么?',
							okText: '是',
							cancelText: '否',
							onOk() {
								let data = {
									schoolId:record.key
								}
								This.props.dispatch({
									type: 'homePage/deleteSchool',
									payload:data
								});
							},
							onCancel() {
							  console.log('Cancel');
							},
						  });
					}}
					>删除</span>
				</div>
			)
		}];
		let schoolList = state.schoolList;
		const dataSource = [];
		let total = 0;
		if(schoolList.data ){
			total = schoolList.data.total
			for(let i = 0;i < schoolList.data.list.length; i ++){
				let p = {};
				let det = schoolList.data.list[i];
				p["key"] = det.schoolId;
				p["name"] = det.schoolName;
				p["position"] = det.address;
				p["type"] = det.phaseName;
				p["principal"] = det.masterName;
				p["introduce"] = det.des;
				dataSource[i]=p;
			}
		}
		let schoolInfo = this.props.state.schoolInfo;
		const hash = this.props.location.hash;
		let cur = hash.substr(hash.indexOf("page=")+5)*1;
		return(
			<Layout >
				<Content style={{ overflow: 'initial' }}>
					<div className={style.layout} style={{ padding: 24, background: '#fff' }}>
						<div style={{overflow:'hidden',marginBottom:"5px",textAlign:'right'}}>
							
							<Search
								placeholder="学校名称"
								style={{width:'300px'}}
								enterButton="搜索"
								onSearch={value => console.log(value)}
							/>
							<Button 
								style={{verticalAlign:'bottom',marginLeft:'10px'}}
								onClick={()=>{
									this.setState({
										visible1:true
									})
								}}
							 	type="primary">添加</Button>
						</div>
						<Table className={style.scoreDetTable}
						 dataSource={dataSource}
						 columns={columns}
						 pagination={true}
						 bordered={true}
						 rowKey={(record, index)=> index}/>
						 {
							 total>1?
							 <Pagination defaultCurrent={cur} 
							 	onChange={(pageNumber)=>{
									this.props.dispatch(
										routerRedux.push({
											pathname: '/school',
											hash:`page=${pageNumber}`
											})
									)
									let data ={
										pageNum:pageNumber,
										pageSize:10
									}
									dispatch({
										type: 'homePage/pageRelevantSchool',
										payload:data
									});
								 }}
							 	pageSize={10} defaultPageSize={10}  total={total} />:
							 ''
						}
					</div>
					<Modal
						title="编辑"
						visible={this.state.visible}
						onOk={this.handleOk}
						onCancel={this.handleCancel}
						okText='确定'
						cancelText='取消'
						>
						{
							schoolInfo.data ?
							<div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}} >学校</span>
									<Input 
										defaultValue={this.props.state.schoolName}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeSchoolName',
												payload:e.target.value
											});
										}}
									 style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>类型</span>
									<RadioGroup onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changephaseId',
											payload:e.target.value
										});
									}}
									 value={this.props.state.phaseId}>
										<Radio value={1}>小学</Radio>
										<Radio value={2}>初中</Radio>
										<Radio value={3}>高中</Radio>
									</RadioGroup>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>校长</span>
									<Input defaultValue={schoolInfo.data.masterName}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeMasterName',
												payload:e.target.value
											});
										}}  style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>位置</span>
									<Input defaultValue={schoolInfo.data.address} 
									onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changeaddress',
											payload:e.target.value
										});
									}} style={{width:'200px'}}/>
								</div>
								<div>
									<span style={{width:"80px",display:'inline-block'}}>介绍</span>
									<Input defaultValue={schoolInfo.data.des} 
									onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changedes',
											payload:e.target.value
										});
									}} style={{width:'200px'}}/>
								</div>
							</div>
							:
							<div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}} >学校</span>
									<Input style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>类型</span>
									<RadioGroup onChange={this.onChange} value='1'>
										<Radio value={1}>小学</Radio>
										<Radio value={2}>初中</Radio>
										<Radio value={3}>高中</Radio>
									</RadioGroup>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>校长</span>
									<Input style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>位置</span>
									<Input style={{width:'200px'}}/>
								</div>
								<div>
									<span style={{width:"80px",display:'inline-block'}}>介绍</span>
									<Input  style={{width:'200px'}}/>
								</div>
							</div>
						}
							
					</Modal>
					<Modal
						title="添加学校"
						visible={this.state.visible1}
						onOk={()=>{
							this.setState({visible1:false})
							this.props.dispatch({
								type: 'homePage/addSchool',
							});
						}}
						onCancel={this.handleCancel}
						okText='确定'
						cancelText='取消'
						>
							<div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}} >学校</span>
									<Input 
										defaultValue={this.props.state.schoolName}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeSchoolName',
												payload:e.target.value
											});
										}}
									 style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>类型</span>
									<RadioGroup onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changephaseId',
											payload:e.target.value
										});
									}}
									 value={this.props.state.phaseId}>
										<Radio value={1}>小学</Radio>
										<Radio value={2}>初中</Radio>
										<Radio value={3}>高中</Radio>
									</RadioGroup>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>校长</span>
									<Input defaultValue={this.props.state.masterName}
										onChange={(e)=>{
											this.props.dispatch({
												type: 'homePage/changeMasterName',
												payload:e.target.value
											});
										}}  style={{width:'200px'}}/>
								</div>
								<div style={{marginBottom:'10px'}}>
									<span style={{width:"80px",display:'inline-block'}}>位置</span>
									<Input defaultValue={this.props.state.address} 
									onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changeaddress',
											payload:e.target.value
										});
									}} style={{width:'200px'}}/>
								</div>
								<div>
									<span style={{width:"80px",display:'inline-block'}}>介绍</span>
									<Input defaultValue={this.props.state.des} 
									onChange={(e)=>{
										this.props.dispatch({
											type: 'homePage/changedes',
											payload:e.target.value
										});
									}} style={{width:'200px'}}/>
								</div>
							</div>
					</Modal>
				</Content>
			</Layout>
		);
	}
	componentDidMount(){
		const {dispatch} = this.props;
		const hash = this.props.location.hash;
		let page = hash.substr(hash.indexOf("page=")+5)*1;
		if(page === 0){
			page = 1
		}
		let data ={
			pageNum:page,
			pageSize:10
		}
		dispatch({
			type: 'homePage/pageRelevantSchool',
			payload:data
		});
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomeworkCenter);