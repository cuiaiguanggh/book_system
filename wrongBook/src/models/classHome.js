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
import {
	pageRelevantSchool
} from '../services/homePageService';
import {routerRedux} from 'dva/router';
import store from 'store';
import { message } from 'antd';
export default {

	namespace: 'classHome',
  
	state: {
		classList: [],
		classList1:[],
		classNews:[],
		className:'',
		classAdmin:'',
		teachers:[],
		adminId:'',
		classInfoPayload:[],
		schoolList:[],
		schoolId:'',
		classId:'',
		workList:[],
		yearList:[],
		nowYear:'',
		sublist:[],
	},
	reducers: {
		classList(state, {payload}) {
			return { ...state, classList:payload };
		},
		classList1(state, {payload}) {
			return { ...state, classList1:payload };
		},
		classNews(state, {payload}) {
			return { ...state, classNews:payload };
		},
		className(state, {payload}) {
			return { ...state, className:payload };
		},
		classAdmin(state, {payload}) {
			return { ...state, classAdmin:payload };
		},
		adminId(state, {payload}) {
			return { ...state, adminId:payload };
		},
		teachers(state, {payload}) {
			return { ...state, teachers:payload };
		},
		classInfoPayload(state, {payload}) {
			return { ...state, classInfoPayload:payload };
		},
		schoolList(state, {payload}) {
			console.log(payload)
			return { ...state, schoolList:payload };
		},
		schoolId(state, {payload}) {
			return { ...state, schoolId:payload };
		},
		classId(state, {payload}) {
			return { ...state, classId:payload };
		},
		workList(state, {payload}) {
			return { ...state, workList:payload };
		},
		yearList(state, {payload}) {
			return { ...state, yearList:payload };
		},
		nowYear(state, {payload}) {
			return { ...state, nowYear:payload };
		},
		sublist(state, {payload}) {
			return { ...state, sublist:payload };
		},
		infoSchool(state, {payload}) {
			return { ...state, infoSchool:payload}
		},
		infoClass(state, {payload}) {
			return { ...state, infoClass:payload}
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
			if(res.data.result != 0 ){
				// yield put(routerRedux.push('/login'))
			}
			if(res.data && res.data.result === 0){
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
		*classInfo({payload}, {put, select}) {
			// 班级信息
			let res = yield classInfo(payload);
			if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'classNews',
					payload:res.data
				})
				yield put ({
					type: 'className',
					payload:res.data.data.className
				})
				yield put ({
					type: 'classAdmin',
					payload:res.data.data.classAdmin
				})
			}
			else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
		},
		*teacherList({payload}, {put, select}) {
			// 教师列表查询
			let {classId,schoolId} = yield select(state => state.classHome)
			let data = {
				type:payload.type,
				classId:classId,
				schoolId:schoolId,
				page:1,
				pageSize:9999
			}
			let res = yield teacherList(data);
			if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'teachers',
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
		*updateClass({payload}, {put, select}) {
			// 修改班级信息
			let {adminId,className,classNews,classInfoPayload,classListPayload} = yield select(state => state.classHome)
			let data = {
				classId:classNews.data.classId,
				className:className,
				adminId:adminId,
			}
			let res = yield updateClass(data);
			if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				const rodeType = store.get('wrongBookNews').rodeType
				if(rodeType === 20 ){

					yield put ({
						type: 'pageClass',
						payload:classInfoPayload
					})
				}else{
					yield put ({
						type: 'getClassList',
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
		*addClass({payload}, {put, select}) {
			// 添加班级
			let {className,adminId,classInfoPayload,schoolId} = yield select(state => state.classHome)
			let data ={
				schoolId:schoolId,
				className:className,
				adminId:adminId
			}
			let res = yield addClass(data);
			if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				const rodeType = store.get('wrongBookNews').rodeType
				console.log(rodeType)
				if(rodeType === 20 ){
					yield put ({
						type: 'pageClass',
						payload:classInfoPayload
					})
				}else{
					yield put ({
						type: 'getClassList',
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
		*deleteClass({payload}, {put, select}) {
			// 删除班级
			let classInfoPayload  = yield select(state => state.classHome)
			let res = yield deleteClass(payload);
			if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'pageClass',
					payload:classInfoPayload
				})
			}
			else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
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
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
		*queryHomeworkList({payload}, {put, select}) {
			// 返回班级作业列表
			let res = yield queryHomeworkList(payload);
			if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'workList',
					payload:res.data
				})
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
		},
		*getClassList({payload}, {put, select}) {
			// 返回教师所在班级列表
			yield put ({
				type: 'classListPayload',
				payload:payload
			})
			let res = yield getClassList(payload);
			if(res.data.result != 0){
				// yield put(routerRedux.push('/login'))
			}
			if(res.data && res.data.result === 0){
				// yield put ({
				// 	type: 'queryHomeworkList',
				// 	payload:{
				// 		classId:res.data.data[0].classId
				// 	}
				// })

				yield put ({
					type: 'classList1',
					payload:res.data
				})
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
		*getYears({payload}, {put, select}) {
			// 学年返回
			let res = yield getYears(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'yearList',
					payload:res.data
				})
				yield put ({
					type: 'nowYear',
					payload:res.data.data[0]
				})
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},

	},
  
	
  
  };
  