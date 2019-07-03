import React from 'react';
import { Layout, Input,Modal,Button,Select,Row, Col,DatePicker,Table } from 'antd';
import { connect } from 'dva';
import ReactDOM from 'react-dom';
import AnimationCount from 'react-count-animation';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './classChart.less';
import 'react-count-animation/dist/count.min.css';
import TopBar from '../topbar/topbar';
import store from 'store';
import {noResposeDataCon} from '../../../utils/common';
moment.locale('zh-cn');

const { Content,Header } = Layout;
const confirm = Modal.confirm;
const Option = Select.Option;
const Search = Input.Search;
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
			dateValue:['开始时间','结束时间'],
			date:[]
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
		let cid=this.state.cclassId;
		let sid=this.state.csubjectId;
		let data={
			schoolId:store.get('wrongBookNews').schoolId,
			periodTime:item.periodTime,
			timeStamp:item.timeStamp,
			classId:cid,
			subjectId:sid,
		};

		this.dispatch({
			type: 'reportChart/getClassDataReport',
			payload:data
		});

	}

	onChangeDate(startDate,endDate){
		if(this.state.classList1.data.length===0||this.state.subList.data.length===0) return
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
			let cid=this.state.cclassId
			let sid=this.state.csubjectId
			data={
				schoolId:store.get('wrongBookNews').schoolId,
				timeStamp:0,
				startTime:startDate,
				endTime:endDate,
				classId:cid,
				subjectId:sid,
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
			let cid=this.state.cclassId
			let sid=this.state.csubjectId
			data={
				schoolId:store.get('wrongBookNews').schoolId,
				classId:cid,
				subjectId:sid,
				periodTime:1,
				timeStamp:this.state.reportTimeList[0].timeStamp,
			}
		}
		this.dispatch({
			type: 'reportChart/getClassDataReport',
			payload:data
		});
	}
	getSub() {
		let subList =  this.props.state.subList.data;
		if(subList && subList.length> 0){
			return(
				<Select					
						style={{ width: 100}}
						placeholder="学科"
						value={this.props.state.csubjectId}
						onChange={(value)=>{
							this.props.dispatch({
								type: 'reportChart/csubjectId',
								payload:value
							});
							let cid=this.props.state.cclassId
							let sid=value
							let data={
								schoolId:store.get('wrongBookNews').schoolId,								
								classId:cid,
								subjectId:sid,
							}
							if(this.props.state.stateTimeIndex===100){
								data.startTime=this.props.state.startTime
								data.endTime=this.props.state.endTime
								data.timeStamp=0	
							}else{
								data.periodTime=this.props.state.periodTime
								data.timeStamp=this.props.state.timeStamp
							}
							this.props.dispatch({
								type: 'reportChart/getClassDataReport',
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
		if(classList && classList.length> 0){
			return(
				<Select					
						style={{ width: 140,marginRight:20}}
						placeholder="班级"
						value={this.props.state.cclassId}
						onChange={(value)=>{
							this.props.dispatch({
								type: 'reportChart/cclassId',
								payload:value
							});

							let cid=value
							let sid=this.props.state.csubjectId
							let data={
								schoolId:store.get('wrongBookNews').schoolId,								
								classId:cid,
								subjectId:sid,
							}
							if(this.props.state.stateTimeIndex===100){
								data.startTime=this.props.state.startTime
								data.endTime=this.props.state.endTime
								data.timeStamp=0	
							}else{
								data.periodTime=this.props.state.periodTime
								data.timeStamp=this.props.state.timeStamp
							}
							this.props.dispatch({
								type: 'reportChart/getClassDataReport',
								payload:data
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
	renderTeacherUserCount(){
		let data=this.props.state.classSearchData
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
        
			},
			{
        title: '视频讲解个数',
        dataIndex: 'videoExplain',
				key: 'videoExplain',
				defaultSortOrder: 'descend',
    		sorter: (a, b) => a.videoExplain - b.videoExplain,
        
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
			
		)}
		renderStudentUseData(data){
			let myChart = echarts.init(document.getElementById('main6'));
			const chartBox = document.getElementById('main6');
			let _barWidth='50%'

			if(data.length===0){
				chartBox.style.display='none'
				return
			}else{
				chartBox.style.display='block'
			}
			let nameList = []
			let numList = []
			if(data.length>10){
				_barWidth='20'
			}
			for (let index = 0; index < data.length; index++) {
				const element = data[index]
				nameList.push(element.name)	
				numList.push(element.num)	
			}
	
			
			let studentOption =  {
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
							
					},
					formatter:function(params){       
						var relVal = params[0].name;             
						for (var i = 0, l = params.length; i < l; i++) {                  
							relVal += '<br/>' +params[i].marker+ params[i].seriesName + ' : ' + params[i].value+"道";              
						}             
							return relVal;          
						} 
				},
		
				legend: {
						data:['错题量'],
						itemGap:16,
						selectedMode:false,
				},
				grid: {
					left: '2%',
					right: '2%',
					bottom: '1%',
					containLabel: true
				},
				xAxis: [
						{
								type: 'category',
								data: nameList,
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
											var maxLength = 4;
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
								show:false
						}
				],
				series: [
						{
								name:'错题量',
								type:'bar',
								symbol: 'circle',     
								barWidth:_barWidth,
								barMaxWidth:'40',
								symbolSize: 6,
								lineStyle:{color:'#21A2F4'},
								itemStyle:{color:"#21A2F4"},
								data:numList
						}
				]
				};
			let obj={
				chart:myChart,
				option:studentOption,
			}
			this.resizeChart(obj)
			myChart.setOption(studentOption)
			
		}
		renderClassUseData(udata,wdata){
			let timelist=[]
			let userlist=[]
			let wronglist=[]
			let cdate= moment(Date.now()).format('YYYY-MM-DD');
			let _axisLabelRotate=0
			
			for (let i = 0; i < udata.length; i++) {			
				const ele = udata[i]
				const itemtime = ele.time
				if(moment(cdate)>=moment(itemtime)){
					timelist.push(ele.time)
					userlist.push(ele.num)
					wronglist.push(wdata[i].num)
				}				
			}

			let _gleft='2%'
			if(timelist.length>20){
				_axisLabelRotate=40
				_gleft='2%'
			}
			let myChart1 = echarts.init(document.getElementById('main5'));		
			let option1 =  {
				title: {
						text: ''
				},
				tooltip: {
						trigger: 'axis',
						formatter:function(params){       
							var relVal = params[0].name;   
							let str=''          
							for (var i = 0, l = params.length; i < l; i++) {  
								
								if(params[i].seriesName==='错题量')   {
									str='道'
								}else{
									str='人'
								}             
								relVal += '<br/>' +params[i].marker+ params[i].seriesName + ' : ' + params[i].value+str;              
							}             
								return relVal;          
							} 
				},
				legend: {
					selectedMode:true,
					data:['错题量','人数'],
					itemGap:16,
				},
				grid: {
						left: _gleft,
						right: '2%',
						bottom: '1%',
						containLabel: true
				},
				xAxis: {
						type: 'category',
						boundaryGap: false,
						data: timelist,			
						axisTick:{
							show:false
						},
						axisLabel: {  
							interval:0,  
							rotate:_axisLabelRotate
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
								stack: '总量1',
								symbol: 'circle',
								symbolSize: 6,
								data:wronglist,
								lineStyle:{color:'#2FC25B'},
								itemStyle:{color:"#2FC25B"}
						},
						{
								name:'人数',
								type:'line',
								symbol: 'circle',
								symbolSize: 6,
								stack: '总量2',
								data:userlist,
								lineStyle:{color:'#21A2F4'},
								itemStyle:{color:"#21A2F4"}
								
						}
				],
				dataZoom: [
			],
			};
		
			let obj={
					chart:myChart1,
					option:option1
			}
			this.resizeChart(obj)
			myChart1.setOption(option1);
		}
	render() {
		
		let timeList=this.props.state.reportTimeList;

		let classReport=this.props.state.classDataReport;
		
		setTimeout(() => {		
			//if(this.props.state.subjectId===''){
				if(classReport.classUserNumData){
					this.renderClassUseData(classReport.classUserNumData,classReport.classWrongNumData)
				}
				if(classReport.studentWrongNum){
					this.renderStudentUseData(classReport.studentWrongNum)
				}
				
			//}
			
		}, 10);
		return(
			<Layout>
					<TopBar timeList={timeList} onChangeTime={this.onChangeTime} onChangeDate={this.onChangeDate}></TopBar>
					<Content style={{background:'#eee',overflow:'auto',position:'relative'}}>
					
						{classReport==='none'||JSON.stringify(classReport)==='{}'?this.nodata():<div>
						<Row style={{marginTop:20}}>
								<Col md={24}> 
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',	overflowX:'auto',overflowY:'hidden'}}>
											<div className={{}}>
												{this.getClassList()}
												{this.getSub()}
											</div>
											<div id='main5' style={{height:400}}>
											
											</div>
										</div>
								</Col>
							</Row>

							<Row style={{marginTop:20}}>
								<Col md={24}> 
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden'}}>
										<p>学生使用情况</p>
										<div id='main6' style={{height:400}} >
										
										</div>
										{classReport.studentWrongNum!==undefined&&classReport.studentWrongNum.length===0?
										<div  style={{height:400}}>{noResposeDataCon()}</div>:""}	

									</div>
								</Col>
							</Row>

							<Row style={{marginTop:20}}>
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

													if(value===''){
														this.props.dispatch({
															type: 'reportChart/classSearchData',
															payload:this.props.state.classDataReport.teacherUseDataList
														});
													}else{
														let arr=[]
														for (let i = 0; i < classReport.teacherUseDataList.length; i++) {
															const ele = classReport.teacherUseDataList[i];
															if(ele.adminName.indexOf(value)>-1){
																arr.push(ele)
															}
														}
														this.props.dispatch({
															type: 'reportChart/classSearchData',
															payload:arr
														});
													}

													this.renderTeacherUserCount()
												} 
													
												}
											/>
										</div>
										{classReport.teacherUseDataList?
											this.renderTeacherUserCount():''
										}
										</div>
								</Col>
							</Row>
						</div>}
							
					</Content>
			</Layout>
		);
	}
	nodata(){
		return(
			<div style={{textAlign:'center',position:'absolute',top:'40%',width:'100%',display:'flex',justifyContent:'center'}}>
					<img src={require('../../images/wsj-n.png')}></img>
					<span style={{fontSize:'20px',color:"#434e59",  height: 195,
					lineHeight: '195px',
					textAlign: 'left',
					paddingLeft: 20,
					fontWeight: 700,}}>
						暂无数据
					</span>
			</div>
		)
	}

	resizeChart(obj){
		window.addEventListener('resize',function(e){
			let winWidth=e.target.innerWidth
			const chartBox1 = document.getElementById('main5');
			const chartBox2 = document.getElementById('main6');
			if(!chartBox2||!chartBox1) return
			if(winWidth<=1400){
				chartBox1.style.width='1200px'
				chartBox2.style.width='1200px'
			}else{

				chartBox1.style.width='100%'
				chartBox2.style.width='100%'
			}			

			obj.chart.resize()
			 
	 },false);
	}
	componentWillUnmount(){
		this.props.dispatch({
			type: 'periodTime',
			payload: 1
		})
		window.removeEventListener('resize',function(e){
			 //卸载resize
	 },false);
	}
	componentDidMount(){
		const {dispatch} = this.props;
		dispatch({
			type: 'reportChart/getReportTimeList',
			payload:{
				classReport:true
			}
		});
		
		let winwidth=document.body.offsetWidth
		const chartBox1 = document.getElementById('main5');
		const chartBox2 = document.getElementById('main6');
		if(!chartBox1) return
		if(winwidth<=1400){
			chartBox1.style.width='1200px'
			chartBox2.style.width='1200px'
		}else{

			chartBox1.style.width='100%'
			chartBox2.style.width='100%'
		}		
	}
}

export default connect((state) => ({
	state: {
		...state.reportChart,
		...state.temp,
	}
}))(HomeworkCenter);