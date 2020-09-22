import React, { useState, useEffect } from 'react';
import {
	Layout, Table,Input, Modal, Select, Spin, Checkbox, Icon
} from 'antd';
import { connect } from 'dva';
import style from './RenderCropItem.less';
import store from 'store';
import moment from 'moment';
moment.locale('zh-cn');
class RenderCropItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			scwidth:720,
			cpicture:{}
		};
		

	}

	render() {

		return (

			<div>
				{
					this.props._partList.map((part, j) => {
						return (
							<div className={style.item_box} key={part.partId}>
										<div className={style._title}><span className={style.line}></span>第{j+1}部分</div>
										<div className={style._con} style={{padding:20,paddingBottom:0}}>
											{
												part.questions?part.questions.map((item, i) => {
													return (
														<div className={style.item_btn}        
															key={`${part.partId}${i}`}  
															onClick={(e)=>{this.props._updateChecked(j,i)}} 
														
															>
															{i+1}
															{item.iscuowu?<img style={{width:20}} src={require('../../../images/cuowu.png')}></img>:""}
													</div>
														
														)
													}):''
											}
										</div>
							</div>
							)
						})
				}
			</div>

		);
	}
	componentDidMount() {

	}


}

export default RenderCropItem
