import React from 'react';
import { Layout, Input,Modal,Button,Select,Row, Col } from 'antd';
import { connect } from 'dva';
import style from './chart.less';
import store from 'store';

const { Content } = Layout;
const confirm = Modal.confirm;
const Option = Select.Option;
const echarts = require('echarts');
//作业中心界面内容
class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			changePhone:0,
			phone:store.get('wrongBookNews').phone,
			name:store.get('wrongBookNews').userName,
			headUrl:store.get('wrongBookNews').avatarUrl,
			subjectId:100
		}

	}
	getGradeName(){
		let userData=this.props.state.userData
		let str=''
		if(userData.subjectName!=null){
			str+=userData.subjectName
		}
		if(userData.gradeName!=null){
			str+='—'+userData.gradeName
		}
		return str
		
	}
	getSub() {
		//return
		let subList =  this.props.state.allSubList ;
		this.props.state.userData!==undefined?this.state.subjectId=this.props.state.userData.subjectId:100
		let subjectId = this.props.state.subjectId;
		if(subList && subList.length> 0 && subjectId != ''){
			return(
				<Select
						
						style={{ width: 300}}
						placeholder="学科"
						value={subjectId}
						optionFilterProp="children"
						onChange={(value)=>{
							this.props.dispatch({
								type: 'userInfo/subjectId',
								payload:value
							});
						}}
						
				>
					{
						subList.map((item,i) =>(
							<Option key={i} value={item.v}>{item.k}</Option>
						))
					}
			</Select>
			)
		}else{

		}
		} 
	render() {
		let userNews = store.get('wrongBookNews')
		let classArray = this.props.state.classList1.data
		let userData=this.props.state.userData
		// console.log(userNews,userData)
		return(
			<Layout>
				<Content  style={{ overflow: 'initial'}} >
					<h3 style={{ background: '#fff',borderBottom:'1px solid #eee',margin:'0',padding:'10px 24px'}}>个人信息</h3>
					
					<Row style={{marginTop:20}}>
						<Col  xl={12} md={24}> 
						 	<div id='main' style={{height:400, margin:'0 20px',padding:'20px',backgroundColor:'#fff'}}></div>
						</Col>
						<Col  xl={12} md={24}>
							<div id='main1' style={{height:400, margin:'0 20px',padding:'20px',backgroundColor:'#fff'}}></div>
						</Col>
					</Row>

					<Row style={{marginTop:20}}>
						<Col span={24}> 
							<div id='main2' style={{height:400,margin:'0 20px',padding:'20px',backgroundColor:'#fff'}}></div>
						</Col>
					</Row>
				</Content>
			</Layout>
		);
	}

	componentDidMount(){
		let schoolId = store.get('wrongBookNews').schoolId
		let myChart = echarts.init(document.getElementById('main'));
		let myChart1 = echarts.init(document.getElementById('main1'));
		let myChart2 = echarts.init(document.getElementById('main2'));
		const {dispatch} = this.props;
		let option = {
			title : {
					text: '南丁格尔玫瑰图',
					subtext: '纯属虚构',
					x:'center'
			},
			tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
					x : 'right',
					y : 'center',
					data:['一年级','二年级','三年级','四年级','五年级'],
					orient:'vertical',
					borderRadius:100,
					type:'plain'
			},
			// toolbox: {
			// 		show : true,
			// 		feature : {
			// 				mark : {show: true},
			// 				dataView : {show: true, readOnly: false},
			// 				magicType : {
			// 						show: true,
			// 						type: ['pie', 'funnel']
			// 				},
			// 				restore : {show: true},
			// 				saveAsImage : {show: true}
			// 		}
			// },
			calculable : true,
			series : [
					{
							name:'半径模式',
							type:'pie',
							radius : [20, 110],
							center : ['25%', '50%'],
							roseType : 'radius',
							label: {
									normal: {
											show: true
									},
									emphasis: {
											show: true
									}
							},
							lableLine: {
									normal: {
											show: false
									},
									emphasis: {
											show: true
									}
							},
							data:[
									{value:10, name:'一年级',itemStyle:{color:'#21A2F4'}},
									{value:5,  name:'二年级', itemStyle:{color:'#B8A5DF'}},
									{value:15, name:'三年级',itemStyle:{color:'#36C9CB'}},
									{value:25, name:'四年级',itemStyle:{color:'#FBD437'}},
									{value:25, name:'五年级',itemStyle:{color:'#DA7F85'}}
							]
					},

			]
	};
	let option1 = {
			tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				x : 'right',
				y : 'center',
				data:['一年级','二年级','三年级','四年级','五年级'],
				orient:'vertical'
			},
			series: [
					{
							name:'访问来源',
							type:'pie',
							radius: ['50%', '70%'],
							center : ['25%', '50%'],
							avoidLabelOverlap: false,
							label: {
									normal: {
											show: false,
											position: 'center'
									},
									emphasis: {
											show: true,
											textStyle: {
													fontSize: '30',
													fontWeight: 'bold'
											}
									}
							},
							labelLine: {
									normal: {
											show: false
									}
							},
							data:[
								{value:335, name:'一年级',itemStyle:{color:'#21A2F4'}},
								{value:310, name:'二年级',itemStyle:{color:'#B8A5DF'}},
								{value:234, name:'三年级',itemStyle:{color:'#36C9CB'}},
								{value:135, name:'四年级',itemStyle:{color:'#FBD437'}},
								{value:1548,name:'五年级',itemStyle:{color:'#DA7F85'}}
							]
					}
			]
		};

		let option2 =  {
			title: {
					text: '折线图堆叠'
			},
			tooltip: {
					trigger: 'axis'
			},
			legend: {
					data:['邮件营销']
			},
			grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
			},
			toolbox: {
					feature: {
							saveAsImage: {}
					}
			},
			xAxis: {
					type: 'category',
					boundaryGap: false,
					data: ['周一','周二','周三','周四','周五','周六','周日']
			},
			yAxis: {
					type: 'value'
			},
			series: [
					{
							name:'邮件营销',
							type:'line',
							stack: '总量',
							data:[120, 132, 101, 134, 90, 230, 210],
							lineStyle:{color:'#2FC25B'},
							itemStyle:{color:"#2FC25B"}
					},
			]
	};
	
		myChart.setOption(option);
		myChart1.setOption(option1);
		myChart2.setOption(option2);
	}
}

export default connect((state) => ({
	state: {
		...state.userInfo,
		...state.classHome,
	}
}))(HomeworkCenter);