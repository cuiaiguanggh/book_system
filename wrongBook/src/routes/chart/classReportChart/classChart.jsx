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
			timeIndex:0,
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
		let cid=this.state.sclassId
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
        title: '视频讲解次数',
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
			let myChart = echarts.init(document.getElementById('main2'));
			let nameList = []
			let numList = []
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
								data: nameList,
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
								data:numList
						}
				]
				};
			let obj={
				chart:myChart,
				option:studentOption,
				id:2
			}
			//this.resizeChart(obj)
			myChart.setOption(studentOption)
			
		}
	render() {
		const {RangePicker} = DatePicker;
		
		let timeList=this.props.state.reportTimeList
		let subList =  this.props.state.subList ;
		let subName = this.props.state.subName;

		let classList = this.props.state.classList1
		let className = this.props.state.className;
		let classReport=this.props.state.classDataReport

		setTimeout(() => {		
			//if(this.props.state.subjectId===''){
				// if(classReport.gradeWrongNumMap){
				// 	this.renderQustionCount(classReport.gradeWrongNumMap)
				// }
				// if(classReport.gradeUseNumMap){
				// 	this.renderUserCount(classReport.gradeUseNumMap)
				// }
				if(classReport.studentWrongNum){
					this.renderStudentUseData(classReport.studentWrongNum)
				}
				// if(classReport.classUseData){
				// 	this.renderClassData(classReport.classUseData,classReport.classWrongData)
				// }
				
			//}
			
		}, 10);
	  console.error(subList,subName,classList)
		return(
			<Layout>
					<TopBar timeList={timeList} onChangeTime={this.onChangeTime} onChangeDate={this.onChangeDate}></TopBar>
					<Content style={{background:'#eee',overflow:'auto',position:'relative'}}>
							<Row style={{marginTop:20}}>
								<Col md={24}> 
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',	overflowX:'auto',overflowY:'hidden'}}>
											<div className={{}}>
												{this.getSub()}
												{this.getClassList()}
											</div>
											<div id='main1' style={{height:400}}>
											
											</div>
										</div>
								</Col>
							</Row>

							<Row style={{marginTop:20}}>
								<Col md={24}> 
									<div style={{margin:'0 20px',width:'calc( 100% - 40px )',padding:'20px',backgroundColor:'#fff',overflowX:'auto',overflowY:'hidden'}}>
										<p>学生使用情况</p>
										<div id='main2' style={{height:400}} >
										
										</div>


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
													//console.log(schoolReport.teacherUseDataList,value)
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
										<div id='main3' style={{height:400}} >
										
										</div>
										</div>
								</Col>
							</Row>
					</Content>
			</Layout>
		);
	}
	resizeChart(obj){

		window.addEventListener('resize',function(e){
			let winWidth=e.target.innerWidth
			// const chartBox = document.getElementById('main');
			// const chartBox1 = document.getElementById('main1');
			const chartBox2 = document.getElementById('main2');
			// const chartBox3 = document.getElementById('main3');
			//if(!chartBox) return
			if(winWidth<=1400){
				//chartBox3.style.width='1000px'
				chartBox2.style.width='1000px'
			}else{

				//chartBox3.style.width='100%'
				chartBox2.style.width='100%'
				if(obj.id>=2){
					obj.chart.resize()
				 }
			}

			

			 obj.chart.setOption(obj.option)
			 if(obj.id===0||obj.id===1){
				obj.chart.resize()
			 }
			 
	 },false);
	}
	componentDidMount(){
		let schoolId = store.get('wrongBookNews').schoolId

		const {dispatch} = this.props;
		dispatch({
			type: 'reportChart/getReportTimeList',
			payload:{
				classReport:true
			}
		});
		let myChart1 = echarts.init(document.getElementById('main1'));
		let myChart3 = echarts.init(document.getElementById('main3'));
		
		let option1 =  {
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
	

		myChart1.setOption(option1);
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