import {
	queryQrDetail,
} from '../services/reportService';
import {
	recoverQuestion
} from '../services/yukeService';
import {
	queryChilQuestions
} from '../services/homePageService';

import moment from 'moment';
import {QUETYPELIST,GRADELIST,STUDYLIST,SUNJECTLIST} from './database'
import 'moment/locale/zh-cn';
import { message } from 'antd';
export default {
	namespace: 'manageQuestion',
	state: {
		STUDYEDATA:{
			value:STUDYLIST[0].value,
			list:STUDYLIST
		},
		GRADEDATA:{
			value:GRADELIST[0].value,
			list:GRADELIST
		},
		SUBJECTDATA:{
				value:SUNJECTLIST[0].value,
				list:SUNJECTLIST
		},
		QUETYPEDATA:{
				list:QUETYPELIST,
				value:QUETYPELIST[0].value
		},
		defaultDate:moment().locale('zh-cn').format('YYYY-MM-DD'),
		allSchools:[],
		schools: [],
		fetching: false,
		
		
		sdate:'',
		schoolValue:"",
		edate:'',
		queringSchool:true,
		queKeyStr:'',
		queId:-1,
		accountName:'',
		queryManageQues:false,
		showNoQueTypeOnly:false,
		manageQuestionList:[]
	},
	reducers: {
		
		STUDYEDATA(state, { payload }) {
			return { ...state, STUDYEDATA: payload };
		},
		GRADEDATA(state, { payload }) {
			return { ...state, GRADEDATA: payload };
		},
		SUBJECTDATA(state, { payload }) {
			return { ...state, SUBJECTDATA: payload};
		},
		QUETYPEDATA(state, { payload }) {
			return { ...state, QUETYPEDATA: payload };
		},
		schoolValue(state, { payload }) {
			return { ...state, schoolValue: payload };
		},
		allSchools(state, { payload }) {
			return { ...state, allSchools: payload };
		},
		showNoQueTypeOnly(state, { payload }) {
			return { ...state, showNoQueTypeOnly: payload };
		},
		schools(state, { payload }) {
			return { ...state, schools: payload };
		},
		fetching(state, { payload }) {
			return { ...state, fetching: payload };
		},
		sdate(state, { payload }) {
			return { ...state, sdate: payload };
		},
		edate(state, { payload }) {
			return { ...state, edate: payload };
		},
		queKeyStr(state, { payload }) {
			return { ...state, queKeyStr: payload };
		},
		queId(state, { payload }) {
			return { ...state, queId: payload };
		},
		accountName(state, { payload }) {
			return { ...state, accountName: payload };
		},
		queryManageQues(state, { payload }) {
			return { ...state, queryManageQues: payload };
		},
		manageQuestionList(state, { payload }) {
			return { ...state, manageQuestionList: payload };
		},
		
	},
	subscriptions: {

	},

	effects: {
		
		*refreshImg({ payload }, { put, select }) {
			let res=yield recoverQuestion(payload)
			return true
			
		},
		*deleteKnowlede({ payload }, { put, select }) {
			let res=yield recoverQuestion(payload)
			// return res
			return true
			
		},
		*updateKnowledge({payload}){
			console.log('payload: ', payload);
			return true
		},
		*getManageQuestions({payload},{put,select}){
			const { sdate,edate,defaultDate,QUETYPEDATA,schoolValue,accountName,queId,queKeyStr,GRADEDATA,SUBJECTDATA } = yield select(state => state.manageQuestion);
			console.log('schoolValue: ', schoolValue);

			//return
			let option={
					startTime:sdate?sdate:defaultDate,
					endTime:edate?edate:defaultDate,
					queType:QUETYPEDATA.value>-1?QUETYPEDATA.value:0,
					schoolId:schoolValue?schoolValue:0,
					accountName:accountName?accountName:'',
					keyword:queKeyStr,
					gradeId:GRADEDATA.value>-1?GRADEDATA.value:0,
					subjectId:SUBJECTDATA.value>-1?SUBJECTDATA.value:0
			}

			if(queId>-1)option.queId=queId

			console.log('option1: ', option);
			let option1={
				subjectId: 10,
				startTime:"2019-09-17",
				childId: 4449434128731136,
				pageSize: 500,
				page: 1,
				endTime: "2020-10-16",
			}
			let res=yield queryChilQuestions(option1)
			if(res.data.result===0){
				if(res.data.data&&res.data.data.list){
					yield put({
						type: 'manageQuestionList',
						payload: res.data.data.list
					})
				}else{
					yield put({
						type: 'manageQuestionList',
						payload: []
					})
				}
			}else{
				message.destroy()
				message.error('题目查询失败：'+res.data.msg)
			}
			console.log('payload: ', res);
			return res
		},
	},

};
