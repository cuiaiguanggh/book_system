import {
	queryQrDetail,
	queryHomeworkList,
	queryHomeworkScoreDetail,
	queryQrStudentCount,
} from '../services/reportService';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import { message } from 'antd';
export default {

	namespace: 'report',
  
	state: {
		mouNow:0,
		qrdetailList:[],
		qrdetailList1:[],
		homeworkList:[],
		homeworkId:'',
		homeworkName:'',
		scoreDetail:[],
		questionDetail:[],
		userId:'',
		page:1,
		page1:1,
		classNext:0,
		studentList:[],
		
	},
	reducers: {
		qrdetailList(state, {payload}) {
			return { ...state, qrdetailList:payload };
		},
		qrdetailList1(state, {payload}) {
			let list = state.qrdetailList;
			if(payload.data.questionList.length > 0 ) {
				for(let i = 0 ; i < payload.data.questionList.length ; i ++ ) {
					list.data.questionList.push(payload.data.questionList[i])
				}
			}
			return { ...state, qrdetailList:list };
		},
		changeMouth(state, {payload}) {
			return { ...state, mouNow:payload };
		},
		homeworkList(state, {payload}) {
			return { ...state, homeworkList:payload };
		},
		homeworkId(state, {payload}) {
			return { ...state, homeworkId:payload };
		},
		homeworkName(state, {payload}) {
			return { ...state, homeworkName:payload };
		},
		scoreDetail(state, {payload}) {
			return { ...state, scoreDetail:payload };
		},
		questionDetail(state, {payload}) {
			return { ...state, questionDetail:payload };
		},
		userId(state, {payload}) {
			return { ...state, userId:payload };
		},
		page(state, {payload}) {
			console.log(1)
			return { ...state, page:payload };
		},
		page1(state, {payload}) {
			return { ...state, page1:payload };
		},
		classNext(state, {payload}) {
			return { ...state, classNext:payload };
		},
		studentList(state, {payload}) {
			return { ...state, studentList:payload };
		},
		qrStudentDetailList(state, {payload}) {
			return { ...state, qrdetailList1:payload };
		},
		qrStudentDetailList1(state, {payload}) {
			let list = state.qrdetailList1;
			if(payload.data.questionList.length > 0 ) {
				for(let i = 0 ; i < payload.data.questionList.length ; i ++ ) {
					list.data.questionList.push(payload.data.questionList[i])
				}
			}
			return { ...state, qrdetailList1:list };
		},
	},
	subscriptions: {
	  setup({ dispatch, history }) { 
	  },
	},
  
	effects: {
		*queryQrDetail({payload},{put,select}) {
			let {mouNow} = yield select(state => state.report)
			if(mouNow != 0){
				payload.month = mouNow.v
			}
			//账号科目列表
			let res = yield queryQrDetail(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'qrdetailList',
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
		*queryQrStudentCount({payload},{put,select}) {
			let {mouNow} = yield select(state => state.report)
			if(mouNow != 0){
				payload.month = mouNow.v
			}
			//查询班级学生列表
			let res = yield queryQrStudentCount(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'studentList',
					payload:res.data
				})
				let data = {
					classId:payload.classId,
					year:payload.year,
					subjectId:payload.subjectId,
					info:0,
					page:1,
					pageSize:50,
					userId:res.data.data[0].userId
				}
				if(mouNow != 0){
					data.month = mouNow.v
				}
				yield put ({
					type: 'userId',
					payload:res.data.data[0].userId
				})
				yield put ({
					type: 'userQRdetail',
					payload:data
				})
				
			}
			else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}

			}
		},
		*userQRdetail({payload},{put,select}) {
			//查询学生作业列表
			let res = yield queryQrDetail(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'qrStudentDetailList',
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
		*userQRdetail1({payload},{put,select}) {
			//查询学生作业列表
			let res = yield queryQrDetail(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'qrStudentDetailList1',
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
		*queryQrDetail1({payload},{put,select}) {
			//账号科目列表
			let res = yield queryQrDetail(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'qrdetailList1',
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
		*queryHomeworkList({payload},{put,select}) {
			//返回作业列表
			let res = yield queryHomeworkList(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'homeworkList',
					payload:res.data
				})
				if(res.data.data.length > 0){
					yield put ({
						type: 'homeworkId',
						payload:res.data.data[0].homeworkId
					})
					yield put ({
						type: 'homeworkName',
						payload:res.data.data[0].name
					})
	
					yield put ({
						type: 'queryHomeworkScoreDetail',
						payload:{
							homeworkId:res.data.data[0].homeworkId
						}
					})
				}else{
					yield put ({
						type: 'homeworkId',
						payload:''
					})
					yield put ({
						type: 'homeworkName',
						payload:''
					})

					yield put ({
						type: 'scoreDetail',
						payload:[]
					})
					yield put ({
						type: 'questionDetail',
						payload:[]
					})
				}
				
				
			}
			else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}

			}
		},
		*queryHomeworkScoreDetail({payload},{put,select}) {
			//作业信息详情
			let res = yield queryHomeworkScoreDetail(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){

				yield put ({
					type: 'scoreDetail',
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
  