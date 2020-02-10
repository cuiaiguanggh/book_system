import {
    subjectList,
    homeworkList,
    studentList,
    markCommit,
    pages,
    pageCommit,
    remind,
} from '../services/correctionService';

import { message } from 'antd';
import observer from '../utils/observer'

export default {

    namespace: 'correction',
    state: {
        subjectList: [],
        homeworkList: [],
        subjectId: '',
        studentList: { submitted: [], uncommitted: [] },
        workDate: '',
    },
    reducers: {
        subjectList(state, { payload }) {
            return { ...state, subjectList: payload };
        },
        subjectId(state, { payload }) {
            return { ...state, subjectId: payload };
        },
        homeworkList(state, { payload }) {
            return { ...state, homeworkList: payload };
        },
        studentList(state, { payload }) {
            return { ...state, studentList: payload };
        },
        workDate(state, { payload }) {
            return { ...state, workDate: payload };
        },


    },

    effects: {
        *pgSubjectList({ payload }, { put, select }) {
            //学科列表
            let res = yield subjectList(payload)
            if (res.data && res.data.result === 0) {
                yield put({
                    type: 'subjectList',
                    payload: res.data.data
                })
                if (res.data.data.length > 0) {
                    const { classId } = yield select(state => state.temp)
                    const { subjectId } = yield select(state => state.correction)
                    let selectSub = res.data.data[0].v;

                    if (subjectId !== '') {
                        //如果已选中的学科已存在，则不更改学科id
                        for (let obj of res.data.data) {
                            if (obj.v === subjectId) {
                                selectSub = subjectId;
                                break
                            }
                        }
                    }
                    yield put({
                        type: 'subjectId',
                        payload: selectSub
                    })
                    yield put({
                        type: 'pgHomeworkList',
                        payload: {
                            classId: classId,
                            subjectId: selectSub,
                        }
                    })
                } else {
                    //清空数据
                    yield put({
                        type: 'subjectId',
                        payload: ''
                    })
                    yield put({
                        type: 'homeworkList',
                        payload: []
                    })
                    yield put({
                        type: 'workDate',
                        payload: ''
                    })
                    yield put({
                        type: 'studentList',
                        payload: { submitted: [], uncommitted: [] }
                    })
                    observer.publish('updateList', [])
                }
            } else {
                message.error(res.data.msg)
            }
        },
        *pgHomeworkList({ payload }, { put, select }) {
            //作业列表
            let res = yield homeworkList(payload)
            if (res.data && res.data.result === 0) {
                let suzu = res.data.data;
                yield put({
                    type: 'workDate',
                    payload: suzu[0]
                })
                yield put({
                    type: 'homeworkList',
                    payload: suzu
                })
                if (suzu.length > 0) {
                    const { classId } = yield select(state => state.temp)
                    const { subjectId } = yield select(state => state.correction)
                    yield put({
                        type: 'pgStudentList',
                        payload: {
                            classId,
                            subjectId,
                            workDate: suzu[0]
                        }
                    })
                } else {
                    //清空数据
                    yield put({
                        type: 'workDate',
                        payload: ''
                    })
                    yield put({
                        type: 'studentList',
                        payload: { submitted: [], uncommitted: [] }
                    })
                    observer.publish('updateList', [])
                }
            } else {
                message.error(res.data.msg)
            }
        },
        *pgStudentList({ payload }, { put, select }) {
            //获取学生列表，默认选中第一个
            let res = yield studentList(payload)
            yield put({
                type: 'workDate',
                payload: payload.workDate
            })
            if (res.data && res.data.result === 0) {
                let stuList = res.data.data, submitted = [], uncommitted = [];
                for (let i = 0; i < stuList.length; i++) {
                    if (stuList[i].commited === 0) {
                        submitted = stuList.slice(0, i);
                        uncommitted = stuList.slice(i, stuList.length);
                        break;
                    }
                }

                let nowList = { submitted, uncommitted }
                yield put({
                    type: 'studentList',
                    payload: nowList
                })
                if (submitted.length > 0) {
                    if (submitted[0].commited === 1) {
                        const { classId } = yield select(state => state.temp)
                        const { subjectId, workDate } = yield select(state => state.correction)
                        observer.publish('updateId', submitted[0].userId, 0)
                        yield put({
                            type: 'pgPages',
                            payload: {
                                classId,
                                subjectId,
                                workDate,
                                userId: submitted[0].userId
                            }
                        })
                    }
                } else {
                    //清空数据
                    yield put({
                        type: 'studentList',
                        payload: { submitted: [], uncommitted: [] }
                    })
                    observer.publish('updateList', [])
                }

            } else {
                message.error(res.data.msg)
            }
        },
        *updateStudentList({ payload }, { put, select }) {
            //更新学生列表
            let res = yield studentList(payload)
            yield put({
                type: 'workDate',
                payload: payload.workDate
            })
            if (res.data && res.data.result === 0) {
                let stuList = res.data.data, submitted = [], uncommitted = [];
                for (let i = 0; i < stuList.length; i++) {
                    if (stuList[i].commited === 0) {
                        submitted = stuList.slice(0, i);
                        uncommitted = stuList.slice(i, stuList.length - 1);
                        break;
                    }
                }

                let nowList = { submitted, uncommitted }
                yield put({
                    type: 'studentList',
                    payload: nowList
                })

            } else {
                message.error(res.data.msg)
            }
        },
        *pgPages({ payload }, { put }) {
            //对应学生的作业
            let res = yield pages(payload)
            if (res.data && res.data.result === 0) {
                observer.publish('updateList', res.data.data)
            } else {
                message.error(res.data.msg)
            }
        },

        *pgMarkCommit({ payload }, { put }) {
            //记录批改结果的接口
            let res = yield markCommit(payload)
            if (res.data && res.data.result === 0) {
                return true
            } else {
                message.error(res.data.msg)
            }
        },
        *pgPageCommit({ payload }, { put }) {
            //点击完成的接口
            let res = yield pageCommit(payload)
            if (res.data && res.data.result === 0) {
                return true
            } else {
                message.error(res.data.msg)
            }
        },
        *remind({ payload }, { put }) {
            //一键提醒
            let res = yield remind(payload)
            if (res.data && res.data.result === 0) {
                message.success(res.data.msg)
            } else {
                message.error(res.data.msg)
            }
        },
    }

};