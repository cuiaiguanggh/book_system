import {
	queryQrDetail,
	queryHomeworkList,
	queryHomeworkScoreDetail,
	queryQrStudentCount,
	deleteTeachVideo,
	queryTeachVideo,
	uploadVideo,
	searchLink,
	getCorrection,
	WrongQuestionMarker,
	CorrectionMarker,
	remindHomework,
	teacherCollect,
	yuantu,
	rate,
	recommend,
	videoPrepare,
	reset
} from '../services/reportService';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { message } from 'antd';
export default {

	namespace: 'report',

	state: {
		mouNow: { k: moment().format('MMM'), v: moment().format('YYYY-MM') },
		qrdetailList: [],
		qrdetailList1: [],
		homeworkList: [],
		homeworkId: '',
		homeworkName: '',
		scoreDetail: [],
		questionDetail: [],
		userId: '',
		page: 1,
		page1: 1,
		classNext: 0,
		studentList: [],
		visible: false,
		visible1: false,
		videlUrl: '',
		toupload: false,
		propsPageNum: 1,
		begtoendTime: [],
		stbegtoendTime: [],
		knowledgenow: [],
		beforehand: [],
		beforstuTopic: [],
		cuowunumber: 0,
		dainumber: 0,
		improveRate: 0,
		a: 0,
		b: 0,
		c: 0,
		d: 0,
		standardAnswer: null,
		questionType: null
	},
	reducers: {
		discern(state, { payload }) {
			return { ...state, a: payload.a, b: payload.b, c: payload.c, d: payload.d, standardAnswer: payload.standardAnswer, questionType: payload.questionType };
		},
		improveRate(state, { payload }) {
			return { ...state, improveRate: payload };
		},
		cuowunumber(state, { payload }) {
			return { ...state, cuowunumber: payload };
		},
		dainumber(state, { payload }) {
			return { ...state, dainumber: payload };
		},
		beforehand(state, { payload }) {
			return { ...state, beforehand: payload };
		},
		knowledgenow(state, { payload }) {
			return { ...state, knowledgenow: payload };
		},
		begtoendTime(state, { payload }) {
			return { ...state, begtoendTime: payload };
		},
		stbegtoendTime(state, { payload }) {
			return { ...state, stbegtoendTime: payload };
		},
		propsPageNum(state, { payload }) {
			return { ...state, propsPageNum: payload };
		},
		toupload(state, { payload }) {
			return { ...state, toupload: payload };
		},
		qrdetailList(state, { payload }) {
			return { ...state, qrdetailList: payload };
		},
		qrdetailList1(state, { payload }) {
			let list = state.qrdetailList;
			if (payload.data && payload.data.questionList.length > 0) {
				for (let i = 0; i < payload.data.questionList.length; i++) {
					list.data.questionList.push(payload.data.questionList[i])
				}
			}
			return { ...state, qrdetailList: list };
		},
		changeMouth(state, { payload }) {
			return { ...state, mouNow: payload };
		},
		homeworkList(state, { payload }) {
			return { ...state, homeworkList: payload };
		},
		homeworkId(state, { payload }) {
			return { ...state, homeworkId: payload };
		},
		homeworkName(state, { payload }) {
			return { ...state, homeworkName: payload };
		},
		scoreDetail(state, { payload }) {
			return { ...state, scoreDetail: payload };
		},
		questionDetail(state, { payload }) {
			return { ...state, questionDetail: payload };
		},
		userId(state, { payload }) {
			return { ...state, userId: payload };
		},
		page(state, { payload }) {
			return { ...state, page: payload };
		},
		page1(state, { payload }) {
			return { ...state, page1: payload };
		},
		classNext(state, { payload }) {
			return { ...state, classNext: payload };
		},
		studentList(state, { payload }) {
			return { ...state, studentList: payload };
		},
		qrStudentDetailList(state, { payload }) {
			return { ...state, qrdetailList1: payload };
		},
		qrStudentDetailList1(state, { payload }) {
			let list = state.qrdetailList1;
			if (payload.data.questionList.length > 0) {
				for (let i = 0; i < payload.data.questionList.length; i++) {
					list.data.questionList.push(payload.data.questionList[i])
				}
			} else {
				list.data.end = false;
			}
			//滚动时加载的，加载错题数据
			return { ...state, qrdetailList1: list };
		},
		deleteVidioGai(state, { payload }) {
			return { ...state, qrdetailList: payload.list, qrdetailList1: payload.list1 };
		},

		updataVideoGai(state, { payload }) {
			return { ...state, ...{ qrdetailList: payload.qrdetailList }, ...{ qrdetailList1: payload.qrdetailList1 } };
		},
		visible(state, { payload }) {
			return { ...state, visible: payload };
		},
		visible1(state, { payload }) {
			return { ...state, visible1: payload };
		},
		videlUrl(state, { payload }) {
			return { ...state, videlUrl: payload };
		},
		addClassup(state, { payload }) {
			let list = state.qrdetailList;
			if (payload.length > 0) {
				for (let i = 0; i < list.data.questionList.length; i++) {
					for (let j = 0; j < payload.length; j++) {
						if (list.data.questionList[i].picId == payload[j]) {
							list.data.questionList[i].num++
						}
					}
				}
			}

			return { ...state, qrdetailList: list };
		},
		addStudentUp(state, { payload }) {
			let list = state.qrdetailList1;
			console.error(payload)
			if (payload.length > 0) {
				for (let i = 0; i < list.data.questionList.length; i++) {
					for (let j = 0; j < payload.length; j++) {
						if (list.data.questionList[i].picId == payload[j]) {
							list.data.questionList[i].num++
						}
					}
				}
			}

			return { ...state, qrdetailList1: list };
		},
		beforstuTopic(state, { payload }) {
			return { ...state, beforstuTopic: payload };
		},
	},
	subscriptions: {
		// setup({ dispatch, history }) {
		// },
	},

	effects: {
		*videoPrepare({ payload }, { put }) {
			let res = yield videoPrepare(payload)
			if (res.data.result === 0) {
				return res.data.data
			} else {
				return false
			}
		},
		*recommend({ payload }, { put, select, }) {
			let res = yield recommend(payload)
			if (res.data.result === 0) {
				return res.data.data
			} else {
				return []

			}

		},
		*rate({ payload }, { put, select, takeLatest, }) {
			//当调用作业报告数据时，调用作业提高率

			// yield takeLatest('report/queryHomeworkScoreDetail', function* () {
			let { homeworkId } = yield select(state => state.report);
			let { classId, subId } = yield select(state => state.temp);
			if (classId && homeworkId && subId) {
				let data = {};
				data.homeworkId = homeworkId;
				data.classId = classId;
				data.subjectId = subId;
				let res = yield rate(data);
				try {
					yield put({
						type: 'improveRate',
						payload: res.data.data.classWrongScoreRate
					})
				} catch (e) {
					console.error('查询提高率失败')
				}

			}
			// })

		},
		* getyuantu({ payload }, { put, select }) {
			let res = yield yuantu(payload);
			return res.data.data;
		},
		* teacherCollect({ payload }, { put, select }) {
			//星标收藏
			let res = yield teacherCollect(payload);

		},
		* remindHomework({ payload }, { put, select }) {
			//提醒上交作业
			let res = yield remindHomework(payload);

			if (res.data && res.data.result === 0) {
				message.success('发送成功');
			} else {
				message.error(res.data.msg)
			}

		},

		* CorrectionMarker({ payload }, { put, select }) {
			//老师预批改结果
			yield CorrectionMarker(payload);
		},
		* WrongQuestionMarker({ payload }, { put, select }) {
			//匹配错误反馈
			let res = yield WrongQuestionMarker(payload);
		},
		*reset({ payload }, { put, select }) {
			//清除预批改结果
			let res = yield reset(payload);
			if (res.data.result === 0) {
				message.success(res.data.msg)
			} else {
				message.error(res.data.msg)
			}

		},
		* getCorrection({ payload }, { put, select }) {
			//获得预批改作业信息
			let res = yield getCorrection(payload);
			let beforstuTopic = []
			if (res.data.data.hasOwnProperty('homeworkCorrectionList')) {
				beforstuTopic = res.data.data.homeworkCorrectionList;
			}
			yield put({
				type: 'beforstuTopic',
				payload: beforstuTopic
			})
			//错误人数和，带批改人数
			let cuowunumber = 0, dainumber = 0;
			for (let i = 0; i < beforstuTopic.length; i++) {
				if (beforstuTopic[i].teacherCollect === 1) {
					cuowunumber++;
				}
				if (beforstuTopic[i].teacherCollect === 0) {
					dainumber++;
				}
			}
			yield put({
				type: 'cuowunumber',
				payload: cuowunumber
			});
			yield put({
				type: 'dainumber',
				payload: dainumber
			})
			// yield put({
			// 	type: 'discern',
			// 	payload: res.data.data
			// })
		},
		* deleteVidio({ payload }, { put, select }) {
			let { qrdetailList, qrdetailList1, beforehand } = yield select(state => state.report);
			//班级错题页面错题列表
			if (qrdetailList.data && qrdetailList.data.questionList[payload]) {
				delete qrdetailList.data.questionList[payload].teachVideo;
			}
			//学生错题页面错题列表
			if (qrdetailList1.data && qrdetailList1.data.questionList[payload]) {
				delete qrdetailList1.data.questionList[payload].teachVideo;
			}
			//作业报告错题列表
			if (beforehand.teachVideo) {
				beforehand.teachVideo = null
				yield put({
					type: 'beforehand',
					payload: beforehand
				})
			}
			yield put({
				type: 'deleteVidioGai',
				payload: {
					list: qrdetailList,
					list1: qrdetailList1,
				}
			})

		},
		* updataVideo({ payload }, { put, select }) {
			let { qrdetailList, qrdetailList1, beforehand } = yield select(state => state.report);
			//班级错题页面错题列表
			if (qrdetailList.data && qrdetailList.data.questionList[payload.key]) {
				qrdetailList.data.questionList[payload.key].teachVideo = payload.video;
			}
			//学生错题页面错题列表
			if (qrdetailList1.data && qrdetailList1.data.questionList[payload.key]) {
				qrdetailList1.data.questionList[payload.key].teachVideo = payload.video;
			}
			//作业报告页面错题列表
			if (beforehand.teachVideo === null) {
				beforehand.teachVideo = payload.video;
				console.log(payload)
				yield put({
					type: 'beforehand',
					payload: beforehand
				})
			}


			yield put({
				type: 'updataVideoGai',
				payload: {
					qrdetailList: qrdetailList,
					qrdetailList1: qrdetailList1
				}
			})
		},


		* searchLink({ payload }, { put, select }) {
			let res = yield searchLink({ picId: payload.picId });
			// 先打开页面  后更改页面地址,解决移动端上被拦截的问题
			payload.wi.location.href = res.data.data.link;
		},
		* queryQrDetail({ payload }, { put, select }) {
			try {
				let { mouNow, knowledgenow, stbegtoendTime } = yield select(state => state.report)
				//月份
				if (mouNow !== 0) {
					payload.month = mouNow.v
				}
				//知识点
				if (knowledgenow.length !== 0) {
					payload.knowledgeName = knowledgenow
				}
				//时间段
				if (stbegtoendTime.length > 0) {
					payload.startTime = stbegtoendTime[0];
					payload.endTime = stbegtoendTime[1];
				}
				if (!payload.subjectId) {
					message.error('请选择学科');
					return;
				}

				//账号科目列表
				let res = yield queryQrDetail(payload);
				if (res.data && res.data.result === 0) {
					yield put({
						type: 'qrdetailList',
						payload: res.data
					})
				}
				else {
					if (res.data.result === 2) {
						yield put(routerRedux.push('/login'))
					} else if (res.data.msg == '服务器异常') {

					} else {
						message.error(res.data.msg)
					}
				}
			} catch (e) {
				console.error('获取错题出错')
			}
		},
		* queryQrStudentCount({ payload }, { put, select }) {
			let { mouNow, userId, stbegtoendTime, knowledgenow } = yield select(state => state.report);
			//月份
			if (mouNow != 0) {
				payload.month = mouNow.v
			}
			// //时间段
			if (stbegtoendTime.length > 0) {
				payload.startTime = stbegtoendTime[0];
				payload.endTime = stbegtoendTime[1];
			}
			if (!payload.subjectId) {
				message.error('请选择学科');
				return;
			}
			//查询班级学生列表
			let res = yield queryQrStudentCount(payload);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else if (res.data && res.data.result === 0) {
				yield put({
					type: 'studentList',
					payload: res.data
				});
				if (res.data.data.length > 0) {
					let data = {}
					if (userId == '') {
						data = {
							classId: payload.classId,
							year: payload.year,
							subjectId: payload.subjectId,
							info: 0,
							pageNum: 1,
							pageSize: 20,
							userId: res.data.data[0].userId
						}
						yield put({
							type: 'userId',
							payload: res.data.data[0].userId
						})
					} else {
						data = {
							classId: payload.classId,
							year: payload.year,
							subjectId: payload.subjectId,
							info: 0,
							pageNum: 1,
							pageSize: 20,
							userId: userId
						}
						yield put({
							type: 'userId',
							payload: userId
						})
					}
					//月份
					if (mouNow != 0) {
						data.month = mouNow.v
					}
					//知识点
					if (knowledgenow.length !== 0) {
						data.knowledgeName = knowledgenow
					}

					//时间段
					if (payload.startTime) {
						data.startTime = payload.startTime;
						data.endTime = payload.endTime;
					}

					yield put({
						type: 'userQRdetail',
						payload: data
					})
				} else {
					yield put({
						type: 'userId',
						payload: ''
					})
					yield put({
						type: 'qrStudentDetailList',
						payload: []
					})
				}

			}
			else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}

			}
		},
		* userQRdetail({ payload }, { put, select }) {
			//查询学生作业列表
			let res = yield queryQrDetail(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'qrStudentDetailList',
					payload: res.data
				})
			}
			else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}

			}
		},
		* userQRdetail1({ payload }, { put, select }) {
			//查询学生作业列表
			let res = yield queryQrDetail(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'qrStudentDetailList1',
					payload: res.data
				})
			}
			else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}
			}
		},
		* queryQrDetail1({ payload }, { put, select }) {
			//账号科目列表
			let res = yield queryQrDetail(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'qrdetailList1',
					payload: res.data
				})
			}
			else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}

			}
		},
		* queryHomeworkList({ payload }, { put, select }) {
			//返回作业列表
			let res = yield queryHomeworkList(payload);
			if (res.data && res.data.result === 0) {
				yield put({
					type: 'homeworkList',
					payload: res.data
				})
				if (res.data.data.length > 0) {
					yield put({
						type: 'homeworkId',
						payload: res.data.data[0].homeworkId
					})
					yield put({
						type: 'homeworkName',
						payload: res.data.data[0].name
					})

					yield put({
						type: 'queryHomeworkScoreDetail',
						payload: {
							homeworkId: res.data.data[0].homeworkId
						}
					})
				} else {
					yield put({
						type: 'improveRate',
						payload: 0
					})
					yield put({
						type: 'homeworkId',
						payload: ''
					})
					yield put({
						type: 'homeworkName',
						payload: ''
					})

					yield put({
						type: 'scoreDetail',
						payload: []
					})
					yield put({
						type: 'questionDetail',
						payload: []
					})
				}


			}
			else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}

			}
		},
		* queryHomeworkScoreDetail({ payload }, { put }) {
			//作业信息详情
			let res = yield queryHomeworkScoreDetail(payload);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else if (res.data && res.data.result === 0) {
				yield put({
					type: 'scoreDetail',
					payload: res.data
				})
				yield put({ type: 'rate' })
			} else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}

			}
		},
		* deleteTeachVideo({ payload }, { put, select }) {
			//删除讲解视频
			let data = {
				videoId: payload.videoId
			}
			let res = yield deleteTeachVideo(data);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else if (res.data && res.data.result === 0) {
				message.success('删除成功')
				yield put({
					type: 'deleteVidio',
					payload: payload.key
				})
				yield put({
					type: 'visible1',
					payload: false
				})

			}
			else {
				if (res.data.result === 2) {
					yield put(routerRedux.push('/login'))
				} else if (res.data.msg == '服务器异常') {

				} else {
					message.error(res.data.msg)
				}

			}
		},
		* queryTeachVideo({ payload }, { put, select }) {
			//刷新查看是否上传成功
			let data = {
				questionId: payload.questionId
			}
			let res = yield queryTeachVideo(data);
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {
					if (res.data.data) {
						message.success('视频已上传')
						yield put({
							type: 'updataVideo',
							payload: {
								key: payload.key,
								video: res.data.data
							}
						})
						yield put({
							type: 'videlUrl',
							payload: res.data.data.url
						})
						yield put({
							type: 'visible1',
							payload: true
						})
					} else {
						message.warning('未检测到上传视频')
					}
				}
				else {
					if (res.data.result === 2) {
						yield put(routerRedux.push('/login'))
					} else if (res.data.msg == '服务器异常') {

					} else {
						message.error(res.data.msg)
					}

				}
		},
		* uploadVideo({ payload }, { put, select }) {
			//上传讲解视频
			const { num } = yield select(state => state.example)
			let res = yield uploadVideo(payload);
			console.log(res)
			if (res.hasOwnProperty("err")) {
				yield put(routerRedux.push('/login'))
			} else
				if (res.data && res.data.result === 0) {

					// yield put ({
					// 	type:  'toupload',
					// 	payload:false
					// })
					if (res.data.data) {
						message.success('视频上传成功')
						yield put({
							type: 'updataVideo',
							payload: {
								key: num,
								video: res.data.data
							}
						})
						yield put({
							type: 'videlUrl',
							payload: res.data.data.url
						})
						yield put({
							type: 'visible1',
							payload: true
						})
						yield put({
							type: 'toupload',
							payload: false
						})
					} else {
						message.warning('未检测到上传视频')
					}
				}
				else {
					yield put({
						type: 'toupload',
						payload: false
					})
					if (res.data.result === 2) {
						yield put(routerRedux.push('/login'))
					} else if (res.data.msg == '服务器异常') {

					} else {
						message.error(res.data.msg)
					}

				}
		},
	},




};
