
import {loginTiku} from '../services/loginService';
import {routerRedux} from 'dva/router';
import store from 'store';
import { message } from 'antd';

export default {

	namespace: 'login',
  
	state: {
		identity: '',
		certification: '',
	},
	reducers: {
		changeUsername(state, {payload}) {
			return {...state, identity: payload};
		},
		changePassword(state, {payload}) {
			return {...state, certification: payload};
		},
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*login({payload}, {put, select}) {
			// 业务逻辑
			store.set('wrongBookToken','')
			let {identity, certification} = yield select(state => state.login);
			let res = yield loginTiku(identity, certification);
			if(!res.hasOwnProperty("err")){
				if(res.data.result === 0 ){
					let data = res.data
					store.set('wrongBookNews',data.data)
					store.set('wrongBookToken',data.data.token)
					let rodeType = data.data.rodeType;
					if(rodeType === 10){
						yield put(routerRedux.push({
							pathname: '/school',
							hash:"page=1"
						}))
					}else 
					// if(rodeType ===20){
					// 	yield put(routerRedux.push({
					// 		pathname: '/schoolNews',
					// 	}))
					// }else 
					if(rodeType ===30 || rodeType ===20){
						yield put(routerRedux.push({
							pathname: '/grade',
							hash:"page=1"
						}))
					}
				}else{
					message.warning(res.data.msg)
				}
			}else{
				message.warning(res.data.msg)
				// message.warning('系统错误，请稍后再试')
			}
		},
	},
  
	
  
  };
  