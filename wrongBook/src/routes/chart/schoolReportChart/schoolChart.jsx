import React from 'react';
import { Layout, Input,Modal,Button,Select,Row, Col,DatePicker, AutoComplete,Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './schoolChart.less';
import TopBar from '../topbar/topbar'
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
			date:[],
			myChart:{},
			sbid:0,
			cid:0,

		}

	}

	onChangeTime(item){
		if(!item) return
		this.dispatch({
			type: 'reportChart/periodTime',
			payload:item.periodTime
		});
		this.dispatch({
			type: 'reportChart/timeStamp',
			payload:item.timeStamp
		});
		let cid=this.state.classId
		let sid=this.state.subjectId
		let data={
			schoolId:store.get('wrongBookNews').schoolId,
			periodTime:item.periodTime,
			timeStamp:item.timeStamp,
			classId:cid,
			subjectId:sid,
		}
		this.dispatch({
			type: 'reportChart/getSchoolDataReport',
			payload:data
		});
	}
	onChangeDate(startDate,endDate){
		console.log(startDate,endDate)
		let data={}
		if(startDate!==''){
			this.dispatch({
				type: 'reportChart/startTime',
				payload:startDate
			});
			this.dispatch({
				type: 'reportChart/endTime',
				payload:endDate
			});
			data={
				schoolId:store.get('wrongBookNews').schoolId,
				startTime:startDate,
				endTime:endDate,
				classId:this.state.classId,
				subjectId:this.state.subjectId,
				timeStamp:0,
			}
		}else{
			console.error('11',this.state.reportTimeList)
			//return
			data={
				schoolId:store.get('wrongBookNews').schoolId,
				classId:this.state.classId,
				subjectId:this.state.subjectId,
				timeStamp:this.state.reportTimeList[0].timeStamp,
				periodTime:1,
			}
		}
		
		this.dispatch({
			type: 'reportChart/getSchoolDataReport',
			payload:data
		});
	}
	renderQustionCount(data){
		let myChart1 = echarts.init(document.getElementById('main'));
		var arr = Object.getOwnPropertyNames(data)
		var arr1=arr.map(function(i){return data[i]})
		let sdata=[]
		for(let i=0;i<arr.length;i++){
			let scolor=''
			if(arr[i]==='一年级'){
				scolor='#21A2F4'
			}else if(arr[i]==='二年级'){
				scolor='#B8A5DF'
			}else if(arr[i]==='三年级'){
				scolor='#36C9CB'
			}else if(arr[i]==='四年级'){
				scolor='#FBD437'
			}else if(arr[i]==='五年级'){
				scolor='#DA7F85'
			}
			sdata.push({name:arr[i],value:arr1[i],itemStyle:{color:scolor}})
		}
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
					data:sdata,
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
							// data:[
							// 		{value:0, name:'一年级',itemStyle:{color:'#21A2F4'}},
							// 		{value:0,  name:'二年级', itemStyle:{color:'#B8A5DF'}},
							// 		{value:0, name:'三年级',itemStyle:{color:'#36C9CB'}},
							// 		{value:0, name:'四年级',itemStyle:{color:'#FBD437'}},
							// 		{value:0, name:'五年级',itemStyle:{color:'#DA7F85'}}
							// ]
							data:sdata
					},

			]
		};
		myChart1.setOption(option);
		myChart1.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
	}

	renderUserCount(data){
		//return
		let myChart = echarts.init(document.getElementById('main1'));
		var arr = Object.getOwnPropertyNames(data)
		var arr1=arr.map(function(i){return data[i]})
		let sdata=[]
		for(let i=0;i<arr.length;i++){
			let scolor=''
			if(arr[i]==='一年级'){
				scolor='#21A2F4'
			}else if(arr[i]==='二年级'){
				scolor='#B8A5DF'
			}else if(arr[i]==='三年级'){
				scolor='#36C9CB'
			}else if(arr[i]==='四年级'){
				scolor='#FBD437'
			}else if(arr[i]==='五年级'){
				scolor='#DA7F85'
			}
			sdata.push({name:arr[i],value:arr1[i],itemStyle:{color:scolor},icon:'circle'})
		}
	
		let option = {
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
				data:sdata,
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
							radius: ['50%', '65%'],
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
							data:sdata
					}
			]
		};

		myChart.setOption(option);
		myChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
	}
	renderTeacherUserCount(arr){
		let data=arr
		let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
		const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        
			},
			{
        title: '教师',
        dataIndex: 'adminName',
        key: 'adminName',
			},
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className',
        
			},
			{
        title: '组卷次数',
        dataIndex: 'assembleTimes',
				key: 'assembleTimes',
				defaultSortOrder: 'descend',
    		sorter: (a, b) => a.assembleTimes - b.assembleTimes,
        // sorter: (a, b) => a.address.length - b.address.length,
        // sortOrder: sortedInfo.columnKey === 'assembleTimes' && sortedInfo.order,
       
			},
			{
        title: '视频讲解次数',
        dataIndex: 'videoExplain',
				key: 'videoExplain',
				defaultSortOrder: 'descend',
    		sorter: (a, b) => a.videoExplain - b.videoExplain,
        // sorter: (a, b) => a.videoExplain.length - b.videoExplain.length,
				// sortOrder: sortedInfo.columnKey === 'videoExplain' && sortedInfo.order,
				// onFilter: (value, record) => record.videoExplain.includes(value),
			},
			// {
      //   title: '视频点赞数',
      //   dataIndex: 'address',
			// 	key: 'address2',
			// 	filters: [{ text: 'London', value: 'London' }, { text: 'New York', value: 'New York' }],
      //   filteredValue: filteredInfo.address || null,
      //   onFilter: (value, record) => record.address.includes(value),
      //   sorter: (a, b) => a.address.length - b.address.length,
      //   sortOrder: sortedInfo.columnKey === 'className' && sortedInfo.order,
       
      // },
		]; 
		return(
			<Table bordered columns={columns}  dataSource={data} pagination={false} />
		)
	}
	renderClassData(udata,wdata){
		let myChart = echarts.init(document.getElementById('main3'));
		let classList=[]
		for (let i = 0; i < udata.length; i++) {
			classList.push(udata[i].className)
		}

		let userList=[]
		for (let i = 0; i < udata.length; i++) {
			userList.push(udata[i].num)
		}

		let wrongList=[]
		for (let i = 0; i < udata.length; i++) {
			wrongList.push(wdata[i].num)
		}

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
					data:['错题量','人数'],
					itemGap:16,
			},
			grid: {
				left: '1%',
				right: '1%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
					{
							type: 'category',
							data: classList,
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
							barWidth:'20',
							symbolSize: 6,
							lineStyle:{color:'#2FC25B'},
							itemStyle:{color:"#2FC25B"},
							data:wrongList
					},
	
					{
							name:'人数',
							type:'line',
							yAxisIndex: 1,
							data:userList,
							symbol: 'circle',
							symbolSize: 6,
							lineStyle:{color:'#21A2F4'},
							itemStyle:{color:"#21A2F4"}
					}
			]
			};

			myChart.setOption(option3)
			myChart.resize()
	}

	renderClassData0(udata,wdata){
		let myChart = echarts.init(document.getElementById('main2'));
		var dateList = Object.getOwnPropertyNames(udata)
		var userList=dateList.map(function(i){return udata[i]})

		var wList = Object.getOwnPropertyNames(wdata)
		var wrongList=wList.map(function(i){return wdata[i]})
		
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
					left: '1%',
					right: '2%',
					bottom: '3%',
					containLabel: true
			},
			xAxis: {
					type: 'category',
					boundaryGap: false,
					data: dateList,			
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
							data:wrongList,
							lineStyle:{color:'#2FC25B'},
							itemStyle:{color:"#2FC25B"}
					},
					{
							name:'人数',
							type:'line',
							symbol: 'circle',
            	symbolSize: 6,
							stack: '总量',
							data:userList,
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

		myChart.setOption(option2)
		
	}
	getSub() {
		let subList =  this.props.state.subList.data;
		if(subList && subList.length> 0){
			return(
				<Select					
						style={{ width: 100,marginRight:20}}
						placeholder="学科"
						optionFilterProp="children"
						value={this.props.state.subjectId}
						onChange={(value)=>{
							this.props.dispatch({
								type: 'reportChart/subjectId',
								payload:value
							});


							let data={
								schoolId:store.get('wrongBookNews').schoolId,
								classId:this.props.state.classId,
								subjectId:this.props.state.subjectId,

								periodTime:this.props.state.periodTime,
								timeStamp:this.props.state.timeStamp,
							}
							if(false){
								// startTime:this.props.state.startTime,
								// endTime:this.props.state.endTime,
							}
							this.props.dispatch({
								type: 'reportChart/getSchoolDataReport',
								payload:data
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
	getClassList() {
		let classList =  this.props.state.classList1.data;
		let cid=classList[0].classId
		// this.setState({
		// 	cid:cid
		// })
		if(classList && classList.length> 0){
			return(
				<Select					
						style={{ width: 140}}
						placeholder="班级"
						optionFilterProp="children"
						value={this.props.state.classId}
						onChange={(value)=>{
							this.props.dispatch({
								type: 'reportChart/classId',
								payload:value
							});
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

		let timeList=this.props.state.reportTimeList
		let schoolReport=this.props.state.schoolDataReport
		if(schoolReport.gradeWrongNumMap){
			this.renderQustionCount(schoolReport.gradeWrongNumMap)
		}
		if(schoolReport.gradeUseNumMap){
			this.renderUserCount(schoolReport.gradeUseNumMap)
		}
		if(schoolReport.classUseData){
			this.renderClassData(schoolReport.classUseData,schoolReport.classWrongData)
		}
		if(schoolReport.schoolUserNumData){
			this.renderClassData0(schoolReport.schoolUserNumData,schoolReport.schoolWrongNumData)
		}
	
	  console.log('报告',schoolReport)
		return(
			<Layout>
				<TopBar timeList={timeList} onChangeTime={this.onChangeTime} onChangeDate={this.onChangeDate}></TopBar>
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
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden',marginBottom:20}}>
										{this.getSub()}
										{this.getClassList()}
										<div id='main2' style={{height:'400px'}}>
										
										</div>
										</div>
								</Col>
							</Row>

							<Row >
								<Col md={24}> 
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden',marginBottom:30}}>
										<p>班级使用情况</p>
										<div id='main3' style={{height:400}}>							
										</div>
									</div>
								</Col>
							</Row>
							<Row >
								<Col md={24}> 
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden',marginBottom:30}}>
										<p>教师使用情况</p>
										{schoolReport.teacherUseDataList?
											this.renderTeacherUserCount(schoolReport.teacherUseDataList):''
										}
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
        // {
        //     type: 'inside'
        // }
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
				data:['错题量','人数'],
				itemGap:16,
		},
		grid: {
			left: '0%',
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
		
		// myChart.setOption(option);
		// myChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
		// myChart1.setOption(option1);
		// myChart1.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
		myChart2.setOption(option2);
		// myChart3.setOption(option3);

		myChart2.resize();
		myChart3.resize();
		myChart.resize();
		myChart1.resize();
		//return
		window.onresize = function (e) {//用于使chart自适应高度和宽度	
			let winWidth=e.target.innerWidth
			let winHeight=e.target.innerheight
			//resizeWorldMapContainer();//重置容器高宽
			const chartBox = document.getElementById('main');
			const chartBox1 = document.getElementById('main1');
			const chartBox2 = document.getElementById('main2');
			const chartBox3 = document.getElementById('main3');
			if(!chartBox) return
			if(winWidth<=1400){
				chartBox3.style.width='1000px'
				chartBox2.style.width='1000px'
			}else{

				chartBox3.style.width='100%'
				chartBox2.style.width='100%'
		
			}

			if(chartBox.offsetWidth<=600||winWidth<=1366){
				chartBox.style.height='500px'
				chartBox1.style.height='500px'
				// option.legend.y='bottom'
				// option.legend.x='center'
				// option.legend.orient='horizontal'
				// option.series[0].center = ['50%', '50%']


				
				//myChart.setOption(option);
			}else{
				chartBox.style.height='400px'
				chartBox1.style.height='400px'
				// option.legend.y='center'
				// option.legend.x='right'
				// option.legend.orient='vertical'
				// option.series[0].center = ['25%', '50%']
				

				// option1.legend.y='center'
				// option1.legend.x='right'
				// option1.legend.orient='vertical'
				// option1.series[0].center = ['25%', '50%']
				// option1.series[0].radius = ['50%', '70%']

			//	myChart.setOption(option);
				//myChart1.setOption(option1);
			}
			//console.log(chartBox.offsetWidth)
			myChart2.resize();
			myChart3.resize();
			myChart.resize();
			myChart1.resize();

	
	};
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