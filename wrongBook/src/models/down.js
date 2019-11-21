import {
	makeSelectWB,
} from '../services/reportService';
import { message } from 'antd';
export default {

	namespace: 'down',

	state: {
		classDown: [],
		classDownPic: [],
		workDown: [],
		workDownPic: [],
		stuDown: [],
		allStuDown: [],
		allClassDown: [],
		stuDownPic: [],
		stuName: '',
		AllPdf: false,
		pdfUrl: {
			fileLink: '',
			downloadLink: ''
		},
		toDown: false,
		downQue: false,
		showPdfModal: false
	},
	reducers: {
		pdfUrl(state, { payload }) {
			return { ...state, pdfUrl: payload };
		},
		showPdfModal(state, { payload }) {
			return { ...state, showPdfModal: payload };
		},
		classDown(state, { payload }) {
			let classDown = state.classDown
			classDown.push(payload)
			return { ...state, classDown: classDown };
		},
		classDownPic(state, { payload }) {
			let classDownPic = state.classDownPic
			classDownPic.push(payload)
			return { ...state, classDownPic: classDownPic };
		},
		delClassDownPic(state, { payload }) {
			let classDownPic = state.classDownPic
			for (let i = 0; i < classDownPic.length; i++) {
				if (classDownPic[i] == payload) {
					classDownPic.splice(i, 1)
				}
			}
			return { ...state, classDownPic: classDownPic };
		},
		delClassDown(state, { payload }) {
			let classDown = state.classDown
			for (let i = 0; i < classDown.length; i++) {
				if (classDown[i] == payload) {
					classDown.splice(i, 1)
				}
			}
			return { ...state, classDown: classDown };
		},
		delAllClass(state, { payload }) {

			let classDown = [], classDownPic = []
			return { ...state, ...{ classDown, classDownPic } };
		},


		workDownPic(state, { payload }) {
			let workDownPic = state.workDownPic
			workDownPic.push(payload)
			return { ...state, workDownPic: workDownPic };
		},
		delWorkDownPic(state, { payload }) {
			let workDownPic = state.workDownPic
			for (let i = 0; i < workDownPic.length; i++) {
				if (workDownPic[i] == payload) {
					workDownPic.splice(i, 1)
				}
			}
			return { ...state, workDownPic: workDownPic };
		},
		workDown(state, { payload }) {
			let workDown = state.workDown;
			workDown.push(payload);
			return { ...state, workDown: workDown };
		},
		delWorkDown(state, { payload }) {
			let workDown = state.workDown;
			for (let i = 0; i < workDown.length; i++) {
				if (workDown[i] == payload) {
					workDown.splice(i, 1)
				}
			}
			return { ...state, workDown: workDown };
		},
		delAllWork(state, { payload }) {
			let workDown = [], workDownPic = []
			return { ...state, ...{ workDown, workDownPic } };
		},

		delAllStu(state, { payload }) {
			let stuDown = [], stuDownPic = []
			return { ...state, ...{ stuDown, stuDownPic } };
		},
		stuDownPic(state, { payload }) {
			let stuDownPic = state.stuDownPic
			stuDownPic.push(payload)
			return { ...state, stuDownPic: stuDownPic };
		},

		stuDownPic(state, { payload }) {
			let stuDownPic = state.stuDownPic
			stuDownPic.push(payload)
			return { ...state, stuDownPic: stuDownPic };
		},
		stuDown(state, { payload }) {
			let stuDown = state.stuDown
			stuDown.push(payload)
			return { ...state, stuDown: stuDown };
		},
		allStuDown(state, { payload }) {
			let arr = state.allStuDown
			if (payload.length > 0) {
				for (let i = 0; i < payload.length; i++) {
					arr.push(payload[i].picId)
				}
			}
			return { ...state, allStuDown: arr };
		},
		delAllStuDown(state, { payload }) {
			let allStuDown = []
			return { ...state, ...{ allStuDown } };
		},
		allClassDown(state, { payload }) {
			let arr = state.allClassDown
			if (payload.length > 0) {
				for (let i = 0; i < payload.length; i++) {
					arr.push(payload[i].picId)
				}
			}
			return { ...state, allClassDown: arr };
		},
		delAllClassDown(state, { payload }) {
			let allClassDown = []
			return { ...state, ...{ allClassDown } };
		},
		delstuDownPic(state, { payload }) {
			let stuDownPic = state.stuDownPic
			for (let i = 0; i < stuDownPic.length; i++) {
				if (stuDownPic[i] == payload) {
					stuDownPic.splice(i, 1)
				}
			}
			return { ...state, stuDownPic: stuDownPic };
		},
		delstuDown(state, { payload }) {
			let stuDown = state.stuDown
			for (let i = 0; i < stuDown.length; i++) {
				if (stuDown[i] == payload) {
					stuDown.splice(i, 1)
				}
			}
			return { ...state, stuDown: stuDown };
		},
		stuName(state, { payload }) {
			return { ...state, stuName: payload };
		},

		AllPdf(state, { payload }) {
			return { ...state, AllPdf: payload };
		},
		toDown(state, { payload }) {
			return { ...state, toDown: payload };
		},
		downQue(state, { payload }) {
			return { ...state, downQue: payload };
		},
	},
	subscriptions: {
		//   setup({ dispatch, history }) {  // eslint-disable-line
		//   },
	},

	effects: {
		*makeSelectWB({ payload }, { put, select }) {
			//最新的下载错题
			let res = yield makeSelectWB(payload);
			if (res.data && res.data.result === 0) {
				console.log(res.data.data);
				yield put({
					type: 'pdfUrl',
					payload: {
						downloadLink: res.data.data.downloadUrl,
						fileLink: res.data.data.url,
					}
				});
				yield put({
					type: 'downQue',
					payload: false
				});
				yield put({
					type: 'showPdfModal',
					payload: true
				})
			}
			else if (res.err) {
				yield put({
					type: 'downQue',
					payload: false
				})
			} else {
				yield put({
					type: 'downQue',
					payload: false
				});
				message.error(res.data.msg)
			}
		},
	},

};
