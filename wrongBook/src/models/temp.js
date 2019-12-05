import {

	queryQuestionDetail,
	homeworkDetail,
	getUserSubjectList,
	getQrMonthList,
	getKnowledgeList
} from '../services/tempService';
import {
	classInfo,
	teacherList,
	updateClass,
	deleteClass,
	addClass,
	queryHomeworkList,
	getClassList,
} from '../services/classHomeService';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { message } from 'antd';
import store from "store";
export default {

	namespace: 'temp',

	state: {
		className: '',
		classId: '',
		classList: [],
		classList1: [],
		subList: [],
		mounthList: [],
		years: moment().format('YYYY'),
		subId: '',
		subName: '',

		scoreList: [],
		QuestionDetail: [],
		classInfoPayload: [],
		schoolId: '',
		workList: [],
		workName: '',
		workId: '',
		workDetail: [],
		subjectId: '',
		knowledgeList: [],
	},
	reducers: {
		knowledgeList(state, { payload }) {
			return { ...state, knowledgeList: payload };
		},
		subjectId(state, { payload }) {
			return { ...state, subjectId: payload };
		},
		className(state, { payload }) {
			return { ...state, className: payload };
		},
		classId(state, { payload }) {
			return { ...state, classId: payload };
		},
		classList(state, { payload }) {
			return { ...state, classList: payload };
		},
		classList1(state, { payload }) {
			return { ...state, classList1: payload };
		},
		subList(state, { payload }) {
			return { ...state, subList: payload };
		},
		mounthList(state, { payload }) {
			return { ...state, mounthList: payload };
		},
		years(state, { payload }) {
			return { ...state, years: payload };
		},
		subId(state, { payload }) {
			let subList = state.subList;
			let subId = payload;
			let subName = '';
			if (subList.data) {
				for (let i = 0; i < subList.data.length; i++) {
					if (subList.data[i].v == payload) {
						subName = subList.data[i].k
					}
				}
			}
			return { ...state, ...{ subId, subName } };
		},
		subName(state, { payload }) {
			return { ...state, subName: payload };
		},
	},
	subscriptions: {
		// setup({ dispatch, history }) {  // eslint-disable-line
		// },
	},

	effects: {
		*getKnowledgeList({ payload }, { put, select }) {
			let { mouNow, knowledgenow, stbegtoendTime } = yield select(state => state.report);
			//月份
			if (mouNow !== 0) {
				payload.month = mouNow.v
			}
			//知识点
			if (knowledgenow.length !== 0) {
				payload.knowledgeName = knowledgenow
			}
			//时间段
			if (stbegtoendTime.length > 0) {
				payload.startTime = stbegtoendTime[0];
				payload.endTime = stbegtoendTime[1];
			}
			if (!payload.subjectId) {
				// message.error('请选择学科');
				return;
			}
			//知识点筛选
			let res = yield getKnowledgeList(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'knowledgeList',
					payload: res.data
				})
			}
		},

		*getClassList({ payload }, { put, select }) {
			// 返回教师所在班级列表	
			let res = yield getClassList(payload);
			if (res.data && res.data.result === 0) {
				if (res.data.data.length > 0) {
					yield put({
						type: 'className',
						payload: res.data.data[0].className
					})
					//自动记忆功能
					if (!store.get('wrongBookNews').memoryClassId) {
						console.log('默认班级')
						yield put({
							type: 'classId',
							payload: res.data.data[0].classId
						})
						yield put({
							type: 'getUserSubjectList',
							payload: res.data.data[0].classId
						})
					} else {
						//加载完后，删除班级记忆
						let cun = store.get('wrongBookNews');
						yield put({
							type: 'getUserSubjectList',
							payload: cun.memoryClassId
						})
						delete (cun.memoryClassId);
						store.set('wrongBookNews', cun)
					}
					yield put({
						type: 'classList1',
						payload: res.data
					})
				} else {
					//班级为空时清空所有对应数据
					yield put({
						type: 'classId',
						payload: ''
					})
					yield put({
						type: 'classList1',
						payload: []
					})
					yield put({
						type: 'report/classList1',
						payload: []
					})
					yield put({
						type: 'mounthList',
						payload: []
					})
					yield put({
						type: 'knowledgeList',
						payload: []
					})
					yield put({
						type: 'subList',
						payload: []
					});
					//班级错题
					yield put({
						type: 'report/qrdetailList',
						payload: []
					})
					//学生错题
					yield put({
						type: 'report/studentList',
						payload: []
					});
					yield put({
						type: 'report/qrStudentDetailList',
						payload: []
					})
					//作业报告
					yield put({
						type: 'report/homeworkList',
						payload: []
					})
					yield put({
						type: 'report/studentList',
						payload: []
					});
					yield put({
						type: 'report/scoreDetail',
						payload: []
					})

				}

			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*zybgSubjectList({ payload }, { put, select }) {
			let res = yield getUserSubjectList(payload);
			if (res.data && res.data.result === 0) {
				if (res.data.data.length > 0) {
					yield put({
						type: 'subId',
						payload: res.data.data[0].v
					});
					yield put({
						type: 'subName',
						payload: res.data.data[0].k
					});
					yield put({
						type: 'subList',
						payload: res.data
					});
					yield put({
						type: 'subjectId',
						payload: res.data.data[0].v
					});
					//切换班级后获取到学科信息调用接口获取数据
					let { classId } = yield select(state => state.temp);
					let { stateTimeIndex, startTime, endTime, periodTime, timeStamp } = yield select(state => state.reportChart);
					let data = {
						schoolId: store.get('wrongBookNews').schoolId,
						classId,
						subjectId: res.data.data[0].v,
					};
					if (stateTimeIndex === 100) {
						data.startTime = startTime;
						data.endTime = endTime;
						data.timeStamp = 0
					} else {
						data.periodTime = periodTime;
						data.timeStamp = timeStamp;
					};
					yield put({
						type: 'reportChart/getClassDataReport',
						payload: data
					});
				} else {
					yield put({
						type: 'subList',
						payload: []
					});

					yield put({
						type: 'reportChart/classDataReport',
						payload: {
							studentWrongNum: [],
							classUserNumData: [],
							classWrongNumData: [],
							teacherUseDataList: []
						}
					})

				}
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}
		},
		*getUserSubjectList({ payload }, { put, select }) {
			// 返回教师所在班级科目
			let { years } = yield select(state => state.temp);
			let data = {
				classId: payload,
				year: years
			};
			let hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "");

			let res = yield getUserSubjectList(data);
			if (res.data && res.data.result === 0) {
				if (res.data.data.length > 0) {
					let subjectId = res.data.data[0].v;
					//自动记忆功能
					if (!store.get('wrongBookNews').memorySubId) {
						console.log('默认学科')
						yield put({
							type: 'subId',
							payload: subjectId
						});
					} else {
						//加载完后，删除学科记忆
						let cun = store.get('wrongBookNews');
						subjectId = cun.memorySubId;
						delete (cun.memorySubId);
						store.set('wrongBookNews', cun)
					}

					yield put({
						type: 'subName',
						payload: res.data.data[0].k
					});
					yield put({
						type: 'subList',
						payload: res.data
					});
					yield put({
						type: 'subjectId',
						payload: subjectId
					});
					//获取月份
					yield put({
						type: 'getQrMonthList',
						payload: {
							classId: payload,
							year: years,
							subjectId: subjectId
						}
					});
					//获取知识点筛选
					yield put({
						type: 'getKnowledgeList',
						payload: {
							classId: payload,
							year: years,
							subjectId: subjectId,
							type: 0,
						}
					});
					//刷新时调用对应页面的接口，而不是调用全部接口
					//班级错题
					if (hashStrings === '/classReport') {
						yield put({
							type: 'report/queryQrDetail',
							payload: {
								classId: payload,
								year: years,
								subjectId: subjectId,
								info: 0,
								page: 1,
								pageSize: 20,
							}
						});
					}
					//学生错题
					if (hashStrings === '/stuReport') {
						yield put({
							type: 'report/queryQrStudentCount',
							payload: {
								classId: payload,
								year: years,
								subjectId: subjectId,
							}
						});
					}
					//作业报告
					if (hashStrings === '/workReport') {
						yield put({
							type: 'report/queryHomeworkList',
							payload: {
								classId: payload,
								subjectId: subjectId
							}
						})
					}
				} else {
					//班级对应的学科为空时候，清空所有对应数据
					//公用的月份，知识点，学科
					yield put({
						type: 'mounthList',
						payload: []
					})
					yield put({
						type: 'knowledgeList',
						payload: []
					})
					yield put({
						type: 'subId',
						payload: ''
					});
					yield put({
						type: 'subList',
						payload: []
					});
					//班级错题
					yield put({
						type: 'report/qrdetailList',
						payload: []
					})
					//学生错题
					yield put({
						type: 'report/studentList',
						payload: []
					});
					yield put({
						type: 'report/qrStudentDetailList',
						payload: []
					})
					//作业报告
					yield put({
						type: 'report/homeworkList',
						payload: []
					})
					yield put({
						type: 'report/studentList',
						payload: []
					});
					yield put({
						type: 'report/scoreDetail',
						payload: []
					})
				}
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*updateMonthList({ payload }, { put, select }) {
			//更新月份列表
			let { years, classId, subjectId } = yield select(state => state.temp);
			let res = yield getQrMonthList({
				classId,
				year: years,
				subjectId
			});
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'mounthList',
					payload: res.data
				})
			}

		},
		*getQrMonthList({ payload }, { put, select }) {
			// 返回教师所在班级科目
			let res = yield getQrMonthList(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'mounthList',
					payload: res.data
				})
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},

		*queryQuestionDetail({ payload }, { put, select }) {
			// 导航栏信息
			let res = yield queryQuestionDetail(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'QuestionDetail',
					payload: res.data
				})
			}
			else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}
		},


		*homeworkDetail({ payload }, { put, select }) {
			// 导航栏信息
			let res = yield homeworkDetail(payload);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'workDetail',
						payload: res.data
					})
				}
				else {
					if (res.data.result === 2) {
						yield put(routerRedux.push('/login'))
					} else if (res.data.msg == '服务器异常') {

					} else {
						message.error(res.data.msg)
					}
				}
		},

	},




};
