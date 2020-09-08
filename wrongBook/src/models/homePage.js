import {
	makeUserDateWB,
	membersForSA,
	getSubjectList,
	pageClass,
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
	updateChild,
	wxCode,
	pushMarker,
	assign,
	remove,
	exit,
	create,
	importData,
	care,
	batchExit,
	refundStudents,
	addStudent,
	changeStudent,
	resetPassword,
} from '../services/homePageService';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import store from 'store';

export default {

	namespace: 'homePage',

	state: {
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
		changeUpperLimit: '',
		dcclassList: [],
		subjectList: [],
		dcStudentList: [],
		cunSchoolNmae: undefined,
		nowschool: '',
		beginGrade: 0,
		endGrade: 0,
		saleId:0

	},
	reducers: {
		setSaleId(state, { payload }) {
			return { ...state, saleId: payload };
		},
		grades(state, { payload }) {
			return { ...state, beginGrade: payload.beginGrade, endGrade: payload.endGrade };
		},
		nowschool(state, { payload }) {
			return { ...state, nowschool: payload };
		},
		cunSchoolNmae(state, { payload }) {
			return { ...state, cunSchoolNmae: payload };
		},
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
			console.log('payload..........: ', payload);
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
		dcclassList(state, { payload }) {
			return { ...state, dcclassList: payload }
		},
		subjectList(state, { payload }) {
			return { ...state, subjectList: payload }
		},
		dcStudentList(state, { payload }) {
			return { ...state, dcStudentList: payload }
		},
	},
	subscriptions: {
		// setup({ dispatch, history }) {  // eslint-disable-line
		// },
	},

	effects: {

		*importData({ payload }, { put, select }) {
			let res = yield importData(payload);
			if (res.data.result === 0) {
				message.success(res.data.msg)
				return true
			} else {
				message.error(res.data.message)
			}
		},
		*create({ payload }, { put, select }) {
			let res = yield create(payload);
			if (res.data.result === 0) {
				message.success(res.data.msg)
				return true
			} else {
				message.error(res.data.msg)
			}
		},
		*exit({ payload }, { put, select }) {
			let res = yield exit(payload);
			if (res.data.result === 0) {
				message.success(res.data.msg)
				return true
			} else {
				message.error(res.data.msg)
			}
		},
		*getGrade({ payload }, { put, select }) {
			let res = yield schoolInfo(payload);
			yield put({
				type: 'grades',
				payload: res.data.data
			})
		},
		*initStudentList({ payload }, { put, select }) {
			let { tealist } = yield select(state => state.homePage);
			if(payload.init&&tealist.data.length){
				let arr=tealist.data.map(item => {
					if(item.questionHook){
						delete item.questionHook
					}
					return {...item,qustionlist:payload.data}
				})
				yield put({
					type: 'tealist',
					payload: {...tealist,data:arr}
				})
			}
		},
		*initStudentList1({ payload }, { put, select }) {
			yield put({
				type: 'tealist',
				payload: payload.data
			})
		},
		*disabledStudentQuestions({ payload }, { put, select }) {
			let { tealist } = yield select(state => state.homePage);
			if(payload.init&&tealist.data.length){
				let arr=tealist.data.map(item => {
					return {...item,qustionlist:payload.data}
				})
				yield put({
					type: 'tealist',
					payload: {...tealist,data:arr}
				})
			}
			yield put({
				type: 'tealist',
				payload: payload.data
			})
		},
		*remove({ payload }, { put, select }) {
			//移除用户权限
			console.log('移除用户权限: ');
			let res = yield remove(payload);
			if (res.data && res.data.result === 0) {
				message.success("修改成功")
				yield put({
					type: 'classHome/getClassList',
				})
				yield put({
					type: 'teacherList',
					payload: {
						type: 1
					}
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
		*assign({ payload }, { put, select }) {
			//指派用户权限
			let res = yield assign(payload);
			if (res.data && res.data.result === 0) {
				message.success("修改成功")
				yield put({
					type: 'classHome/getClassList',
				})
				yield put({
					type: 'teacherList',
					payload: {
						type: 1
					}
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

		*ifpush({ payload }, { put, select }) {

			yield pushMarker(payload);
		},
		*wxCode({ payload }, { put, select }) {
			let res = yield wxCode(payload);
			return res.data
		},
		*updateChild({ payload }, { put, select }) {
			let res = yield updateChild(payload);
			if (res.data && res.data.result === 0) {
				message.success('修改成功')
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
		*makeUserDateWB({ payload }, { put, select }) {
			let res = yield makeUserDateWB(payload);
			if (res.data && res.data.result === 0) {
				return res.data.data
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
		*membersForSA({ payload }, { put, select }) {
			let res = yield membersForSA(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'dcStudentList',
					payload: res.data.data
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
		*exportSubject({ payload }, { put, select }) {
			let { years } = yield select(state => state.temp);
			payload.year = years;
			let res = yield getSubjectList(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'subjectList',
					payload: res.data.data
				})
				return res.data.data
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
		*exportClass({ payload }, { put, select }) {
			let res = yield pageClass(payload);
			if (!res.data.data.hasOwnProperty('list')) {
				res.data.data.list = []
			}
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'dcclassList',
					payload: res.data.data.list
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
			})

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
			try {
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
						if (res.data.result === 2) {
							yield put(routerRedux.push('/login'))
						} else if (res.data.msg == '服务器异常') {

						} else {
							message.error(res.data.msg)
						}
					}
			} catch (e) {
				console.error('获取区域信息错误' + e)
			}
		},
		*pageRelevantSchool({ payload }, { put, select }) {
			// 学校列表返回
			yield put({
				type: 'schoolPay',
				payload: payload
			})
			let res = yield pageRelevantSchool(payload);
			if (!res.data.data.hasOwnProperty('list')) {
				res.data.data.list = []
			}
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
				// yield put({
				// 	type: 'changeMasterName',
				// 	payload: res.data.data.masterName
				// })
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

				//校管姓名和电话整合
				if (res.data.data.hasOwnProperty('managerNames')) {
					return {
						effStart: res.data.data.effStart,
						effEnd: res.data.data.effEnd,
						managerNames: res.data.data.managerNames,
						managerPhones: res.data.data.managerPhones
					}
				} else {
					return {
						effStart: res.data.data.effStart,
						effEnd: res.data.data.effEnd,
					}
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
		*changeSchool({ payload }, { put, select }) {
			// 修改学校信息
			let { changeUpperLimit, changeSchoolType, phaseId, schoolName, address, des, schoolPay, provinces, citys, areas, schoolInfo } = yield select(state => state.homePage);
			let data = {
				...payload,
				schoolName: schoolName,
				address: address,
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
				message.success('修改成功')

			}
			else if (res.err) {
				// yield put(routerRedux.push('/login'))
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.message)
				}
			}

		},
		*deleteSchool({ payload }, { put, select }) {
			// 删除学校
			let { schoolPay } = yield select(state => state.homePage)
			let res = yield deleteSchool(payload);
			if (res.data && res.data.result === 0) {
				message.success('删除成功')
				yield put({
					type: 'pageRelevantSchool',
					payload: schoolPay
				})
			}
			else if (res.err) {
				// yield put(routerRedux.push('/login'))
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else {
					message.error(res.data.msg)
				}
			}

		},
		*addSchool({ payload }, { put, select }) {
			// 修改学校信息
			let { phaseId, schoolName, masterName, masterPhone, address, schoolPay, citys, provinces, areas, schoolType } = yield select(state => state.homePage)
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
				...payload
			}
			let res = yield addSchool(data);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'pageRelevantSchool',
					payload: schoolPay
				})
				message.success('添加成功')
			}
			else if (res.data.result === 2) {
				yield put(routerRedux.push('/login'))
			} else {
				message.error(res.data.message)
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
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		teacherList: [function* ({ payload }, { put, select }) {
			let hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : "");
			let _type=payload.type
			
			if(hashStrings.includes('/questionFetch')){
				_type=3
			}
			let { infoClass, infoSchool } = yield select(state => state.homePage);
			let userNews = store.get('wrongBookNews');

			console.log('infoClass, infoSchool: ', infoClass, infoSchool);
			let data = {
				type: _type,
				schoolId: userNews.schoolId,
				page: 1,
				pageSize: 9999
			}
			if (infoClass) {
				data.classId = infoClass
			}else{
				yield put({
					type: 'tealist',
					payload: []
				})
				return console.log('当前查询没有classId...')
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
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}
		}, { type: 'takeLatest' }],
		*createSchoolUser({ payload }, { put, select }) {
			// 学年返回
			let res = yield createSchoolUser(payload);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else if (res.data && res.data.result === 0) {
				message.success('添加成功')
				let data = {
					type: 1
				}
				yield put({
					type: 'teacherList',
					payload: data
				})
				return true
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.message)
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
					if (res.data.result === 2) {
						yield put(routerRedux.push('/login'))
					} else if (res.data.msg == '服务器异常') {

					} else {
						message.error(res.data.msg)
					}
				}
		},
		*batchExit({ payload }, { put, select }) {

			if (!payload.classId) {
				message.warning('未选中班级')
				return
			}
			let res = yield batchExit(payload);

			if (res.data && res.data.result === 0) {
				message.success(res.data.msg)
			} else if (res.data.result === 2) {
				yield put(routerRedux.push('/login'))
			} else {
				message.error(res.data.msg)
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
				//如果不存在上次记忆的学年，则默认选择第一个
				let _year=res.data.data[0]
				if (!store.get('wrongBookNews').memoryYears) {
					console.log('默认学年')
					//默认学年要更新一下years
				
				} else {
					//加载完后，删除学年记忆
					let cun = store.get('wrongBookNews');
					console.log('store year cun: ', cun);
					_year=cun.memoryYears
					delete (cun.memoryYears);
					store.set('wrongBookNews', cun)
				}
				yield put({
					type: 'temp/years',
					payload: _year
				})
				return _year
			}
			else if (res.hasOwnProperty("err")) {
				// yield put(routerRedux.push('/login'))
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}

		},
		*care({ payload }, { put, select }) {
			let res = yield care(payload);
			if (res.data && res.data.result === 0) {
				message.success('修改成功')
			} else {
				message.error(res.data.msg)
			}
		},
		*refundStudents({ payload }, { put, select }) {
			let res = yield refundStudents(payload);
			if (res.data && res.data.result === 0) {
				message.success('退款成功')
			} else {
				message.error(res.data.msg)
			}
		},
		*addStudent({ payload }, { put, select }) {
			let res = yield addStudent(payload);
			if (res.data && res.data.result === 0) {
				message.success('添加成功')
			} else {
				message.error(res.data.msg)
			}
		},

		*changeStudent({ payload }, { put, select }) {
			let res = yield changeStudent(payload);
			if (res.data && res.data.result === 0) {
				message.success('修改成功')
			} else {
				message.error(res.data.msg)
			}
		},
		*resetPassword({ payload }, { put, select }) {
			let res = yield resetPassword(payload);
			if (res.data && res.data.result === 0) {
				message.success('重置密码成功')
			} else {
				message.error(res.data.msg)
			}
		},
		*kickClass({ payload }, { put, select }) {
			let res = yield kickClass(payload);
			if (res.data && res.data.result === 0) {
				message.success('删除成功')
				yield put({
					type: 'teacherList',
					payload: {
						type: 1
					}
				})
			} else {
				message.error(res.data.msg)
			}
		},
	},



};
