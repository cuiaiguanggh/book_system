import {
} from '../services/reportService';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import { message } from 'antd';
export default {

	namespace: 'report',
  
	state: {
		mouths:[9,10,11,12,1,2,3,4,5,6,7,8],
		mouNow:moment().format('MM')
	},
	reducers: {
		workDetail(state, {payload}) {
			return { ...state, workDetail:payload };
		},
		changeMouth(state, {payload}) {
			return { ...state, mouNow:payload };
		},
	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		// *pageClass({payload}, {put, select}) {
			// 班级列表
			// yield put ({
			// 	type: 'classInfoPayload',
			// 	payload:payload
			// })
			// let res = yield pageClass(payload);
			// if(res.hasOwnProperty("err")){
			// 	yield put(routerRedux.push('/login'))
			// }else
			// if(res.data && res.data.result === 0){
				
			// 	yield put ({
			// 		type: 'queryHomeworkList',
			// 		payload:{
			// 			classId:res.data.data.list[0].classId
			// 		}
			// 	})
				
			// 	yield put ({
			// 		type: 'className',
			// 		payload:res.data.data.list[0].className
			// 	})
			// 	yield put ({
			// 		type: 'classList',
			// 		payload:res.data
			// 	})
			// }
			// else{
			// 	message.error(res.data.msg)
			// 	yield put(routerRedux.push('/login'))

			// }
		// },
		

	},

  
	
  
  };
  