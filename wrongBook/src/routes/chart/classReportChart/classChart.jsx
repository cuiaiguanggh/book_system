import React from 'react';
import { Layout, Input,Modal,Button,Select,Row, Col,DatePicker, AutoComplete } from 'antd';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import AnimationCount from 'react-count-animation';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './classChart.less';
import 'react-count-animation/dist/count.min.css';
import TopBar from '../topbar/topbar';
import store from 'store';
moment.locale('zh-cn');

const { Content,Header } = Layout;
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
			subjectId:100,
			timeIndex:0,
			dateValue:['开始时间','结束时间'],
			date:[]
		}

	}

	getSub() {
		let subList =  this.props.state.subList.data;
		if(subList && subList.length> 0){
			return(
				<Select					
						style={{ width: 100,marginRight:20}}
						placeholder="学科"
						optionFilterProp="children"
						onChange={(value)=>{
							console.log(value)
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
	getClassList() {
		let classList =  this.props.state.classList1.data;
		if(classList && classList.length> 0){
			return(
				<Select					
						style={{ width: 100}}
						placeholder="班级"
						optionFilterProp="children"
						onChange={(value)=>{
							console.log(value)
						}}
						
				>
					{
						classList.map((item,i) =>(
							<Option key={i} value={item.classId}>{item.className}</Option>
						))
					}
			</Select>
			)
		}else{

		}
	}  
	render() {
		const {RangePicker} = DatePicker;
		
		let timeList=this.props.state.reportTimeList
		let subList =  this.props.state.subList ;
		let subName = this.props.state.subName;

		let classList = this.props.state.classList1
		let className = this.props.state.className;
	  console.error(subList,subName,classList)
		return(
			<Layout>
					<TopBar timeList={timeList}></TopBar>
					<Content style={{background:'#eee',overflow:'auto',position:'relative'}}>
							<Row style={{marginTop:20}}>
								<Col md={24}> 
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',	overflowX:'auto',overflowY:'hidden'}}>
											<div className={{}}>
												{this.getSub()}
												{this.getClassList()}
											</div>
											<div id='main2' style={{height:400}}>
											
											</div>
										</div>
								</Col>
							</Row>

							<Row style={{marginTop:20}}>
								<Col md={24}> 
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden'}}>
										<p>学生使用情况</p>
										<div id='main3' style={{height:400}} >
										
										</div>
									</div>
								</Col>
							</Row>

							<Row style={{marginTop:20}}>
								<Col md={24}> 
									<div style={{margin:'0 20px',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden',marginBottom:30}}>
										<p>教师使用情况</p>
									</div>
								</Col>
							</Row>
					</Content>
			</Layout>
		);
	}

	componentDidMount(){
		let schoolId = store.get('wrongBookNews').schoolId

		const {dispatch} = this.props;
		dispatch({
			type: 'reportChart/getReportTimeList',
		});
		let myChart2 = echarts.init(document.getElementById('main2'));
		let myChart3 = echarts.init(document.getElementById('main3'));
		
		let option2 =  {
			title: {
					text: ''
			},
			tooltip: {
					trigger: 'axis'
			},
			legend: {
				selectedMode:true,
				data:['错题量','人数'],
				itemGap:16,
			},
			grid: {
					left: '0%',
					right: '2%',
					bottom: '3%',
					containLabel: true
			},
			xAxis: {
					type: 'category',
					boundaryGap: false,
					data: ['1.01','1.02','1.03','1.04','1.05','1.06','1.07','1.08','1.09','1.10','1.11','1.12','1.13','1.13','1.15','1.16','1.17','1.18','1.19','1.20','1.21','1.22','1.23','1.24','1.25','1.26','1.27','1.28','1.29','1.30'],			
					axisTick:{
						show:false
					}
			},
			yAxis: {
					type: 'value',
					axisLine:{
						show: false
					},
					splitLine:{
            lineStyle:{
                type:'dashed',
                color:'#ccc'
            }
				},
				axisTick:{
					show:false
				}
			},
			series: [
					{
							name:'错题量',
							type:'line',
							stack: '总量',
							symbol: 'circle',
            	symbolSize: 6,
							data:[120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210, 90, 230, 210,],
							lineStyle:{color:'#2FC25B'},
							itemStyle:{color:"#2FC25B"}
					},
					{
							name:'人数',
							type:'line',
							symbol: 'circle',
            	symbolSize: 6,
							stack: '总量',
							data:[120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210, 90, 230, 210,],
							lineStyle:{color:'#21A2F4'},
							itemStyle:{color:"#21A2F4"}
							
					}
			],
			dataZoom: [
    ],
		};
		let option3 =  {
			title: {
				text: '',
				subtext: '',
				x:'left',
				textStyle:{
						fontSize:14,
						fontWeight:'normal'
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
						
				}
			},
	
			legend: {
					data:['错题量'],
					itemGap:16,
					selectedMode:false,
			},
			grid: {
				left: '0%',
				right: '2%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
					{
							type: 'category',
							data: [
								'张三','里斯','王五','张三','里斯','王五','张三','里斯','王五','张三',
								'张三','里斯','王五','张三','里斯','王五','张三','里斯','王五','张三',
								'张三','里斯','王五','张三','里斯','王五','张三','里斯','王五','张三',
								// '张三','里斯','王五','张三','里斯','王五','张三','里斯','王五','张三',
								// '张三','里斯','王五','张三','里斯','王五','张三','里斯','王五','张三',
								// '张三','里斯','王五','张三','里斯','王五','张三','里斯','王五','张三',
							],
							axisPointer: {
									type: 'shadow'
							},
							axisTick:{
								show:false
							}
							
					}
			],
			yAxis: [
				
					{
							type: 'value',
							axisLine:{
								show: false
							},
							axisLabel: {
									formatter: '{value}'
							},
							splitLine:{
								lineStyle:{
										type:'dashed',
										color:'#ccc'
								}
							},
							axisTick:{
								show:false
							}
					},
					{
							show:false
					}
			],
			series: [
					{
							name:'错题量',
							type:'bar',
							symbol: 'circle',     
							barWidth:'50%',
							symbolSize: 6,
							lineStyle:{color:'#21A2F4'},
							itemStyle:{color:"#21A2F4"},
							data:[
								12, 23, 45, 23, 25, 76, 135, 162, 32, 20,
								12, 23, 45, 23, 25, 76, 135, 162, 32, 20,
								12, 23, 45, 23, 25, 76, 135, 162, 32, 20,
								// 12, 23, 45, 23, 25, 76, 135, 162, 32, 20,
								// 12, 23, 45, 23, 25, 76, 135, 162, 32, 20,
								// 12, 23, 45, 23, 25, 76, 135, 162, 32, 20,
							]
					}
			]
			};

		myChart2.setOption(option2);
		myChart3.setOption(option3);
	}
}

export default connect((state) => ({
	state: {
		...state.userInfo,
		...state.classHome,
		...state.reportChart,
		...state.report,
		...state.temp,
	}
}))(HomeworkCenter);