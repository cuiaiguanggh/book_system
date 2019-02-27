import {
	queryScoreDetail,
	queryQuestionDetail,
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
import {routerRedux} from 'dva/router';
import { message } from 'antd';
export default {

	namespace: 'temp',
  
	state: {
		scoreList:[],
		QuestionDetail:[],
		classList: [],
		classList1:[],
		classInfoPayload:[],
		schoolId:'',
		workList:[],
	},
	reducers: {
		scoreList(state, {payload}) {
			return { ...state, scoreList:payload };
		},
		QuestionDetail(state, {payload}) {
			return { ...state, QuestionDetail:payload };
		},
		
		classList(state, {payload}) {
			return { ...state, classList:payload };
		},
		classList1(state, {payload}) {
			return { ...state, classList1:payload };
		},
		classInfoPayload(state, {payload}) {
			return { ...state, classInfoPayload:payload };
		},
		schoolId(state, {payload}) {
			return { ...state, schoolId:payload };
		},
		workList(state, {payload}) {
			return { ...state, workList:payload };
		},
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*pageClass({payload}, {put, select}) {
			console.log(payload)
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
				message.err(res.data.msg)
			}
		},
		*getClassList({payload}, {put, select}) {
			// 返回教师所在班级列表
			let res = yield getClassList(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'queryHomeworkList',
					payload:{
						classId:res.data.data[0].classId
					}
				})

				yield put ({
					type: 'classList1',
					payload:res.data
				})
			}else{
				message.err(res.data.msg)
			}
			
		},
		*queryHomeworkList({payload}, {put, select}) {
			// 返回班级作业列表
			let res = yield queryHomeworkList(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				let data = {
					homeworkId:res.data.data[0].homeworkId,
				}
				
				yield put ({
					type: 'queryScoreDetail',
					payload:data
				})
				yield put ({
					type: 'queryQuestionDetail',
					payload:data
				})

				yield put ({
					type: 'workList',
					payload:res.data
				})
			}else{
				message.err(res.data.msg)
			}
		},


		*queryScoreDetail({payload}, {put, select}) {
			// 导航栏信息
			let res = yield queryScoreDetail(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'scoreList',
					payload:res.data
				})
			}
			else{
				message.err(res.data.msg)
			}
		},
		*queryQuestionDetail({payload}, {put, select}) {
			// 导航栏信息
			let res = yield queryQuestionDetail(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'QuestionDetail',
					payload:res.data
				})
			}
			else{
				message.err(res.data.msg)
			}
		},

	},

  
	
  
  };
  