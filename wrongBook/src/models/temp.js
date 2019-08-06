import {
	queryScoreDetail,
	queryQuestionDetail,
	homeworkDetail,
	getUserSubjectList,
	getQrMonthList,
	getKnowledgeList
} from '../services/tempService';
import {
	pageClass,
	classInfo,
	teacherList,
	updateClass,
	deleteClass,
	addClass,
	queryHomeworkList,
	getClassList,
	getYears,
} from '../services/classHomeService';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { message } from 'antd';
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
		setup({ dispatch, history }) {  // eslint-disable-line
		},
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

			//知识点筛选
			let res = yield getKnowledgeList(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'knowledgeList',
					payload: res.data
				})
			}
		},
		*pageClass({ payload }, { put, select }) {
			// 班级列表
			yield put({
				type: 'classInfoPayload',
				payload: payload
			})
			let res = yield pageClass(payload);
			if (res.data && res.data.result === 0) {

				yield put({
					type: 'className',
					payload: res.data.data.list[0].className
				})
				yield put({
					type: 'classId',
					payload: res.data.data.list[0].classId
				})

				// yield put ({
				// 	type: 'report/queryHomeworkList',
				// 	payload:{
				// 		classId:res.data.data.list[0].classId,
				// 	}
				// })

				yield put({
					type: 'classList',
					payload: res.data
				})
			}
			else {
				if (res.data.msg == '无效TOKEN!') {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}

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
					yield put({
						type: 'classId',
						payload: res.data.data[0].classId
					})
					yield put({
						type: 'classList1',
						payload: res.data
					})

					yield put({
						type: 'getUserSubjectList',
						payload: res.data.data[0].classId
					})
				}



			} else {
				if (res.data.msg == '无效TOKEN!') {
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
					//获取月份
					yield put({
						type: 'getQrMonthList',
						payload: {
							classId: payload,
							year: years,
							subjectId: res.data.data[0].v
						}
					});
          //获取知识点筛选
          yield put({
            type: 'getKnowledgeList',
            payload: {
              classId: payload,
              year: years,
              subjectId: res.data.data[0].v,
              type:0,
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
								subjectId: res.data.data[0].v,
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
								subjectId: res.data.data[0].v,
							}
						});
					}
					//作业报告
					if (hashStrings === '/workReport') {
						yield put({
							type: 'report/queryHomeworkList',
							payload: {
								classId: payload,
								subjectId: res.data.data[0].v
							}
						})
					}
				}
			} else {
				if (res.data.msg == '无效TOKEN!') {
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
				if (res.data.msg == '无效TOKEN!') {
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
				if (res.data.msg == '无效TOKEN!') {
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
					if (res.data.msg == '无效TOKEN!') {
						yield put(routerRedux.push('/login'))
					} else if (res.data.msg == '服务器异常') {

					} else {
						message.error(res.data.msg)
					}
				}
		},

	},




};
