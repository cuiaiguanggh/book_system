import React, { useState, useEffect } from 'react';
import {
	Layout, Table,Input, Modal, Select, Spin, Checkbox, Icon
} from 'antd';
import { connect } from 'dva';
import style from './RenderCropItem.less';
import store from 'store';
import moment from 'moment';
moment.locale('zh-cn');
class LogContent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			scwidth:720,
			cpicture:{}
		};
		

	}
	cropItemClick (i,pic) {
		pic['areas'][i]['iscuowu']=!pic['areas'][i]['iscuowu']
		this.setState({
			cpicture:pic
		})
	}
	render() {
		let picture=this.state.cpicture
		return (
			<div className={style.item_box} >
							<div className={style._title}><span className={style.line}></span>第{this.props.index+1}部分</div>
							<div className={style._con} style={{padding:20,paddingBottom:0}}>
								{
									picture.areas?picture.areas.map((item, i) => {
										return (
											<div className={style.item_btn}        
												key={i}  
												onClick={(e)=>{this.cropItemClick(i,picture)}} 
											
												>
												{i+1}
												{item.iscuowu?<img style={{width:20}} src={require('../../../images/cuowu.png')}></img>:""}
										</div>
											
											)
										}):''
								}
							</div>
				</div>
		);
	}
	componentDidMount() {
		this.setState({
			cpicture:this.props.picture
		})
	}
	UNSAFE_componentWillMount() {
		
	}

}

export default connect((state) => ({
	state: {
		...state.homePage,
		getClassMembersFinish:state.classModel.getClassMembersFinish,
		classStudentList:state.classModel.classStudentList,
		years: state.temp.years
	}
}))(LogContent);
