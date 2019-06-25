
export default {

  namespace: 'example',

  state: {
		uqId:'',
    userId:'',
    questionId:'',
    num:'',
    questionNews:[],
    //引导图的显示隐藏
    guideFigure:false,
  },

  reducers: {
    guideFigure(state, {payload}) {
      return { ...state, guideFigure:false };
    },
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
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    //引导图的显示隐藏
    *guide({ payload }, { call, put }){
      yield put({type:'guideFigure'})
    }
  },

  

};
