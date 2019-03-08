import {
	pageClass,
    teacherList,
	pageUser,
	updateInfo
} from '../services/classHomeService';
import {
	pageRelevantSchool
} from '../services/homePageService';
import {routerRedux} from 'dva/router';
import store from 'store';
import { message } from 'antd';
export default {

	namespace: 'userInfo',
  
	state: {
		classList: [],
		classNews:[],
		className:'',
		classAdmin:'',
		teachers:[],
		adminId:'',
		classInfoPayload:[],
		schoolList:[],
        schoolId:'',
        userList:[],
        classId:'',
	},
	reducers: {
		classList(state, {payload}) {
			return { ...state, classList:payload };
		},
		teachers(state, {payload}) {
			return { ...state, teachers:payload };
		},
		classInfoPayload(state, {payload}) {
			return { ...state, classInfoPayload:payload };
		},
		schoolList(state, {payload}) {
			return { ...state, schoolList:payload };
		},
		schoolId(state, {payload}) {
			return { ...state, schoolId:payload };
        },
        classId(state, {payload}) {
			return { ...state, classId:payload };
        },
        userList(state, {payload}) {
			return { ...state, userList:payload };
        },
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*pageClass({payload}, {put, select}) {
			// 班级列表
			yield put ({
				type: 'classInfoPayload',
				payload:payload
			})
			let res = yield pageClass(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'classList',
					payload:res.data
				})
			}
			else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
		},
		*teacherList({payload}, {put, select}) {
			// 教师列表查询
			let res = yield teacherList(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'teachers',
					payload:res.data
				})
			}
			else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
		},
		*pageRelevantSchool({payload}, {put, select}) {
			// 学校列表返回
			yield put ({
				type:'schoolPay',
				payload:payload
			})
			let res = yield pageRelevantSchool(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'schoolList',
					payload:res.data
				})
			}else{
				message.err(res.data.msg)
			}
        },
        *pageUser({payload}, {put, select}) {
			// 用户列表
			yield put ({
				type:'schoolPay',
				payload:payload
			})
			let res = yield pageUser(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'userList',
					payload:res.data
				})
			}else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
		},
		*updateInfo({payload}, {put, select}) {
			// 修改个人信息
			let res = yield updateInfo(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				let news = store.get('wrongBookNews');
				news.phone = payload.phone;
				news.userName = payload.name
				news.avatarUrl = payload.headUrl
				store.set('wrongBookNews',news);
				yield put(routerRedux.push('/userInfo'))

			}else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
		},

	},
  
	
  
  };
  