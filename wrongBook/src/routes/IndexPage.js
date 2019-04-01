import React, {Component} from 'react';
// import {Modal, } from 'antd';
import { routerRedux,  } from "dva/router";
import {connect} from 'dva';
import store from 'store';
import 'antd/dist/antd.css';

class HomePage extends Component {

	render() {
		return (
			<div className='homePageContaier'>
			</div>
   		)
	}

	componentWillMount () {
		const {dispatch} = this.props;
		dispatch({
			type: 'homePage/functionList'
		});
		const rodeType = store.get('wrongBookNews').rodeType
		if(rodeType === 10){
			this.props.dispatch(
				routerRedux.push({
					pathname: '/school',
					hash:'page=1'
					})
			)
		}else if(rodeType ===20){
			this.props.dispatch(
				routerRedux.push({
					pathname: '/schoolNews',
					})
			)
		}
	}

}

export default connect((state) => ({
	state: {
		...state.userName,
	}
}))(HomePage);