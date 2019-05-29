import {
	pageClass,
    teacherList,
	pageUser,
	updateInfo,
	getSubjectList,
	getUserInfo,
} from '../services/classHomeService';
import {
	getReportTimeList,querySchoolDataReport,queryGradeDataBySchoolId
} from '../services/reportService';
import {
	pageRelevantSchool
} from '../services/homePageService';
import {routerRedux} from 'dva/router';
import store from 'store';
import { message } from 'antd';
export default {

	namespace: 'reportChart',
  
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
		userData:[],
		subjectId:'',
		gradeId:'',
		phone:'',
		reportTimeList:[],
		schoolDataReport:{},
		periodTime: 100,
		timeStamp: 100,
		startTime:'',
		endTime:'',
		sgradeList:[],
		sclassList:[],
		searchData:[],
	},
	reducers: {
		searchData(state,{payload}){
			return { ...state, searchData:payload };
		},
		sgradeList(state,{payload}){
			return { ...state, sgradeList:payload };
		},
		sclassList(state,{payload}){
			return { ...state, sclassList:payload };
		},
		periodTime(state,{payload}){
			return { ...state, periodTime:payload };
		},
		timeStamp(state,{payload}){
			return { ...state, timeStamp:payload };
		},
		reportTimeList(state,{payload}){
			return { ...state, reportTimeList:payload };
		},
		startTime(state,{payload}){
			return { ...state, startTime:payload };
		},
		endTime(state,{payload}){
			return { ...state, endTime:payload };
		},
		schoolDataReport(state,{payload}){
			return { ...state, schoolDataReport:payload };
		},
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
		gradeId(state, {payload}) {
			return { ...state, gradeId:payload };
    },
		schoolId(state, {payload}) {
			return { ...state, schoolId:payload };
    },
    classId(state, {payload}) {
			return { ...state, classId:payload };
    },
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
		*getReportTimeList({}, {put, select}) {
			let res = yield getReportTimeList();
			if(res.data){
				let arr=res.data.data
				for(let i=0;i<arr.length;i++){
					if(arr[i].periodTime===1){
						arr[i].name='本学年'
					}else if(arr[i].periodTime===2){
						arr[i].name='本学期'
					}else if(arr[i].periodTime===3){
						arr[i].name='本月'
					}else if(arr[i].periodTime===4){
						arr[i].name='本周'
					}
				}
				yield put ({
					type: 'reportTimeList',
					payload:res.data.data
				})

				let gradeData=yield queryGradeDataBySchoolId()
				console.error('年级信息',gradeData)
				if(gradeData){
					let {subList} = yield select(state => state.temp)
					let {classList1} = yield select(state => state.temp)
					yield put ({
						type: 'classId',
						payload:classList1.data[0].classId
					})
					yield put ({
						type: 'subjectId',
						payload:subList.data[0].v
					})
					yield put ({
						type: 'periodTime',
						payload:1
					})
					yield put ({
						type: 'timeStamp',
						payload:res.data.data[0].timeStamp
					})
					let data={
						schoolId:store.get('wrongBookNews').schoolId,
						periodTime:1,
						timeStamp:res.data.data[0].timeStamp,
						classId:classList1.data[0].classId,
						subjectId:subList.data[0].v
					}
					let schoolRes= yield querySchoolDataReport(data);		
					if(schoolRes.data.result===0){
						yield put ({
							type: 'schoolDataReport',
							payload:schoolRes.data.data
						})
						yield put ({
							type: 'searchData',
							payload:schoolRes.data.data.teacherUseDataList
						})
					}else{
						message.error('获取报表失败')
					}
				}else{
					message.error('获取班级信息失败')
				}
				
			}else{
				message.error(res.data.msg)
			}
			
		},
		*getSchoolDataReport({payload}, {put, select}) {

			let schoolRes= yield querySchoolDataReport(payload);		
			if(schoolRes.data.result===0){
				yield put ({
					type: 'schoolDataReport',
					payload:schoolRes.data.data
				})
			}else{
				message.error('获取报表失败')
			}
			
		},
		*getSubjectList({}, {put, select}) {
			// 返回教师所在班级科目
			let res = yield getSubjectList();		
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
				yield put ({
					type: 'userData',
					payload:res.data.data
				})		
				if( res.data.data.subjectId  !== '')	 {
					yield put ({
						type: 'subjectId',
						payload:res.data.data.subjectId
					})		
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
				if(res.data.msg == '无效TOKEN!'){
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
				if(res.data.msg == '无效TOKEN!'){
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
					if(res.data.msg == '无效TOKEN!'){
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
					if(res.data.msg == '无效TOKEN!'){
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
			}else
			if(res.data && res.data.result === 0){
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
				if(res.data.msg == '无效TOKEN!'){
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
  