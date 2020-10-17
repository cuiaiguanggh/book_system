import React from 'react';
import { Layout, Input,Button,Radio } from 'antd';
import {  Link, } from "dva/router";
import { connect } from 'dva';
import style from './SchoolNews.less';
import store from 'store';
const { Content } = Layout;
// const Search = Input.Search;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
//作业中心界面内容
class HomeworkCenter extends React.Component {
	render() {
		return(
			<Layout>
				<Content style={{ overflow: 'initial' }}>
					<div className={style.layout} style={{ padding: 24, background: '#fff' }}>
						<div style={{margin:'10px 10px'}}>						
							<span style={{width:"100px",display:'inline-block'}}>学校名称：</span>
							<Input defaultValue={this.props.state.schoolName} style={{width:'500px'}}
							onChange={(e)=>{
								this.props.dispatch({
									type: 'homePage/changeSchoolName',
									payload:e.target.value
								});
							}}/>
						</div>
						<div style={{margin:'10px 10px'}}>						
							<span style={{width:"100px",display:'inline-block'}}>学校类型：</span>
							<RadioGroup onChange={(e)=>{
								this.props.dispatch({
									type: 'homePage/changephaseId',
									payload:e.target.value
								})}}
								value={this.props.state.phaseId}>
								<Radio value={1}>小学</Radio>
								<Radio value={2}>初中</Radio>
								<Radio value={3}>高中</Radio>
							</RadioGroup>
						</div>
						<div style={{margin:'10px 10px'}}>						
							<span style={{width:"100px",display:'inline-block'}}>校长名称：</span>
							<Input  defaultValue={this.props.state.masterName}  style={{width:'500px'}}
							onChange={(e)=>{
								this.props.dispatch({
									type: 'homePage/changeMasterName',
									payload:e.target.value
								});
							}}/>
						</div>
						<div style={{margin:'10px 10px'}}>						
							<span style={{width:"100px",display:'inline-block'}}>学校位置：</span>
							<Input  defaultValue={this.props.state.address}  style={{width:'500px'}}
							onChange={(e)=>{
								this.props.dispatch({
									type: 'homePage/changeaddress',
									payload:e.target.value
								});
							}}/>
						</div>
						<div style={{margin:'10px 10px'}}>						
							<span style={{width:"100px",display:'inline-block',verticalAlign: 'top'}}>介绍：</span>
							<TextArea  defaultValue={this.props.state.des}  rows={4} style={{width:'500px'}}
							onChange={(e)=>{
								this.props.dispatch({
									type: 'homePage/changedes',
									payload:e.target.value
								});
							}}/>
						</div>
						<Button type="primary"
							onClick={()=>{
								this.props.dispatch({
									type: 'homePage/changeSchool',
									payload:store.get('wrongBookNews').schoolId
								});
							}}
						>保存</Button>
					</div>
				</Content>
			</Layout>
		);
	}
	componentDidMount(){
		let schoolId = store.get('wrongBookNews').schoolId
		let data ={
			schoolId:schoolId
		}
		const {dispatch} = this.props;
		dispatch({
			type: 'homePage/schoolInfo',
			payload:data
		});
	}
}

export default connect((state) => ({
	state: {
		...state.homePage,
	}
}))(HomeworkCenter);