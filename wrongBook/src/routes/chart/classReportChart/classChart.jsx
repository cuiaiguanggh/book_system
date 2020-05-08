import React from 'react';
import { Layout, Select, Row, Col, Table, Icon, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './classChart.less';
import 'react-count-animation/dist/count.min.css';
import TopBar from '../topbar/topbar';
import store from 'store';
import { routerRedux } from 'dva/router';
import echarts from 'echarts';
import fetch from 'dva/fetch';
import { dataCenter } from '../../../config/dataCenter';

moment.locale('zh-cn');

const { Content } = Layout;
const Option = Select.Option;
const Search = Input.Search;
//作业中心界面内容
class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			changePhone: 0,
			phone: store.get('wrongBookNews').phone,
			name: store.get('wrongBookNews').userName,
			headUrl: store.get('wrongBookNews').avatarUrl,
			subjectId: 100,
			dateValue: ['开始时间', '结束时间'],
			date: [],
			tableData: null,
		}

	}
	onChangeTime(item) {
		if (!item) return
		this.dispatch({
			type: 'reportChart/periodTime',
			payload: item.periodTime
		});
		this.dispatch({
			type: 'reportChart/timeStamp',
			payload: item.startTimeStamp
		});
		let cid = this.state.classId;
		let sid = this.state.csubId;
		let data = {
			// schoolId: store.get('wrongBookNews').schoolId,
			periodTime: item.periodTime,
			timeStamp: item.startTimeStamp,
			classId: cid,
			subjectId: sid,
		};
		this.dispatch({
			type: 'reportChart/getClassDataReport',
			payload: data
		});

	}

	onChangeDate(startDate, endDate) {

		let data = {};
		let cid = this.state.classId;
		let sid = this.state.csubId;
		if (startDate !== '') {
			this.dispatch({
				type: 'reportChart/startTime',
				payload: startDate
			});
			this.dispatch({
				type: 'reportChart/endTime',
				payload: endDate
			});

			data = {
				schoolId: store.get('wrongBookNews').schoolId,
				timeStamp: 0,
				startTime: startDate,
				endTime: endDate,
				classId: cid,
				subjectId: sid,
			}

		} else {
			this.dispatch({
				type: 'reportChart/periodTime',
				payload: 1
			});
			this.dispatch({
				type: 'reportChart/timeStamp',
				payload: this.state.reportTimeList[0].startTimeStamp
			});

			data = {
				// schoolId: store.get('wrongBookNews').schoolId,
				classId: cid,
				subjectId: sid,
				periodTime: 1,
				timeStamp: this.state.reportTimeList[0].startTimeStamp,
			}
		}
		if (!this.state.csubId) return false;

		this.dispatch({
			type: 'reportChart/getClassDataReport',
			payload: data
		});
	}
	getSub() {
		let subList = this.props.state.cSubList;
		// let subList = this.props.state.subList.data;
		//如果是超级管理员的话
		// if (store.get('wrongBookNews').rodeType === 10) {
		// 	subList = this.props.state.ssubList;
		// }

		if (subList && subList.length > 0) {
			return (
				<Select style={{ width: 120, margin: '13px 15px 0 0', height: 30 }}
					placeholder="学科"
					getPopupContainer={triggerNode => triggerNode.parentElement}
					value={this.props.state.csubId}
					onChange={(value) => {

						this.props.dispatch({
							type: 'reportChart/csubId',
							payload: value
						});
						let cid = this.props.state.classId;
						let sid = value;
						let data = {
							classId: cid,
							subjectId: sid,
						};
						if (this.props.state.stateTimeIndex === 100) {
							data.startTime = this.props.state.startTime;
							data.endTime = this.props.state.endTime;
							data.timeStamp = 0
						} else {
							data.periodTime = this.props.state.periodTime;
							data.timeStamp = this.props.state.timeStamp
						}
						this.props.dispatch({
							type: 'reportChart/getClassDataReport',
							payload: data
						})
					}} >
					{subList.map((item, i) => (<Option key={i} value={item.v}>{item.k}</Option>))}
				</Select>
			)
		}
	}
	getClassList() {
		let classList = this.props.state.classList1.data;
		//如果是超级管理员的话
		if (store.get('wrongBookNews').rodeType === 10) {
			classList = this.props.state.sclassList;
		}
		if (classList && classList.length > 0) {
			return (
				<Select
					style={{ width: 120, margin: '13px 15px 0 0', height: 30 }}
					placeholder="班级"
					getPopupContainer={triggerNode => triggerNode.parentElement}
					value={this.props.state.className}
					onChange={(value, option) => {
						this.props.dispatch({
							type: 'temp/classId',
							payload: value
						});
						this.props.dispatch({
							type: 'temp/className',
							payload: option.props.children
						});
						let cid = value;

						this.props.dispatch({
							type: 'reportChart/chartSubList',
							payload: {
								classId: cid,
							}
						})
						// this.props.dispatch({
						// 	type: 'temp/zybgSubjectList',
						// 	payload: {
						// 		classId: cid,
						// 		year: this.props.state.years
						// 	}
						// });
					}} >
					{classList.map((item, i) => (
						<Option key={i} value={store.get('wrongBookNews').rodeType === 10 ? item.id : item.classId}>{store.get('wrongBookNews').rodeType === 10 ? item.name : item.className}</Option>
					))
					}
				</Select>
			)
		}
	}
	//班级使用数据
	renderClassUseData(udata, wdata) {
		let timelist = [], userlist = [], wronglist = [];
		let cdate = moment(Date.now()).format('YYYY-MM-DD');

		for (let i = 0; i < udata.length; i++) {
			const ele = udata[i]
			const itemtime = ele.time
			if (moment(cdate) >= moment(itemtime)) {
				timelist.push(ele.time)
				userlist.push(ele.num)
				wronglist.push(wdata[i].num)
			}
		}
		let myChart1 = echarts.init(document.getElementById('main5'));
		let option1 = {
			title: {
				text: '班级使用数据',
				textStyle: {
					fontSize: 16,
					fontFmily: 'Microsoft YaHei',
					fontWeight: 400,
					color: '#666666',
				}
			},
			legend: {
				show: true,
				icon: 'rect',
				top: 40,
				itemWidth: 13,
				itemHeight: 3,
			},
			tooltip: {
				trigger: 'axis',
				padding: [5, 10],
				backgroundColor: 'rgba(0,0,0,0.4)',
				axisPointer: {
					lineStyle: {
						color: '#B9B9B9'
					}
				},
			},
			grid: {
				left: 15,
				right: 40,
				bottom: 15,
				top: 100,
				containLabel: true
			},
			xAxis: {
				data: timelist,
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
					name: '错题量',
					type: 'line',
					data: wronglist,
					symbol: 'circle',
					symbolSize: 6,
					lineStyle: { color: '#1890FF' },
					itemStyle: { color: "#1890FF" }
				}, {
					name: '人数',
					type: 'line',
					data: userlist,
					symbol: 'circle',
					symbolSize: 6,
					lineStyle: { color: '#2FC25B' },
					itemStyle: { color: "#2FC25B" }
				},
			],
		};

		let obj = {
			chart: myChart1,
			option: option1
		}
		this.resizeChart(obj)
		myChart1.setOption(option1);
	}
	nodata() {
		return (
			<div style={{ textAlign: 'center', position: 'absolute', top: '40%', width: '100%', display: 'flex', justifyContent: 'center' }}>
				<img src={require('../../images/wsj-n.png')} />
				<span style={{
					fontSize: '20px', color: "#434e59", height: 195,
					lineHeight: '195px',
					textAlign: 'left',
					paddingLeft: 20,
					fontWeight: 700,
				}}>
					暂无数据
					</span>
			</div>
		)
	}

	resizeChart(obj) {
		window.addEventListener('resize', function (e) {
			obj.chart.resize()
		}, false);
	}

	format(shijianchuo) {
		//shijianchuo是整数，否则要parseInt转换
		var time = new Date(shijianchuo);
		var y = time.getFullYear();
		var m = time.getMonth() + 1;
		var d = time.getDate();
		return y + '-' + `${m < 10 ? '0' + m : m}` + '-' + `${d < 10 ? '0' + d : d}`;
	}

	//班级使用数据导出
	classDaochu() {
		let timeList = this.props.state.reportTimeList,
			startTime = this.props.state.startTime,
			endTime = this.props.state.endTime;

		if (this.props.state.startTime === '') {
			startTime = this.format(timeList[this.props.state.periodTime - 1].startTimeStamp);
			endTime = this.format(timeList[this.props.state.periodTime - 1].endTimeStamp);
		}

		fetch(dataCenter(`/export/excel/exportClassData?schoolId=${store.get('wrongBookNews').schoolId}&startTime=${startTime}&endTime=${endTime}&subjectId=${this.props.state.csubId || 0}&classId=${this.props.state.classId}`))
			.then(resp => resp.blob())
			.then(blob => {
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `${store.get('wrongBookNews').schoolName}班级使用数据.xlsx`;
				a.click();
			})
	}

	//学生使用数据导出
	stuDaochu() {
		let timeList = this.props.state.reportTimeList,
			startTime = this.props.state.startTime,
			endTime = this.props.state.endTime;

		if (this.props.state.startTime === '') {
			startTime = this.format(timeList[this.props.state.periodTime - 1].startTimeStamp);
			endTime = this.format(timeList[this.props.state.periodTime - 1].endTimeStamp);
		}
		fetch(dataCenter(`/export/excel/exportStudentData?schoolId=${store.get('wrongBookNews').schoolId}&startTime=${startTime}&endTime=${endTime}&subjectId=${this.props.state.csubId || 0}&classId=${this.props.state.classId}`))
			.then(resp => resp.blob())
			.then(blob => {

				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `${store.get('wrongBookNews').schoolName}${this.props.state.className}学生使用数据.xlsx`;
				a.click();
			})
	}



	render() {
		const columns = [
			{
				title: '使用率排行',
				key: 'userId',
				align: 'center',
				render: (text, record, index) => (index + 1),
			},
			{
				title: '学生',
				dataIndex: 'name',
			},
			{
				title: '学科错题总量',
				dataIndex: 'questionNum',
			},
			{
				title: '学科作业数',
				dataIndex: 'workNum',
			},
			{
				title: '学科优秀作业数',
				dataIndex: 'excellentNum',
			},

		];
		let timeList = this.props.state.reportTimeList;
		let classReport = this.props.state.classDataReport;

		setTimeout(() => {
			if (classReport.classUserNumData) {
				this.renderClassUseData(classReport.classUserNumData, classReport.classWrongNumData)
			}
		}, 10);
		return (
			<>

				<div style={{ display: 'flex', position: 'absolute', left: 70, top: 15 }}>
					<div onClick={() => {
						this.props.dispatch(routerRedux.push({ pathname: '/schoolChart' }));
						this.props.dispatch({
							type: 'reportChart/stateTimeIndex',
							payload: 0
						});
					}} className={style.whiteButton}>
						校级报表
					</div>
					<div onClick={() => { this.props.dispatch(routerRedux.push({ pathname: '/classChart' })) }} className={style.blueButton}>
						班级报表
					</div>
				</div>

				<Layout>
					<TopBar timeList={timeList} onChangeTime={this.onChangeTime} onChangeDate={this.onChangeDate}>
						{this.getClassList()}
						{this.getSub()}

					</TopBar>
					<Content style={{ background: '#eee', overflow: 'auto', position: 'relative' }}>

						{classReport === 'none' || JSON.stringify(classReport) === '{}' ? this.nodata() : <div>
							<Row style={{ marginTop: 30 }}>
								<Col md={24}>
									<div className={style.chartbox} style={{ width: 'calc( 100% - 40px )', paddingRight: 0 }}>
										<div className={style.chartExport} onClick={() => { this.classDaochu() }}>
											<img src={require('../../images/chartDerive.png')} />
												导出
											</div>
										<div id='main5' style={{ height: 420 }}>
										</div>
									</div>
								</Col>
							</Row>

							<Row >
								<Col md={24}>
									<div className={style.chartbox} style={{ width: 'calc( 100% - 40px )' }}>
										<div className={style.chartExport} onClick={() => { this.stuDaochu() }}>
											<img src={require('../../images/chartDerive.png')} />
												导出
											</div>
										<Search placeholder="请输入学生名字"
											enterButton="搜索"
											style={{ width: 250, position: 'absolute', right: 100, top: 23, zIndex: 10 }}
											onSearch={value => {
												if (value === '') {
													this.setState({
														tableData: null
													})
												} else {
													let arr = []
													for (let i = 0; i < classReport.studentWrongNum.length; i++) {
														const ele = classReport.studentWrongNum[i];
														if (ele.name.indexOf(value) > -1) {
															arr.push(ele)
														}
													}
													this.setState({
														tableData: arr
													})
												}
											}} />

										<div className={style.searchInput}>
											<p>学生使用数据
										 <span style={{ fontSize: 12, color: '#909090' }}><Icon type="question-circle" style={{ color: '#409EFF', margin: '0px 3px 0px 15px' }} />学生<span style={{ color: '#409EFF' }}>“使用率排行”</span>指学生错题收集量、作业数及优秀作业数的综合指数排名 </span></p>

										</div>
										<div className={style.cagtable}>
											<Table rowKey='userId' bordered columns={columns} dataSource={this.state.tableData ? this.state.tableData : classReport.studentWrongNum} pagination={false}
											// scroll={{ y: 400 }} 
											/>
										</div>
									</div>
								</Col>
							</Row>

						</div>}

					</Content>
				</Layout>
			</>
		);
	}

	componentWillMount() {

		let schoolId = store.get('wrongBookNews').schoolId;
		this.props.dispatch({
			type: 'homePage/getEnableYears',
			payload: {
				schoolId
			}
		})
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: 'periodTime',
			payload: 1
		})
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
				classReport: true
			}
		});
	}

}

export default connect((state) => ({
	state: {
		...state.temp,
		...state.reportChart,
	}
}))(HomeworkCenter);
