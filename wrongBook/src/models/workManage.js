import {
	pageClass,
	teacherList,
	subjectNodeList
} from '../services/classHomeService';
import {
	getUserSubjectList,testPage
} from '../services/tempService';
import { routerRedux } from 'dva/router';
import store from 'store';
import { message } from 'antd';
export default {
	namespace: 'workManage',
	state: {
		getClassMembersFinish:false,
		classStudentList:[],
		checkClassId:'',
		classSubjectData:{
			list:[],
			value:''
		},
		pageClassList:[],
		schoolSubjectList:[],
		logType:true
	},
	reducers: {
		logType(state, { payload }) {
			return { ...state, logType: payload };
		},
		pageClassList(state, { payload }) {
			return { ...state, pageClassList: payload };
		},
		schoolSubjectList(state, { payload }) {
			return { ...state, schoolSubjectList: payload };
		},
		getClassMembersFinish(state, { payload }) {
			return { ...state, getClassMembersFinish: payload };
		},
		classStudentList(state, { payload }) {
			return { ...state, classStudentList: payload };
		},
		checkClassId(state, { payload }) {
			return { ...state, checkClassId: payload };
		},
		classSubjectData(state, { payload }) {
			return { ...state, classSubjectData: payload };
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
			return _subs
		},
		*getPageClass({ payload }, { put, select }) {
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
			yield put({
				type: 'pageClassList',
				payload: _classList
			})
			if(_classList.length){
				yield put({
					type: 'checkClassId',
					payload:_classList[0].classId
				})
			}else{
				yield put({
					type: 'classStudentList',
					payload:[]
				})
				
			}
			return _classList
		},
		//temp.js这个接口耦合度太高了,所以拆开来
		*getClassSubjectList({ payload }, { put, select }) {
			// 返回教师所在班级科目
			let res = yield getUserSubjectList(payload);
			let _subjectList =[];
			if (res.data && res.data.result === 0&&res.data.data) {
				if (res.data.data.length > 0) {
					//自动记忆功能?先不考虑
					// if (!store.get('wrongBookNews').memorySubId) {
					// 	console.log('默认学科')
					// 	subjectId= res.data.data[0].v
					// } else {
					// 	//加载完后，删除学科记忆
					// 	let cun = store.get('wrongBookNews');
					// 	subjectId = cun.memorySubId;
					// 	delete (cun.memorySubId);
					// 	store.set('wrongBookNews', cun)
					// }
					_subjectList=res.data.data
				}
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}
			yield put({
				type: 'classSubjectData',
				payload: {
					list:_subjectList,
					value:_subjectList.length?_subjectList[0].v:''
				}
			});

		},
		getClassMembers: [function* ({ payload }, { put, select }) {
			yield put({
				type: 'getClassMembersFinish',
				payload: false
			})
			let userNews = store.get('wrongBookNews');
			let data = {
				type: payload.type,
				schoolId: userNews.schoolId,
				page: 1,
				pageSize: 9999,
				classId:payload.classId
			}
			let _classStudentList=[]
			let res = yield teacherList(data);
			if (res.data && res.data.result === 0&&res.data.data) {
				_classStudentList=res.data.data
			}
			else if (res.hasOwnProperty("err")||res.data.result === 2) {
				yield put(routerRedux.push('/login'))
			} else {
				if (res.data.result !==0) 
				message.error(res.data.msg)
			}
			yield put({
				type: 'classStudentList',
				payload:_classStudentList
			})
			yield put({
				type: 'getClassMembersFinish',
				payload: true
			})

		}],
		*initStudentList({ payload }, { put, select }) {
			let { classStudentList } = yield select(state => state.classModel);
			if(payload&&classStudentList.length){
				let arr=classStudentList.map(item => {
					if(item.questionHook){
						delete item.questionHook
					}
					return {...item,qustionlist:payload}
				})
				yield put({
					type: 'classStudentList',
					payload: arr
				})
			}
		},
		
		

	},



};
