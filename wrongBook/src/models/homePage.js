import {
	functionList,
	pageRelevantSchool,
	schoolInfo,
	updateSchool,
	deleteSchool,
	addSchool,
	teacherList,
	administrativeDivision,
	kickClass,
	createSchoolUser,
	subjectNodeList,
	getEnableYears,
} from '../services/homePageService';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
export default {

	namespace: 'homePage',

	state: {
		identity: '',
		certification: '',
		classNews: [],
		pageHomeworkList: [],
		catalogId: '',
		userType: 2,
		MenuList: [],
		schoolList: [],
		schoolInfo: [],
		phaseId: 2,
		schoolName: '',
		masterName: '',
		masterPhone: '',
		provinces: '',
		citys: '',
		areas: '',
		address: '',
		des: '',
		schoolPay: [],
		tealist: [],
		city: [],
		infoClass: '',
		infoSchool: '',
		memType: 1,
		sublist: [],
		yearList: [],
		showMen: '',
		schoolTeacherList: [],
		teacherName: '',
		phone: '',
		subjectId: '',
		upperLimit: '',
		schoolType: 0,
		changeSchoolType: 0,
		changeUpperLimit: ''
	},
	reducers: {
		schoolType(state, { payload }) {
			return { ...state, schoolType: payload };
		},
		classNews(state, { payload }) {
			return { ...state, classNews: payload };
		},
		city(state, { payload }) {
			return { ...state, city: payload };
		},
		pageHomeworkList(state, { payload }) {
			return { ...state, pageHomeworkList: payload };
		},
		catalogId(state, { payload }) {
			return { ...state, catalogId: payload }
		},
		MenuList(state, { payload }) {
			return { ...state, MenuList: payload }
		},
		schoolList(state, { payload }) {
			return { ...state, schoolList: payload }
		},
		schoolNews(state, { payload }) {
			return { ...state, schoolInfo: payload }
		},
		changeSchoolName(state, { payload }) {
			return { ...state, schoolName: payload }
		},
		changeSchoolType(state, { payload }) {
			return { ...state, changeSchoolType: payload }
		},
		changeUpperLimit(state, { payload }) {
			console.log(payload)
			return { ...state, changeUpperLimit: payload }
		},
		changephaseId(state, { payload }) {
			return { ...state, phaseId: payload }
		},
		changeMasterName(state, { payload }) {
			return { ...state, masterName: payload }
		},
		changeMasterPhone(state, { payload }) {
			return { ...state, masterPhone: payload }
		},
		provinces(state, { payload }) {
			return { ...state, provinces: payload }
		},
		citys(state, { payload }) {
			return { ...state, citys: payload }
		},
		areas(state, { payload }) {
			return { ...state, areas: payload }
		},
		changeaddress(state, { payload }) {
			return { ...state, address: payload }
		},
		changedes(state, { payload }) {
			return { ...state, des: payload }
		},
		schoolPay(state, { payload }) {
			return { ...state, schoolPay: payload }
		},
		schoolTeacherList(state, { payload }) {
			return { ...state, schoolTeacherList: payload }
		},
		tealist(state, { payload }) {
			return { ...state, tealist: payload }
		},
		infoSchool(state, { payload }) {
			return { ...state, infoSchool: payload }
		},
		infoClass(state, { payload }) {
			return { ...state, infoClass: payload }
		},
		memType(state, { payload }) {
			return { ...state, memType: payload }
		},
		sublist(state, { payload }) {
			return { ...state, sublist: payload };
		},
		yearList(state, { payload }) {
			return { ...state, yearList: payload };
		},
		showMen(state, { payload }) {
			return { ...state, showMen: payload }
		},
		teacherName(state, { payload }) {
			return { ...state, teacherName: payload }
		},
		phone(state, { payload }) {
			return { ...state, phone: payload }
		},
		subjectId(state, { payload }) {
			return { ...state, subjectId: payload }
		},
	},
	subscriptions: {
		setup({ dispatch, history }) {  // eslint-disable-line
		},
	},

	effects: {
		*addSchoolRecover({ payload }, { put, select }) {
			//清空'添加学校'弹窗数据
			yield put({
				type: 'changeMasterPhone',
				payload: ''
			});
			yield put({
				type: 'changeMasterName',
				payload: ''
			});
			yield put({
				type: 'changeSchoolName',
				payload: ''
			});
			yield put({
				type: 'schoolType',
				payload: 0
			});
			yield put({
				type: 'provinces',
				payload: ''
			});
			yield put({
				type: 'citys',
				payload: ''
			});
			yield put({
				type: 'areas',
				payload: ''
			});

		},
		*functionList({ payload }, { put, select }) {
			// 导航栏信息
			let MenuList = [300, 100, 200, 400]
			yield put({
				type: 'MenuList',
				payload: MenuList
			})
		},

		*administrativeDivision({ payload }, { put, select }) {
			// 区域信息返回
			let res = yield administrativeDivision(payload);
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'city',
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
		*pageRelevantSchool({ payload }, { put, select }) {
			// 学校列表返回
			yield put({
				type: 'schoolPay',
				payload: payload
			})
			let res = yield pageRelevantSchool(payload);
			console.log(res.hasOwnProperty("err"))
			if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'schoolList',
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
		*schoolInfo({ payload }, { put, select }) {
			// 学校信息返回
			let res = yield schoolInfo(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'schoolNews',
					payload: res.data
				})
				yield put({
					type: 'changeSchoolName',
					payload: res.data.data.schoolName
				})
				yield put({
					type: 'changephaseId',
					payload: res.data.data.phaseId
				})
				yield put({
					type: 'changeMasterName',
					payload: res.data.data.masterName
				})
				yield put({
					type: 'changeaddress',
					payload: res.data.data.address
				})
				yield put({
					type: 'changeUpperLimit',
					payload: res.data.data.upperLimit
				})
				yield put({
					type: 'changeSchoolType',
					payload: res.data.data.schoolType
				})
				yield put({
					type: 'changedes',
					payload: res.data.data.des
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
		*changeSchool({ payload }, { put, select }) {
			// 修改学校信息
			let { changeUpperLimit, changeSchoolType, phaseId, schoolName, masterName, address, des, schoolPay, provinces, citys, areas, schoolInfo } = yield select(state => state.homePage);
			let data = {
				schoolId: payload,
				schoolName: schoolName,
				address: address,
				masterName: masterName,
				// des:des,
				phaseId: phaseId,
				province: provinces,
				city: citys,
				area: areas,
				schoolType: changeSchoolType,
			};
			if (changeUpperLimit) {
				data.upperLimit = changeUpperLimit;
			}
			if (!provinces) {
				data.province = schoolInfo.data.province
			}
			if (!citys) {
				data.city = schoolInfo.data.city
			}
			if (!areas) {
				data.area = schoolInfo.data.area
			}
			let res = yield updateSchool(data);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'pageRelevantSchool',
					payload: schoolPay
				})
			}
			else if (res.err) {
				// yield put(routerRedux.push('/login'))
			} else {
				if (res.data.msg == '无效TOKEN!') {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*deleteSchool({ payload }, { put, select }) {
			// 删除学校
			let { schoolPay } = yield select(state => state.homePage)
			let res = yield deleteSchool(payload);
			if (res.data && res.data.result === 0) {
				message.success(res.data.msg)
				yield put({
					type: 'pageRelevantSchool',
					payload: schoolPay
				})
			}
			else if (res.err) {
				// yield put(routerRedux.push('/login'))
			} else {
				if (res.data.msg == '无效TOKEN!') {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*addSchool({ payload }, { put, select }) {
			// 修改学校信息
			let { phaseId, schoolName, masterName, masterPhone, address, des, schoolPay, citys, provinces, areas, schoolType } = yield select(state => state.homePage)
			let data = {
				schoolName: schoolName,
				address: address,
				masterName: masterName,
				phone: masterPhone,
				phaseId: phaseId,
				province: provinces,
				city: citys,
				area: areas,
				schoolType,
			}
			let res = yield addSchool(data);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'pageRelevantSchool',
					payload: schoolPay
				})
			}
			else if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else {
				if (res.data.msg == '无效TOKEN!') {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*schoolTeacher({ payload }, { put, select }) {
			// 获取教师列表
			let { infoClass, infoSchool } = yield select(state => state.homePage)
			let data = {
				type: 1,
				schoolId: infoSchool,
				page: 1,
				pageSize: 9999
			}
			let res = yield teacherList(data);
			if (res.data && res.data.result === 0) {

				yield put({
					type: 'schoolTeacherList',
					payload: res.data
				})
			}
			else if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else {
				if (res.data.msg == '无效TOKEN!') {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*teacherList({ payload }, { put, select }) {
			// 获取教师列表
			let { infoClass, infoSchool } = yield select(state => state.homePage);
			let data = {
				type: payload.type,
				classId: infoClass,
				schoolId: infoSchool,
				page: 1,
				pageSize: 9999
			}
			let res = yield teacherList(data);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'tealist',
					payload: res.data
				})
			}
			else if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else {
				if (res.data.msg == '无效TOKEN!') {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},

		*createSchoolUser({ payload }, { put, select }) {
			// 学年返回
			let res = yield createSchoolUser(payload);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					message.success(res.data.msg)
					let data = {
						type: 1
					}
					yield put({
						type: 'teacherList',
						payload: data
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
		*subjectNodeList({ payload }, { put, select }) {
			let res = yield subjectNodeList(payload);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'sublist',
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
		*kickClass({ payload }, { put, select }) {
			// 用户踢出班级
			let { infoClass, memType } = yield select(state => state.homePage)
			let data = {
				userId: payload.userId,
				classId: infoClass,
			}
			let res = yield kickClass(data);
			if (res.data && res.data.result === 0) {
				message.success(res.data.msg)
				yield put({
					type: 'teacherList',
					payload: {
						type: memType
					}
				})
			}
			else if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else {
				if (res.data.msg == '无效TOKEN!') {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*getEnableYears({ payload }, { put, select }) {
			// 获取学年
			let res = yield getEnableYears(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'yearList',
					payload: res.data
				})
			}
			else if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else {
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
