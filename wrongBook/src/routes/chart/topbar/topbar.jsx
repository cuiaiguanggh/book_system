import React from 'react';
import { Layout,DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import style from './topbar.less';
import 'react-count-animation/dist/count.min.css';
import store from 'store';
moment.locale('zh-cn');

const { Header } = Layout;
//作业中心界面内容
class topbar extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			timeIndex:0,
			dateValue:['开始时间','结束时间'],
			date:[],
			ctimestamp :new Date().getTime(),
		}

	}
	workHandlePanelChange = (value, mode) => {    
		
	} 
	add0(m){return m<10?'0'+m:m }
	format(shijianchuo){
		//shijianchuo是整数，否则要parseInt转换
		var time = new Date(shijianchuo);
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y+'-'+this.add0(m)+'-'+this.add0(d);
	}
	handleClick=(item)=> {
		this.props.onChangeTime(item);
	}
	workOnChange = (date) => { 	
			const dateFormat = 'YYYY-MM-DD';   
			let startDate= moment(date[0]).format("YYYY-MM-DD")
			let endDate = moment(date[1]).format("YYYY-MM-DD")

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
		
	}
	disabledDate = current => current && current > moment().endOf('day') || current < moment().subtract(2, 'year');
	render() {
		const {RangePicker} = DatePicker;
		
		let timeList=this.props.timeList
		let sdate
		let cdate=this.format(this.state.ctimestamp)
		let defaultDate=[]
		if(timeList.length>0){
			sdate=this.format(timeList[0].timeStamp)
			defaultDate=[sdate, cdate]
		}
		console.log('defaultDate',defaultDate)
		return(
			<Header  style={{ background: '#fff',borderTop:'1px solid #eee',borderBottom:'1px solid #eee',overflow:'hidden',padding:'0 20px',height:44,lineHeight:'44px'}}>
						<div className={style.topbar} style={{ background: '#fff',margin:'0'}}>
								<div>
									<ul className={style.timemenu}>
									{timeList.length>0?timeList.map((item,i) =>(
											<li key={i}
												className={i === this.state.timeIndex?'selected': ''}
												onClick={() =>{											
													sdate=this.format(item.timeStamp)
													this.setState({
														timeIndex:i,
														date:[moment(sdate, "YYYY-MM-DD"), moment(cdate, "YYYY-MM-DD")]
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
										placeholder={defaultDate}
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