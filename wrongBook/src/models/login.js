
import {
	loginTiku,
	getVC,
	checkVC,
	updateInfo,
	webchatLoginForWeb,
	info,
	schools,
	loginForGZ,
	tokenLogin
} from '../services/loginService';
import { routerRedux } from 'dva/router';
import store from 'store';
import { message } from 'antd';
import { createSecureContext } from 'tls';

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
		// setup({ dispatch, history }) {  // eslint-disable-line
		// },
	},

	effects: {
		*getPower({ payload }, { put, select }) {
			let data = payload.data;
			data.data.userId = data.data.id;
			store.set('wrongBookToken', data.data.token);

			let rodeType;
			//获取权限
			let quanx = yield info({});
			if (!quanx.data.data.hasOwnProperty('roleName')) {
				message.error('没有权限');
				return false
			}
			switch (quanx.data.data.roleName[0]) {
				case 'surpeAdmin':
					//总管
					rodeType = 10;
					data.data.rodeType = 10;
					break;
				case 'teacher':
					//任课老师
					rodeType = 40;
					data.data.rodeType = 40;
					break;
				case 'headteacher':
					//班主任 
					rodeType = 30;
					data.data.rodeType = 30;
					break;
				case 'gradeLeader':
					//年级组长
					rodeType = 50;
					data.data.rodeType = 50;
					break;
				case 'schoolManagement':
					//校管
					rodeType = 20;
					data.data.rodeType = 20;
					break;
				case 'headmaster':
					//校长
					rodeType = 50;
					data.data.rodeType = 50;
					break;
			}
			store.set('leftMenus', quanx.data.data.permissionList);

			if (rodeType !== 10) {
				//学校用户信息
				let usermessage = yield schools({
					roleName: quanx.data.data.roleName[0]
				});
				if (usermessage.data.data.length === 0) {
					message.error('用户暂未加入学校');
					return false;
				}
				store.set('moreschool', usermessage.data.data)

				try {
					data.data.schoolId = usermessage.data.data[0].schoolId;
					data.data.schoolName = usermessage.data.data[0].schoolName;
				} catch (err) {
					console.log('学校id赋值错误')
				}
				try {
					//主要给个人信息页面用的数据
					usermessage.data.data[0].userClass[0] = { rodeType, schoolName: usermessage.data.data[0].schoolName };

					store.set('userData', usermessage.data.data[0].userClass[0])
				} catch (err) {
					console.log('userClass字段没有' + err)
				}

			}
			console.log(data.data)
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
			} else {
				yield put(routerRedux.push({
					pathname: '/classReport',
				}))
			}
		},
		*tokenLogin({ payload }, { put, select }) {
			//云课token登录,没有权限的话跳官网。
			try {
				// 登录
				store.set('wrongBookToken', '')
				let res = yield tokenLogin(payload);

				if (res.data.result === 0) {

					let data = res.data;
					data.data.userId = data.data.id;
					store.set('wrongBookToken', data.data.token);

					let rodeType;
					//获取权限
					let quanx = yield info({});
					if (!quanx.data.data.hasOwnProperty('roleName')) {
						window.location.href = "http://kacha.xin/";
						return false
					}
					switch (quanx.data.data.roleName[0]) {
						case 'surpeAdmin':
							//总管
							rodeType = 10;
							data.data.rodeType = 10;
							break;
						case 'teacher':
							//任课老师
							rodeType = 40;
							data.data.rodeType = 40;
							break;
						case 'headteacher':
							//班主任 
							rodeType = 30;
							data.data.rodeType = 30;
							break;
						case 'gradeLeader':
							//年级组长
							rodeType = 50;
							data.data.rodeType = 50;
							break;
						case 'schoolManagement':
							//校管
							rodeType = 20;
							data.data.rodeType = 20;
							break;
						case 'headmaster':
							//校长
							rodeType = 50;
							data.data.rodeType = 50;
							break;
					}
					store.set('leftMenus', quanx.data.data.permissionList);

					if (rodeType !== 10) {
						//学校用户信息
						let usermessage = yield schools({
							roleName: quanx.data.data.roleName[0]
						});
						if (usermessage.data.data.length === 0) {
							message.error('用户暂未加入学校');
							return false;
						}
						store.set('moreschool', usermessage.data.data)

						try {
							data.data.schoolId = usermessage.data.data[0].schoolId;
							data.data.schoolName = usermessage.data.data[0].schoolName;
						} catch (err) {
							console.log('学校id赋值错误')
						}
						try {
							//主要给个人信息页面用的数据
							usermessage.data.data[0].userClass[0] = { rodeType, schoolName: usermessage.data.data[0].schoolName };

							store.set('userData', usermessage.data.data[0].userClass[0])
						} catch (err) {
							console.log('userClass字段没有' + err)
						}

					}
					console.log(data.data)
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
					} else {
						yield put(routerRedux.push({
							pathname: '/classReport',
						}))
					}


				} else {
					if (res.data.result === 2) {
						yield put(routerRedux.push('/login'))
					} else if (res.data.result === -1) {
						
						window.location.href = "http://kacha.xin/";

					} else {
						message.error(res.data.msg)
					}
				}
			} catch (e) {
				console.error('登录发生错误' + e);
			}

		},
		*login({ payload }, { put, call, select }) {
			try {
				// 登录
				store.set('wrongBookToken', '')
				let { identity, certification } = yield select(state => state.login);

				let res = yield loginTiku(payload);

				// if(!res.hasOwnProperty("err")){

				if (res.data.result === 0) {
					yield put({
						type: 'getPower',
						payload: res
					})

				} else {
					if (res.data.result === 2) {
						yield put(routerRedux.push('/login'))
					} else if (res.data.msg == '服务器异常') {

					} else {
						message.error(res.data.msg)
					}
				}
			} catch (e) {
				console.error('登录发生错误' + e);
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
				if (!quanx.data.data.hasOwnProperty('roleName')) {
					message.error('没有权限');
					//跳转到关联页面
					store.set('wrongBookNews', data.data)
					yield put(routerRedux.push('/getPhone'))
					return false;
				}
				switch (quanx.data.data.roleName[0]) {

					case 'surpeAdmin':
						//总管
						rodeType = 10;
						data.data.rodeType = 10;
						break;
					case 'teacher':
						//任课老师
						rodeType = 40;
						data.data.rodeType = 40;
						break;
					case 'headteacher':
						//班主任 
						rodeType = 30;
						data.data.rodeType = 30;
						break;
					case 'gradeLeader':
						//年级组长
						rodeType = 50;
						data.data.rodeType = 50;
						break;
					case 'schoolManagement':
						//校管
						rodeType = 20;
						data.data.rodeType = 20;
						break;
					case 'headmaster':
						//校长
						rodeType = 50;
						data.data.rodeType = 50;
						break;
				}
				store.set('leftMenus', quanx.data.data.permissionList);

				if (rodeType !== 10) {
					//学校用户信息
					let usermessage = yield schools({
						roleName: quanx.data.data.roleName[0]
					});
					if (usermessage.data.data.length === 0) {
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
						console.log('userClass字段没有' + err)
					}

				}

				store.set('wrongBookNews', data.data)

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
			payload.openId = store.get('wrongBookNews').openIdForGZ;
			payload.unionId = store.get('wrongBookNews').unionId;
			let res = yield loginForGZ(payload);
			// if(!res.hasOwnProperty("err")){
			if (res.data.result === 0) {
				yield put({
					type: 'getPower',
					payload: res
				})

			} else {
				if (res.data.result === 2) {
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
				if (res.data.message == '服务器异常') {

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
				if (res.data.result === 2) {
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
