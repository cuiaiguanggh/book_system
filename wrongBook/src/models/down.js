import {
	getQuestionDoxc
} from '../services/reportService';
import {routerRedux} from 'dva/router';
import moment from 'moment';
import { message } from 'antd';
import { parseGeoJSON } from 'echarts/lib/export';
export default {

	namespace: 'down',
  
	state: {
		classDown:[],
		workDown:[],
		stuDown:[],
		stuName:'',
	},
	reducers: {
		classDown(state, {payload}) {
			let classDown = state.classDown
			classDown.push(payload)
			console.log(classDown)
			return { ...state, classDown:classDown };
		},

		delClassDown(state, {payload}) {
			let classDown = state.classDown
			for(let i = 0 ; i < classDown.length ; i++){
				if(classDown[i] == payload){
					classDown.splice(i,1)
				}
			}
			console.log(classDown)
			return { ...state, classDown:classDown};
		},
		delAllClass(state, {payload}) {
			return { ...state, classDown:[]};
		},
		workDown(state, {payload}) {
				let workDown = state.workDown
				workDown.push(payload)
			return { ...state, workDown:workDown };
		},
		delWorkDown(state, {payload}) {
			let workDown = state.workDown
				for(let i = 0 ; i < workDown.length ; i++){
					if(workDown[i] == payload){
						workDown.splice(i,1)
					}
				}
			return { ...state, workDown:workDown};
		},
		delAllWork(state, {payload}) {
			return { ...state, workDown:[]};
		},

		
		delAllStu(state, {payload}) {
			return { ...state, stuDown:[]};
		},

		stuDown(state, {payload}) {
			let stuDown = state.stuDown
			stuDown.push(payload)
		return { ...state, stuDown:stuDown };
		},
		delstuDown(state, {payload}) {
			let stuDown = state.stuDown
			console.log(stuDown,payload)
			for(let i = 0 ; i < stuDown.length ; i++){
				if(stuDown[i] == payload){
					stuDown.splice(i,1)
				}
			}
			return { ...state, stuDown:stuDown};
		},
		stuName(state, {payload}) {
			return { ...state, stuName:payload};
		},


	},
	subscriptions: {
	  setup({ dispatch, history }) {  // eslint-disable-line
	  },
	},
  
	effects: {
		*downwork({payload}, {put, select}) {
			// 下载班级错题
			
			let res = yield getQuestionDoxc(payload);
			if(res.data && res.data.result === 0){
				
			}
			else if(res.err){
				// yield put(routerRedux.push('/login'))
			}else{
				message.error(res.data.msg)
				// yield put(routerRedux.push('/login'))
			}
			
		},
	},

  
	
  
  };
  