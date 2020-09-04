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
	promotionClass,
} from '../services/classHomeService';
import {
	fetchQuestions
} from '../services/yukeService';
import {
	pageRelevantSchool
} from '../services/homePageService';
import { routerRedux } from 'dva/router';
import store from 'store';
import { message } from 'antd';
export default {

	namespace: 'classHome',

	state: {
		classList: [],
		classList1: [],
		classNews: [],
		className: '',
		classAdmin: '',
		teachers: [],
		adminId: '',
		classInfoPayload: [],
		schoolList: [],
		schoolId: '',
		classId: '',
		workList: [],
		yearList: [],
		nowYear: '',
		sublist: [],
	},
	reducers: {
		classList(state, { payload }) {
			return { ...state, classList: payload };
		},
		classList1(state, { payload }) {
			return { ...state, classList1: payload };
		},
		classNews(state, { payload }) {
			return { ...state, classNews: payload };
		},
		className(state, { payload }) {
			return { ...state, className: payload };
		},
		classAdmin(state, { payload }) {
			return { ...state, classAdmin: payload };
		},
		adminId(state, { payload }) {
			return { ...state, adminId: payload };
		},
		teachers(state, { payload }) {
			return { ...state, teachers: payload };
		},
		classInfoPayload(state, { payload }) {
			return { ...state, classInfoPayload: payload };
		},
		schoolList(state, { payload }) {
			return { ...state, schoolList: payload };
		},
		schoolId(state, { payload }) {
			return { ...state, schoolId: payload };
		},
		classId(state, { payload }) {
			return { ...state, classId: payload };
		},
		workList(state, { payload }) {
			return { ...state, workList: payload };
		},
		yearList(state, { payload }) {
			return { ...state, yearList: payload };
		},
		nowYear(state, { payload }) {
			return { ...state, nowYear: payload };
		},
		sublist(state, { payload }) {
			return { ...state, sublist: payload };
		},
		infoSchool(state, { payload }) {
			return { ...state, infoSchool: payload }
		},
		infoClass(state, { payload }) {
			return { ...state, infoClass: payload }
		},
	},
	subscriptions: {
		// setup({ dispatch, history }) {  // eslint-disable-line
		// },
	},

	effects: {
		//一键升级班级
		*upgrade({ payload }, { put, select }) {
			let res = yield promotionClass(payload);
			let { years } = yield select(state => state.temp)
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'pageClass',
					payload: {
						schoolId: store.get('wrongBookNews').schoolId,
						pageSize: 9999,
						pageNum: 1,
						year: years
					}
				})
				message.success('一键升级班级成功')
			} else {
				message.error(res.data.msg)
			}
		},

		*searchClass({ payload }, { put, select }) {
			yield put({
				type: 'classInfoPayload',
				payload: payload
			})
			let res = yield getClassList(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'classList1',
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
		*pageClass({ payload }, { put, select }) {
			// 班级列表
			yield put({
				type: 'classInfoPayload',
				payload: payload
			})
			let res = yield pageClass(payload);
			if (!res.data.data.hasOwnProperty('list')) {
				res.data.data.list = []
			}
			if (res.data.result != 0) {
				// yield put(routerRedux.push('/login'))
			}
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'classList',
					payload: res.data
				})
				let { infoClass } = yield select(state => state.homePage)

				//切换学年时的班级与当前选中的班级相同时，不清空选中班级的id
				let panduan = true;
				for (let i = 0; i < res.data.data.list.length; i++) {
					if (res.data.data.list[i].classId == infoClass) {
						panduan = false;
						break;
					}
				}
				if (panduan) {
					yield put({
						type: 'homePage/infoClass',
						payload: ''
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
		*classInfo({ payload }, { put, select }) {
			// 班级信息
			let res = yield classInfo(payload);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'classNews',
						payload: res.data
					})
					yield put({
						type: 'className',
						payload: res.data.data.className
					})
					yield put({
						type: 'classAdmin',
						payload: res.data.data.classAdmin
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
		*teacherList({ payload }, { put, select }) {
			// 教师列表查询
			let { classId, schoolId } = yield select(state => state.classHome)
			let data = {
				type: payload.type,
				classId: classId,
				schoolId: schoolId,
				page: 1,
				pageSize: 9999
			}
			let res = yield teacherList(data);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'teachers',
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
		*updateClass({ payload }, { put, select }) {
			// 修改班级信息
			let { adminId, className, classInfoPayload, classId } = yield select(state => state.classHome)
			let data = {
				classId: classId,
				className: className,
				adminId: adminId,
			}
			let res = yield updateClass(data);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else if (res.data && res.data.result === 0) {
				const rodeType = store.get('wrongBookNews').rodeType

				if (rodeType === 20) {
					yield put({
						type: 'pageClass',
						payload: classInfoPayload
					})
				} else {
					let { years } = yield select(state => state.temp)
					yield put({
						type: 'getClassList',
						payload: {
							year: years,
							schoolId: store.get('wrongBookNews').schoolId
						}
					})
				}
			} else if (res.data.result === 2) {
				yield put(routerRedux.push('/login'))
			} else {
				message.error(res.data.msg)
			}

		},
		*updateClassAdmin({ payload }, { put, select }) {
			// 修改班主任
			let { classInfoPayload } = yield select(state => state.classHome)
			let res = yield updateClass(payload);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					const rodeType = store.get('wrongBookNews').rodeType
					message.success("修改成功")
					if (rodeType === 20) {
						yield put({
							type: 'pageClass',
							payload: classInfoPayload
						})
					} else {
						yield put({
							type: 'getClassList',
						})
					}
					yield put({
						type: 'homePage/teacherList',
						payload: {
							type: 1
						}
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
		*addClass({ payload }, { put, select }) {
			// 添加班级
			let { className, adminId, classInfoPayload, schoolId } = yield select(state => state.classHome)
			let data = {
				schoolId: schoolId,
				className: className,
				adminId: adminId
			}
			let res = yield addClass(data);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					const rodeType = store.get('wrongBookNews').rodeType
					console.log(rodeType)
					if (rodeType === 20) {
						yield put({
							type: 'pageClass',
							payload: classInfoPayload
						})
					} else {
						yield put({
							type: 'getClassList',
						})
					}
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
		*deleteClass({ payload }, { put, select }) {
			// 删除班级
			let { classInfoPayload } = yield select(state => state.classHome)
			let res = yield deleteClass(payload);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'pageClass',
						payload: classInfoPayload
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
		*pageRelevantSchool({ payload }, { put, select }) {
			// 学校列表返回
			yield put({
				type: 'schoolPay',
				payload: payload
			})
			let res = yield pageRelevantSchool(payload);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'schoolList',
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
		*queryHomeworkList({ payload }, { put, select }) {
			// 返回班级作业列表
			let res = yield queryHomeworkList(payload);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'workList',
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
		*getClassList({ payload }, { put, select }) {
			console.log('getClassList: 获取学年', 11111);
			// 返回教师所在班级列表
			// yield put({
			// 	type: 'classListPayload',
			// 	payload: payload
			// })
			let res = yield getClassList(payload);
			if (res.data.result != 0) {
				// yield put(routerRedux.push('/login'))
			}
			if (res.data && res.data.result === 0) {
				// yield put ({
				// 	type: 'queryHomeworkList',
				// 	payload:{
				// 		classId:res.data.data[0].classId
				// 	}
				// })
				// yield put({
				// 	type: 'classList1',
				// 	payload: res.data
				// })
				yield put({
					type: 'classList1',
					payload: res.data
				})
				yield put({
					type: 'classList',
					payload: res.data
				})
				console.log('res.data: ', res.data);
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*getYears({ payload }, { put, select }) {
			// 学年返回
			let res = yield getYears(payload);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'yearList',
						payload: res.data
					})
					yield put({
						type: 'nowYear',
						payload: res.data.data[0]
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
		*fetchQuestions({ payload }, { put, select }) {
			// 班级信息
			try {
				let res = yield fetchQuestions(payload.data);
				res&&res.data&&res.data.result===0?
				message.success('题目同步成功'):message.error('题目同步失败')
			} catch (error) {
				console.error('error: ', error);
				message.error('题目同步失败')
			}
		},

	},



};
