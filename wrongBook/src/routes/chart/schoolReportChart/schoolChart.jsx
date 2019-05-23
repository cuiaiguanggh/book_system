import React from 'react';
import { Layout, Input,Modal,Button,Select,Row, Col,DatePicker, AutoComplete } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './schoolChart.less';
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
	workHandlePanelChange = (value, mode) => {    
		    console.log(1111)			
	} 
	workOnChange = (date) => { 
		console.log(date)
		 
		const dateFormat = 'YYYY-MM-DD';   
		let startDate= moment(date[0]).format("YYYY-MM-DD")
		let endDate = moment(date[1]).format("YYYY-MM-DD")
		let queryDate=startDate+'~'+endDate

		if(date.length===0){
			this.setState({
				timeIndex:0,
				date:null		
			})
		}else{
			this.setState({
				timeIndex:100,
				date:[moment(startDate, dateFormat), moment(endDate, dateFormat)]			
			})
		} 
		console.log(queryDate)
	}
	disabledDate = current => current && current > moment().endOf('day') || current < moment().subtract(2, 'year');

	render() {
		const {RangePicker} = DatePicker;
		
		let timeList=this.props.state.reportTimeList

	//	console.log('时间',timeList,this.props.state)
		return(
			<Layout>
				<Header  style={{ background: '#fff',borderTop:'1px solid #eee',borderBottom:'1px solid #eee',overflow:'hidden',padding:'0 20px',height:44,lineHeight:'44px'}}>
						<div className={style.topbar} style={{ background: '#fff',margin:'0'}}>
								<div>
									<ul className={style.timemenu}>
									{timeList.map((item,i) =>(
											<li key={i}
												className={i === this.state.timeIndex?'selected': ''}
												onClick={() =>{
													console.log(i,item)
													this.setState({
														timeIndex:i
													})
												}}>
											{item.name}</li>
										))
									}									
									</ul>
								</div>
								<div style={{marginLeft:14}}>
									<RangePicker  
										style={{width:220}}              
										placeholder={this.state.dateValue}
										value={this.state.date}  		
										format="YYYY-MM-DD"                            
										onPanelChange={this.workHandlePanelChange}
										onChange={this.workOnChange} 
										disabledDate={this.disabledDate}
										/>
								</div>
										
						</div>
					</Header>
					<Content style={{background:'#eee',overflow:'auto',position:'relative'}}>
										
							<Row style={{marginTop:20}}>
								<Col  xl={12} md={24} > 
									<div id='main' style={{height:400, margin:'0 20px',padding:'20px',backgroundColor:'#fff',marginBottom:20}}></div>
								</Col>
								<Col  xl={12} md={24}>
									<div id='main1' style={{height:400, margin:'0 20px',padding:'20px',backgroundColor:'#fff',marginBottom:20}}></div>
								</Col>
							</Row>

							<Row >
								<Col md={24}> 
									<div style={{height:400,margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden',marginBottom:30}}>
										<div id='main2' style={{height:'100%'}}>
										
										</div></div>
								</Col>
							</Row>

							<Row >
								<Col md={24}> 
									<div style={{height:400,margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden',marginBottom:30}}>
										<div id='main3' style={{height:'100%'}}>
										
										</div>
									</div>
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
		let myChart3 = echarts.init(document.getElementById('main3'));
		const {dispatch} = this.props;
		dispatch({
			type: 'reportChart/getReportTimeList',
		});
		let option = {
			title : {
					text: '错题总量',
					subtext: '',
					x:'left',
					textStyle:{
							fontSize:14,
							fontWeight:'normal'
					}
			},
			tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
					x : 'right',
					y : 'center',
					itemGap:18,
					data:[
						{name:'一年级',icon:''},
						{name:'二年级',icon:''},
						{name:'三年级',icon:''},
						{name:'四年级',icon:''},
						{name:'五年级',icon:''},
					],
					align: 'left',
					formatter: function (params) {
						for (var i = 0; i < option.series[0].data.length; i++) {
							if (option.series[0].data[i].name == params) {
									return params +"  "+ option.series[0].data[i].value+"道";
							}
						}
					},
					orient:'vertical',
					type:'plain',
			},
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
			title:{
				text: '使用人数',
				subtext: '',
				x:'left',
				textStyle:{
						fontSize:14,
						fontWeight:'normal'
				}
			},
			tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
			},
			legend: {
				x : 'right',
				y : 'center',
				itemGap:18,
				data:[
					{name:'一年级',icon:'circle'},
					{name:'二年级',icon:'circle'},
					{name:'三年级',icon:'circle'},
					{name:'四年级',icon:'circle'},
					{name:'五年级',icon:'circle'},
				],
				orient:'vertical',
				align: 'left',
					formatter: function (params) {
						for (var i = 0; i < option.series[0].data.length; i++) {
							if (option.series[0].data[i].name == params) {
									return params +"  "+ option.series[0].data[i].value+"人";
							}
						}
					},
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
				selectedMode:true,
				data:['错题量','人数'],
				itemGap:16,
			},
			grid: {
					left: '3%',
					right: '3%',
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
        // {
        //     type: 'inside'
        // }
    ],
	};

	let option3 =  {
		title: {
			text: '班级使用情况',
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
				data:['错题量','人数'],
				itemGap:16,
		},
		grid: {
			left: '3%',
			right: '1%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
				{
						type: 'category',
						data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
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
						lineStyle:{color:'#2FC25B'},
						itemStyle:{color:"#2FC25B"},
						data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				},

				{
						name:'人数',
						type:'line',
						yAxisIndex: 1,
						data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
						symbol: 'circle',
						symbolSize: 6,
						lineStyle:{color:'#21A2F4'},
						itemStyle:{color:"#21A2F4"}
				}
		]
		};
		
		myChart.setOption(option);
		myChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
		myChart1.setOption(option1);
		myChart1.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
		myChart2.setOption(option2);
		myChart3.setOption(option3);

		window.onresize = function (e) {//用于使chart自适应高度和宽度
		//	console.log(e)
			let winWidth=e.target.innerWidth
			let winHeight=e.target.innerheight
			//resizeWorldMapContainer();//重置容器高宽
			const chartBox = document.getElementById('main');
			const chartBox1 = document.getElementById('main1');
			const chartBox2 = document.getElementById('main2');
			const chartBox3 = document.getElementById('main3');
			console.error('winwidth:',winWidth)
			console.error('chartBoxwidth:',chartBox.offsetWidth,chartBox3.offsetWidth)
			if(!chartBox) return
			if(winWidth<=1024){
				chartBox3.style.width='800px'
				chartBox2.style.width='800px'
			}else{

				chartBox3.style.width='calc( 100% - 40px )'
				chartBox2.style.width='calc( 100% - 40px )'
			}
			if(chartBox.offsetWidth<=600){
				chartBox.style.height='500px'
				chartBox1.style.height='500px'
				option.legend.y='bottom'
				option.legend.x='center'
				option.legend.orient='horizontal'
				option.series[0].center = ['50%', '50%']

				option1.legend.y='bottom'
				option1.legend.x='center'
				option1.legend.orient='horizontal'
				option1.series[0].center = ['50%', '50%']
				option1.series[0].radius = ['35%', '55%']
				
				myChart.setOption(option);
				myChart1.setOption(option1);
			}else{
				chartBox.style.height='400px'
				chartBox1.style.height='400px'
				option.legend.y='center'
				option.legend.x='right'
				option.legend.orient='vertical'
				option.series[0].center = ['25%', '50%']
				
				option1.legend.y='center'
				option1.legend.x='right'
				option1.legend.orient='vertical'
				option1.series[0].center = ['25%', '50%']
				option1.series[0].radius = ['50%', '70%']

				myChart.setOption(option);
				myChart1.setOption(option1);
			}
			//console.log(chartBox.offsetWidth)
			myChart.resize();
			myChart1.resize();
			myChart2.resize();
			myChart3.resize();
	
	};
	}
}

export default connect((state) => ({
	state: {
		...state.userInfo,
		...state.classHome,
		...state.reportChart,
	}
}))(HomeworkCenter);