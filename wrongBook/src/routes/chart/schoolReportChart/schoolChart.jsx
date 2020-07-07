
import React from 'react';
import { Layout, Input, Modal, Button, Select, Row, Col, DatePicker, Icon, Table, Spin } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './schoolChart.less';
import TopBar from '../topbar/topbar'
import store from 'store';
import echarts from 'echarts';
import { routerRedux } from 'dva/router';
import { noResposeDataCon } from '../../../utils/common';
import fetch from 'dva/fetch';
import { dataCenter } from '../../../config/dataCenter';
moment.locale('zh-cn');

const { Content } = Layout;
const Option = Select.Option;
const Search = Input.Search;

class SchoolChart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			subjectId: 100,
			date: [],
			myChart: {},
			sbid: 0,
			cid: 0,
			searchData: [],
			gradeDataSelect: 1,
			spin1: false,
			spin2: false,
		}
		this.onChangeTime = this.onChangeTime.bind(this)
		this.onChangeDate = this.onChangeDate.bind(this)
	}

	onChangeTime(item) {

		if (!item) return
		this.props.dispatch({
			type: 'reportChart/periodTime',
			payload: item.periodTime
		});
		this.props.dispatch({
			type: 'reportChart/timeStamp',
			payload: item.startTimeStamp
		});
		if (this.props.state.sclassList.length === 0) return
		let data = {
			schoolId: store.get('wrongBookNews').schoolId,
			periodTime: item.periodTime,
			timeStamp: item.startTimeStamp,
		}
		this.props.dispatch({
			type: 'reportChart/getSchoolDataReport',
			payload: data
		});
		this.props.dispatch({
			type: 'reportChart/startTime',
			payload: ''
		});
		this.props.dispatch({
			type: 'reportChart/endTime',
			payload: ''
		});
	}
	onChangeDate(startDate, endDate) {
		let data = {}
		if (startDate !== '') {
			this.props.dispatch({
				type: 'reportChart/startTime',
				payload: startDate
			});
			this.props.dispatch({
				type: 'reportChart/endTime',
				payload: endDate
			});
			if (this.props.state.sclassList.length === 0) return
			data = {
				schoolId: store.get('wrongBookNews').schoolId,
				timeStamp: 0,
				startTime: startDate,
				endTime: endDate,
			}
		} else {
			this.props.dispatch({
				type: 'reportChart/periodTime',
				payload: 1
			});
			this.props.dispatch({
				type: 'reportChart/timeStamp',
				payload: this.props.state.reportTimeList[0].startTimeStamp
			});
			data = {
				schoolId: store.get('wrongBookNews').schoolId,
				periodTime: 1,
				timeStamp: this.props.state.reportTimeList[0].startTimeStamp,
			}
		}
		this.props.dispatch({
			type: 'reportChart/getSchoolDataReport',
			payload: data
		});
	}
	//错题总量
	renderQustionCount(data) {
		let myChart1 = echarts.init(document.getElementById('main'), 'light');
		const chartBox = document.getElementById('main');
		// if (JSON.stringify(data) === '{}') {
		// 	chartBox.style.display = 'none'
		// 	return
		// } else {
		// 	chartBox.style.display = 'block'
		// }
		const winWidth = document.body.offsetWidth
		var arr = Object.getOwnPropertyNames(data)
		var arr1 = arr.map(function (i) { return data[i] })
		let sdata = []
		let colors = ['#F76056', '#FFA63B', '#FFCA3F', '#67BB6A', '#46A7F5', '#975FE5']
		for (let i = 0; i < arr.length; i++) {
			sdata.push({ name: arr[i], value: arr1[i], itemStyle: { color: colors[i] } })
		}
		let option = {
			title: {
				text: '错题总量',
				textStyle: {
					fontSize: 16,
					fontFmily: 'Microsoft YaHei',
					fontWeight: 400,
					color: '#666666',
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: "{b} : {c}道",
				padding: [5, 10],
				backgroundColor: 'rgba(0,0,0,0.4)'

			},
			legend: {
				x: 'right',
				y: 'center',
				itemGap: 18,
				data: sdata,
				align: 'left',
				icon: 'circle',
				formatter: function (params) {
					for (var i = 0; i < option.series[0].data.length; i++) {
						if (option.series[0].data[i].name == params) {
							return params + "  " + option.series[0].data[i].value + "道";
						}
					}
				},
				orient: 'vertical',
				type: 'plain',
			},
			series: [
				{
					name: '错题量',
					type: 'pie',
					radius: [80, 115],
					center: ['35%', '50%'],
					label: {
						show: false
					},
					emphasis: {
						label: {
							show: true,
							fontSize: '12',
							fontWeight: '400',
							color: '#3B3B3B',
							formatter: '{d}%'
						}
					},

					data: sdata
				},

			]
		};

		//适配
		if (winWidth <= 1400) {
			option.legend.y = 'bottom'
			option.legend.x = 'center'
			option.legend.orient = 'horizontal'
			option.series[0].center = ['50%', '50%']
		}
		let obj = {
			chart: myChart1,
			option: option,
			id: 0
		}
		this.resizeChart(obj)
		myChart1.setOption(option);

	}
	//使用人数
	renderUserCount(data) {
		let myChart = echarts.init(document.getElementById('main1'), 'light');
		const chartBox = document.getElementById('main1');
		// if (JSON.stringify(data) === '{}') {
		// 	chartBox.style.display = 'none'
		// 	return
		// } else {
		// 	chartBox.style.display = 'block'
		// }
		var arr = Object.getOwnPropertyNames(data)
		var arr1 = arr.map(function (i) { return data[i] })
		let sdata = [], zong = 0, colors = ['#3AA1FF', '#36CBCB', '#4ECB73', '#FBD437', '#F2637B', '#975FE5', '#FFA63B']

		for (let i = 0; i < arr.length; i++) {
			sdata.push({ name: arr[i], value: arr1[i], itemStyle: { color: colors[i] } })
			zong += arr1[i]
		}

		let option = {
			title: {
				text: '错题使用人数',
				textStyle: {
					fontSize: 16,
					fontFmily: 'Microsoft YaHei',
					fontWeight: 400,
					color: '#666666',
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: "{b} : {c}人",
				padding: [5, 10],
				backgroundColor: 'rgba(0,0,0,0.4)'
			},
			legend: {
				x: 'right',
				y: 'center',
				itemGap: 18,
				icon: 'circle',
				data: sdata,
				align: 'left',
				orient: 'vertical',
				formatter: function (params) {
					for (var i = 0; i < option.series[0].data.length; i++) {
						if (option.series[0].data[i].name == params) {
							return params + "  " + option.series[0].data[i].value + "人";
						}
					}
				},
			},
			series: [
				{
					name: '使用人数',
					type: 'pie',
					radius: [80, 115],
					center: ['35%', '50%'],
					avoidLabelOverlap: false,
					label: {
						show: false,
					},
					label: {
						show: false,
						position: 'center',
					},
					emphasis: {
						label: {
							show: true,
							fontSize: '18',
							fontWeight: '400',
							color: '#666666',
							formatter: `共${zong}人`,
						}
					},
					data: sdata
				}
			]
		};
		//适配
		if (document.body.offsetWidth <= 1400) {
			option.legend.y = 'bottom'
			option.legend.x = 'center'
			option.legend.orient = 'horizontal'
			option.series[0].center = ['50%', '50%']
		}

		let obj = {
			chart: myChart,
			option: option,
			id: 1
		}
		this.resizeChart(obj)
		myChart.setOption(option);

	}
	renderTeacherUserCount() {
		let data = this.props.state.searchData;
		const columns = [
			{
				title: '使用率排行',
				dataIndex: 'number',
				align: 'center',
				render: (text, record, index) => (index + 1),
			},
			{
				title: '教师',
				dataIndex: 'userName',
			},
			{
				title: '学科',
				dataIndex: 'subjectName',
			},
			{
				title: '班级',
				dataIndex: 'className',
			},
			{
				title: '作业总数',
				dataIndex: 'workNum',
			}, {
				title: '作业批改率',
				dataIndex: 'workRate',
				render: (text, record, index) => `${Math.round(text * 100)}%`,

			}, {
				title: '组卷次数',
				dataIndex: 'assembleTimes',
			}, {
				title: '视频录制数',
				dataIndex: 'videoExplain',
			},
		];
		return (
			<div className={style.cagtable}>
				<Table bordered columns={columns} dataSource={data} pagination={false} rowKey={record => record.userId + record.classId}
				// scroll={{ y: 400 }} 
				/>
			</div>

		)
	}
	//年级使用数据
	renderClassData(udata) {
		let myChart = echarts.init(document.getElementById('main3'));
		const chartBox = document.getElementById('main3');
		// if (udata === undefined || udata.length === 0) {
		// 	chartBox.style.display = 'none'
		// 	return
		// } else {
		// 	chartBox.style.display = 'block'
		// }

		let classList = [], userList = [], usageRate = [];
		for (let key in udata) {
			for (let j = 0; j < udata[key].length; j++) {
				classList.push(udata[key][j].className);
				if (this.state.gradeDataSelect === 1) {
					userList.push(udata[key][j].questionNum);
					usageRate.push(udata[key][j].userRate);
				} else if (this.state.gradeDataSelect === 2) {
					userList.push(udata[key][j].userNum);
				} else if (this.state.gradeDataSelect === 3) {
					userList.push(udata[key][j].workNum);
					usageRate.push(udata[key][j].correctRate);
					console.log(udata[key][j].correctRate * 100)

				}
			}
		}


		let option3 = {
			title: {
				text: '年级使用数据',
				textStyle: {
					fontSize: 16,
					fontFmily: 'Microsoft YaHei',
					fontWeight: 400,
					color: '#666666',
				}
			},
			legend: {
				show: false
			},
			tooltip: {
				trigger: 'axis',
				padding: [5, 10],
				backgroundColor: 'rgba(0,0,0,0.4)',
				formatter: function (params) {
					let str = '';
					if (params[0].seriesName === '人数') {
						return str = `${params[0].name}   <br/> 错题使用人数：${params[0].value}人`;
					} else if (params[0].seriesName === '错题量') {
						return str = `${params[0].name} <br/> 错题总量：${params[0].value}道<br/>错题使用率:${Math.round(usageRate[params[0].dataIndex] * 100)}%`;
					} else if (params[0].seriesName === '作业数') {
						return str = `${params[0].name} <br/>作业数：${params[0].value}份<br/>作业批改率:${Math.round(usageRate[params[0].dataIndex] * 100)}%`;
					}
				},
				axisPointer: {
					lineStyle: {
						color: '#2FC25B'
					}
				}
			},
			grid: {
				left: 15,
				right: 40,
				bottom: 15,
				top: 100,
				containLabel: true
			},
			xAxis: {
				data: classList,
				boundaryGap: false,
				nameTextStyle: {
					fontFamily: 'Microsoft YaHei',
				},
				axisLine: {
					lineStyle: { color: '#545454' }
				},
			},
			yAxis: {
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				splitLine: {
					lineStyle: {
						type: 'dashed',
						color: '#F3F3F3',
						width: 1.5
					}
				},
			},
			series: [
				{
					name: `${(this.state.gradeDataSelect === 1 && '错题量') || (this.state.gradeDataSelect === 2 && '人数') || (this.state.gradeDataSelect === 3 && '作业数')}`,
					type: 'line',
					data: userList,
					symbol: 'circle',
					symbolSize: 6,
					lineStyle: { color: '#2FC25B' },
					itemStyle: { color: "#2FC25B" }
				}
			],
		};

		let obj = {
			chart: myChart,
			option: option3,
			id: 2
		}
		this.resizeChart(obj)
		myChart.setOption(option3)
	}


	resizeChart(obj) {
		window.addEventListener('resize', function (e) {
			let winWidth = e.target.innerWidth
			const chartBox = document.getElementById('main');
			const chartBox1 = document.getElementById('main1');
			if (!chartBox) return

			if (chartBox.offsetWidth <= 600 || winWidth <= 1400) {
				if (obj.id === 0 || obj.id === 1) {
					chartBox.style.height = '400px'
					chartBox1.style.height = '400px'
					obj.option.legend.y = 'bottom'
					obj.option.legend.x = 'center'
					obj.option.legend.orient = 'horizontal'
					obj.option.series[0].center = ['50%', '50%']
				}

			} else {
				if (obj.id === 0 || obj.id === 1) {
					chartBox.style.height = '300px'
					chartBox1.style.height = '300px'
					obj.option.legend.y = 'center'
					obj.option.legend.x = 'right'
					obj.option.legend.orient = 'vertical'
					obj.option.series[0].center = ['35%', '50%']
				}
			}

			obj.chart.setOption(obj.option)
			obj.chart.resize()

		}, false);
	}

	gradeSelectChange(num) {
		if (num === this.state.gradeDataSelect) { return };
		this.setState({
			gradeDataSelect: num
		}, () => {
			this.renderClassData(this.props.state.schoolDataReport.classWrongData);
		})
	}

	format(shijianchuo) {
		//shijianchuo是整数，否则要parseInt转换
		var time = new Date(shijianchuo);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		return y + '-' + `${m < 10 ? '0' + m : m}` + '-' + `${d < 10 ? '0' + d : d}`;
	}
	//年级使用数据导出
	gradeDaochu() {
		if (this.state.spin1) { return false; }
		this.setState({ spin1: true })
		let timeList = this.props.state.reportTimeList,
			startTime = this.props.state.startTime,
			endTime = this.props.state.endTime;

		if (this.props.state.startTime === '') {
			startTime = this.format(timeList[this.props.state.periodTime - 1].startTimeStamp);
			endTime = this.format(timeList[this.props.state.periodTime - 1].endTimeStamp);
		}
		fetch(dataCenter(`/export/excel/exportSchoolData?schoolId=${store.get('wrongBookNews').schoolId}&startTime=${startTime}&endTime=${endTime}`))
			.then(resp => resp.blob())
			.then(blob => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `${store.get('wrongBookNews').schoolName}年级使用数据.xlsx`;
				a.click();
				this.setState({ spin1: false })
				this.props.dispatch({
					type: 'report/maidian',
					payload: { functionId: 19, actId: 1 }
				})
			})
	}
	//教师使用情况导出
	teacherDaochu() {
		if (this.state.spin2) { return false; }
		this.setState({ spin2: true })
		let timeList = this.props.state.reportTimeList,
			startTime = this.props.state.startTime,
			endTime = this.props.state.endTime;

		if (this.props.state.startTime === '') {
			startTime = this.format(timeList[this.props.state.periodTime - 1].startTimeStamp);
			endTime = this.format(timeList[this.props.state.periodTime - 1].endTimeStamp);
		}
		fetch(dataCenter(`/export/excel/exportTeacherData?schoolId=${store.get('wrongBookNews').schoolId}&startTime=${startTime}&endTime=${endTime}`))
			.then(resp => resp.blob())
			.then(blob => {
				console.log(blob)
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `${store.get('wrongBookNews').schoolName}教师使用情况.xlsx`;
				a.click();
				this.setState({ spin2: false })
				this.props.dispatch({
					type: 'report/maidian',
					payload: { functionId: 20, actId: 1 }
				})
			})
	}

	render() {

		let timeList = this.props.state.reportTimeList;
		let schoolReport = this.props.state.schoolDataReport;

		return (
			<>
				<div style={{ display: 'flex', position: 'absolute', left: 70, top: 15 }}>
					<div onClick={() => { this.props.dispatch(routerRedux.push({ pathname: '/schoolChart' })) }} className={style.blueButton}>
						校级报表
					</div>
					<div onClick={() => {
						this.props.dispatch(routerRedux.push({ pathname: '/classChart' }));
						this.props.dispatch({
							type: 'reportChart/stateTimeIndex',
							payload: 0
						});
					}} className={style.whiteButton}>
						班级报表
					</div>
				</div>
				<Layout>

					<TopBar timeList={timeList} onChangeTime={this.onChangeTime} onChangeDate={this.onChangeDate}></TopBar>
					<Content style={{ background: '#eee', overflow: 'auto', position: 'relative' }}>
						{this.props.state.sgradeList.length === 0 && (schoolReport === "none" || JSON.stringify(schoolReport) === '{}') ? noResposeDataCon() :
							<div>
								<Row style={{ marginTop: 30 }} >
									<Col xl={12} md={24} >
										<div style={{ margin: '0 20px', padding: '20px', backgroundColor: '#fff', marginBottom: 30 }}>
											<div id='main' style={document.body.offsetWidth <= 1400 ? { height: 400 } : { height: 300 }}>
											</div>
											{/* {JSON.stringify(schoolReport.gradeWrongNumMap) === '{}' ?
												<div style={document.body.offsetWidth <= 1400 ? { height: 400 } : { height: 300 }}>{noResposeDataCon()}</div> : ""} */}
										</div>
									</Col>
									<Col xl={12} md={24}>
										<div style={{ margin: '0 20px', padding: '20px', backgroundColor: '#fff', marginBottom: 30 }}>
											<div id='main1' style={document.body.offsetWidth <= 1400 ? { height: 400 } : { height: 300 }}>
											</div>
											{/* {JSON.stringify(schoolReport.gradeUseNumMap) === '{}' ?
												<div style={document.body.offsetWidth <= 1400 ? { height: 400 } : { height: 300 }}><Empty /></div> : ""} */}
										</div>
									</Col>
								</Row>

								<Row >
									<Col md={24}>
										<div className={style.chartbox} style={{ width: 'calc( 100% - 40px )', paddingRight: 0, }}>

											<div className={style.classSelects}>
												<span style={this.state.gradeDataSelect === 1 ? { width: 70, borderColor: '#2F9BFF' } : { width: 70 }} onClick={() => { this.gradeSelectChange(1) }}> 错题量</span>
												<span style={this.state.gradeDataSelect === 2 ? { width: 100, borderColor: '#2F9BFF' } : { width: 100 }} onClick={() => { this.gradeSelectChange(2) }}>错题使用人数</span>
												<span style={this.state.gradeDataSelect === 3 ? { width: 70, borderColor: '#2F9BFF' } : { width: 70 }} onClick={() => { this.gradeSelectChange(3) }}>作业数</span>
											</div>
											<div className={style.chartExport} onClick={() => { this.gradeDaochu() }}>
												<Spin spinning={this.state.spin1}>
													<img src={require('../../images/chartDerive.png')} />
												导出
												</Spin>
											</div>

											<div id='main3' style={{ height: 440 }}> </div>
											{/* {schoolReport.classWrongData === undefined || schoolReport.classWrongData.length === 0 ?
												<div style={{ height: 440 }}>{noResposeDataCon()}</div> : ""} */}

										</div>
									</Col>
								</Row>
								<Row >
									<Col md={24}>
										<div className={style.chartbox} style={{ width: 'calc( 100% - 40px )' }}>
											<div className={style.chartExport} onClick={() => { this.teacherDaochu() }}>
												<Spin spinning={this.state.spin2}>
													<img src={require('../../images/chartDerive.png')} /> 导出
												 </Spin>
											</div>

											<Search
												placeholder="请输入教师姓名"
												enterButton="搜索"
												style={{ width: 250, position: 'absolute', right: 100, top: 23, zIndex: 10 }}
												onSearch={value => {
													if (value === '') {
														this.props.dispatch({
															type: 'reportChart/searchData',
															payload: this.props.state.schoolDataReport.teacherUseDataList
														});
													} else {
														let arr = []
														for (let i = 0; i < schoolReport.teacherUseDataList.length; i++) {
															const ele = schoolReport.teacherUseDataList[i];
															if (ele.userName.indexOf(value) > -1) {
																arr.push(ele)
															}
														}
														this.props.dispatch({
															type: 'reportChart/searchData',
															payload: arr
														});
													}
													this.renderTeacherUserCount()
												}} />
											<div className={style.searchInput}>
												<p>教师使用情况  <span style={{ fontSize: 12, color: '#909090' }}><Icon type="question-circle" style={{ color: '#409EFF', margin: '0px 3px 0px 15px' }} />教师<span style={{ color: '#409EFF' }}>“使用率排行”</span>指教师作业批改率、组卷次数、视频录制数的综合指数排名</span></p>
											</div>
											{schoolReport.teacherUseDataList ? this.renderTeacherUserCount() : ''}
										</div>
									</Col>
								</Row>
							</div>
						}

					</Content>
				</Layout>
			</>
		);
	}
	UNSAFE_componentWillMount() {
		if (store.get('wrongBookNews').rodeType === 10) {
			let schoolId = store.get('wrongBookNews').schoolId;
			this.props.dispatch({
				type: 'homePage/getEnableYears',
				payload: {
					schoolId
				}
			})
		}
	}

	componentWillUnmount() {
		//清空图表数据
		this.props.dispatch({
			type: 'reportChart/schoolDataReport',
			payload: 'none'
		})

		this.props.dispatch({
			type: 'periodTime',
			payload: 1
		});
		this.props.dispatch({
			type: 'reportChart/startTime',
			payload: ''
		});
		this.props.dispatch({
			type: 'reportChart/endTime',
			payload: ''
		});
		window.removeEventListener('resize', function (e) {
			//卸载resize
		}, false);
		if (store.get('wrongBookNews').rodeType === 10) {
			this.props.dispatch({
				type: 'homePage/yearList',
				payload: {
					yearList: []
				}
			})
		}
	}
	componentDidMount() {
		this.props.dispatch({
			type: 'reportChart/getReportTimeList',
			payload: {
				classReport: false
			}
		});
		this.props.dispatch({
			type: 'report/maidian',
			payload: { functionId: 17, actId: 2 }
		})
	}
	shouldComponentUpdate(nextProps) {
		let data = nextProps.state.schoolDataReport;

		if (!(JSON.stringify(data) === '{}' || data === "none") && data !== this.props.state.schoolDataReport) {

			if (data.gradeWrongNumMap) {
				this.renderQustionCount(data.gradeWrongNumMap)
			}
			if (data.gradeUseNumMap) {
				this.renderUserCount(data.gradeUseNumMap)
			}
			if (data.classWrongData) {
				this.renderClassData(data.classWrongData)
			}
		} else if ((JSON.stringify(data) === '{}' || data === "none") && document.getElementById('main')) {

			this.renderQustionCount({})
			this.renderUserCount({})
			this.renderClassData({})

		}

		return true
	}

}

export default connect((state) => ({
	state: {
		...state.temp,
		...state.reportChart,
	}
}))(SchoolChart);
