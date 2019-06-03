
import React from 'react';
import { Layout, Input,Modal,Button,Select,Row, Col,DatePicker, AutoComplete,Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './schoolChart.less';
import TopBar from '../topbar/topbar'
import store from 'store';
import echarts  from 'echarts';
moment.locale('zh-cn');

const { Content } = Layout;
const Option = Select.Option;
const Search = Input.Search;

//作业中心界面内容
class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			subjectId:100,
			timeIndex:0,
			date:[],
			myChart:{},
			sbid:0,
			cid:0,
			searchData:[]
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
		let cid=this.state.sclassList[0].id
		let sid=this.state.ssubList[0].id
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
		//console.log(startDate,endDate)
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
			let cid=this.state.sclassList[0].id
		  let sid=this.state.ssubList[0].id
			data={
				schoolId:store.get('wrongBookNews').schoolId,
				classId:cid,
				subjectId:sid,
				timeStamp:0,
				startTime:startDate,
				endTime:endDate,
			}
		}else{
			this.dispatch({
				type: 'reportChart/periodTime',
				payload:1
			});
			this.dispatch({
				type: 'reportChart/timeStamp',
				payload:this.state.reportTimeList[0].timeStamp
			});
			data={
				schoolId:store.get('wrongBookNews').schoolId,
				classId:this.state.sclassId,
				subjectId:this.state.subjectId,
				periodTime:0,
				timeStamp:this.state.reportTimeList[0].timeStamp,
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
			if(i===0){
				scolor='#21A2F4'
			}else if(i===1){
				scolor='#B8A5DF'
			}else if(i===2){
				scolor='#36C9CB'
			}else if(i===3){
				scolor='#FBD437'
			}else if(i===4){
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
							name:'错题量',
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
		let obj={
			chart:myChart1,
			option:option,
			id:0
		}
		this.resizeChart(obj)
		myChart1.setOption(option);
		myChart1.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
	}

	renderUserCount(data){
		let myChart = echarts.init(document.getElementById('main1'));
		var arr = Object.getOwnPropertyNames(data)
		var arr1=arr.map(function(i){return data[i]})
		let sdata=[]
		for(let i=0;i<arr.length;i++){
			let scolor=''
			if(i===0){
				scolor='#21A2F4'
			}else if(i===1){
				scolor='#B8A5DF'
			}else if(i===2){
				scolor='#36C9CB'
			}else if(i===3){
				scolor='#FBD437'
			}else if(i===4){
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
							name:'使用人数',
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
		let obj={
			chart:myChart,
			option:option,
			id:1
		}
		this.resizeChart(obj)
		let index=0
		myChart.setOption(option);
		myChart.dispatchAction({        
			type: "highlight",        
			seriesIndex: index,        
			dataIndex: index      
		});      
		myChart.on("mouseover", function(e) {        
			if (e.dataIndex != index) {         
				 myChart.dispatchAction({            
					 type: "downplay",            
					 seriesIndex: 0,            
					 dataIndex: index          
					});        }      
			});      
				// myChart.on("mouseout", function(e) {        
				// 	index = e.dataIndex;        
				// 	myChart.dispatchAction({          
				// 		type: "highlight",          
				// 		seriesIndex: 0,          
				// 		dataIndex: e.dataIndex        
				// 	});      
				// });

	//	myChart.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0})
	}
	renderTeacherUserCount(){
	
		// let data=[]
		// if(type===1){
		// 	data=this.state.searchData
		// }else{
		// 	data=this.props.state.schoolDataReport.teacherUseDataList
		// }
		let data=this.props.state.searchData
		//console.error('00',this.props,this.props.state.searchData)
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
        title: '学科',
        dataIndex: 'subjectName',
        key: 'subjectName',
        
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
			<div className={style.cagtable}>
					<Table  bordered columns={columns}  dataSource={data} pagination={false} />
			</div>
			
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
							},
							axisLabel: {  
								interval: 0,  
								formatter:function(value)  
								{  
										// debugger  
										var ret = "";
										var maxLength = 6;
										var valLength = value.length; 
										var rowN = Math.ceil(valLength / maxLength); 
										if (rowN > 1)
										{  
												for (var i = 0; i < rowN; i++) {  
														var temp = ""; 
														var start = i * maxLength;
														var end = start + maxLength;
														temp = value.substring(start, end) + "\n";  
														ret += temp; 
												}  
												return ret;  
										}  
										else {  
												return value;  
										}  
								}  
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
					}
			],
			series: [
					{
							name:'错题量',
							type:'bar',
							symbol: 'circle',
							barWidth:'30%',
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
			let obj={
				chart:myChart,
				option:option3,
				id:2
			}
			this.resizeChart(obj)
			myChart.setOption(option3)
			myChart.resize()
	}

	renderClassData0(udata,wdata){
		let cdate= moment(Date.now()).format('YYYY-MM-DD');
		let myChart = echarts.init(document.getElementById('main2'));
		var dList = Object.getOwnPropertyNames(udata)

		let dateArr=[]
		for (let index = 0; index < dList.length; index++) {
			const element = dList[index]
			if(moment(cdate)>=moment(element)){
				dateArr.push(element)
			}			
		}

		let dateList=dateArr
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
					},
				// 	axisLabel: {  
				// 		interval:0,  
				// 		rotate:50  
				//  }  
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
							stack: '总量1',
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
							stack: '总量2',
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
		let obj={
			chart:myChart,
			option:option2,
			id:2
		}
		this.resizeChart(obj)
		myChart.setOption(option2)
		
	}
	getSub() {
		let subList =  this.props.state.ssubList;
		if(subList && subList.length> 0){
			return(
				<Select					
						style={{ width: 100,marginLeft:20}}
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
								classId:this.props.state.sclassId,
								subjectId:this.props.state.subjectId,
								periodTime:this.props.state.periodTime,
								timeStamp:this.props.state.timeStamp,
							}		
							this.props.dispatch({
								type: 'reportChart/changeSubList',
								payload:data
							});

						}}
						
				>
					{
						subList.map((item,i) =>(
							<Option key={i} value={item.id}>{item.name}</Option>
						))
					}
			</Select>
			)
		}else{

		}
	} 
	getClassList() {
		let classList =  this.props.state.sclassList;
		if(classList && classList.length> 0){
			return(
				<Select					
						style={{ width: 140,marginLeft:20}}
						placeholder="班级"
						value={this.props.state.sclassId}
						onChange={(value)=>{
							this.props.dispatch({
								type: 'reportChart/sclassId',
								payload:value
							});

							let data={
								schoolId:store.get('wrongBookNews').schoolId,
								classId:value,
								periodTime:this.props.state.periodTime,
								timeStamp:this.props.state.timeStamp,
							}		
							this.props.dispatch({
								type: 'reportChart/getSubList',
								payload:data
							});
						}}
						
				>
					{
						classList.map((item,i) =>(
							<Option key={i} value={item.id}>{item.name}</Option>
						))
					}
			</Select>
			)
		}else{

		}
	} 
	getGradeList() {
		let gradeList =  this.props.state.sgradeList;
		if(gradeList && gradeList.length> 0){
			return(
				<Select					
						style={{ width: 100}}
						placeholder="年级"
						value={this.props.state.gradeId}
						onChange={(value)=>{
							this.props.dispatch({
								type: 'reportChart/gradeId',
								payload:value
							});
							let data={
								schoolId:store.get('wrongBookNews').schoolId,
								classId:this.props.state.sclassId,
								subjectId:this.props.state.subjectId,
								periodTime:this.props.state.periodTime,
								timeStamp:this.props.state.timeStamp,
								gradeId:value
							}	
							this.props.dispatch({
								type: 'reportChart/getClassList',
								payload:data
							});
							
						}}
						
				>
					{
						gradeList.map((item,i) =>(
							<Option key={i} value={item.id}>{item.name}</Option>
						))
					}
			</Select>
			)
		}else{

		}
	} 
	nodata(){
		return(
			<div style={{textAlign:'center',position:'absolute',top:'40%',width:'100%',display:'flex',justifyContent:'center'}}>
					<img src={require('../../images/wsj-n.png')}></img>
					<span style={{fontSize:'20px',color:"#434e59",  height: 195,
					paddingTop: 50,
					lineHeight: '40px',
					textAlign: 'left',
					paddingLeft: 20,
					fontWeight: 700,}}>
						暂无学生错题数据，无法查看数据报表
						<br></br>
						请让老师和家长督促学生收集错题
					</span>
			</div>
		)
	}
	render() {

		let timeList=this.props.state.reportTimeList
		let schoolReport=this.props.state.schoolDataReport
		
		setTimeout(() => {		
			if(this.props.state.subjectId!==''){
				if(schoolReport.gradeWrongNumMap){
					this.renderQustionCount(schoolReport.gradeWrongNumMap)
				}
				if(schoolReport.gradeUseNumMap){
					this.renderUserCount(schoolReport.gradeUseNumMap)
				}
				if(schoolReport.schoolUserNumData){
					this.renderClassData0(schoolReport.schoolUserNumData,schoolReport.schoolWrongNumData)
				}
				if(schoolReport.classUseData){
					this.renderClassData(schoolReport.classUseData,schoolReport.classWrongData)
				}
				
			}
			
		}, 10);
	  //console.error('报告',schoolReport,schoolReport.gradeWrongNumMap)
		return(
			<Layout>
				<TopBar timeList={timeList} onChangeTime={this.onChangeTime} onChangeDate={this.onChangeDate}></TopBar>
				<Content style={{background:'#eee',overflow:'auto',position:'relative'}}>
							{this.props.state.subjectId!==''&&schoolReport.length==0?this.nodata():
							<div>
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
										{this.getGradeList()}
										{this.getClassList()}
										{this.getSub()}
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
										<div className={style.searchInput}>
										<p>教师使用情况</p>
										<Search
												placeholder="请输入教师姓名"
												enterButton="搜索"
												size="large"
												style={{width:240,position:'absolute',right:0,top:0}}
												onSearch={value =>{
													//console.log(schoolReport.teacherUseDataList,value)
													if(value===''){
														this.props.dispatch({
															type: 'reportChart/searchData',
															payload:this.props.state.schoolDataReport.teacherUseDataList
														});
													}else{
														let arr=[]
														for (let i = 0; i < schoolReport.teacherUseDataList.length; i++) {
															const ele = schoolReport.teacherUseDataList[i];
															if(ele.adminName.indexOf(value)>-1){
																arr.push(ele)
															}
														}
														this.props.dispatch({
															type: 'reportChart/searchData',
															payload:arr
														});
													}

													this.renderTeacherUserCount()
												} 
													
												}
											/>
										</div>
										{schoolReport.teacherUseDataList?
											this.renderTeacherUserCount():''
										}
									</div>
								</Col>
							</Row>
							</div>
						}	
							
						
					</Content>
			</Layout>

			
		);
	}
	resizeChart(obj){

		window.addEventListener('resize',function(e){
			let winWidth=e.target.innerWidth
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
				if(obj.id>=2){
					obj.chart.resize()
				 }
			}

			if(chartBox.offsetWidth<=600||winWidth<=1366){
				if(obj.id===0||obj.id===1){
					chartBox.style.height='500px'
					chartBox1.style.height='500px'
					obj.option.legend.y='bottom'
					obj.option.legend.x='center'
					obj.option.legend.orient='horizontal'
					obj.option.series[0].center = ['50%', '50%']
				}
				
				if(obj.id===1){
					obj.option.series[0].radius = ['40%', '55%']
				}
			}else{
				if(obj.id===0||obj.id===1){
					chartBox.style.height='400px'
					chartBox1.style.height='400px'
					obj.option.legend.y='center'
					obj.option.legend.x='right'
					obj.option.legend.orient='vertical'
					obj.option.series[0].center = ['25%', '50%']
				}
				
				if(obj.id===1){
					obj.option.series[0].radius = ['50%', '65%']
				}
			}

			 obj.chart.setOption(obj.option)
			 if(obj.id===0||obj.id===1){
				obj.chart.resize()
			 }
			 
	 },false);
	}
	componentWillUnmount(){
		this.props.dispatch({
			type: 'reportChart/subjectId',
			payload:'',
		});
		window.removeEventListener('resize',function(e){
			 //卸载resize
	 },false);
	}
	componentDidMount(){
	
		const {dispatch} = this.props;
		dispatch({
			type: 'reportChart/getReportTimeList',
			payload:{
				classReport:false
			}
		});

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