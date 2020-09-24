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
		};
		this.workColum = [
			{
				title: '序号',
				align: 'center',
				dataIndex: '_index',
				render: (text, record, index) => `${text}` // 显示每一行的序号
			},
			{
			title: '作业名称',
			dataIndex: 'examName',
			align: 'center',
			editable: true,
			render: (text, record) => (text)
		}, {
			title: '班级',
			dataIndex: 'className',
			align: 'center',
			editable: true,
			render: (text, record) => (text)
		},{
			title: '学科',
			dataIndex: 'subjectName',
			align: 'center',
			editable: false,
			className:'thphone',
			render: (text, record) => (text)
		}, {
			title: <div >时间</div>,
			dataIndex: 'createTime',
			align: 'center',
			editable: false,
			className:'thphone',
			render: (text, record) => (text)
		}, {
			title: <div >操作</div>,
			align: 'center',
			editable: false,
			render: (text, record,index) => {
				return(
					<>
						<span className={style.caozuospan} onClick={()=>props.logQuestions(record)}>错题录入</span>
						<span className={style.caozuospan}>查看报告</span>
						<span className={style.caozuospan} onClick={()=>props.editWork(record)}>编辑</span>
						<span className={style.caozuospan} onClick={()=>this.deleteWork(record)}>删除</span>
					</>
				)
			}
		 },
		];

	}

	deleteWork(witem){
		console.log('witem: ', witem);
		const { confirm } = Modal
		confirm({
			content: '确定要删除该份作业吗?',
			onOk() {
				this.props.deleteWork(witem)
			},
			onCancel() {
				
			},
		});

	}
	render() {

		const data = this.props.state.workList;


		let columns = this.workColum;
		return (
			<>
				<Layout style={{
							overflow: 'auto',
							maxHeight:'calc( 100% - 50px )'
					}}>
					<Content style={{ background:"#fff" }}>
						<div className={style.gradeboder} >
							<div style={{position:'relative'}}>
								<Spin spinning={!this.props.state.getWorkListFinish} style={{height:'100%'}}> 
									<div className={style.table}>
										<Table
											rowKey={record => record._index}
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
	
	}


}

export default connect((state) => ({
	state: {
		...state.homePage,
		getWorkListFinish:state.workManage.getWorkListFinish,
		workList:state.workManage.workList,
		years: state.temp.years
	}
}))(HomeworkCenter);
