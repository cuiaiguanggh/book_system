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
		const rodeType = store.get('wrongBookNews').rodeType;
		let classList =  rodeType == 20 ? this.props.state.classList :this.props.state.classList1
		if(classList.data){
			return(
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
			)
		}
    }
    getSub() {
			const rodeType = store.get('wrongBookNews').rodeType;
			let classList =  rodeType == 20 ? this.props.state.classList :this.props.state.classList1
			if(classList.data){
				return(
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
				)
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
}))(ClassReport);