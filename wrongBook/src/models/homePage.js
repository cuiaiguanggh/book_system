import {
	functionList,
	pageRelevantSchool,
	schoolInfo,
	updateSchool,
	deleteSchool,
	addSchool,
	teacherList,
	administrativeDivision,
} from '../services/homePageService';
import {routerRedux} from 'dva/router';
import { message } from 'antd';
export default {

	namespace: 'homePage',
  
	state: {
		identity: '',
		certification: '',
		classNews:[],
		pageHomeworkList:[],
		catalogId:'',
		userType:2,
		MenuList:[],
		schoolList:[],
		schoolInfo:[],
		phaseId:1,
		schoolName:'',
		masterName:'',
		masterPhone:'',
		provinces:'',
		citys:'',
		areas:'',
		address:'',
		des:'',
		schoolPay:[],
		tealist:[],
		city:[],
		infoClass:'',
		infoSchool:'',
	},
	reducers: {
		classNews(state, {payload}) {
			return { ...state, classNews:payload };
		},
		city(state, {payload}) {
			return { ...state, city:payload };
		},
		pageHomeworkList(state, {payload}) {
			return { ...state, pageHomeworkList:payload };
		},
		catalogId(state, {payload}) {
			return { ...state, catalogId:payload}
		},
		MenuList(state, {payload}) {
			return { ...state, MenuList:payload}
		},
		schoolList(state, {payload}) {
			return { ...state, schoolList:payload}
		},
		schoolNews(state, {payload}) {
			return { ...state, schoolInfo:payload}
		},
		changeSchoolName(state, {payload}) {
			return { ...state, schoolName:payload}
		},
		changephaseId(state, {payload}) {
			return { ...state, phaseId:payload}
		},
		changeMasterName(state, {payload}) {
			return { ...state, masterName:payload}
		},
		changeMasterPhone(state, {payload}) {
			return { ...state, masterPhone:payload}
		},
		provinces(state, {payload}) {
			return { ...state, provinces:payload}
		},
		citys(state, {payload}) {
			return { ...state, citys:payload}
		},
		areas(state, {payload}) {
			return { ...state, areas:payload}
		},
		changeaddress(state, {payload}) {
			return { ...state, address:payload}
		},
		changedes(state, {payload}) {
			return { ...state, des:payload}
		},
		schoolPay(state, {payload}) {
			return { ...state, schoolPay:payload}
		},
		tealist(state, {payload}) {
			return { ...state, tealist:payload}
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
		*functionList({payload}, {put, select}) {
			// 导航栏信息
			// let res = yield functionList(payload);
			// if(res.hasOwnProperty("err")){
			// 	yield put(routerRedux.push('/login'))
			// }else
			// if(res.data && res.data.result === 0){
			// 	yield put ({
			// 		type: 'MenuList',
			// 		payload:res.data.data
			// 	})
			// }
			// else{
			// 	message.err(res.data.msg)
			// }
			let MenuList = [100,200,300,400]
			yield put ({
				type: 'MenuList',
				payload:MenuList
			})
		},
		
		*administrativeDivision({payload}, {put, select}) {
			// 区域信息返回
			let res = yield administrativeDivision(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'city',
					payload:res.data
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
			console.log(res.hasOwnProperty("err"))
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
		*schoolInfo({payload}, {put, select}) {
			// 学校信息返回
			let res = yield schoolInfo(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'schoolNews',
					payload:res.data
				})
				yield put ({
					type: 'changeSchoolName',
					payload:res.data.data.schoolName
				})
				yield put ({
					type: 'changephaseId',
					payload:res.data.data.phaseId
				})
				yield put ({
					type: 'changeMasterName',
					payload:res.data.data.masterName
				})
				yield put ({
					type: 'changeaddress',
					payload:res.data.data.address
				})
				yield put ({
					type: 'changedes',
					payload:res.data.data.des
				})
			}
			else if(res.err){
				yield put(routerRedux.push('/login'))
			}else{
				message.err(res.data.msg)
			}
			
		},
		*changeSchool({payload}, {put, select}) {
			// 修改学校信息
			let {phaseId,schoolName,masterName, address, des,schoolPay,provinces,citys,areas} = yield select(state => state.homePage)
			let data = {
				schoolId:payload,
				schoolName:schoolName,
				address:address,
				masterName:masterName,
				des:des,
				phaseId:phaseId,
				province:provinces,
				city:citys,
				area:areas
			}
			let res = yield updateSchool(data);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'pageRelevantSchool',
					payload:schoolPay
				})
			}
			else if(res.err){
				yield put(routerRedux.push('/login'))
			}else{
				message.err(res.data.msg)
			}
			
		},
		*deleteSchool({payload}, {put, select}) {
			// 删除学校
			let {schoolPay} = yield select(state => state.homePage)
			let res = yield deleteSchool(payload);
			if(res.data && res.data.result === 0){
				message.success(res.data.msg)
				yield put ({
					type: 'pageRelevantSchool',
					payload:schoolPay
				})
			}
			else if(res.err){
				yield put(routerRedux.push('/login'))
			}else{
				message.err(res.data.msg)
			}
			
		},
		*addSchool({payload}, {put, select}) {
			// 修改学校信息
			let {phaseId,schoolName,masterName,masterPhone, address, des,schoolPay,citys,provinces,areas} = yield select(state => state.homePage)
			let data = {
				schoolName:schoolName,
				address:address,
				masterName:masterName,
				phone:masterPhone,
				des:des,
				phaseId:phaseId,
				province:provinces,
				city:citys,
				area:areas,
			}
			console.log(data)
			let res = yield addSchool(data);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'pageRelevantSchool',
					payload:schoolPay
				})
			}
			else if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else{
				message.err(res.data.msg)
			}
			
		},
		*teacherList({payload}, {put, select}) {
			// 获取教师列表
			console.log(payload)
			let {infoClass,infoSchool} = yield select(state => state.homePage)
			let data = {
				type:payload.type,
				classId:infoClass,
				schoolId:infoSchool,
				page:1,
				pageSize:9999
			}
			let res = yield teacherList(data);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'tealist',
					payload:res.data
				})
			}
			else if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else{
				message.err(res.data.msg)
			}
			
		},
	},
  
	
  
  };
  