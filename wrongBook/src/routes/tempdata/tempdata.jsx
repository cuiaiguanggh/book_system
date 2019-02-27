import React from 'react';
import { Layout, Table, Input,message,  InputNumber, Pagination, Form,Rate ,Modal,Select
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
import style from './tempdata.less';
import store from 'store';
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
import'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const confirm = Modal.confirm;
const Option = Select.Option;
const { Content } = Layout;
const Search = Input.Search;
//错题报告
function judgeLevel(score, area, name) {
	for (var i=0; i<area.length; i++) {
		if (score<area[i]) {
			return i;
		}
	}
	return name.length-1;
}

function doSomething(id, value) {
  var inputId = 'input' + id;
  if (value=='') {
	  document.getElementById(inputId).className = 'mizhu_filler_e'; 
  } else {
	  document.getElementById(inputId).className = 'mizhu_filler_f'; 
  }
}
class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			editingKey: '',
			visible: false,
			visible1:false,
			schoolId:'',
	};
	}
	workData() {
		let testScoreInfo = this.props.state.scoreList;
		let QuestionDetail = this.props.state.QuestionDetail;
			
			let data = testScoreInfo.data;

			var bestScoret = (data.best.score * 100).toFixed(0);
			var worstScoret = (data.worst.score * 100).toFixed(0);
			var averageScoret = (data.average * 100).toFixed(2);

			var userScoreList = data.userScoreList;
			var scoreArea = [0, 40, 50, 60, 70, 80, 90, 100];
			var areaCount = [0, 0, 0, 0, 0, 0, 0]
			for (var i=0; i<userScoreList.length; i++) {
				var s = userScoreList[i].score * 100;
				for (var j=1; j<scoreArea.length; j++ ) {
					if (s>=scoreArea[scoreArea.length-1]) {
						areaCount[areaCount.length-1] = areaCount[areaCount.length-1] + 1;
						break;
					}
					if (s<scoreArea[j]) {
						areaCount[j-1] = areaCount[j-1] + 1;
						break;
					}
				}
			}
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));
			// 绘制图表
			let option = {
				// color: ['#3398DB'],
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				// xAxis : [
				// 	{
				// 		type : 'category',
				// 		data : ['0~39', '40~49', '50~59', '60~69', '70~79', '80~89', '90~100'],
				// 		axisTick: {
				// 			alignWithLabel: true
				// 		}
				// 	}
				// ],
				// yAxis : [
				// 	{
				// 		type : 'value'
				// 	}
				// ],
				// series : [
				// 	{
				// 		name:'人数',
				// 		type:'bar',
				// 		barWidth: '60%',
				// 		data:areaCount
				// 	}
				// ]
				xAxis : [
					{
							type : 'category',
							name:'正确率',
　　　　　　　　//这是设置的false，就不不显示下方的x轴，默认是true的
							data : ['90~100', '40~49', '50~59', '60~69', '70~79', '80~89', '90~100'],
							axisLabel: {
　　　　　　　　　　　　　//这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
//                     rotate: 30,
　　　　　　　　　　　　//这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
									interval :0
									}
					}
			],
			yAxis : [
					{
							type : 'value',
							name:'人数',
　　　　　　　　　　//下面的就很简单了，最小是多少，最大是多少，默认一次增加多少
							interval: 6,
　　　　　　　　　　//下面是显示格式化，一般来说还是用的上的
							axisLabel: {
									formatter: '{value} '
							}
				}
			],
			series : [
					{
							name: '数量',
							type: 'bar',
							itemStyle: {
									normal: {
　　　　　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
											color: function(params) {
													// build a color map as your need.
													var colorList = [
														'#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
														 '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
														 '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
													];
													return colorList[params.dataIndex]
											},
											borderRadius:function(){
												return '100%'
											},
　　　　　　　　　　　　　　//以下为是否显示，显示位置和显示格式的设置了
											label: {
													// show: true,
													// position: 'top',
													formatter: '{c}'
													// formatter: '{b}\n{c}'
											}
									}
							},
							//设置柱的宽度，要是数据太少，柱子太宽不美观~
							barWidth:30,
							data: areaCount
					}
			]
			};


			myChart.setOption(option);

			var qsList = QuestionDetail.data.qsList;
			var ksList = QuestionDetail.data.ksList;
			var dataShadow = [];
			var dataZoom = [] ;
			// var $qastr = $("#question-avg-score tr:last");
			// var qashtml = "";
			var questionSeq = [];
			var questionScoreArray = [];
			for (var i=0; i<qsList.length; i++) {
				questionSeq.push((i+1));
				questionScoreArray.push((qsList[i].score * 100).toFixed(2));
			// 	qashtml += "<tr><td>" + (i+1) + "</td><td>" + (qsList[i].score*100) + "</td></tr>";
			}
			// $qastr.after(qashtml);
			var yMax = 100;
			var dataShadow = [];
			var dataZoom = [] ;
			if (qsList.length>30) {
				dataZoom = [{
					type: 'slider',
					show: true, //flase直接隐藏图形
					xAxisIndex: [0],
					left: '9%', //滚动条靠左侧的百分比
					bottom: -5,
					start: 0,//滚动条的起始位置
					end: 50 //滚动条的截止位置（按比例分割你的柱状图x轴长度）
				}]
			}
			for (var i = 0; i < questionScoreArray.length; i++) {
			dataShadow.push(yMax);
			}
			// var quscore = echarts.init(document.getElementById('quscore'));
			
			// let option1 = {
			// 	color: ['#a5d6a7'],
			// 	tooltip : {
			// 			trigger: 'axis',
			// 			axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			// 					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			// 			}
			// 	},
			// 	grid: {
			// 		top:"10px",
			// 			left:"50px",
			// 			right:"15px",
			// 			bottom:"50px",
			// 		containLabel: true
			// 	},
			// 	xAxis : [
			// 			{
			// 					type : 'category',
			// 					data : questionSeq,
			// 					axisTick: {
			// 							alignWithLabel: true
			// 					}
			// 			}
			// 	],
			// 	yAxis : [
			// 			{
			// 					type : 'value'
			// 			}
			// 	],
			//  	dataZoom: dataZoom , 
			// 	series : [
			// 			{
			// 					name:'平均分',
			// 					type:'bar',
			// 				barMaxWidth: '100',
			// 				barGap:'100%',
			// 				barCategoryGap: '30%',
			// 					data:questionScoreArray
			// 			}
			// 	]
			// };
			// quscore.setOption(option1);
			
			return(
				<tr>
					<td>{data.commit}</td>
					<td>{(data.average * 100).toFixed(0)}%</td>
					<td>{(data.commit/data.total * 100).toFixed(0)}%</td>
					<td>{bestScoret}%</td>
					<td>{worstScoret}%</td>
				</tr>
			)
	}
	levelList(){
		let testScoreInfo = this.props.state.scoreList.data;
		var userScoreList = testScoreInfo.userScoreList;
		var levelArea = [45, 60, 80, 100];
		var levelName = ["危险", "较差", "及格", "优秀"];
		var levelClass = ["level-d", "level-c", "level-b", "level-a"];

		var levelSizeMap = new Map();
		for (var i=0; i<userScoreList.length; i++) {
			var score = userScoreList[i].score*100;
			var level = judgeLevel(score, levelArea, levelName);
			if (levelSizeMap[level]==null) {
				levelSizeMap[level] = 1;
			} else {
				levelSizeMap[level] = levelSizeMap[level] + 1;
			}
		}
		let ul = []
		var lastLevel = -1
		var lastRank = -1;
		var lastScore = -1;
		return(
			<table border="1"  className='data-view-table1'>
			<thead>
				<tr>
					<th style={{width: '15%'}}>层级</th>
					<th>姓名</th>
					<th>班级排名</th>
					<th>正确率</th>
				</tr>
			</thead>
			<tbody>
				{
					userScoreList.map((item,i)=>{
						var score = (item.score*100).toFixed(0);
						var level = judgeLevel(score, levelArea, levelName);
						var rank = (i+1);
						if (score==lastScore) {
							rank = lastRank;
						}
						if (level!=lastLevel) {
							lastLevel = level;
							return(
								<tr key={i}>
									<td className={levelClass[level]} rowSpan={levelSizeMap[level]}>{levelName[level]}</td>
									<td>{item.userName}</td>
									<td>{rank}</td>
									<td>{score}</td>
								</tr>
							)
						} else {
							lastRank = rank;
							lastScore = score;
							return(
								<tr key={i}>
									<td>{item.userName}</td>
									<td>{rank}</td>
									<td>{score}</td>
								</tr>
							)
						}
					})
				}
			</tbody>
			</table>
		)
	}
	commitDes(){
			let testScoreInfo = this.props.state.scoreList.data;
			var bestScoret = (testScoreInfo.best.score * 100).toFixed(0);
			var worstScoret = (testScoreInfo.worst.score * 100).toFixed(0);
			var averageScoret = (testScoreInfo.average * 100).toFixed(2);

			

			return (
				<div className="commit-des">共{testScoreInfo.total}人; {testScoreInfo.total-testScoreInfo.commit}人未交; 最高分{bestScoret}, 最低分{worstScoret},平均分{averageScoret};</div>
			)
	}
	questionResult(){
		let testScoreInfo = this.props.state.scoreList;
		let QuestionDetail = this.props.state.QuestionDetail;
		var qsList = QuestionDetail.data.qsList;

		return(
			<div>
			<tr>
				<th class='name-column'>姓名</th>
				{
					qsList.map((item,i)=> {
						return(
							<th key={i} className='data-column'>{i+1}</th>
						)
					})
				}
			</tr>
			<tr>	
				{/* 姓名 */}
				{
					qsList[0].userAnswerList.map((item,i)=> (
							qsList.map((item,j) =>{
								if(j === 0){
									return(
										<td>{item.userAnswerList[i].userName}</td>
									)
								}
							})
					))
				}
				{
					qsList[0].userAnswerList.map((item,i)=> (
							qsList.map((item,j) =>{
								if(item.userAnswerList[i].result == 0){
									return(
											<td>
												<div class='wrong-result'></div>
											</td>
									)
								}else{
									return(
										<td>
											<div class='right-result'></div>
										</td>
									)
								}
							})
					))
				}
			</tr>
			
			</div>
		)
	}
	render() {
		let testScoreInfo = this.props.state.scoreList;
		let QuestionDetail = this.props.state.QuestionDetail;
		
		let data = []
		return (
			<div className={style.gradeboder} >
				<div className={style.button_div}>整体概览</div>
				<table border="1"  className='data-view-table'>
				<thead>
					<tr>
						<th>提交量</th>
						<th>正确率</th>
						<th>作业提交率</th>
						<th>最高正确率</th>
						<th>最低正确率</th>
					</tr>
				</thead>
				<tbody>
					{testScoreInfo.data && QuestionDetail.data ? this.workData():''}
				</tbody>
				</table>
				<div className={style.button_div}>成绩人数分布</div>
				
				<div id ="main" className='temainst' style={{ width: '100%', height: 400 }}></div>
				{/* <div className={style.button_div}>班级成绩排行</div>
				{testScoreInfo.data ?this.levelList():''}
				<div className={style.button_div}>作业统计 (正确)</div>
				{testScoreInfo.data && QuestionDetail.data ? this.commitDes():''}
				<div id="quscore"  className='temainst' style={{ width: '100%', height: 400 }}></div>
				<div className='qi-title-div'>答题详情 ( 正确 
					<div className='right-rect'></div>
				   错误  <div className='wrong-rect'></div> 
					 未提交 <div className='unfinish-rect'></div> 
					 )
				</div>
				<div style={{width:'100%', overflow:"auto"}}>
				<table border="1"  className='data-view-table'>
					<tbody>
						{testScoreInfo.data && QuestionDetail.data ? this.questionResult():''}
					</tbody>
				</table>
				</div> */}
			</div>

		);
	  }

	componentDidMount(){
		
        const {dispatch} = this.props;
		let hash = this.props.location.hash;
        let ids = hash.substr(hash.indexOf("sId=")+4);
        let id = ids.split('&id=');
        let data = {
            homeworkId:id[1],
        }
        dispatch({
            type: 'temp/queryScoreDetail',
            payload:data
        });
        dispatch({
            type: 'temp/queryQuestionDetail',
            payload:data
        });
	}
}

export default connect((state) => ({
	state: {
		...state.temp,
	}
}))(HomeworkCenter);