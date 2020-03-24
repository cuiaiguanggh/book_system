import {
    subjectList,
    homeworkList,
    studentList,
    markCommit,
    pages,
    pageCommit,
    remind,
    check,
    workCommit,
    updateCommit,
    deleteCommit,
    teacherCommit,
    homeworkCommit,
    share,
} from '../services/correctionService';

import { message } from 'antd';
import observer from '../utils/observer'

export default {

    namespace: 'correction',
    state: {
        subjectList: [],
        homeworkList: [],
        subjectId: '',
        subjectName: '',
        studentList: { submitted: [], uncommitted: [] },
        workDate: '',
        isCorrected: 0,
    },
    reducers: {
        subjectList(state, { payload }) {
            return { ...state, subjectList: payload };
        },
        subjectId(state, { payload }) {
            return { ...state, subjectId: payload };
        },
        subjectName(state, { payload }) {
            return { ...state, subjectName: payload };
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
        isCorrected(state, { payload }) {
            return { ...state, isCorrected: payload };
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
                    const { subjectId, subjectName } = yield select(state => state.correction)
                    let selectSub = res.data.data[0].v, selectSubName = res.data.data[0].k;

                    if (subjectId !== '') {
                        //如果已选中的学科已存在，则不更改学科id
                        for (let obj of res.data.data) {
                            if (obj.v === subjectId) {
                                selectSub = subjectId;
                                selectSubName = subjectName;
                                break
                            }
                        }
                    }
                    yield put({
                        type: 'subjectName',
                        payload: selectSubName
                    })
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
                        type: 'subjectName',
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
                    yield put({
                        type: 'isCorrected',
                        payload: 0
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
                    yield put({
                        type: 'workDate',
                        payload: suzu[0]
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
                    yield put({
                        type: 'isCorrected',
                        payload: 0
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
                let submitted = res.data.data.studentCommitWork || [], uncommitted = res.data.data.studentUnCommitWork || [];

                yield put({
                    type: 'studentList',
                    payload: { submitted, uncommitted }
                })
                yield put({
                    type: 'isCorrected',
                    payload: res.data.data.isCorrected
                })
                if (submitted.length > 0) {
                    if (submitted[0].commited === 1) {
                        const { classId } = yield select(state => state.temp)
                        const { subjectId, workDate } = yield select(state => state.correction)
                        //是否存在待批改的，存在选中待批改学生
                        let whether = true;
                        for (let obj of submitted) {
                            if (obj.corrected === 0 || (obj.supplement === 1 && obj.corrected === 2)) {
                                observer.publish('updateId', obj.userId, obj.name, 0, obj.corrected);
                                yield put({
                                    type: 'pgPages',
                                    payload: {
                                        classId,
                                        subjectId,
                                        workDate,
                                        userId: obj.userId
                                    }
                                })
                                whether = false;
                                break;
                            }
                        }
                        if (whether) {
                            observer.publish('updateId', submitted[0].userId, submitted[0].name, 1, submitted[0].corrected)
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
        *check({ payload }, { put }) {
            //一键提醒
            let res = yield check(payload)
            if (res.data && res.data.result === 0) {

            } else {
                message.error(res.data.msg)
            }
        },
        *teacherCommit({ payload }, { put }) {
            //教师批改完成提交
            let res = yield teacherCommit(payload)
            if (res.data && res.data.result === 0) {

            } else {
                message.error(res.data.msg)
            }
        },
        *workCommit({ payload }, { put }) {
            //发布评价
            let res = yield workCommit(payload)
            if (res.data && res.data.result === 0) {
                // message.success('发布评价成功')

            } else {
                message.error(res.data.msg)
            }
        },
        *updateCommit({ payload }, { put }) {
            //更新评价
            let res = yield updateCommit(payload)
            if (res.data && res.data.result === 0) {
                message.success('更新评价成功')
            } else {
                message.error(res.data.msg)
            }
        },
        *deleteCommit({ payload }, { put }) {
            //删除评价
            let res = yield deleteCommit(payload)
            if (res.data && res.data.result === 0) {
                message.success('删除评价成功')
            } else {
                message.error(res.data.msg)
            }
        },
        *updateStudentList({ payload }, { put, select }) {
            //更新学生列表
            let res = yield studentList(payload)
            if (res.data && res.data.result === 0) {
                let submitted = res.data.data.studentCommitWork || [], uncommitted = res.data.data.studentUnCommitWork || [];
                yield put({
                    type: 'studentList',
                    payload: { submitted, uncommitted }
                })

            } else {
                message.error(res.data.msg)
            }
        },
        *homeworkCommit({ payload }, { put }) {
            //导出作业提交情况
            let res = yield homeworkCommit(payload)
            console.log(res)
            if (res.data && res.data.result === 0) {
                console.log(res)
                let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
                console.log(blob)
                // window.location.href = `${this.state.pdfUrl.downloadUrl}${downame}`;

            } else {
                message.error(res.data.msg)
            }
        },
        *share({ payload }, { put }) {
            //分享优秀作业
            let res = yield share(payload)
            if (res.data && res.data.result === 0) {
                message.success(res.data.msg)
            } else {
                message.error(res.data.msg)
            }
        },
    }

};