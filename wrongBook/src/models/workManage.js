import {
	pageClass,
	subjectNodeList
} from '../services/classHomeService';
import {
	testPage
} from '../services/tempService';

import {
	getWorkList,createWork, workList
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
		workList:[]
	},
	reducers: {
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
		
	},
	subscriptions: {
		
	},

	effects: {
		*createWork({ payload }, { put, select }){
			let res = yield createWork(payload);
			console.log('res: ', res);
			return res
		},
		*getWorkList({ payload }, { put, select }){
			let res = yield workList(payload);
			console.log('res: ', res);
			return res
		},
		
		*uploadImage({ payload }, { put, select }){
			let res = yield testPage();
			console.log('res: ', res);
		},
		*testPage({ payload }, { put, select }){
			let res = yield testPage(payload);
			console.log('res: ', res);
		},
		*getSchoolSubjectList({ payload }, { put, select }) {
			let res = yield subjectNodeList();
			let _subs=[]
			if (res.data && res.data.result === 0&&res.data.data) {
				_subs=res.data.data
			} else {
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
			let data=[]
			for (let i = 0; i < 100; i++) {
				data.push({
					_index: i,
					_name: `work ${i}`,
					_id: i,
					_classes: [`一年 ${i}班`,`一年 ${i+1}班`],
					_subject:'学科',
					_time:"0907",
				});
			}
			yield put({
				type: 'getWorkListFinish',
				payload: true
			})
			yield put({
				type: 'workList',
				payload: data
			})
		},
		
	},



};
