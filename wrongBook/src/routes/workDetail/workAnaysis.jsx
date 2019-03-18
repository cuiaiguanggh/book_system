import React from 'react';
import { Layout, Tabs, Input,Modal,Select,Table,Checkbox,Rate, message,Icon
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
			classId:'',
			checked:false,
			key:0
	};
		this.columns = [
			{
				title:'排序',
				dataIndex:'sort',
				key:'sort',
				width: '15%',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer'}}>
							{text+1 }
						</div>
					);
				}
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				render: (text, record) => {
					return (
						<div className='space'  style={{cursor:'pointer'}}>
							{text}
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
					let key = ''; 
					if(!this.state.checked){
						var s = text * 100;
					var scoreArea = [ 80, 60, 40, 20,0];
					let are = [1,2,3,4,5]
					for (var j=0; j<scoreArea.length; j++ ) {
						//是否优秀
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
					}else{
						return (
							<div style={{cursor:'pointer'}}>
							</div>
						);
					}
					
				}
			},
			{
				title:'错题量',
				dataIndex:'wrongNum',
				key:'wrongNum',
				width: '15%',
				render: (text, record) => {
					if(!this.state.checked){
						let num = text.split('/')
						return (
							<div style={{cursor:'pointer'}} >
								{!this.state.checked ?`${num[1]-num[0]}题`:''}
							</div>
						);
					}else{
						return (
							<div style={{cursor:'pointer'}}>
							</div>
						)
					}
				}
			},
			{
				title:'错误率',
				dataIndex:'wrong',
				key:'wrong',
				width: '15%',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer'}} >
							{!this.state.checked ?`${(text * 100).toFixed(0)}%`:''}
						</div>
					);
				}
			},
			{
			title: '操作',
			dataIndex: 'operation',
			render: (text, record) => {
				if(!this.state.checked){
					return (
					<div>
						<span style={{color:'#1890ff',cursor:'pointer',margin:'0 10px'}} onClick={()=>{
							message.warning('此功能暂未开放');
							// this.setState({visible:true})
							// let hash = `workId=${this.props.state.workId}&stId=${record.key}`
							// this.props.dispatch(
							// 	routerRedux.push({
							// 		pathname: '/studentDetail',
							// 		hash:hash
							// 		})
							// )
						}}>习题详情</span>
					</div>
					);
				}else{
					return(
						<div></div>
					)
				}
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
		var worstScoret = 0
		let Num = []
		let wost = 0;
		if(data.worst != null){
			worstScoret = (data.worst.score * 100).toFixed(0);
			Num = data.worst.count.split('/')
			wost = Num[1]-Num[0]
		}
		let key = 0;
		for(let i =0;i<data.userScoreList.length;i++){
			key = data.userScoreList[i].wrongScore+key
		}
	
		return(
			<div>
				<div className={style.dataView3}>
					<span>
						提交人数
					</span>
					<div style={{textAlign:'center'}}>
						<span style={{fontSize:'60px',color:'#1daef8'}}>{data.commit}/</span>
						<span style={{fontSize:'30px',color:'#1daef8'}}>{data.total}人</span>
					</div>
				</div>
				<div className={style.dataView3} style={{borderLeft:"1px solid #ccc",borderRight:'1px solid #ccc'}}>
				<span>平均错误率</span>
					<div style={{textAlign:'center'}}>
						<span style={{fontSize:'60px',color:'#2bdec6'}}>{(key/data.userScoreList.length * 100).toFixed(0)}%</span>
					</div>
				</div>
				<div className={style.dataView3}>
				<span>错题量</span>
					<div style={{textAlign:'center'}}>
						<span style={{fontSize:'60px',color:'#ffbf00'}}>{wost}/</span>
						<span style={{fontSize:'30px',color:'#ffbf00'}}>{QuestionDetail.data.qsList.length}题</span>
					</div>
				</div>
				{/* <div>平均错误率</div> */}
			</div>
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
                    // rotate: 30,
　　　　　　　　　　　　//这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
								interval :0
								}
				}
			],
			yAxis : [
					{
							type : 'value',
							name:'人数',
							// interval: data.total/4,
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
											barBorderRadius: [200,200,200,200]
											,
　　　　　　　　　　　　　　//以下为是否显示，显示位置和显示格式的设置了
											label: {
													show: true,
													position: 'top',
													formatter: '{c}'
													// formatter: '{b}\n{c}'
											}
									}
							},
							//设置柱的宽度，要是数据太少，柱子太宽不美观~
							barWidth:40,
							data: areaCount
					}
			]
			};


			myChart.setOption(option);
		},1)
		
	}
	workDetail() {
		let testScoreInfo = this.props.state.scoreList;

	}
	render() {
		let state = this.props.state;
		let testScoreInfo = state.scoreList;
		let QuestionDetail = state.QuestionDetail;
		let dataSource =[];
		if(testScoreInfo.data){
			if(this.state.checked){
				for(let i = 0;i < testScoreInfo.data.undoneList.length; i ++){
					let p = {};
					let det = testScoreInfo.data.undoneList[i];
					p["key"] = i;
					p["sort"] = i;
					p["name"] = det;
					dataSource[i]=p;
				}
			}else{
				for(let i = 0;i < testScoreInfo.data.userScoreList.length; i ++){
					let p = {};
					let det = testScoreInfo.data.userScoreList[i];
					p["key"] = det.userId;
					p["name"] = det.userName;
					p["sort"] = i;
					p['wrongNum'] = det.count;
					p["stars"] = det.wrongScore*1;
					p["wrong"] = det.wrongScore*1;
					p["list"] = det;
					dataSource[i]=p;
				}
			}
				
		}
		let key = this.state.key;
		
		let MaxKey = testScoreInfo.data ? testScoreInfo.data.userScoreList.length:0;
		return (
				<div className={style.borderOut} >
						<div className={style.borderInner}>
							<h3>整体概览</h3>
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
									checked={this.state.checked}
									onChange={(e) =>{
										this.setState({checked:e.target.checked})
								}}>未提交学生</Checkbox>
								{/* <Search
									placeholder="输入学生名称"
									onSearch={value => console.log(value)}
									style={{ width: 200,float:'right',lineHeight:'50px' }}
								/> */}
							</div>
							<Modal
                    visible={this.state.visible}
                    width='1000px'
                    className="showques"
                    footer={null}
                    onOk={()=>{
                        this.setState({visible:false})
                    }}
                    onCancel={()=>{
                        this.setState({visible:false})
                    }}
                >
										{testScoreInfo.data?this.workDetail() : ''}
                    <Icon 
                        className={style.icLeft}
                        onClick={()=>{
                            if(key == 0){
                                message.warning('已是第一题')
                            }else{

                            }
                        }}
                        type="left" />
                    <Icon
                        className={style.icRight}
                        onClick={()=>{
                            if(key == MaxKey){
                                message.warning('已是最后一题')
                            }else{
                               
                            }
                        }}
                        type="right" />
                </Modal>
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