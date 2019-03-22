import {
	queryScoreDetail,
	queryQuestionDetail,
	homeworkDetail,
	getUserSubjectList,
	getQrMonthList,
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
		className:'',
		workName:'',
		workId:'',
		workDetail:[],
		subList:[],
		years:2019,
		mounthList:[],
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
		className(state, {payload}) {
			return { ...state, className:payload };
		},
		workName(state, {payload}) {
			return { ...state, workName:payload };
		},
		workId(state, {payload}) {
			return { ...state, workId:payload };
		},
		workDetail(state, {payload}) {
			return { ...state, workDetail:payload };
		},
		subList(state, {payload}) {
			return { ...state, subList:payload };
		},
		mounthList(state, {payload}) {
			return { ...state, mounthList:payload };
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
			if(res.data && res.data.result === 0){
				
				yield put ({
					type: 'queryHomeworkList',
					payload:{
						classId:res.data.data.list[0].classId
					}
				})
				
				yield put ({
					type: 'className',
					payload:res.data.data.list[0].className
				})
				yield put ({
					type: 'getUserSubjectList',
					payload:res.data.data.list[0].classId
				})
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
		*getClassList({payload}, {put, select}) {
			// 返回教师所在班级列表
			let res = yield getClassList(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'queryHomeworkList',
					payload:{
						classId:res.data.data[0].classId
					}
				})
				yield put ({
					type: 'className',
					payload:res.data.data[0].className
				})
				
				yield put ({
					type: 'getUserSubjectList',
					payload:res.data.data[0].classId
				})

				yield put ({
					type: 'classList1',
					payload:res.data
				})
				
			}else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
			
		},
		*getUserSubjectList({payload}, {put, select}) {
			// 返回教师所在班级科目
			let {years} = yield select(state => state.temp)
			let data={
				classId:payload,
				year:years
			}
			let res = yield getUserSubjectList(data);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'subList',
					payload:res.data
				})
				
				yield put ({
					type: 'getQrMonthList',
					payload:{
						classId:payload,
						year:years,
						subjectId:res.data.data[0].v
					}
				})
			}else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
			
		},
		*getQrMonthList({payload}, {put, select}) {
			// 返回教师所在班级科目
			let {years} = yield select(state => state.temp)
			let data={
				classId:payload,
				year:years
			}
			let res = yield getQrMonthList(data);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'mounthList',
					payload:res.data
				})
			}else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
			
		},
		*queryHomeworkList({payload}, {put, select}) {
			// 返回班级作业列表
			let res = yield queryHomeworkList(payload);
			if(res.data.result === 0){
				if(res.data.data.length > 0 ){
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
						type: 'workId',
						payload:res.data.data[0].homeworkId
					})
					yield put ({
						type: 'workName',
						payload:res.data.data[0].name
					})
					yield put ({
						type: 'workList',
						payload:res.data
					})
				}else{
					message.warning('此班级暂无作业')
					yield put ({
						type: 'workList',
						payload:res.data
					})
				}
				
			}else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
		},


		*queryScoreDetail({payload}, {put, select}) {
			// 导航栏信息
			let res = yield queryScoreDetail(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'scoreList',
					payload:res.data
				})
			}
			else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
		},
		*queryQuestionDetail({payload}, {put, select}) {
			// 导航栏信息
			let res = yield queryQuestionDetail(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'QuestionDetail',
					payload:res.data
				})
			}
			else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
		},
		*homeworkDetail({payload}, {put, select}) {
			// 导航栏信息
			let res = yield homeworkDetail(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'workDetail',
					payload:res.data
				})
			}
			else{
				message.error(res.data.msg)
				yield put(routerRedux.push('/login'))
			}
		},

	},

  
	
  
  };
  