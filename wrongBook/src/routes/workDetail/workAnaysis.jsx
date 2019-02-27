import React from 'react';
import { Layout, Tabs, Input,Modal,Select,Table,Checkbox,Rate
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './workAnaysis.less';
import store from 'store';
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
import'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Option = Select.Option;
const { Content } = Layout;
const Search = Input.Search;
//作业中心界面内容


const operations = <div>Extra Action</div>;

class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			editingKey: '',
			visible: false,
			visible1:false,
			classId:''
	};
		this.columns = [
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				render: (text, record) => {
					return (
						<div className='space'  style={{cursor:'pointer'}}>
							{text+1}
						</div>
					);
				}
			},
			{
				title:'排序',
				dataIndex:'sort',
				key:'sort',
				width: '15%',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer'}}>
							{text+1}
						</div>
					);
				}
			},
			{
				title:'等级',
				dataIndex:'stars',
				key:'stars',
				width: '20%',
				render: (text, record) => {
					var s = text * 100;
					var scoreArea = [ 80, 60, 40, 20,0];
					let are = [1,2,3,4,5]
					let key = []; 

					for (var j=0; j<scoreArea.length; j++ ) {
						//是否优秀
						console.log(scoreArea[j],s)
						if( j == 0 ){
							if (s>=scoreArea[j]) {
								for(let i =0 ;i<are[j] ;i++){
									key = are[j]
								}
							}
						}else{
							if (s>=scoreArea[j] && s<scoreArea[j-1]) {
								key = are[j]
							}
						}
						
					}
					return (
						<div style={{cursor:'pointer'}}>
							<Rate value={key} />
						</div>
					);
				}
			},
			{
				title:'错误率',
				dataIndex:'wrong',
				key:'wrong',
				width: '15%',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer'}} onClick={()=>{
							store.set('wrong_hash', this.props.location.hash)
							this.props.dispatch(
								routerRedux.push({
									pathname: '/classInfo',
									hash:`sId=${this.props.state.schoolId}&id=${record.key}`
									})
							)
						}}>
							{(text * 100).toFixed(0)}%
						</div>
					);
				}
			},
			{
			title: '操作',
			dataIndex: 'operation',
			render: (text, record) => {
				return (
				<div>
					<span style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}} onClick={()=>{
						
					}}>习题详情</span>
				</div>
				);
			},
			},
		];
	}
	onChange = (activeKey) => {
    this.setState({ activeKey });
	}
	workData () {
		let testScoreInfo = this.props.state.scoreList;
		let QuestionDetail = this.props.state.QuestionDetail;
		let data = testScoreInfo.data;
		var worstScoret = (data.worst.score * 100).toFixed(0);
		
		return(
			<table border="1"  className='data-view-table'>
				<thead>
					<tr>
						<th>提交人数</th>
						<th>未提交人数</th>
						<th>平均错误率</th>
						<th>试题量</th>
						<th>做错题量</th>
					</tr>
				</thead>
			<tbody>
				<tr>
					<td>{data.commit}</td>
					<td>{data.total - data.commit}</td>
					<td>{(data.wrongAverage * 100).toFixed(0)}%</td>
					<td>{QuestionDetail.data.qsList.length}题</td>
					<td>{(QuestionDetail.data.qsList.length*data.wrongAverage ).toFixed(0)}题</td>
				</tr>
			</tbody>
			</table>
		)
	}
	DistributionGroup () {
		let This = this
		setTimeout(function() {
		let testScoreInfo = This.props.state.scoreList;
		let QuestionDetail = This.props.state.QuestionDetail;
			
		let data = testScoreInfo.data;

		var userScoreList = data.userScoreList;
		var scoreArea = [ 20, 40, 60, 100];
		var areaCount = [ 0, 0, 0, 0]
		for (var i=0; i<userScoreList.length; i++) {
			//学生的错误率
			var s = userScoreList[i].wrongScore * 100;

			for (var j=0; j<scoreArea.length; j++ ) {
				//是否优秀
				if( j == 0 ){
					if (s<=scoreArea[j]) {
						areaCount[j] = areaCount[j] + 1;
					}
				}else{

					if (s<=scoreArea[j] && s>scoreArea[j-1]) {
						areaCount[j] = areaCount[j] + 1;
						break;
					}
				}
				// else{
				// 	if (s<=scoreArea[j] && s>scoreArea[j-1]) {
				// 		areaCount[j] = areaCount[j] + 1;
				// 		break;
				// 	}
				// }
			}
		}
		areaCount.push(data.total - data.commit)
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('main'));
		// 绘制图表
		let option = {
			tooltip : {
				trigger: 'axis',
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis : [
				{
						type : 'category',
						name:'正确率',
　　　　　　　　//这是设置的false，就不不显示下方的x轴，默认是true的
						data : ['(<20%)优秀', '(20%<39%)良好', '(40%<59%)良好', '(60%<100%)良好', '(-)未提交'],
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
							interval: data.total/4,
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
														'#88ca53','#ffc650','#52b0f8','#ff7f69','#728ba3'
													];
													return colorList[params.dataIndex]
											},
											barBorderRadius: [100,100,100,100]
											,
　　　　　　　　　　　　　　//以下为是否显示，显示位置和显示格式的设置了
											label: {
													show: true,
													position: [30,-20,0,0],
													formatter: '{c}'
													// formatter: '{b}\n{c}'
											}
									}
							},
							//设置柱的宽度，要是数据太少，柱子太宽不美观~
							barWidth:22,
							data: areaCount
					}
			]
			};


			myChart.setOption(option);
		},1)
		
	}

	render() {
		let state = this.props.state;
		let testScoreInfo = state.scoreList;
		let QuestionDetail = state.QuestionDetail;
		let dataSource =[];
		if(testScoreInfo.data){
				for(let i = 0;i < testScoreInfo.data.userScoreList.length; i ++){
					let p = {};
					let det = testScoreInfo.data.userScoreList[i];
					p["key"] = det.userId;
					p["name"] = det.userName;
					p["sort"] = i;
					p["stars"] = det.wrongScore;
					p["wrong"] = det.wrongScore;
					p["list"] = det;
					dataSource[i]=p;
				}
		}
		return (
				<div className={style.borderOut} >
						<div className={style.borderInner}>
							<h3>数据概况</h3>
								{testScoreInfo.data && QuestionDetail.data ? this.workData():''}
						</div>
						<div className={style.borderInner}>
							<h3>错误率人数分布</h3>
							<div id ="main" className='temainst' style={{ width: '100%', height: 400 }}></div>
							{testScoreInfo.data && QuestionDetail.data ? this.DistributionGroup():''}
						</div>
						<div className={style.borderInner}>
							<div style={{height:50,lineHeight:'50px'}}>
								<h3 style={{display:'inline-block',marginRight:22}}>成绩单</h3>
								<span>等级说明：1星＞80%   2星80%-60%   3星59%-40%    4星39-20%   5星＜20% </span>

								<Checkbox
									style={{float:'right'}}
									onChange={(e) =>{
									console.log(e.target.checked)
								}}>未提交学生</Checkbox>
								<Search
									placeholder="输入学生名称"
									onSearch={value => console.log(value)}
									style={{ width: 200,float:'right',lineHeight:'50px' }}
								/>
							</div>
							
							<Table
								bordered
								dataSource={dataSource}
								columns={this.columns}
								rowClassName="editable-row"
							/>
						</div>
				</div>
		);
	  }

	componentDidMount(){
	}
}

export default connect((state) => ({
	state: {
		...state.temp,
	}
}))(HomeworkCenter);