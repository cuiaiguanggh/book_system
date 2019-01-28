import React from 'react';
import { Layout, Table, Input,message,  InputNumber, Pagination, Form,Rate ,Modal,Select
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './homeworkDetail.less';
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
			classId:''
	};
		this.columns = [
			{
				title: '作业名称',
				dataIndex: 'name',
				key: 'name',
				render: (text, record) => {
					return (
						<div onClick={()=>{
							this.props.dispatch(
								routerRedux.push({
									pathname: '/workInfo',
									hash:`sId=${this.state.classId}&id=${record.key}`
									})
							)
						}}>
							{text}
						</div>
					);
				}
			},
			{
			title: '操作',
			dataIndex: 'operation',
			render: (text, record) => {
				const editable = this.isEditing(record);
				return (
				<div>
					<span style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}} onClick={()=>{
					}}>查看</span>
					
					
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
							let data ={
								schoolId:value,
								pageNum:1,
								pageSize:10
							}
							this.props.dispatch({
								type: 'classHome/schoolId',
								payload:value
							});
							this.props.dispatch({
								type: 'classHome/pageClass',
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
    }
    chooseClass(){
		const rodeType = store.get('wrongBookNews').rodeType
		let classList = this.props.state.classList;
		let classList1 = this.props.state.classList1;
		const children = [];
		if(rodeType <= 20){
			if(classList.data){
				for (let i = 0; i < classList.data.list.length; i++) {
					let data = classList.data.list[i]
					children.push(<Option key={data.classId}>{data.className}</Option>);
				}
				
			}
		}else{
			if(classList1.data){
				for (let i = 0; i < classList1.data.length; i++) {
					let data = classList1.data[i]
					children.push(<Option key={data.classId}>{data.className}</Option>);
				}
				
			}
		}
		return(
			<Select
				showSearch
				style={{ width: 200,marginRight:'10px' }}
				optionFilterProp="children"
				placeholder='请选择班级'
				onChange={(value)=>{
					let data={
						classId:value
					}
					this.setState({classId:value})
					this.props.dispatch({
						type: 'classHome/queryHomeworkList',
						payload:data
					});
				}}
				filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
			>
				{children}
			</Select>
		)
    }
	render() {
		let state = this.props.state;
		let workList = state.workList;
		const dataSource = [];
		let total = 1;
		let pages = 1;
		if(workList.data ){
			for(let i = 0;i < workList.data.length; i ++){
				let p = {};
				let det = workList.data[i];
				p["key"] = det.homeworkId;
				p["name"] = det.name;
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
		let teachers = state.teachers;
		const children = [];
		if(teachers.data){
			for (let i = 0; i < teachers.data.length; i++) {
				let data = teachers.data[i]
				children.push(<Option key={data.userId}>{data.userName}</Option>);
			}
		}
		return (
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.gradeboder} >
						<div className={style.gradeTop}>
							{this.chooseSchool()}
							{this.chooseClass()}
								
							{/* <Search
								style={{float:'right',width:'300px',marginRight:'10px'}}
								placeholder="班级名称"
								enterButton="搜索"
								onSearch={value => console.log(value)}
							/> */}
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
											pathname: '/grade',
											hash:`page=${pageNumber}`
											})
									)
									let data ={
										schoolId:this.props.state.schoolId,
										pageNum:pageNumber,
										pageSize:10
									}
									this.props.dispatch({
										type: 'classHome/pageClass',
										payload:data
									});
								 }}
							 	pageSize={10} defaultPageSize={10}  total={total} />:
							 ''
						}
					</div>
				</Content>
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
		dispatch({
			type: 'classHome/classList',
			payload:[]
		});
		const rodeType = store.get('wrongBookNews').rodeType
		if(rodeType === 10){
			let data1 = {
				pageNum:1,
				pageSize:9999
			}
			dispatch({
				type: 'classHome/pageRelevantSchool',
				payload:data1
			});
		}else if(rodeType === 20){
			let data ={
				schoolId:store.get('wrongBookNews').schoolId,
				pageNum:page,
				pageSize:10
			}
			this.props.dispatch({
				type: 'classHome/schoolId',
				payload:store.get('wrongBookNews').schoolId
			});
			dispatch({
				type: 'classHome/pageClass',
				payload:data
			});
		}else{
			dispatch({
				type: 'classHome/getClassList',
			});
		}
	}
}

export default connect((state) => ({
	state: {
		...state.classHome,
	}
}))(HomeworkCenter);