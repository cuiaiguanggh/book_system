import {
	pageClass,
    teacherList,
	pageUser,
	updateInfo,
	getSubjectList,
	getUserInfo,
} from '../services/classHomeService';
import {
	getReportTimeList,querySchoolDataReport,queryGradeListBySchoolId
	,queryClassListByGradeId,querySubListByClassId
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
		sclassId:'',
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
		ssubList:[],
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
		ssubList(state,{payload}){
			return { ...state, ssubList:payload };
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
		sclassId(state, {payload}) {
			return { ...state, sclassId:payload };
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
				yield put ({
					type: 'periodTime',
					payload:1
				})
				yield put ({
					type: 'timeStamp',
					payload:res.data.data[0].timeStamp
				})
				let _timeStamp=res.data.data[0].timeStamp
				
				let _schoolid=store.get('wrongBookNews').schoolId
				let gradeData=yield queryGradeListBySchoolId({schoolId:_schoolid})
				console.error('年级信息',gradeData)
				//return
				if(gradeData){

					let glist=gradeData.data.data
					yield put ({
						type: 'sgradeList',
						payload:glist
					})
					yield put ({
						type: 'gradeId',
						payload:glist[0].id
					})
					let classData=yield queryClassListByGradeId({schoolId:_schoolid,gradeId:glist[0].id})
					console.error('班级信息',classData)

					if(classData.data.result===0){
						let clist=classData.data.data
						yield put ({
							type: 'sclassList',
							payload:clist
						})
						yield put ({
							type: 'sclassId',
							payload:clist[0].id
						})
						let _classId=clist[0].id					
						let subData=yield querySubListByClassId({classId:clist[0].id})
						let _sublist=subData.data.data
						if(subData.data.result===0){
							yield put ({
								type: 'ssubList',
								payload:_sublist
							})
							yield put ({
								type: 'subjectId',
								payload:_sublist[0].id
							})
							let _subjectId=_sublist[0].id

							let data={
								schoolId:_schoolid,
								periodTime:1,
								timeStamp:_timeStamp,
								classId:_classId,
								subjectId:_subjectId
							}

							//console.error('请求数据',data)
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
							message.error('获取学科失败')
							return
						}
						//console.error('学科信息',subData)
					}else{
						message.error('获取班级失败')
						return
					}
					
				}else{
					message.error('获取班级信息失败')
				}
				
			}else{
				message.error(res.data.msg)
			}
			
		},
		*getClassList({payload}, {put, select}) {
			let classData=yield queryClassListByGradeId({schoolId:payload.schoolId,gradeId:payload.gradeId})
					if(classData.data.result===0){
						let clist=classData.data.data
						
						yield put ({
							type: 'sclassList',
							payload:clist
						})
						yield put ({
							type: 'sclassId',
							payload:clist[0].id
						})
						//console.error('qqq',clist[0].id)
						let _classId=clist[0].id					
						let subData=yield querySubListByClassId({classId:_classId})
						let _sublist=subData.data.data
						if(subData.data.result===0){
							yield put ({
								type: 'ssubList',
								payload:_sublist
							})
							yield put ({
								type: 'subjectId',
								payload:_sublist[0].id
							})

							let data={
								schoolId:payload.schoolId,
								periodTime:payload.periodTime,
								timeStamp:payload.timeStamp,
								classId:_classId,
								subjectId:_sublist[0].id
							}

							//console.error('请求数据',data)
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
							message.error('获取学科失败')
							return
						}
					}else{
						message.error('获取班级失败')
						return
					}
		},
		*getSubList({payload}, {put, select}) {
			let subData=yield querySubListByClassId({classId:payload.classId})
			let _sublist=subData.data.data
			if(subData.data.result===0){
				yield put ({
					type: 'ssubList',
					payload:_sublist
				})
				yield put ({
					type: 'subjectId',
					payload:_sublist[0].id
				})
				let _subjectId=_sublist[0].id
				let data={
					schoolId:payload.schoolId,
					periodTime:payload.periodTime,
					timeStamp:payload.timeStamp,
					classId:payload.classId,
					subjectId:_subjectId
				}

				console.error('请求数据',data)
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
				message.error('获取学科失败')
				return
			}
		},
		*changeSubList({payload}, {put, select}) {
				let data=payload

			//	console.error('请求数据',data)
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
  