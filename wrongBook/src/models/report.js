import {
	queryQrDetail,
	queryHomeworkList,
	queryHomeworkScoreDetail,
	queryQrStudentCount,
	deleteTeachVideo,
	queryTeachVideo,
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
		visible:false,
		visible1:false,
		videlUrl:''
	},
	reducers: {
		qrdetailList(state, {payload}) {
			return { ...state, qrdetailList:payload };
		},
		qrdetailList1(state, {payload}) {
			let list = state.qrdetailList;
			if(payload.data && payload.data.questionList.length > 0 ) {
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
		deleteVidio(state, {payload}) {
			let list = state.qrdetailList;
			delete list.data.questionList[payload].teachVideo; 
			return { ...state, qrdetailList:list };
		},
		updataVideo(state, {payload}) {
			let qrdetailList = state.qrdetailList;
			let visible = false;
			qrdetailList.data.questionList[payload.key].teachVideo = payload.video
			return { ...state, ...{qrdetailList,visible} };
		},
		visible(state, {payload}) {
			return { ...state, visible:payload };
		},
		visible1(state, {payload}) {
			return { ...state, visible1:payload };
		},
		videlUrl(state, {payload}) {
			return { ...state, videlUrl:payload };
		},
		addClassup(state, {payload}) {
			let list = state.qrdetailList;
			if( payload.length > 0 ) {
				for(let i = 0 ; i < list.data.questionList.length ; i ++ ) {
					for( let j = 0 ; j < payload.length ; j ++ ) {
						if(list.data.questionList[i].picId == payload[j]){
							list.data.questionList[i].num ++
						}
					}
				}
			}

			return { ...state, qrdetailList:list };
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
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
				}

			}
		},
		*queryQrStudentCount({payload},{put,select}) {
			let {mouNow,userId} = yield select(state => state.report)
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
				if(res.data.data.length > 0 ) {
					let data = {}
					if(userId == ''){
						data = {
							classId:payload.classId,
							year:payload.year,
							subjectId:payload.subjectId,
							info:0,
							pageNum:1,
							pageSize:50,
							userId:res.data.data[0].userId
						}
						yield put ({
							type: 'userId',
							payload:res.data.data[0].userId
						})
					}else{
						data = {
							classId:payload.classId,
							year:payload.year,
							subjectId:payload.subjectId,
							info:0,
							pageNum:1,
							pageSize:50,
							userId:userId
						}
						yield put ({
							type: 'userId',
							payload:userId
						})
					}
					if(mouNow != 0){
						data.month = mouNow.v
					}
					yield put ({
						type: 'userQRdetail',
						payload:data
					})
				}else{
					yield put ({
						type: 'userId',
						payload:''
					})
					yield put ({
						type: 'qrStudentDetailList',
						payload:[]
					})
				}
				
			}
			else{
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
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
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
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
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
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
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
				}

			}
		},
		*queryHomeworkList({payload},{put,select}) {
			//返回作业列表
			let res = yield queryHomeworkList(payload);
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
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
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
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
				}

			}
		},
		*deleteTeachVideo({payload},{put,select}) {
			//删除讲解视频
			let data = {
				videoId:payload.videoId
			}
			let res = yield deleteTeachVideo(data);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				message.success('删除成功')
				yield put ({
					type: 'deleteVidio',
					payload:payload.key
				})
			}
			else{
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
				}

			}
		},
		*queryTeachVideo({payload},{put,select}) {
			//刷新查看是否上传成功
			let data = {
				questionId:payload.questionId
			}
			let res = yield queryTeachVideo(data);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				if( res.data.data ) {
					message.success('视频已上传')
					yield put ({
						type: 'updataVideo',
						payload:{
							key:payload.key,
							video:res.data.data
						}
					})
					yield put ({
						type:  'videlUrl',
						payload:res.data.data.url
					})
					yield put ({
						type: 'visible1',
						payload:true
					})
				}else{
					message.warning('未检测到上传视频')
				}
			}
			else{
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
				}

			}
		},
	},

  
	
  
  };
  