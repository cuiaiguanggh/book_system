
import {
	loginTiku,
	getVC,
	checkVC,
	updateInfo,
	webchatLoginForWeb,
	info,
	schools,
	loginForGZ
} from '../services/loginService';
import { routerRedux } from 'dva/router';
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
		vc: 0,
		upd: 0,
		time: 0,
		phone: '',
		token: '',
		pc: 0,
	},
	reducers: {
		changeUsername(state, { payload }) {
			return { ...state, identity: payload };
		},
		changePassword(state, { payload }) {
			return { ...state, certification: payload };
		},
		vc(state, { payload }) {
			return { ...state, vc: payload };
		},
		upd(state, { payload }) {
			return { ...state, upd: payload };
		},
		vcOk(state, { payload }) {
			let vc = 0;
			let upd = 0;
			return { ...state, ...{ vc, upd } };
		},
		phone(state, { payload }) {
			return { ...state, phone: payload };
		},
		time(state, { payload }) {
			return { ...state, time: payload };
		},
		token(state, { payload }) {
			return { ...state, token: payload };
		},
		pc(state, { payload }) {
			return { ...state, pc: payload };
		},
	},
	subscriptions: {
		setup({ dispatch, history }) {  // eslint-disable-line
		},
	},

	effects: {
		*login({ payload }, { put, select }) {
			// 登录
			store.set('wrongBookToken', '')
			let { identity, certification } = yield select(state => state.login);

			let res = yield loginTiku(payload);

			// if(!res.hasOwnProperty("err")){

			if (res.data.result === 0) {
				let data = res.data;
				data.data.userId = data.data.id;
				store.set('wrongBookToken', data.data.token);

				let rodeType;
				//获取权限
				let quanx = yield info({});
				if(!quanx.data.data.hasOwnProperty('roleId')){
					message.error('没有权限');
					return false
				}
				switch (quanx.data.data.roleId[0]) {
					// 2超管 3校管 4班主任 5任课老师 6校长
					case 2:
						//总管
						rodeType = 10;
						data.data.rodeType = 10;
						break;
					case 3:
						//校管
						rodeType = 20;
						data.data.rodeType = 20;
						break;
					case 4:
						rodeType = 30;
						data.data.rodeType = 30;
						break;
					case 5:
						rodeType = 40;
						data.data.rodeType = 40;
						break;
					case 6:
						rodeType = 50;
						data.data.rodeType = 50;
						break;
				}
				store.set('leftMenus', quanx.data.data.permissionList);

				if (rodeType !== 10) {
					//学校用户信息
					let usermessage = yield schools({
						roleId: quanx.data.data.roleId[0]
					});
					if(usermessage.data.data.length === 0){
						message.error('用户暂未加入学校');
						return false;
					}

					try {
						data.data.schoolId = usermessage.data.data[0].schoolId;
					} catch (err) {
						console.log('学校id赋值错误')
					}
					try {
						//主要给个人信息页面用的数据
						usermessage.data.data[0].userClass[0] = { ...usermessage.data.data[0].userClass[0], rodeType, schoolName: usermessage.data.data[0].schoolName };
						store.set('userData', usermessage.data.data[0].userClass[0])
					} catch (err) {
						console.log('userClass字段没有'+err)
					}


				}
				store.set('wrongBookNews', data.data);

				yield put({
					type: 'temp/classList1',
					payload: []
				})
				yield put({
					type: 'report/changeMouth',
					payload: 0
				})

				if (rodeType === 10) {
					yield put(routerRedux.push({
						pathname: '/school',
						hash: 'page=1'
					}))
				} else if (rodeType === 20) {
					yield put(routerRedux.push({
						pathname: '/classReport',
						// hash:'page=1'
					}))
				} else if (rodeType === 30 || rodeType === 40|| rodeType === 50) {
					yield put(routerRedux.push({
						pathname: '/classReport',
					}))
				}
			} else {
				if (res.data.result===2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}
		},
		*getVC({ payload }, { put, select }) {
			// 获取验证码
			let res = yield getVC(payload);
			// if(!res.hasOwnProperty("err")){
			if (res.data.result === 0) {
				yield put({
					type: 'pc',
					payload: 1
				})
			} else {
				yield put({
					type: 'pc',
					payload: 0
				})
				message.error(res.data.msg)
			}
		},
		*codelog({ payload }, { put, select }) {
			// code微信扫码登陆
			let res = yield webchatLoginForWeb(payload);
			// if(!res.hasOwnProperty("err")){
			if (res.data.result === 0) {
				yield put({
					type: 'codeType',
					payload: false
				})
				let data = res.data;
				data.data.userId = data.data.id;
				store.set('wrongBookToken', data.data.token)

				let rodeType;
				//获取权限
				let quanx = yield info({});
				if(!quanx.data.data.hasOwnProperty('roleId')){
					message.error('没有权限');
					//跳转到关联页面
					store.set('wrongBookNews', data.data)
					yield put(routerRedux.push('/getPhone'))
					return false;
				}
				switch (quanx.data.data.roleId[0]) {
					// 2超管 3校管 4班主任 5任课老师 6校长
					case 2:
						//总管
						rodeType = 10;
						data.data.rodeType = 10;
						break;
					case 3:
						//校管
						rodeType = 20;
						data.data.rodeType = 20;
						break;
					case 4:
						rodeType = 30;
						data.data.rodeType = 30;
						break;
					case 5:
						rodeType = 40;
						data.data.rodeType = 40;
						break;
					case 6:
						rodeType = 50;
						data.data.rodeType = 50;
						break;
				}
				store.set('leftMenus', quanx.data.data.permissionList);

				if (rodeType !== 10) {
					//学校用户信息
					let usermessage = yield schools({
						roleId: quanx.data.data.roleId[0]
					});
					if(usermessage.data.data.length === 0){
						message.error('用户暂未加入学校');
						return false;
					}

					try {
						data.data.schoolId = usermessage.data.data[0].schoolId;
					} catch (err) {
						console.log('学校id赋值错误')
					}
					try {
						//主要给个人信息页面用的数据
						usermessage.data.data[0].userClass[0] = { ...usermessage.data.data[0].userClass[0], rodeType, schoolName: usermessage.data.data[0].schoolName };
						store.set('userData', usermessage.data.data[0].userClass[0])
					} catch (err) {
						console.log('userClass字段没有'+err)
					}

				}

				store.set('wrongBookNews', data.data)

				// if (data.data.phone == '' || data.data.phone == null) {
				// 	yield put(routerRedux.push('/getPhone'))
				// } else {
					// let rodeType = data.data.rodeType;
					yield put({
						type: 'temp/classList1',
						payload: []
					})
					yield put({
						type: 'report/changeMouth',
						payload: 0
					})

					if (rodeType === 10) {
						yield put(routerRedux.push({
							pathname: '/school',
							hash: 'page=1'
						}))
					} else if (rodeType === 20) {
						yield put(routerRedux.push({
							pathname: '/grade',
							hash: 'page=1'
						}))
					} else if (rodeType === 30 || rodeType === 40) {
						yield put(routerRedux.push({
							pathname: '/classReport',
						}))
					}
				// }
			} else {
				message.error(res.data.msg)
			}
		},
		*phoneLogin({ payload }, { put, select }) {
			// 点击关联login登陆
			payload.openId=store.get('wrongBookNews').openIdForGZ;
			payload.unionId=store.get('wrongBookNews').unionId;
			let res = yield loginForGZ(payload);
			// if(!res.hasOwnProperty("err")){
			if (res.data.result === 0) {
				let data = res.data;
				data.data.userId = data.data.id;
				store.set('wrongBookToken', data.data.token);

				let rodeType;
				//获取权限
				let quanx = yield info({});
				if(!quanx.data.data.hasOwnProperty('roleId')){
					message.error('没有权限');
					return false
				}
				switch (quanx.data.data.roleId[0]) {
					// 2超管 3校管 4班主任 5任课老师 6校长
					case 2:
						//总管
						rodeType = 10;
						data.data.rodeType = 10;
						break;
					case 3:
						//校管
						rodeType = 20;
						data.data.rodeType = 20;
						break;
					case 4:
						rodeType = 30;
						data.data.rodeType = 30;
						break;
					case 5:
						rodeType = 40;
						data.data.rodeType = 40;
						break;
					case 6:
						rodeType = 50;
						data.data.rodeType = 50;
						break;
				}
				store.set('leftMenus', quanx.data.data.permissionList);

				if (rodeType !== 10) {
					//学校用户信息
					let usermessage = yield schools({
						roleId: quanx.data.data.roleId[0]
					});
					if(usermessage.data.data.length === 0){
						message.error('用户暂未加入学校');
						return false;
					}

					try {
						data.data.schoolId = usermessage.data.data[0].schoolId;
					} catch (err) {
						console.log('学校id赋值错误')
					}
					try {
						//主要给个人信息页面用的数据
						usermessage.data.data[0].userClass[0] = { ...usermessage.data.data[0].userClass[0], rodeType, schoolName: usermessage.data.data[0].schoolName };
						store.set('userData', usermessage.data.data[0].userClass[0])
					} catch (err) {
						console.log('userClass字段没有'+err)
					}


				}
				store.set('wrongBookNews', data.data);

				yield put({
					type: 'temp/classList1',
					payload: []
				})
				yield put({
					type: 'report/changeMouth',
					payload: 0
				})

				if (rodeType === 10) {
					yield put(routerRedux.push({
						pathname: '/school',
						hash: 'page=1'
					}))
				} else if (rodeType === 20) {
					yield put(routerRedux.push({
						pathname: '/classReport',
						// hash:'page=1'
					}))
				} else if (rodeType === 30 || rodeType === 40|| rodeType === 50) {
					yield put(routerRedux.push({
						pathname: '/classReport',
					}))
				}

			} else {
				if (res.data.result===2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}
		},
		*checkVC({ payload }, { put, select }) {
			// 校验验证码
			let res = yield checkVC(payload);
			if (res.data.result === 0) {
				yield put({
					type: 'vc',
					payload: 1
				})
				// yield put ({
				// 	type:'token',
				// 	payload:res.data.data
				// })
			} else {
				if (res.data.result===2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.message == '服务器异常') {

				} else {
					message.error(res.data.message)
				}
			}

		},
		* updateInfo({ payload }, { put, select }) {
			// 校验验证码
			let { time } = yield select(state => state.login);

			let res = yield updateInfo(payload);
			// if(!res.hasOwnProperty("err")){
			if (res.data.result === 0) {
				yield put({
					type: 'phone',
					payload: ''
				})
				yield put({
					type: 'upd',
					payload: 1
				})
				yield put({
					type: 'reduceTime',
				})
			} else {
				if (res.data.result===2) {
					message.error('修改失败，请稍后再试')
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}
		},
		* reduceTime({ payload }, { put, call }) {
			// 校验验证码
			yield call(delay, 3000);
			yield put({
				type: 'vcOk',
			})
			yield put(routerRedux.push('/login'))
		},
	},
};
