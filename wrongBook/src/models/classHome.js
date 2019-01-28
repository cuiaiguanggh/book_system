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
		workList:[],
		yearList:[],
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
		workList(state, {payload}) {
			return { ...state, workList:payload };
		},
		yearList(state, {payload}) {
			return { ...state, yearList:payload };
		},
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*pageClass({payload}, {put, select}) {
			console.log(payload)
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
				message.err(res.data.msg)
			}
		},
		*classInfo({payload}, {put, select}) {
			// 班级信息
			let res = yield classInfo(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
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
				message.err(res.data.msg)
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
				message.err(res.data.msg)
			}
		},
		*updateClass({payload}, {put, select}) {
			// 修改班级信息
			let {adminId,className,classNews,classInfoPayload} = yield select(state => state.classHome)
			let data = {
				classId:classNews.data.classId,
				className:className,
				adminId:adminId,
			}
			let res = yield updateClass(data);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'pageClass',
					payload:classInfoPayload
				})
			}
			else{
				message.err(res.data.msg)
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
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'pageClass',
					payload:classInfoPayload
				})
			}
			else{
				message.err(res.data.msg)
			}
		},
		*deleteClass({payload}, {put, select}) {
			// 删除班级
			let {adminId,className,classNews,classInfoPayload} = yield select(state => state.classHome)
			let res = yield deleteClass(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'pageClass',
					payload:classInfoPayload
				})
			}
			else{
				message.err(res.data.msg)
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
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'schoolList',
					payload:res.data
				})
			}else{
				message.err(res.data.msg)
			}
			
		},
		*queryHomeworkList({payload}, {put, select}) {
			// 返回班级作业列表
			console.log(payload)
			let res = yield queryHomeworkList(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'workList',
					payload:res.data
				})
			}else{
				message.err(res.data.msg)
			}
		},
		*getClassList({payload}, {put, select}) {
			// 返回教师所在班级列表
			console.log(payload)
			let res = yield getClassList(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'classList1',
					payload:res.data
				})
			}else{
				message.err(res.data.msg)
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
			}else{
				message.err(res.data.msg)
			}
			
		},

	},
  
	
  
  };
  