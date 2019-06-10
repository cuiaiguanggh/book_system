import {
	getSubjectList
} from '../services/classHomeService';
import {
	getReportTimeList,querySchoolDataReport,queryGradeListBySchoolId
	,queryClassListByGradeId,querySubListByClassId,queryClassDataReport,
} from '../services/reportService';

import store from 'store';
import { message } from 'antd';
export default {

	namespace: 'reportChart',
  
	state: {
		schoolId:'',
		sclassId:'',
		subjectId:'',
		cclassId:'',
		csubjectId:'',
		gradeId:'',
		reportTimeList:[],
		schoolDataReport:{},
		classDataReport:{},
		periodTime: 100,
		timeStamp: 100,
		sgradeList:[],
		sclassList:[],
		ssubList:[],
		searchData:[],
		classSearchData:[],
		stateTimeIndex:0,
		noClassData:true,
	},
	reducers: {
		noClassData(state,{payload}){
			return { ...state, noClassData:payload };
		},
		stateTimeIndex(state,{payload}){
			return { ...state, stateTimeIndex:payload };
		},
		searchData(state,{payload}){
			return { ...state, searchData:payload };
		},
		classSearchData(state,{payload}){
			return { ...state, classSearchData:payload };
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
		schoolDataReport(state,{payload}){
			return { ...state, schoolDataReport:payload };
		},
		classDataReport(state,{payload}){
			return { ...state, classDataReport:payload };
		},
		allSubList(state,{payload}){
			return { ...state, allSubList:payload };
		},
		gradeId(state, {payload}) {
			return { ...state, gradeId:payload };
    },
		schoolId(state, {payload}) {
			return { ...state, schoolId:payload };
    },
		sclassId(state, {payload}) {
			return { ...state, sclassId:payload };
    },
		subjectId(state, {payload}) {
			return { ...state, subjectId:payload };
		},
		cclassId(state, {payload}) {
			return { ...state, cclassId:payload };
    },
		csubjectId(state, {payload}) {
			return { ...state, csubjectId:payload };
		},
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*getReportTimeList({payload}, {put, select}) {
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
				if(payload.classReport===true){
					//获取班级报表
					const _state = yield select(state => state.reportChart);
					const _class = yield select(state => state.temp);
					let _ccid=_class.classList1.data[0].classId
					let _sid=_class.subList.data[0].v
					yield put ({
						type: 'cclassId',
						payload:_ccid
					})
					yield put ({
						type: 'csubjectId',
						payload:_sid
					})
					let data={
						classId:_ccid,
						schoolId:store.get('wrongBookNews').schoolId,
						periodTime:_state.periodTime,
						timeStamp:_state.timeStamp,
						subjectId:_sid
					}	
					yield put ({
						type: 'getClassDataReport',
						payload:data,
					})
				}else{
					yield put ({
						type: 'getGradeList',
					})
				}
				
		
			}else{
				message.error(res.data.msg)
			}
			
		},
		*getGradeList({payload}, {put, select}) {
			let _schoolid=store.get('wrongBookNews').schoolId
			let gradeData=yield queryGradeListBySchoolId({schoolId:_schoolid})
			if(gradeData.data.result===0){			
				let glist=gradeData.data.data
				yield put ({
					type: 'sgradeList',
					payload:glist
				})
				if(gradeData.data.data.length===0) return
				yield put ({
					type: 'gradeId',
					payload:glist[0].id
				})

				yield put ({
					type: 'getClassList',
					payload:{schoolId:_schoolid,gradeId:glist[0].id}
				})
				
			}else{
				message.error('获取年级失败')
			}
		},
		*getClassList({payload}, {put, select}) {
			let classData=yield queryClassListByGradeId({schoolId:payload.schoolId,gradeId:payload.gradeId})
			console.error('classData',classData)
					if(classData.data.result===0){
						let clist=classData.data.data				
						yield put ({
							type: 'sclassList',
							payload:clist
						})

						if(clist.length===0){
							yield put ({
								type: 'sclassId',
								payload:''
							})
							yield put ({
								type: 'ssubList',
								payload:[]
							})
							yield put ({
								type: 'noClassData',
								payload:true
							})
							return
						}
						yield put ({
							type: 'sclassId',
							payload:clist[0].id
						})
						const _state = yield select(state => state.reportChart);
						let _classId=clist[0].id
						let data={
							classId:_classId,
							schoolId:store.get('wrongBookNews').schoolId,
							periodTime:_state.periodTime,
							timeStamp:_state.timeStamp,
							subjectId:_state.subjectId
						}		
						yield put ({
							type: 'getSubList',
							payload:data
						})
					}else{
						message.error('获取班级失败')
					}
		},
		*getSubList({payload}, {put, select}) {
			let subData=yield querySubListByClassId({classId:payload.classId})
			let _sublist=subData.data.data
			if(subData.data.result===0){
				
				if(_sublist.length===0){
					yield put ({
						type: '_sublist',
						payload:''
					})
					yield put ({
						type: 'ssubList',
						payload:[]
					})
					yield put ({
						type: 'noClassData',
						payload:true
					})
					return
				}else{
					yield put ({
						type: 'noClassData',
						payload:false
					})
				}
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

				yield put ({
					type: 'getSchoolDataReport',
					payload:data
				})
			}else{
				message.error('获取学科失败')
				return
			}
		},
		*changeSubList({payload}, {put, select}) {
				yield put ({
					type: 'getSchoolDataReport',
					payload:payload
				})		
		},
		
		*getSchoolDataReport({payload}, {put, select}) {
			let schoolRes= yield querySchoolDataReport(payload);	
					
			if(schoolRes.data.result===0){
				yield put ({
					type: 'schoolDataReport',
					payload:schoolRes.data.data
				})
				yield put ({
					type: 'searchData',
					payload:schoolRes.data.data.teacherUseDataList
				})
			}else if(schoolRes.data.result===1){
				yield put ({
					type: 'schoolDataReport',
					payload:'none'
				})
				//message.warning(schoolRes.data.msg)
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
		*getClassDataReport({payload}, {put, select}) {
			let classRes= yield queryClassDataReport(payload);	
			if(classRes.data.result===0){
				yield put ({
					type: 'classDataReport',
					payload:classRes.data.data
				})
				yield put ({
					type: 'classSearchData',
					payload:classRes.data.data.teacherUseDataList
				})

			}else if(classRes.data.result===1){
				yield put ({
					type: 'classDataReport',
					payload:'none'
				})
			}else{
				message.error('获取报表失败')
			}
			
		},
	},
  
	
  
  };
  