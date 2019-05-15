import React from 'react';
import { Layout, Tabs, Input,Modal,Select,Popover,Icon
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './wrongTop.less';
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
		let classList = this.props.state.classList1
		let className = this.props.state.className;
		if(classList.data && classList.data.length > 0 && className != ''){
			return(
				<Select
						showSearch
						style={{ width: 150,margin:'0 20px'}}
						placeholder="班级"
						defaultValue={this.props.state.className}
						optionFilterProp="children"
						onChange={(value)=>{
								this.props.dispatch({
									type: 'temp/classId',
									payload:value
								});
								this.props.dispatch({
									type: 'report/changeMouth',
									payload:0,
								});
								this.props.dispatch({
									type: 'report/userId',
									payload:'',
								});
								
								this.props.dispatch({
									type: 'temp/getUserSubjectList',
									payload:value,
								});
						}}
						filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					{
						classList.data.map((item,i) =>(
							<Option key={i} value={item.classId}>{item.className}</Option>
						))
					}
				</Select>
			)
		}else{

		}
    }
    getSub() {
			let subList =  this.props.state.subList ;
			let subName = this.props.state.subName;
			if(subList.data && subList.data.length> 0 && subName != ''){
				return(
					<Select
							showSearch
							style={{ width: 150,margin:'0 20px'}}
							placeholder="学科"
							value={this.props.state.subName}
							optionFilterProp="children"
							onChange={(value)=>{
								
								this.props.dispatch({
									type: 'report/changeMouth',
									payload:0
							});
								this.props.dispatch({
									type: 'report/queryQrDetail',
									payload:{
										classId:this.props.state.classId,
										year:this.props.state.years,
										subjectId:value,
										info:0,
										pageSize:50,
										pageNum:1
									}
								});
								this.props.dispatch({
									type: 'temp/subId',
									payload:value
								});
								// this.props.dispatch({
								// 	type: 'report/userId',
								// 	payload:''
								// })
								this.props.dispatch({
									type: 'report/studentList',
									payload:[]
								});
								this.props.dispatch({
									type:'report/qrdetailList',
									payload:[]
								})
								this.props.dispatch({
									type:'report/qrStudentDetailList',
									payload:[]
								})
								this.props.dispatch({
									type: 'report/queryQrStudentCount',
									payload:{
										classId:this.props.state.classId,
										year:this.props.state.years,
										subjectId:value
									}
								});
								this.props.dispatch({
									type: 'temp/getQrMonthList',
									payload:{
										classId:this.props.state.classId,
										year:this.props.state.years,
										subjectId:value
									}
								});
								this.props.dispatch({
									type: 'report/queryHomeworkList',
									payload:{
										classId:this.props.state.classId,
										subjectId:value
									}
								});
							}}
							filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					>
						{
							subList.data.map((item,i) =>(
								<Option key={i} value={item.v}>{item.k}</Option>
							))
						}
				</Select>
				)
			}else{

			}
			} 
	render() {
		return (
			<div style={{height:'50px',lineHeight:'50px'}}>
					{this.getGrade()}
					{this.getSub()}
			</div>
		);
	  }

	componentDidMount(){
		const hash = this.props.type.hash;
		let page = hash.substr(hash.indexOf("page=")+5)*1;
		if(page === 0){
			page = 1
		}
		const {dispatch} = this.props;
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
			dispatch({
				type: 'temp/getClassList',
			});
		
	}
}

export default connect((state) => ({
	state: {
		...state.report,
		...state.temp,
	}
}))(ClassReport);