import {
	pageClass,
	teacherList
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
	namespace: 'classModel',
	state: {
		pageClassList: [],
		getClassMembersFinish:false,
		classStudentList:[],
		checkClassId:''
	},
	reducers: {
		pageClassList(state, { payload }) {
			return { ...state, pageClassList: payload };
		},
		getClassMembersFinish(state, { payload }) {
			return { ...state, getClassMembersFinish: payload };
		},
		classStudentList(state, { payload }) {
			return { ...state, classStudentList: payload };
		},
		checkClassId(state, { payload }) {
			return { ...state, checkClassId: payload };
		},
		
	},
	subscriptions: {
		
	},

	effects: {
		*getPageClass({ payload }, { put, select }) {
			// 带分页的班级列表查询
			let res = yield pageClass({
				pageSize: 9999,
				pageNum: 1,
				...payload
			});
			let _classList=[]
			if (res.data && res.data.result === 0&&res.data.data&&res.data.data.list) {
				_classList=res.data.data.list
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				}  else if(res.data.result!==0){
					message.error(res.data.msg)
				}
				yield put({
					type: 'getClassMembersFinish',
					payload: true
				})
			}
			yield put({
				type: 'pageClassList',
				payload: _classList
			})
			if(_classList.length){
				yield put({
					type: 'checkClassId',
					payload:_classList[0].classId
				})
			}else{
				yield put({
					type: 'classStudentList',
					payload:[]
				})
				
			}
			return _classList
		},
		getClassMembers: [function* ({ payload }, { put, select }) {
			// let { getClassMembersFinish } = yield select(state => state.classModel)
			// if(getClassMembersFinish){
			// 	yield put({
			// 		type: 'getClassMembersFinish',
			// 		payload: false
			// 	})
			// }
			yield put({
				type: 'getClassMembersFinish',
				payload: false
			})
			let userNews = store.get('wrongBookNews');
			let data = {
				type: payload.type,
				schoolId: userNews.schoolId,
				page: 1,
				pageSize: 9999,
				classId:payload.classId
			}
			let _classStudentList=[]
			let res = yield teacherList(data);
			if (res.data && res.data.result === 0&&res.data.data) {
				_classStudentList=res.data.data
			}
			else if (res.hasOwnProperty("err")||res.data.result === 2) {
				yield put(routerRedux.push('/login'))
			} else {
				if (res.data.result !==0) 
				message.error(res.data.msg)
			}
			yield put({
				type: 'classStudentList',
				payload:_classStudentList
			})
			yield put({
				type: 'getClassMembersFinish',
				payload: true
			})

		}],
		*initStudentList({ payload }, { put, select }) {
			let { classStudentList } = yield select(state => state.classModel);
			if(payload&&classStudentList.length){
				let arr=classStudentList.map(item => {
					if(item.questionHook){
						delete item.questionHook
					}
					return {...item,qustionlist:payload}
				})
				yield put({
					type: 'classStudentList',
					payload: arr
				})
			}
		},
		*classInfo({ payload }, { put, select }) {
			// 班级信息
			// let res = yield classInfo(payload);
			// if (res.hasOwnProperty("err")) {
			// 	// yield put(routerRedux.push('/login'))
			// } else
			// 	if (res.data && res.data.result === 0) {
			// 		yield put({
			// 			type: 'classNews',
			// 			payload: res.data
			// 		})
			// 		yield put({
			// 			type: 'className',
			// 			payload: res.data.data.className
			// 		})
			// 		yield put({
			// 			type: 'classAdmin',
			// 			payload: res.data.data.classAdmin
			// 		})
			// 	}
			// 	else {
			// 		if (res.data.result === 2) {
			// 			yield put(routerRedux.push('/login'))
			// 		} else if (res.data.msg == '服务器异常') {

			// 		} else {
			// 			message.error(res.data.msg)
			// 		}
			// 	}
		},
		

	},



};
