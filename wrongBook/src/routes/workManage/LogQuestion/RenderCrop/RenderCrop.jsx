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
		return (
			
			this.props._partList.map((part, j) => {
				return(
					<div className={style.img_box} key={part.partId}>
						<img style={{width:720}}  src={part.partUrl} alt=""/>
						{
							part.questions?part.questions.map((item, i) => {
								return (
									<div className={style.rect_item}        
										key={`${item.aftId}${i}`}  
										style={{
												width:item.areaList[0].areaWidth/720*this.state.scwidth+'px',
												height:item.areaList[0].areaHeight/720*this.state.scwidth+'px',
												left:item.areaList[0].pointX/720*this.state.scwidth+'px',
												top:item.areaList[0].pointY/720*this.state.scwidth+'px',
												zIndex:50-i,
										}} 
										onClick={(e)=>{this.props._updateChecked(j,i)}}  
									
										>
										<span className={style.inputnum}>{item.orderBy}</span>
										{item.iscuowu?<img style={{minHeight:20,height:'70%'}} src={require('../../../images/cuowu.png')}></img>:""}
								</div>
									
									)
								}):''
						}
					</div>
				)
		})
		);
	
	}
	componentDidMount() {
	
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
