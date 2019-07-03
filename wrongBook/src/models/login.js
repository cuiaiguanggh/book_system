
import {
	loginTiku,
	getVC,
	checkVC,
	updateInfo,
	webchatLoginForWeb,
} from '../services/loginService';
import {routerRedux} from 'dva/router';
import store from 'store';
import { message } from 'antd';

const delay = (ms) => new Promise((resolve) => {
	setTimeout(resolve, ms);
  });

export default {

	namespace: 'login',
  
	state: {
		identity: '',
		certification: '',
		vc:0,
		upd:0,
		time:0,
		phone:'',
		token:'',
		pc:0,
	},
	reducers: {
		changeUsername(state, {payload}) {
			return {...state, identity: payload};
		},
		changePassword(state, {payload}) {
			return {...state, certification: payload};
		},
		vc(state, {payload}) {
			return {...state, vc: payload};
		},
		upd(state, {payload}) {
			return {...state, upd: payload};
		},
		vcOk(state, {payload}) {
			let vc = 0;
			let upd = 0;
			return {...state, ...{vc,upd}};
		},
		phone(state, {payload}) {
			return {...state, phone: payload};
		},
		time(state, {payload}) {
			return {...state, time: payload};
		},
		token(state, {payload}) {
			return {...state, token: payload};
		},
		pc(state, {payload}) {
			return {...state, pc: payload};
		},
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*login({payload}, {put, select}) {
			// 登录
			store.set('wrongBookToken','')
			let {identity, certification} = yield select(state => state.login);
			let res = yield loginTiku(payload);
			// if(!res.hasOwnProperty("err")){
				if(res.data.result === 0 ){
					let data = res.data;
					if(payload.rem){
						let tim = new Date()*1;
						store.set('logTime',tim)
					}else{
						store.set('logTime','')
					}
					store.set('wrongBookNews',data.data);
					store.set('wrongBookToken',data.data.token);
					let rodeType = data.data.rodeType;
					
					yield put ({
						type: 'temp/classList1',
						payload:[]
					})
					yield put ({
						type: 'report/changeMouth',
						payload:0
					})



					if(rodeType === 10){
						yield put(routerRedux.push({
							pathname: '/school',
							hash:'page=1'
						}))
					}else if(rodeType ===20){
						yield put(routerRedux.push({
							pathname: '/classReport',
							// hash:'page=1'
						}))
					}else if(rodeType ===30 || rodeType ===40){
						yield put(routerRedux.push({
							pathname: '/classReport',
						}))
					}
				}else{
					if(res.data.msg == '无效TOKEN!'){
						yield put(routerRedux.push('/login'))
					}else if(res.data.msg == '服务器异常'){
	
					}else{
						message.error(res.data.msg)
					}
				}
		},
		*getVC({payload}, {put, select}) {
			// 获取验证码
			let res = yield getVC(payload);
			// if(!res.hasOwnProperty("err")){
				if(res.data.result === 0 ){
					yield put ({
						type: 'pc',
						payload:1
					})
				}else{
					yield put ({
						type: 'pc',
						payload:0
					})
					message.error(res.data.msg)
				}
		},
		*codelog({payload}, {put, select}) {
			// code登陆
			let res = yield webchatLoginForWeb(payload);
			// if(!res.hasOwnProperty("err")){
				if(res.data.result === 0 ){
					yield put ({
						type: 'codeType',
						payload:false
					})
					let data = res.data
					store.set('wrongBookNews',data.data)
					store.set('accessToken',data.data.accessToken)
					store.set('wrongBookToken',data.data.token)
					if(data.data.phone == '' || data.data.phone == null) {
						yield put(routerRedux.push('/getPhone'))
					}else{
						let rodeType = data.data.rodeType;
						yield put ({
							type: 'temp/classList1',
							payload:[]
						})
						yield put ({
							type: 'report/changeMouth',
							payload:0
						})
						
						if(rodeType === 10){
							yield put(routerRedux.push({
								pathname: '/school',
								hash:'page=1'
							}))
						}else if(rodeType ===20){
							yield put(routerRedux.push({
								pathname: '/grade',
								hash:'page=1'
							}))
						}else if(rodeType ===30 || rodeType ===40){
							yield put(routerRedux.push({
								pathname: '/classReport',
							}))
						}
					}
				}else{
					message.error(res.data.msg)
				}
		},
		*phoneLogin({payload}, {put, select}) {
			// login登陆
			let res = yield loginTiku(payload);
			// if(!res.hasOwnProperty("err")){
			if(res.data.result === 0 ){
				let data = res.data
				if(payload.rem){
					let tim = new Date()*1
					store.set('logTime',tim)
				}else{
					store.set('logTime','')
				}
				store.set('wrongBookNews',data.data)
				store.set('wrongBookToken',data.data.token)
				let rodeType = data.data.rodeType;
				
				yield put ({
					type: 'temp/classList1',
					payload:[]
				})
				yield put ({
					type: 'report/changeMouth',
					payload:0
				})
				
				if(rodeType === 10){
					yield put(routerRedux.push({
						pathname: '/school',
						hash:'page=1'
					}))
				}else if(rodeType ===20){
					yield put(routerRedux.push({
						pathname: '/grade',
						hash:'page=1'
					}))
				}else if(rodeType ===30 || rodeType ===40){
					yield put(routerRedux.push({
						pathname: '/classReport',
					}))
				}
			}else{
				if(res.data.msg == '无效TOKEN!'){
					yield put(routerRedux.push('/login'))
				}else if(res.data.msg == '服务器异常'){

				}else{
					message.error(res.data.msg)
				}
			}
		},
		*checkVC({payload}, {put, select}) {
			// 校验验证码
			let res = yield checkVC(payload);
			// if(!res.hasOwnProperty("err")){
				if(res.data.result === 0 ){
					yield put ({
						type: 'vc',
						payload:1
					})
					yield put ({
						type:'token',
						payload:res.data.data
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
			// 校验验证码
			let {time} = yield select(state => state.login);

			let res = yield updateInfo(payload);
			// if(!res.hasOwnProperty("err")){
				if(res.data.result === 0 ){
					yield put ({
						type: 'phone',
						payload:''
					})
					yield put ({
						type: 'upd',
						payload:1
					})
					yield put ({
						type: 'reduceTime',
					})
				}else{
					if(res.data.msg == '无效TOKEN!'){
						message.error('修改失败，请稍后再试')
						yield put(routerRedux.push('/login'))
					}else if(res.data.msg == '服务器异常'){
	
					}else{
						message.error(res.data.msg)
					}
				}
		},
		*reduceTime({payload}, {put, call}) {
			// 校验验证码
			yield call(delay, 3000);
			yield put ({
				type: 'vcOk',
			})
			yield put(routerRedux.push('/login'))
		},
	},
  };
