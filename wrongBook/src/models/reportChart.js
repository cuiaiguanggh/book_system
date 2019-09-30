import {
  getSubjectList
} from '../services/classHomeService';
import moment from 'moment';
import {
  getReportTimeList, querySchoolDataReport, queryGradeListBySchoolId
  , queryClassListByGradeId, querySubListByClassId, queryClassDataReport,
} from '../services/reportService';
import {
  getUserSubjectList,
} from '../services/tempService';
import store from 'store';
import { message } from 'antd';

export default {

  namespace: 'reportChart',

  state: {
    schoolId: '',
    sclassId: '',
    subjectId: '',
    cclassId: '',
    csubjectId: '',
    gradeId: '',
    reportTimeList: [],
    schoolDataReport: {},
    classDataReport: {},
    periodTime: 100,
    timeStamp: 100,
    sgradeList: [],
    sclassList: [],
    ssubList: [],
    searchData: [],
    classSearchData: [],
    stateTimeIndex: 0,
    noClassData: true,
    startTime: '',
    endTime: '',
  },
  reducers: {
    endTime(state, { payload }) {
      return { ...state, endTime: payload };
    },
    startTime(state, { payload }) {
      return { ...state, startTime: payload };
    },
    noClassData(state, { payload }) {
      return { ...state, noClassData: payload };
    },
    stateTimeIndex(state, { payload }) {
      return { ...state, stateTimeIndex: payload };
    },
    searchData(state, { payload }) {
      return { ...state, searchData: payload };
    },
    classSearchData(state, { payload }) {
      return { ...state, classSearchData: payload };
    },
    sgradeList(state, { payload }) {
      return { ...state, sgradeList: payload };
    },
    sclassList(state, { payload }) {
      return { ...state, sclassList: payload };
    },
    ssubList(state, { payload }) {
      return { ...state, ssubList: payload };
    },
    periodTime(state, { payload }) {
      return { ...state, periodTime: payload };
    },
    timeStamp(state, { payload }) {
      return { ...state, timeStamp: payload };
    },
    reportTimeList(state, { payload }) {
      return { ...state, reportTimeList: payload };
    },
    schoolDataReport(state, { payload }) {
      return { ...state, schoolDataReport: payload };
    },
    classDataReport(state, { payload }) {
      return { ...state, classDataReport: payload };
    },
    allSubList(state, { payload }) {
      return { ...state, allSubList: payload };
    },
    gradeId(state, { payload }) {
      return { ...state, gradeId: payload };
    },
    schoolId(state, { payload }) {
      return { ...state, schoolId: payload };
    },
    sclassId(state, { payload }) {
      return { ...state, sclassId: payload };
    },
    subjectId(state, { payload }) {
      return { ...state, subjectId: payload };
    },
    cclassId(state, { payload }) {
      return { ...state, cclassId: payload };
    },
    csubjectId(state, { payload }) {
      return { ...state, csubjectId: payload };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * getReportTimeList({ payload }, { put, select }) {
      let { years } = yield select(state => state.temp)
      let res = yield getReportTimeList({ year: years });
      if (res.data) {
        let arr = res.data.data;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].periodTime === 1) {
            arr[i].name = '本学年'
          } else if (arr[i].periodTime === 2) {
            arr[i].name = '本学期'
          } else if (arr[i].periodTime === 3) {
            arr[i].name = '本月'
          } else if (arr[i].periodTime === 4) {
            arr[i].name = '本周'
          }
        }
        yield put({
          type: 'reportTimeList',
          payload: res.data.data
        })
        yield put({
          type: 'periodTime',
          payload: 1
        })
        yield put({
          type: 'timeStamp',
          payload: res.data.data[0].timeStamp
        })

        if (payload.classReport === true) {
          //获取班级报表
          const _state = yield select(state => state.reportChart);
          let { classId, subId } = yield select(state => state.temp);
          //如果是超级管理员的话
          if (store.get('wrongBookNews').rodeType === 10) {
            let { sclassId, csubjectId } = yield select(state => state.reportChart);
            classId = sclassId;
            subId = csubjectId;
          }
          // let _ccid = _class.classList1.data[0].classId
          // let _sid = _class.subList.data[0].v
          // yield put({
          //   type: 'cclassId',
          //   payload: _ccid
          // })
          // yield put({
          //   type: 'csubjectId',
          //   payload: _sid
          // })
          let data = {
            classId: classId,
            schoolId: store.get('wrongBookNews').schoolId,
            periodTime: _state.periodTime,
            timeStamp: _state.timeStamp,
            subjectId: subId
          }
          yield put({
            type: 'getClassDataReport',
            payload: data,
          })
        } else {
          yield put({
            type: 'getGradeList',
          })
        }

      } else {
        message.error(res.data.msg)
      }

    },
    * getGradeList({ payload }, { put, select }) {
      let _schoolid = store.get('wrongBookNews').schoolId
      let gradeData = yield queryGradeListBySchoolId({ schoolId: _schoolid })
      if (gradeData.data.result === 0) {
        let glist = gradeData.data.data
        yield put({
          type: 'sgradeList',
          payload: glist
        })
        if (gradeData.data.data.length === 0) {
          yield put({
            type: 'schoolDataReport',
            payload: {}
          });
          return
        }

        yield put({
          type: 'gradeId',
          payload: glist[0].id
        })

        yield put({
          type: 'getClassList',
          payload: { schoolId: _schoolid, gradeId: glist[0].id }
        })

      } else {
        message.error('获取年级失败')
      }
    },
    * getClassList({ payload }, { put, select }) {
      let classData = yield queryClassListByGradeId({ schoolId: payload.schoolId, gradeId: payload.gradeId })
      console.error('classData', classData)
      if (classData.data.result === 0) {
        let clist = classData.data.data;
        yield put({
          type: 'sclassList',
          payload: clist
        });
        if (clist.length === 0) {
          yield put({
            type: 'sclassId',
            payload: ''
          });
          yield put({
            type: 'ssubList',
            payload: []
          });
          yield put({
            type: 'noClassData',
            payload: true
          });
          return
        }
        yield put({
          type: 'sclassId',
          payload: clist[0].id
        });
        if (store.get('wrongBookNews').rodeType === 10) {
          yield put({
            type: 'temp/className',
            payload: clist[0].name
          });
        }
        const _state = yield select(state => state.reportChart);
        let _classId = clist[0].id;
        let data = {
          classId: _classId,
          schoolId: store.get('wrongBookNews').schoolId,
          periodTime: _state.periodTime,
          timeStamp: _state.timeStamp,
          subjectId: _state.subjectId
        };
        yield put({
          type: 'getSubList',
          payload: data
        })
      } else {
        message.error('获取班级失败')
      }
    },
    * getSubList({ payload }, { put, select }) {
      let { years } = yield select(state => state.temp);
      let subData = yield querySubListByClassId({ year: years, classId: payload.classId })
      let _sublist = subData.data.data;
      if (subData.data.result === 0) {

        if (_sublist.length === 0) {
          yield put({
            type: '_sublist',
            payload: ''
          })
          yield put({
            type: 'ssubList',
            payload: []
          })
          yield put({
            type: 'noClassData',
            payload: true
          })
          return
        } else {
          yield put({
            type: 'noClassData',
            payload: false
          })
        }
        yield put({
          type: 'ssubList',
          payload: _sublist
        })
        yield put({
          type: 'subjectId',
          payload: _sublist[0].v
        });
        yield put({
          type: 'csubjectId',
          payload: _sublist[0].v
        });
        if (store.get('wrongBookNews').rodeType === 10) {
          yield put({
            type: 'temp/subName',
            payload: _sublist[0].k
          });
        }
        let _subjectId = _sublist[0].v;
        let data = {
          schoolId: payload.schoolId,
          periodTime: payload.periodTime,
          timeStamp: payload.timeStamp,
          classId: payload.classId,
          subjectId: _subjectId
        }

        yield put({
          type: 'getSchoolDataReport',
          payload: data
        })
      } else {
        message.error('获取学科失败')
        return
      }
    },
    * changeSubList({ payload }, { put, select }) {
      yield put({
        type: 'getSchoolDataReport',
        payload: payload
      })
    },

    * getSchoolDataReport({ payload }, { put, select }) {
      let schoolRes = yield querySchoolDataReport(payload);

      if (schoolRes.data.result === 0) {
        yield put({
          type: 'schoolDataReport',
          payload: schoolRes.data.data
        })
        yield put({
          type: 'searchData',
          payload: schoolRes.data.data.teacherUseDataList
        })
      } else if (schoolRes.data.result === 1) {
        yield put({
          type: 'schoolDataReport',
          payload: 'none'
        })
        //message.warning(schoolRes.data.msg)
      } else {
        message.error('获取报表失败')
      }

    },
    * getSubjectList({ }, { put, select }) {
      // 返回教师所在班级科目
      let res = yield getSubjectList();
      if (res.data && res.data.result === 0) {
        yield put({
          type: 'allSubList',
          payload: res.data.data
        })
      } else {
        message.error(res.data.msg)
      }

    },
    * getClassDataReport({ payload }, { put, select }) {
      let classRes = yield queryClassDataReport(payload);

      let { years } = yield select(state => state.temp);
      let { periodTime } = yield select(state => state.reportChart);

      if (classRes.data.result === 0) {
        let nowtime;
        // 9月1号 之前，是2018-2019学年，9月1号之后，是2019-2020学年 moment().format('YYYY')
        if (Number(moment().format('MM')) < 9) {
          nowtime = moment().format('YYYY') - 1;
        } else {
          nowtime = moment().format('YYYY');
        }
        ;
        //如果学年不是今年，且选择的时间周期是‘本周’‘本月’则删除数据
        if (nowtime !== years && periodTime != 1 && periodTime != 2) {
          classRes.data.data.studentWrongNum = [];
          classRes.data.data.classUserNumData = [];
          classRes.data.data.classWrongNumData = [];
        }

        yield put({
          type: 'classDataReport',
          payload: classRes.data.data
        })
        yield put({
          type: 'classSearchData',
          payload: classRes.data.data.teacherUseDataList
        })

      } else if (classRes.data.result === 1) {
        yield put({
          type: 'classDataReport',
          payload: 'none'
        })
        message.error('获取报表失败')
      } else {

        yield put({
          type: 'classDataReport',
          payload:{
            studentWrongNum:[],
            classUserNumData:[],
            classWrongNumData:[],
            teacherUseDataList:[]
          }
          })

      }

    },
  },


};
