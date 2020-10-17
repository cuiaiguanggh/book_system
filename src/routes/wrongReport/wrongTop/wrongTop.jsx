import React from 'react';
import {
	Layout, Tabs, Input, Modal, Select, Popover, Icon
} from 'antd';
import { routerRedux, } from "dva/router";
import { connect } from 'dva';
import observer from '../../../utils/observer'

//作业中心界面内容
const Option = Select.Option;


class WrongTop extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	getGrade() {
		let classList = this.props.state.classList1;
		let className = this.props.state.className;
		if (classList.data && classList.data.length > 0 && className != '') {
			return (
				<Select
					// showSearch
					style={{ width: 120 }}
					placeholder="班级"
					value={this.props.state.classId}
					suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
					optionFilterProp="children"
					onChange={(value, option) => {
						this.props.dispatch({
							type: 'temp/classId',
							payload: value
						});
						this.props.dispatch({
							type: 'temp/className',
							payload: option.props.children
						});
						this.props.dispatch({
							type: 'report/propsPageNum',
							payload: 1
						});
						this.props.dispatch({
							type: 'report/changeMouth',
							payload: 0,
						});
						this.props.dispatch({
							type: 'report/userId',
							payload: '',
						});
						this.props.dispatch({
							type: 'down/delAllClass',
						});
						this.props.dispatch({
							type: 'down/delAllStu',
						});
						this.props.dispatch({
							type: 'report/knowledgenow',
							payload: []
						});
						this.props.dispatch({
							type: 'temp/getUserSubjectList',
							payload: value,
						});
					}}
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					{
						classList.data.map((item, i) => (
							<Option key={i} value={item.classId}>{item.className}</Option>
						))
					}
				</Select>
			)
		} else {

		}
	}
	getSub() {
		let subList = this.props.state.subList;
		let subName = this.props.state.subName;
		if (subList.data && subList.data.length > 0 && subName != '') {
			return (
				<Select
					style={{ width: 90, marginLeft: 5 }}
					placeholder="学科"
					value={this.props.state.subId}
					suffixIcon={<Icon type="caret-down" style={{ color: "#646464", fontSize: 10 }} />}
					optionFilterProp="children"
					onChange={(value) => {
						//清空时间段
						this.props.dispatch({
							type: 'report/begtoendTime',
							payload: []
						});
						this.props.dispatch({
							type: 'report/stbegtoendTime',
							payload: []
						});
						//清空知识点
						this.props.dispatch({
							type: 'report/knowledgenow',
							payload: []
						});

						this.props.dispatch({
							type: 'report/changeMouth',
							payload: 0
						});
						this.props.dispatch({
							type: 'report/propsPageNum',
							payload: 1
						});

						this.props.dispatch({
							type: 'report/studentList',
							payload: []
						});
						this.props.dispatch({
							type: 'report/qrdetailList',
							payload: []
						})
						this.props.dispatch({
							type: 'report/qrStudentDetailList',
							payload: []
						})

						this.props.dispatch({
							type: 'temp/getQrMonthList',
							payload: {
								classId: this.props.state.classId,
								year: this.props.state.years,
								subjectId: value
							}
						});
						this.props.dispatch({
							type: 'temp/subId',
							payload: value
						});
						let hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "");
						if (hashStrings === '/classReport') {
							//处在班级错题页面
							this.props.dispatch({
								type: 'temp/getKnowledgeList',
								payload: {
									classId: this.props.state.classId,
									year: this.props.state.years,
									subjectId: value,
									type: 0,
								}
							});
							this.props.dispatch({
								type: 'report/queryQrDetail',
								payload: {
									classId: this.props.state.classId,
									year: this.props.state.years,
									subjectId: value,
									info: 0,
									pageSize: 20,
									pageNum: 1
								}
							});
							this.props.dispatch({
								type: 'down/delAllClass',
							});
						} else if (hashStrings === '/stuReport') {
							//处在学生错题页面
							this.props.dispatch({
								type: 'temp/getKnowledgeList',
								payload: {
									classId: this.props.state.classId,
									year: this.props.state.years,
									subjectId: value,
									userId: this.props.state.userId,
									type: 1
								}
							});
							this.props.dispatch({
								type: 'report/queryQrStudentCount',
								payload: {
									classId: this.props.state.classId,
									year: this.props.state.years,
									subjectId: value
								}
							});
							this.props.dispatch({
								type: 'down/delAllStu',
							});
						} else if (hashStrings === '/workReport') {
							//处在作业报告页面
							this.props.dispatch({
								type: 'report/queryHomeworkList',
								payload: {
									classId: this.props.state.classId,
									subjectId: value
								}
							});
						} else if (hashStrings === '/intelligentDollors') {
							//处在智能组卷页面
							observer.publish('dollorsChange', value)
						} else if (hashStrings === '/bulkPrint') {
							//处在批量打印页面
							observer.publish('printCut', value)
						}


					}}
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
				>
					{
						subList.data.map((item, i) => (
							<Option key={i} value={item.v}>{item.k}</Option>
						))
					}
				</Select>
			)
		} else {

		}
	}
	render() {
		return (
			<>
				{this.getGrade()}
				{this.getSub()}
			</>
		);
	}

	componentDidMount() {
		const hash = this.props.type.hash;
		let page = hash.substr(hash.indexOf("page=") + 5) * 1;
		if (page === 0) {
			page = 1
		}
	}
}

export default connect((state) => ({
	state: {
		...state.report,
		...state.temp,
	}
}))(WrongTop);
