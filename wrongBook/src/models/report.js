import {
	queryQrDetail,
	queryHomeworkList,
	queryUserScoreDetail,
	queryQuestionDetail,
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
	},
	reducers: {
		qrdetailList(state, {payload}) {
			return { ...state, qrdetailList:payload };
		},
		qrdetailList1(state, {payload}) {
			return { ...state, qrdetailList1:payload };
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
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*queryQrDetail({payload},{put,select}) {
			let {userId} = yield select(state => state.report)

			//账号科目列表
			let res = yield queryQrDetail(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'qrdetailList',
					payload:res.data
				})
				if(res.data.data.userCountList.length > 0) {
					let id = userId;
					if(userId == ''){
						yield put ({
							type: 'userId',
							payload:res.data.data.userCountList[0].userId
						})
						id = res.data.data.userCountList[0].userId
					}
					yield put ({
						type: 'queryQrDetail1',
						payload:{
							classId:payload.classId,
							year:payload.year,
							subjectId:payload.subjectId,
							userId:id,
							info:0
						}
					})
				}else{
					yield put ({
						type: 'qrdetailList1',
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
		*queryQrDetail1({payload},{put,select}) {
			//账号科目列表
			console.log(payload)
			let res = yield queryQrDetail(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
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
						type: 'queryUserScoreDetail',
						payload:{
							homeworkId:res.data.data[0].homeworkId
						}
					})
					yield put ({
						type: 'queryQuestionDetail',
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
		*queryUserScoreDetail({payload},{put,select}) {
			//作业信息详情1
			let res = yield queryUserScoreDetail(payload);
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
		*queryQuestionDetail({payload},{put,select}) {
			//作业信息详情2
			let res = yield queryQuestionDetail(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){

				yield put ({
					type: 'questionDetail',
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
  