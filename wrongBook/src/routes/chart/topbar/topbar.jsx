import React from 'react';
import { Layout,Select,Row, Col,DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './topbar.less';
import 'react-count-animation/dist/count.min.css';
import store from 'store';
moment.locale('zh-cn');

const { Content,Header } = Layout;
const Option = Select.Option;
//作业中心界面内容
class topbar extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			timeIndex:0,
			dateValue:['开始时间','结束时间'],
			date:[]
		}

	}
	workHandlePanelChange = (value, mode) => {    
		
	} 
	handleClick=(item)=> {
		this.props.onChangeTime(item);
	}
	workOnChange = (date) => { 	
			const dateFormat = 'YYYY-MM-DD';   
			let startDate= moment(date[0]).format("YYYY-MM-DD")
			let endDate = moment(date[1]).format("YYYY-MM-DD")
			let queryDate=startDate+'~'+endDate

			if(date.length===0){
				this.setState({
					timeIndex:0,
					date:null		
				})
				this.props.onChangeDate('','');
			}else{
				this.setState({
					timeIndex:100,
					date:[moment(startDate, dateFormat), moment(endDate, dateFormat)]			
				})
				this.props.onChangeDate(startDate,endDate);
			} 
			//console.log(queryDate)
		
	}
	disabledDate = current => current && current > moment().endOf('day') || current < moment().subtract(2, 'year');
	render() {
		const {RangePicker} = DatePicker;
		
		let timeList=this.props.timeList

		return(
			<Header  style={{ background: '#fff',borderTop:'1px solid #eee',borderBottom:'1px solid #eee',overflow:'hidden',padding:'0 20px',height:44,lineHeight:'44px'}}>
						<div className={style.topbar} style={{ background: '#fff',margin:'0'}}>
								<div>
									<ul className={style.timemenu}>
									{timeList.length>0?timeList.map((item,i) =>(
											<li key={i}
												className={i === this.state.timeIndex?'selected': ''}
												onClick={() =>{
													console.log(i,item)
													this.setState({
														timeIndex:i,
														date:null
													})
													this.handleClick(item);
												}}>
											{item.name}</li>
										)):''}														
									</ul>
								</div>
								<div style={{marginLeft:14}}>
									<RangePicker  
										style={{width:220}}              
										placeholder={this.state.dateValue}
										value={this.state.date}  		
										format="YYYY-MM-DD"                            
										onPanelChange={this.workHandlePanelChange}
										onChange={this.workOnChange} 
										disabledDate={this.disabledDate}
										/>
								</div>
										
						</div>
					</Header>
		);
	}

	componentDidMount(){

	}
}

export default connect((state) => ({
	state: {
		...state.userInfo,
		...state.classHome,
		...state.reportChart,
		...state.report,
		...state.temp,
	}
}))(topbar);