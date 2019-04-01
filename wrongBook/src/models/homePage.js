import {
	functionList,
	pageRelevantSchool,
	schoolInfo,
	updateSchool,
	deleteSchool,
	addSchool,
	teacherList,
	administrativeDivision,
	kickClass,
	createSchoolUser,
	subjectNodeList,
	getEnableYears,
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
		memType:1,
		sublist:[],
		yearList:[],
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
		memType(state, {payload}) {
			return { ...state, memType:payload}
		},
		sublist(state, {payload}) {
			return { ...state, sublist:payload };
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
		*functionList({payload}, {put, select}) {
			// 导航栏信息
			let MenuList = [300,100,200,400]
			yield put ({
				type: 'MenuList',
				payload:MenuList
			})
		},
		
		*administrativeDivision({payload}, {put, select}) {
			// 区域信息返回
			let res = yield administrativeDivision(payload);
			if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'city',
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
		*pageRelevantSchool({payload}, {put, select}) {
			// 学校列表返回
			yield put ({
				type:'schoolPay',
				payload:payload
			})
			let res = yield pageRelevantSchool(payload);
			console.log(res.hasOwnProperty("err"))
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
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
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
				// yield put(routerRedux.push('/login'))
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
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
				// yield put(routerRedux.push('/login'))
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
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
			let res = yield addSchool(data);
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'pageRelevantSchool',
					payload:schoolPay
				})
			}
			else if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
		*teacherList({payload}, {put, select}) {
			// 获取教师列表
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
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
		
		*createSchoolUser({payload}, {put, select}) {
			// 学年返回
			let res = yield createSchoolUser(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				message.success(res.data.msg)
				let data = {
					type:1
				}
				yield put ({
					type: 'teacherList',
					payload:data
				})
				
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
		*subjectNodeList({payload}, {put, select}) {
			let res = yield subjectNodeList(payload);
			if(res.hasOwnProperty("err")){
				yield put(routerRedux.push('/login'))
			}else
			if(res.data && res.data.result === 0){
				yield put ({
					type: 'sublist',
					payload:res.data
				})
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
		*kickClass({payload}, {put, select}) {
			// 用户踢出班级
			let {infoClass,memType} = yield select(state => state.homePage)
			let data = {
				userId:payload.userId,
				classId:infoClass,
			}
			let res = yield kickClass(data);
			if(res.data && res.data.result === 0){
				message.success(res.data.msg)
				yield put ({
					type: 'teacherList',
					payload:{
						type:memType
					}
				})
			}
			else if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
		*getEnableYears({payload}, {put, select}) {
			// 获取学年
			let res = yield getEnableYears(payload);
			if(res.data && res.data.result === 0){
				yield put ({
					type:'yearList',
					payload:res.data
				})
			}
			else if(res.hasOwnProperty("err")){
				// yield put(routerRedux.push('/login'))
			}else{
				message.error(res.data.msg)
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}
			}
			
		},
	},
  
	
  
  };
  