import {
	pageClass,
	subjectNodeList
} from '../services/classHomeService';
import {
	testPage
} from '../services/tempService';
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
		schoolSubId:0
	},
	reducers: {
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
		*testPage({ payload }, { put, select }){
			let res = yield testPage();
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
		
	},



};
