import React from 'react';
import { Layout, Tabs, Input,Modal,Select,Popover,Icon
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './homeworkDetail.less';
import store from 'store';
import Analysis from './workAnaysis'
import Problemlist from './Problemlist'
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Option = Select.Option;
const { Content } = Layout;
const Search = Input.Search;
//作业中心界面内容


const operations = <div>Extra Action</div>;

class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			editingKey: '',
			visible: false,
			visible1:false,
			classId:'',
			homeworkId:'',
	};
		this.columns = [
			{
				title: '作业名称',
				dataIndex: 'name',
				key: 'name',
				render: (text, record) => {
					return (
						<div className="space" onClick={()=>{
							// this.props.dispatch(
							// 	routerRedux.push({
							// 		pathname: '/workInfo',
							// 		hash:`sId=${this.state.classId}&id=${record.key}`
							// 		})
							// )
						}}>
							{text}
						</div>
					);
				}
			},
		];
	}
	onChange = (activeKey) => {
		this.setState({ activeKey });
	}
	operations() {
		const rodeType = store.get('wrongBookNews').rodeType;
		let classList =  rodeType == 20 ? this.props.state.classList :this.props.state.classList1
		if(classList.data){
			const content = (
				<div  style={{width:100,padding:'0'}}>
					{
						rodeType == 20 ?
							classList.data.list.map((item,i) =>(
								<p key={i}
								className={style.PList}
								onClick={()=>{
									this.setState({
										classId:item.classId
									})
									this.props.dispatch({
										type: 'temp/className',
										payload: item.className
									});
									this.props.dispatch({
										type: 'temp/queryHomeworkList',
										payload:{
											classId: item.classId
										}
									});
								}}>{item.className}</p>
							))
						:
						classList.data.map((item,i) =>(
							<p key={i}
							className={style.PList}
							 onClick={()=>{
								this.setState({
									classId:item.classId
								})
								
								this.props.dispatch({
									type: 'temp/queryHomeworkList',
									payload:{
										classId:item.classId
									}
								});
							}}>{item.className}</p>
						))
					}
				</div>
			);

			return(
				<div>
					<Popover placement="bottom"content={content} trigger="hover">
						<span
							style={{cursor:'pointer', padding:'0 10px',width: 100,marginRight:10,textAlign:'right' }}
						>
							<span>{this.props.state.className}</span>
						<Icon type="caret-down" />
						</span>
					</Popover>
					{this.workList()}
				</div>
			)
		}
		
	}
	workList() {
		let workList = this.props.state.workList;
		if(workList.data && workList.data.length >0){
			const content = (
				<div style={{padding:'0'}}>
					{
						workList.data.map((item,i) =>(
							<p key={i} 
							className={style.PList}
							onClick={()=>{
								this.setState({
									homeworkId:item.homeworkId
								})
								let data = {
									homeworkId:item.homeworkId,
								}
								
								this.props.dispatch({
									type: 'temp/workId',
									payload:item.homeworkId
								});
								this.props.dispatch({
									type: 'temp/workName',
									payload:item.name
								});
								this.props.dispatch({
									type: 'temp/queryScoreDetail',
									payload:data
								});
								this.props.dispatch({
									type: 'temp/queryQuestionDetail',
									payload:data
								});
							}}>{item.name}</p>
						))
					}
				</div>
			);

			return(
					<span>
						<span>作业:</span>
						<Popover placement="bottom"content={content} trigger="hover">
							<span
								style={{cursor:'pointer',padding:'0 10px', width: 100,marginRight:10,textAlign:'right' }}
							>
								<span>{this.props.state.workName}</span>
								<Icon type="caret-down" />
							</span>
						</Popover>
					</span>
			)
		}
	}
	getGrade() {
		const rodeType = store.get('wrongBookNews').rodeType;
		let classList =  rodeType == 20 ? this.props.state.classList :this.props.state.classList1
		if(classList.data){
			return(
				<div  style={{background:'#fff',textAlign:'left',padding:'10px'}}>
					{
						rodeType == 20 ?
							classList.data.list.map((item,i) =>(
								<span key={i}
								className={i ==0 ?'SList SListon':'SList'}
								onClick={()=>{
									this.setState({
										classId:item.classId
									})
									let w = document.getElementsByClassName('SList');
									for(let j = 0;j<w.length;j++){
										w[j].className='SList'
									}
									w[i].className='SList SListon'

									this.props.dispatch({
										type: 'temp/className',
										payload: item.className
									});
									this.props.dispatch({
										type: 'temp/queryHomeworkList',
										payload:{
											classId: item.classId
										}
									});
								}}>{item.className}</span>
							))
						:
						classList.data.map((item,i) =>(
							<span key={i}
							className={i ==0 ?'SList SListon':'SList'}
							 onClick={()=>{
								this.setState({
									classId:item.classId
								})
								let w = document.getElementsByClassName('SList');
								for(let j = 0;j<w.length;j++){
									w[j].className='SList'
								}
								w[i].className='SList SListon'
								
								this.props.dispatch({
									type: 'temp/queryHomeworkList',
									payload:{
										classId:item.classId
									}
								});
							}}>{item.className}</span>
						))
					}
				</div>
			)
		}
	}
	render() {
	
		return (
			<Layout >
				<Content style={{ overflow: 'initial' }}>
				<div className={style.borderOut} >
					<Tabs defaultActiveKey="1" value='large' tabBarExtraContent={this.workList()} onChange={this.onChange}>
						<TabPane tab="成绩分析" key="1">
							{this.getGrade()}
							<Analysis/>
						</TabPane>
						<TabPane tab="查看习题" key="2">
							{this.getGrade()}
							<Problemlist/>
						</TabPane>
					</Tabs>
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
		const rodeType = store.get('wrongBookNews').rodeType
		// if(rodeType === 10){
		// 	let data1 = {
		// 		pageNum:1,
		// 		pageSize:9999
		// 	}
		// 	dispatch({
		// 		type: 'classHome/pageRelevantSchool',
		// 		payload:data1
		// 	});
		// }else 
		if(rodeType === 20){
			let data ={
				schoolId:store.get('wrongBookNews').schoolId,
				pageNum:page,
				pageSize:10
			}
			this.props.dispatch({
				type: 'temp/schoolId',
				payload:store.get('wrongBookNews').schoolId
			});
			dispatch({
				type: 'temp/pageClass',
				payload:data
			});
		}else if(rodeType >20){
			dispatch({
				type: 'temp/getClassList',
			});
		}
	}
}

export default connect((state) => ({
	state: {
		...state.temp,
	}
}))(HomeworkCenter);