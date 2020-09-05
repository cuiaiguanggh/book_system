import React, { useState, useEffect } from 'react';
import {
	Layout, Table, Modal, Select, Spin, Checkbox, Icon
} from 'antd';
import { connect } from 'dva';
import style from './studentList.less';
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
				render: (text, record, index) => `${index + 1}` // 显示每一行的序号
			},
			{
			title: '姓名',
			dataIndex: 'userName',
			align: 'center',
			editable: true,
			render: (text, record) => (text)
		}, {
			title: '账号',
			dataIndex: 'account',
			align: 'center',
			editable: true,
			render: (text, record) => (text)
		}, {
			title: <div >联系电话</div>,
			dataIndex: 'parentPhones',
			align: 'center',
			editable: false,
			className:'thphone',
			render: (text, record) => (text)
		}, {
			title: <div >请勾选一个学生按照时间查询错题</div>,
			align: 'center',
			editable: false,
			render: (text, record,index) => {
				return record.qustionlist?record.qustionlist.map((item, i) => {
					return (
						<Checkbox
							key={i}
							checked={(record.userId&&this.props.state.saleId===record.userId)||(record.questionHook&&record.questionHook[`${index}-${i}`])}
							disabled={record.userId&&this.props.state.saleId===record.userId}
							onClick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								this.onChangeCheck(index,i,record)
							}}
						>
						{i+1}
					</Checkbox>
					)
				}) :''
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
		let rowRadioSelection={
			type:'radio',
			columnTitle:"选择",
			onSelect: (selectedRowKeys, selectedRows) => {
				console.log(selectedRowKeys, selectedRows)
				this.props.selectStudentHander(selectedRowKeys,selectedRows)
				this.props.dispatch({
					type: 'homePage/setSaleId',
					payload: selectedRowKeys.userId
				})
			}
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
											rowSelection={rowRadioSelection}
											rowKey={record => record.userId}
											className={style.scoreDetTable}
											dataSource={dataSource}
											columns={columns}
											pagination={false}
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

		this.props.dispatch({
			type: 'homePage/subjectNodeList',
			payload: {}
		})
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
