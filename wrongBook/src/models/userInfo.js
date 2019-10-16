import {
	pageClass,
    teacherList,
	pageUser,
	updateInfo,
	getUserInfo,
	subjectNodeList,
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
		// classId:'',
		userData:[],
		subjectId:'',
		phone:''
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
		allSubList(state,{payload}){
			return { ...state, allSubList:payload };
		},
		userData(state,{payload}){
			return { ...state, userData:payload };
		},	
		schoolId(state, {payload}) {
			return { ...state, schoolId:payload };
    },
    // classId(state, {payload}) {
		// 	return { ...state, classId:payload };
    // },
    userList(state, {payload}) {
			return { ...state, userLisgetUserInfot:payload };
		},
		subjectId(state, {payload}) {
			return { ...state, subjectId:payload };
		},
		phone(state, {payload}) {
			return { ...state, phone:payload };
		},
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*getSubjectList({}, {put, select}) {
			// 返回教师所在班级科目
			let res = yield subjectNodeList();		
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'allSubList',
					payload:res.data.data
				})			
			}else{
				message.error(res.data.msg)
			}
			
		},
		*getUserInfo({}, {put}) {
			// 返回教师所在班级科目
			let res = yield getUserInfo();			
			if(res.data && res.data.result === 0){
				let abc=store.get('userData');

				res.data.data={name:res.data.data.nickName,...res.data.data,...abc,}

				yield put ({
					type: 'userData',
					payload:res.data.data
				})		
				if( res.data.data.subjectId  !== ''){
					yield put ({
						type: 'subjectId',
						payload:res.data.data.subjectId
					})		
				}
				if( res.data.data.phone  !== ''){
					yield put ({
						type: 'phone',
						payload:res.data.data.phone
					})
				}



			}else{
				message.error(res.data.msg)
			}		
		},
		*pageClass({payload}, {put, select}) {
			// 班级列表
			yield put ({
				type: 'classInfoPayload',
				payload:payload
			})
			let res = yield pageClass(payload);
			if(!res.data.data.hasOwnProperty('list')){
				res.data.data.list=[]
			}
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
				if(res.data.result===2){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
				}
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
				if(res.data.result===2){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
				}
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
					// yield put(routerRedux.push('/login'))
				}else
				if(res.data && res.data.result === 0){
					yield put ({
						type: 'schoolList',
						payload:res.data
					})
				}else{
					if(res.data.result===2){
						yield put(routerRedux.push('/login'))
					}else if(res.data.msg == '服务器异常'){
	
					}else{
						message.error(res.data.msg)
					}
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
					if(res.data.result===2){
						yield put(routerRedux.push('/login'))
					}else if(res.data.msg == '服务器异常'){
	
					}else{
						message.error(res.data.msg)
					}
				}
			},
		*updateInfo({payload}, {put, select}) {
			// 修改个人信息
			let res = yield updateInfo(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else if(res.data && res.data.result === 0){
				let news = store.get('wrongBookNews');
				news.phone = payload.phone;
				news.userName = payload.name
				news.avatarUrl = payload.headUrl
				store.set('wrongBookNews',news);
				yield put ({
					type:'getUserInfo'
				})
				message.success('修改成功')

			}else{
				if(res.data.result===2){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){
					message.error('信息修改失败:'+res.data.msg)
				}else{
					message.error(res.data.msg)
				}
			}
		},

	},
  
	
  
  };
