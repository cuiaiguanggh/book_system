import React, { useState, useEffect } from 'react';
import {
	Layout, Table, Modal, Select, Spin, Checkbox, Icon
} from 'antd';
import { connect } from 'dva';
import style from './workList.less';
import store from 'store';
import observer from '../../../utils/observer'
import moment from 'moment';
moment.locale('zh-cn');

const { Content } = Layout;
const Option = Select.Option;
class HomeworkCenter extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			selectUser: '',
		};
		this.studentColum = [
			{
				title: '序号',
				align: 'center',
				dataIndex: '_index',
				render: (text, record, index) => `${text}` // 显示每一行的序号
			},
			{
			title: '作业名称',
			dataIndex: '_name',
			align: 'center',
			editable: true,
			render: (text, record) => (text)
		}, {
			title: '班级',
			dataIndex: '_classes',
			align: 'center',
			editable: true,
			render: (text, record) => (text)
		},{
			title: '学科',
			dataIndex: '_subject',
			align: 'center',
			editable: false,
			className:'thphone',
			render: (text, record) => (text)
		}, {
			title: <div >时间</div>,
			dataIndex: '_time',
			align: 'center',
			editable: false,
			className:'thphone',
			render: (text, record) => (text)
		}, {
			title: <div >操作</div>,
			align: 'center',
			editable: false,
			render: (text, record,index) => {
				// return record.qustionlist?record.qustionlist.map((item, i) => {
				// 	return (
				// 		<Checkbox
				// 			key={i}
				// 			checked={(record.userId&&this.props.state.saleId===record.userId)||(record.questionHook&&record.questionHook[`${index}-${i}`])}
				// 			disabled={record.userId&&this.props.state.saleId===record.userId}
				// 			onClick={(e) => {
				// 				e.preventDefault()
				// 				e.stopPropagation()
				// 				this.onChangeCheck(index,i,record)
				// 			}}
				// 		>
				// 		{i+1}
				// 	</Checkbox>
				// 	)
				// }) :''
				return(
					<>
						<span className={style.caozuospan}>错题录入</span>
						<span className={style.caozuospan}>查看报告</span>
						<span className={style.caozuospan}>编辑</span>
						<span className={style.caozuospan}>删除</span>
					</>
				)
			}
		 },
		];

	}
	onChangeCheck(index,i,ele){
        console.log("HomeworkCenter -> onChangeCheck -> index,i,ele", index,i,ele)
		let qh=ele.questionHook||{}
        console.log("HomeworkCenter -> onChangeCheck -> qh", qh)
		if(qh[`${index}-${i}`]){
			delete qh[`${index}-${i}`]
		}else{
			qh[`${index}-${i}`]=true
		}
		let _pageHomeworkDetiles = this.props.state.classStudentList;
		_pageHomeworkDetiles[index].questionHook=qh
		this.props.dispatch({
			type: 'classModel/classStudentList',
			payload: _pageHomeworkDetiles
		})
	}

	render() {
		let state = this.props.state;
		let rodeType = store.get('wrongBookNews').rodeType;
		let dataSource = state.classStudentList;
		// let rowRadioSelection={
		// 	type:'radio',
		// 	columnTitle:"选择",
		// 	onSelect: (selectedRowKeys, selectedRows) => {
		// 		console.log(selectedRowKeys, selectedRows)
		// 		this.props.selectStudentHander(selectedRowKeys,selectedRows)
		// 		this.props.dispatch({
		// 			type: 'homePage/setSaleId',
		// 			payload: selectedRowKeys.userId
		// 		})
		// 	}
		// }
		const data = [];
		for (let i = 0; i < 100; i++) {
			data.push({
				_index: i,
				_name: `work ${i}`,
				_id: i,
				_classes: [`一年 ${i}班`,`一年 ${i+1}班`],
				_subject:'学科',
				_time:"0907",
			});
		}
		let columns = this.studentColum;

		let sublist = this.props.state.sublist;
		const children = [];
		if (sublist.data) {
			for (let i = 0; i < sublist.data.length; i++) {
				let data = sublist.data[i]
				children.push(<Option key={data.k}>{data.v}</Option>);
			}
		}
		return (
			<>
				<Layout style={{
							overflow: 'auto',
							maxHeight:'calc( 100% - 50px )'
					}}>
					<Content style={{ background:"#fff" }}>
						<div className={style.gradeboder} >
							<div style={{position:'relative'}}>
								<Spin spinning={!this.props.state.getClassMembersFinish} style={{height:'100%'}}> 
									<div className={style.table}>
										<Table
											rowKey={record => record.userId}
											className={style.scoreDetTable}
											dataSource={data}
											columns={columns}
											pagination={true}
											style={{ userSelect: 'text' }}
											rowClassName="editable-row" />

									</div>
								</Spin>
							</div>
						</div>
					</Content>
				</Layout >
			</>
		);
	}
	componentDidMount() {
		// this.props.dispatch({
		// 	type: 'homePage/getGrade',
		// 	payload: { schoolId: store.get('wrongBookNews').schoolId }
		// })

		// this.props.dispatch({
		// 	type: 'homePage/subjectNodeList',
		// 	payload: {}
		// })
	}
	UNSAFE_componentWillMount() {
		// this.props.dispatch({
		// 	type: 'homePage/tealist',
		// 	payload: []
		// });
	}

}

export default connect((state) => ({
	state: {
		...state.homePage,
		getClassMembersFinish:state.classModel.getClassMembersFinish,
		classStudentList:state.classModel.classStudentList,
		years: state.temp.years
	}
}))(HomeworkCenter);
