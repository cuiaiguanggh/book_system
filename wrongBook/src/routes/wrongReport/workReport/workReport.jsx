import React from 'react';
import { Table, Button, Input,Modal,Select,Popover,Icon
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './workReport.less';
import store from 'store';
//作业中心界面内容
const Option = Select.Option;


class ClassReport extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	    };
    }
    getGrade() {
			const rodeType = store.get('wrongBookNews').rodeType;
			let classList =  rodeType == 20 ? this.props.state.classList :this.props.state.classList1
			if(classList.data){
				return(
					<div>
						<span>选择作业：</span>
						<Select
							showSearch
							style={{ width: 150,margin:'0 20px'}}
							placeholder="班级"
							defaultValue={this.props.state.className}
							optionFilterProp="children"
							onChange={(value)=>{
									console.log(value)
							}}
							filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						>
							{
								rodeType == 20 ?
									classList.data.list.map((item,i) =>(
										<Option key={i} value={item.classId}>{item.className}</Option>
									))
								:
								classList.data.map((item,i) =>(
									<Option key={i} value={item.classId}>{item.className}</Option>
								))
							}
						</Select>
					</div>
				)
			}
    }
    getSub() {

    }
	render() {
		let columns = [
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: '100px',
				render: (text, record) => {
					return (
						<div className='space' style={{cursor:'pointer'}} onClick={()=>{
							store.set('wrong_hash', this.props.location.hash)
							this.props.dispatch(
								routerRedux.push({
									pathname: '/classInfo',
									hash:`sId=${this.props.state.schoolId}&id=${record.key}`
									})
							)
						}}>
							{text}
						</div>
					);
				}
			},
			{
				title:'错误率',
				dataIndex:'teacherName',
				key:'teacherName',
				width: '100px',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer'}} onClick={()=>{
							store.set('wrong_hash', this.props.location.hash)
							this.props.dispatch(
								routerRedux.push({
									pathname: '/classInfo',
									hash:`sId=${this.props.state.schoolId}&id=${record.key}`
									})
							)
						}}>
							{text}
						</div>
					);
				}
			},
			{
				title:'提交时间',
				dataIndex:'stars',
				key:'stars',
				width: '200px',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer'}} onClick={()=>{
							store.set('wrong_hash', this.props.location.hash)
							this.props.dispatch(
								routerRedux.push({
									pathname: '/classInfo',
									hash:`sId=${this.props.state.schoolId}&id=${record.key}`
									})
							)
						}}>
							{text}
						</div>
					);
				}
			},
			{
				title:'题目详情',
				dataIndex:'stuNum',
				key:'stuNum',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer'}} onClick={()=>{
							store.set('wrong_hash', this.props.location.hash)
							this.props.dispatch(
								routerRedux.push({
									pathname: '/classInfo',
									hash:`sId=${this.props.state.schoolId}&id=${record.key}`
									})
							)
						}}>
							{text}
						</div>
					);
				}
			},
		]
		const dataSource = [];
		return (
			<div style={{height:'50px',lineHeight:'50px',padding:'20px'}}>
				{this.getGrade()}
				<Table
					bordered
					dataSource={dataSource}
					columns={columns}
					rowClassName="editable-row"
				/>
				<div>
					<div className={style.questionBody}>
						<div className={style.questionTop}>
							<span>第一题</span>
							<span>班级错误率：80%（答错15人）</span>
						</div>
						<img></img>
						<div style={{overflow:'hidden',padding:'10px'}}>
							<Button style={{float:'left'}}>查看统计</Button>
							<Button type="primary" style={{float:'right'}}>加入错题篮</Button>
						</div>
					</div>
				</div>
				{/* <Modal
						visible={this.state.visible}
						width='1000px'
						className="showques"
						footer={null}
						onOk={()=>{
								this.setState({visible:false})
						}}
						onCancel={()=>{
								this.setState({visible:false})
						}}
				>
						{QuestionDetail.data?this.showQuestion():''}
						<Icon 
								className={style.icLeft}
								onClick={()=>{
										if(key == 0){
												message.warning('已是第一题')
										}else{
												this.setState({showAns:''})
												let w = document.getElementsByClassName('wrongNum');
												for(let j = 0;j<w.length;j++){
														w[j].className='wrongNum'
												}
												w[0].className='wrongNum wrongNumOn'
												for(let i=0;i< QuestionDetail.data.qsList[key-1].userAnswerList.length;i++){
														if(QuestionDetail.data.qsList[key-1].userAnswerList[i].result !=1 ){
																this.setState({questionKey:key-1,
																		showAns:QuestionDetail.data.qsList[key-1].userAnswerList[i].answer})
																
																return
														}
												}
										}
								}}
								type="left" />
						<Icon
								className={style.icRight}
								onClick={()=>{
										if(key == MaxKey){
												message.warning('已是最后一题')
										}else{
												let w = document.getElementsByClassName('wrongNum');
												for(let j = 0;j<w.length;j++){
														w[j].className='wrongNum'
												}
												w[0].className='wrongNum wrongNumOn'
												for(let i=0;i< QuestionDetail.data.qsList[key+1].userAnswerList.length;i++){
														if(QuestionDetail.data.qsList[key+1*1].userAnswerList[i].result !=1 ){
																this.setState({questionKey:key+1*1,
																		showAns:QuestionDetail.data.qsList[key+1].userAnswerList[i].answer})
																return
														}
												}
										}
								}}
								type="right" />
				</Modal> */}
			</div>
		);
	  }

	componentDidMount(){
		
	}
}

export default connect((state) => ({
	state: {
		...state.temp,
	}
}))(ClassReport);