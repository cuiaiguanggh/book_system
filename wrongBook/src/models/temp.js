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
import moment from 'moment';
import { message } from 'antd';
export default {

	namespace: 'temp',
  
	state: {
		className:'',
		classId:'',
		classList: [],
		classList1:[],
		subList:[],
		mounthList:[],
		years:moment().format('YYYY'),
		subId:'',
		subName:'',

		scoreList:[],
		QuestionDetail:[],
		classInfoPayload:[],
		schoolId:'',
		workList:[],
		workName:'',
		workId:'',
		workDetail:[],
	},
	reducers: {
		className(state, {payload}) {
			return { ...state, className:payload };
		},
		classId(state, {payload}) {
			let classList = state.classList1;
			let className= '';
			let classId = payload;
			for( let i = 0 ; i < classList.data.length ; i++ ) {
				if( classList.data[i].classId == payload ) {
					className = classList.data[i].className
				}
			}
			console.log(className)
			return { ...state, ...{classId,className} };
		},
		classList(state, {payload}) {
			return { ...state, classList:payload };
		},
		classList1(state, {payload}) {
			return { ...state, classList1:payload };
		},
		subList(state, {payload}) {
			return { ...state, subList:payload };
		},
		mounthList(state, {payload}) {
			return { ...state, mounthList:payload };
		},
		years(state, {payload}) {
			return { ...state, years:payload };
		},
		subId(state, {payload}) {
			let subList = state.subList;
			let subName= '';
			let subId = payload;
			for( let i = 0 ; i < subList.data.length ; i++ ) {
				if( subList.data[i].v == payload ) {
					subName = subList.data[i].k

				}
			}
			return { ...state,...{ subId,subName} };
		},
		subName(state, {payload}) {
			return { ...state, subName:payload };
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
					type: 'className',
					payload:res.data.data.list[0].className
				})
				yield put ({
					type: 'classId',
					payload:res.data.data.list[0].classId
				})

				// yield put ({
				// 	type: 'report/queryHomeworkList',
				// 	payload:{
				// 		classId:res.data.data.list[0].classId,
				// 	}
				// })
				
				yield put ({
					type: 'classList',
					payload:res.data
				})
			}
			else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}

			}
		},

		*getClassList({payload}, {put, select}) {
			// 返回教师所在班级列表
			let {classId} = yield select(state => state.temp)
			let res = yield getClassList(payload);
			if(res.data && res.data.result === 0){
				if(res.data.data.length > 0 ){
					if(classId == '') {
						yield put ({
							type: 'classList1',
							payload:res.data
						})
						
						yield put ({
							type: 'classId',
							payload:res.data.data[0].classId
						})
						yield put ({
							type: 'getUserSubjectList',
							payload:{
								value:res.data.data[0].classId,
								type:0
							}
						})
					}else{
						yield put ({
							type: 'classList1',
							payload:res.data
						})
						yield put ({
							type: 'getUserSubjectList',
							payload:{
								value:classId,
								type:0
							}
						})
					}
				}

				
				
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},

		*getUserSubjectList({payload}, {put, select}) {
			// 返回教师所在班级科目
			let {years,subId,subName} = yield select(state => state.temp)
			let data={
				classId:payload.value,
				year:years
			}
			let res = yield getUserSubjectList(data);
			if(res.data && res.data.result === 0){
				if(res.data.data.length> 0 ){
					if(subId == '' || payload.type == 1){
						yield put ({
							type: 'subList',
							payload:res.data
						})
						
						yield put ({
							type: 'subId',
							payload:res.data.data[0].v
						})
						yield put ({
							type: 'report/queryQrDetail',
							payload:{
								classId:payload.value,
								year:years,
								subjectId:res.data.data[0].v,
								info:0
							}
						})
						
						yield put ({
							type: 'getQrMonthList',
							payload:{
								classId:payload.value,
								year:years,
								subjectId:res.data.data[0].v
							}
						})
						yield put ({
							type: 'report/queryHomeworkList',
							payload:{
								classId:payload.value,
								subjectId:res.data.data[0].v
							}
						})
					}else{
						yield put ({
							type: 'subList',
							payload:res.data
						})
						yield put ({
							type: 'report/queryQrDetail',
							payload:{
								classId:payload.value,
								year:years,
								subjectId:subId,
								info:0
							}
						})
						
						yield put ({
							type: 'getQrMonthList',
							payload:{
								classId:payload.value,
								year:years,
								subjectId:subId
							}
						})
						yield put ({
							type: 'report/queryHomeworkList',
							payload:{
								classId:payload.value,
								subjectId:subId
							}
						})
					}
				}
				
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
		
		*getQrMonthList({payload}, {put, select}) {
			// 返回教师所在班级科目
			let res = yield getQrMonthList(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'mounthList',
					payload:res.data
				})
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
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
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
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
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
		},

	},

  
	
  
  };
  