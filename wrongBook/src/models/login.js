
import {
	loginTiku,
	getVC,
	checkVC,
	updateInfo,
} from '../services/loginService';
import {routerRedux} from 'dva/router';
import store from 'store';
import { message } from 'antd';

export default {

	namespace: 'login',
  
	state: {
		identity: '',
		certification: '',
		vc:0,
		upd:0,
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

					if(rodeType === 10){
						yield put(routerRedux.push({
							pathname: '/school',
							hash:'page=1'
						}))
					}else {
					// if(rodeType ===20){
					// 	yield put(routerRedux.push({
					// 		pathname: '/schoolNew s',
					// 	}))
					// }else 
					// if(rodeType ===30 || rodeType ===20){
						yield put(routerRedux.push({
							pathname: '/classReport',
						}))
					}
				}else{
					message.warning(res.data.msg)
					yield put(routerRedux.push('/login'))
				}
		},
		*getVC({payload}, {put, select}) {
			// 获取验证码
			let res = yield getVC(payload);
			// if(!res.hasOwnProperty("err")){
				if(res.data.result === 0 ){
					
				}else{
					message.warning(res.data.msg)
					yield put(routerRedux.push('/login'))
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
				}else{
					message.warning(res.data.msg)
					yield put(routerRedux.push('/login'))
				}
		},
		*updateInfo({payload}, {put, select}) {
			// 校验验证码
			let res = yield updateInfo(payload);
			// if(!res.hasOwnProperty("err")){
				if(res.data.result === 0 ){
					yield put ({
						type: 'upd',
						payload:1
					})
				}else{
					message.warning(res.data.msg)
					yield put(routerRedux.push('/login'))
				}
		},
	},
  };
  