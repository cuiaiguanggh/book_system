import React, { useState, useEffect } from 'react';
import {
	Layout, Table,Input, Modal, Select, Spin, Checkbox, Icon
} from 'antd';
import { connect } from 'dva';
import style from './RenderCrop.less';
import store from 'store';
import moment from 'moment';
moment.locale('zh-cn');

const { Content } = Layout;
const Option = Select.Option;
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
			<div className={style.img_box} >
							<img style={{width:720}}  src={picture.serUrl} alt=""/>
							{
								picture.areas?picture.areas.map((item, i) => {
									return (
										<div className={style.rect_item}        
											key={i}  
											style={{
													width:item.area.width/720*this.state.scwidth+'px',
													height:item.area.height/720*this.state.scwidth+'px',
													left:item.area.x/720*this.state.scwidth+'px',
													top:item.area.y/720*this.state.scwidth+'px',
													zIndex:50-i,
											}} 
											onClick={(e)=>{this.cropItemClick(i,picture)}} 
										
											>
											<span className={style.inputnum}>{i+1}</span>
											{item.iscuowu?<img style={{width:20}} src={require('../../../images/cuowu.png')}></img>:""}
									</div>
										
										)
									}):''
							}
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
