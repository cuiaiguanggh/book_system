import React from 'react';
import { Layout, Table } from 'antd';
import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
import style from './HomeworkCenter.css';
import store from 'store';

const { Content } = Layout;

//作业中心界面内容
class HomeworkCenter extends React.Component {

	render() {
		let dispatch = this.props.dispatch;
		let state = this.props.state;
		const columns = [{
		title: '作业名称',
			dataIndex: 'name',
			key: 'name',
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
			dataIndex: 'operate',
			key: 'operate',
			render: (text, record) => (
				<div className="operateLink"
					onClick={()=>{
						dispatch(
							routerRedux.push({
								pathname: '/homeworkDetails',
								hash:`${record.key}`
							  })
						)
					}
					}>
					{text}
				</div>
			)
		}];
		let pageHomeworkDetiles = state.classNews;
		const dataSource = [];
		if(pageHomeworkDetiles != ''){
			for(let i = 0;i < pageHomeworkDetiles.length; i ++){
				let p = {};
				let det = pageHomeworkDetiles[i];
				p["key"] = det.classId;
				p["name"] = det.className;
				p["operate"] = '查看详情';
				dataSource[i]=p;
			}
		}
		return(
			<Layout style={{ marginLeft: 200 }}>
				<Content style={{ overflow: 'initial' }}>
					<div style={{ padding: 24, background: '#fff' }}>
						<p className={style.ptitle}>班级列表</p>
						<Table className={style.scoreDetTable}
						 dataSource={dataSource}
						 columns={columns}
						 pagination={true}
						 bordered={true}
						 rowKey={(record, index)=> index}/>
					</div>
				</Content>
			</Layout>
		);
	}
	componentDidMount(){
		let data ={
			classId:store.get('grouplistId')
		}
		const {dispatch} = this.props;
		dispatch({
			type: 'homePage/reportqueryClassList'
		});
		this.props.dispatch({
			type: 'homePage/queryClassBookChapterList',
			payload:data
		});
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomeworkCenter);