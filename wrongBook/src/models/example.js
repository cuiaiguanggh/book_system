
export default {

  namespace: 'example',

  state: {
		uqId:'',
    userId:'',
    questionId:'',
    num:'',
    questionNews:[],
  },

  reducers: {
    questionNews(state, {payload}) {
			return { ...state, questionNews:payload };
    },
		uqId(state, {payload}) {
			return { ...state, uqId:payload };
    },
    userId(state, {payload}) {
			return { ...state, userId:payload };
    },
    questionId(state, {payload}) {
			return { ...state, questionId:payload };
    },
    num(state, {payload}) {
			return { ...state, num:payload };
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {  // eslint-disable-line
    // },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  

};
