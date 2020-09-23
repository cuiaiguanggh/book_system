import {
	pageClass,
	subjectNodeList,
	teacherList
} from '../services/classHomeService';
import {
	testPage
} from '../services/tempService';

import {
	areaDiscern,createWork, workList,createPartAndDiscover,workPartList,workPartInfo,examInfo,delPart,publishWork,updateWork,updateGroup,commitQuestions
	,getStudentQuestions
} from '../services/yukeService';

import { routerRedux } from 'dva/router';
import store from 'store';
import { message } from 'antd';
export default {
	namespace: 'workManage',
	state: {
		workPageClass:{
			list:[],
			value:[]
		},
		schoolSubjectList:[],
		schoolSubId:0,
		getWorkListFinish:false,
		workList:[],
		work:{
			info:{},
			patrList:[],
			groupList:[]
		},
		workPartList:[],
		workPartInfo:{},
		logType:false,
		students:[]
	},
	reducers: {
		students(state, { payload }) {
			return { ...state, students: payload };
		},
		logType(state, { payload }) {
			return { ...state, logType: payload };
		},
		workList(state, { payload }) {
			return { ...state, workList: payload };
		},
		getWorkListFinish(state, { payload }) {
			return { ...state, getWorkListFinish: payload };
		},
		schoolSubId(state, { payload }) {
			return { ...state, schoolSubId: payload };
		},
		workPageClass(state, { payload }) {
			return { ...state, workPageClass: payload };
		},
		schoolSubjectList(state, { payload }) {
			return { ...state, schoolSubjectList: payload };
		},
		workPartList(state, { payload }) {
			return { ...state, workPartList: payload };
		},
		workPartInfo(state, { payload }) {
			return { ...state, workPartInfo: payload };
		},
		
	},
	subscriptions: {
		
	},

	effects: {
		getStudents: [function* ({ payload }, { put, select }) {
			yield put({
				type: 'getClassMembersFinish',
				payload: false
			})
			let userNews = store.get('wrongBookNews');
			let data = {
				type: 3,
				schoolId: userNews.schoolId,
				page: 1,
				pageSize: 9999,
				classId:payload.classId
			}
			let _classStudentList=[]
			let res = yield teacherList(data);
			if (res.data && res.data.result === 0&&res.data.data) {
				_classStudentList=res.data.data
			}
			
			yield put({
				type: 'students',
				payload:_classStudentList
			})
			yield put({
				type: 'getClassMembersFinish',
				payload: true
			})
			return _classStudentList

		}],
		*createWork({ payload }, { put, select }){
			let res = yield createWork(payload);
			return res
		},
		
		*uploadImage({ payload }, { put, select }){
			let res = yield testPage();
		},
		*testPage({ payload }, { put, select }){
			let res = yield testPage(payload);
		},
		*getSchoolSubjectList({ payload }, { put, select }) {
			let res = yield subjectNodeList();
			let _subs=[]
			if (res.data && res.data.result === 0&&res.data.data) {
				_subs=res.data.data
			} 
			yield put({
				type: 'schoolSubjectList',
				payload: _subs
			})
			if(_subs.length){
				yield put({
					type: 'schoolSubId',
					payload: _subs[0].k
				})
			}
			return _subs
		},
		*getWorkPageClass({ payload }, { put, select }) {
			// 带分页的班级列表查询
			yield put({
				type: 'classHome/getPageClassFinish',
				payload: false
			})
			let res = yield pageClass({
				pageSize: 9999,
				pageNum: 1,
				...payload
			});
			let _classList=[]
			yield put({
				type: 'classHome/getPageClassFinish',
				payload: true
			})
			if (res.data && res.data.result === 0&&res.data.data&&res.data.data.list) {
				_classList=res.data.data.list
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				}  else if(res.data.result!==0){
					message.error(res.data.msg)
				}
				yield put({
					type: 'getClassMembersFinish',
					payload: true
				})
			}
			let _v=''
			if(_classList.length){
				_v=_classList[0].classId
			}
			yield put({
				type: 'workPageClass',
				payload: {
					list:_classList,
					value:[_v]
				}
			})

			return {
				list:_classList,
				value:[_v]
			}
		},
		*getWorkList({ payload }, { put, select }){
			// let res = yield getWorkList(payload);
			// console.log('res: ', res);
			yield put({
				type: 'getWorkListFinish',
				payload: false
			})
			let wres=yield workList(payload)

			
			if(wres.data.result===0){
				if(wres.data.data.list){
					let nwlist=wres.data.data.list.map((item,i)=>{
						return {...item,_index:i+1}
					})
					yield put({
						type: 'workList',
						payload: nwlist||[]
					})
				}
				
			}else{
				message.error('获取作业列表失败：'+wres.data.msg)
			}
			yield put({
				type: 'getWorkListFinish',
				payload: true
			})
			// let data=[]
			// for (let i = 0; i < 100; i++) {
			// 	data.push({
			// 		_index: i,
			// 		_name: `work ${i}`,
			// 		_id: i,
			// 		_classes: [`一年 ${i}班`,`一年 ${i+1}班`],
			// 		_subject:'学科',
			// 		_time:"0907",
			// 	});
			// }
			// yield put({
			// 	type: 'getWorkListFinish',
			// 	payload: true
			// })
			// yield put({
			// 	type: 'workList',
			// 	payload: data
			// })
		},
		*areaDiscern({ payload }, { put, select }){
			let res = yield areaDiscern(payload);
			console.log('areaDiscern res: ', res);

		},
		*createPartAndDiscover({ payload }, { put, select }){
			let res = yield createPartAndDiscover(payload);
			console.log('createPartAndDiscover res: ', res);

		},
		*getWorkPartList({ payload }, { put, select }){
			let res = yield workPartList(payload);
			
			if(res.data.result===0){
				if(res.data.data.list){
					yield put({
						type: 'workPartList',
						payload:res.data.data.list
					})
				}
			}
			console.log('workPartList res: ', res);

		},
		*getWorkPartInfo({ payload }, { put, select }){
			let res = yield workPartInfo(payload);
			
			
			console.log('workPartInfo res: ', res);

		},
		*delPart({ payload }, { put, select }){
			let res = yield delPart(payload);
			if(res.data.result===0){
				
			}
			console.log('examId res: ', res);
		},
		*publishWork({ payload }, { put, select }){
			return  yield publishWork(payload);
		},
		*updateWork({ payload }, { put, select }){
			return  yield updateWork(payload);
		},
		
		*getExamInfo({ payload }, { put, select }){
			let res = yield examInfo({examId:10});
			if(res.data.result===0){
				yield put({
					type: 'work',
					payload: res.data.data
				})
				
			}
			return res.data.data
			console.log('examId res: ', res);
		},
		*addOrUpdateExamGroup({ payload }, { put, select }){
			let res = yield updateGroup(payload);
			
			console.log('examId res: ', res);
		},
		*doCommitQuestions({ payload }, { put, select }){
			let res = yield commitQuestions(payload);
			
			console.log('examId res: ', res);
			return res
		},
		*doGetStudentQuestions({ payload }, { put, select }){
			let res = yield getStudentQuestions(payload);
			
			console.log('examId res: ', res);
			return res.data
		}
	},



};
