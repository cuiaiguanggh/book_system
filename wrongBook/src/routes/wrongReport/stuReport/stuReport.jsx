import React from 'react';
import { Layout, Menu, Button,message,Select,Modal,Icon
} from 'antd';
import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './stuReport.less';
import moment from 'moment';
import {dataCenter} from '../../../config/dataCenter'
import store from 'store';
//作业中心界面内容
const Option = Select.Option;
const {
	Header, Footer, Sider, Content,
  } = Layout;

let hei = 0

class StuReport extends React.Component {
	constructor(props) {
		super(props);
        this.Ref = ref => {this.refDom = ref};
		this.state={
			current:'',
			loading:false,
			wordUrl:'',
			visible:false,
			Img:'',
		}
	}
	
	handleScroll(e){
        const { clientHeight} = this.refDom;
        hei = clientHeight;
    }
    
    onScrollHandle(e) {
        console.log(e.target.scrollTop,hei,e.target.clientHeight)
    }
	menulist() {
		let  detail = this.props.state.qrdetailList.data.userCountList;
		if(this.props.state.qrdetailList.data.userCountList.length > 0){

			let current = this.props.state.stuName== '' ? detail[0].userId:this.props.state.stuName
			return (
				<Menu 
				// theme="dark" 
				mode="inline" 
				defaultSelectedKeys={[current]}
				onClick={(e)=>{
					this.props.dispatch({
						type: 'down/stuName',
						payload:e.key
					});
					let data ={
						classId:this.props.state.classId,
						year:this.props.state.years,
						subjectId:this.props.state.subId,
						userId:e.key,
						info:0
					}
					this.props.dispatch({
						type: 'report/queryQrDetail1',
						payload:data
					});
					this.props.dispatch({
						type: 'report/userId',
						payload:e.key
					});
					let dom = document.getElementsByClassName('down');
					for(let i = 0 ; i < dom.length ; i ++ ) {
						dom[i].innerHTML="加入错题篮";
						dom[i].className= 'down'
					}
					this.props.dispatch({
						type: 'down/delAllStu',
					});
				}}
			>
				{
					detail.map((item,i)=>(
						<Menu.Item key={item.userId}style={{cursor:'pointer'}}>
							<div key={i} style={{overflow:'hidden'}}>
								<span style={{float:'left'}}>{item.userName}</span>
								<span style={{float:'right'}}>{item.wrongNum}道</span>
							</div>
						</Menu.Item>
					))
				}
			</Menu>
			)
		}
	}
	questions() {
		let  detail = this.props.state.qrdetailList1.data.questionList;
		
		if(detail.length >0){
			return(
				<div className={style.outBody}
                	ref={this.Ref}
	                onWheel={(e) => this.handleScroll(e)}>
					{
						detail.map((item,i)=>{
							let cls = 'down',name = '加入错题篮'
							let downs = this.props.state.stuDown;
							for(let j = 0 ; j < downs.length ; j ++) {
								if(downs[j] == item.questionId){
									cls = 'down ndown';
									name = '移出错题篮'
								}
							}
							return(
							<div key={i} className={style.questionBody}>
								<div className={style.questionTop}>
									<span style={{marginRight:'20px'}}>第{i+1}题</span>
									{/* <span>班级错误率：{}%（答错15人）</span> */}
								</div>
								<div style={{padding:'10px',height:'250px',overflow:"hidden"}}  onClick={()=>{
								this.setState({visible:true,Img:item.userAnswerList[0].answer})
							}}>
									{
										item.userAnswerList[0].answer.split(',').map((item,i)=>(
											<img key={i} style={{width:'100%'}} src={item}></img>
										))
									}
								</div>
								<div style={{overflow:'hidden',padding:'10px'}}>
								
								<span className={cls}  onClick={()=>{
									let dom = document.getElementsByClassName('down');
									let downs = this.props.state.stuDown;
									if( dom[i].innerHTML == '加入错题篮' ){
										this.props.dispatch({
											type: 'down/stuDown',
											payload:item.questionId
										});
									}else{
										this.props.dispatch({
											type: 'down/delstuDown',
											payload:item.questionId
										});
									}
									}}>{name}</span>
								</div>
							</div>
						)})
					}
				</div>
			)
		}else{
			return(
				<div></div>
			)
		}
	}
	render() {
		let mounthList = this.props.state.mounthList;
		let  detail = this.props.state.qrdetailList1;
		return (
            <Content style={{
                background: '#fff', 
                minHeight: 280,
                overflow:'auto',
                position:'relative'
            }}
            ref='warpper'
            onScroll={this.onScrollHandle}
            >
				<div className={style.layout}>
					<iframe style={{display:'none'}} src={this.state.wordUrl}/>
					<div style={{height:'50px',lineHeight:'50px'}}>
						<div style={{padding:'0 20px'}}>
							<span>时间：</span>
								<span key={0} className={0 == this.props.state.mouNow?'choseMonthOn': 'choseMonth'} onClick={()=>{
									this.props.dispatch({
										type: 'report/changeMouth',
										payload:0
									});
									this.props.dispatch({
										type: 'report/queryQrDetail',
										payload:{
											classId:this.props.state.classId,
											year:this.props.state.years,
											subjectId:this.props.state.subId,
											info:0,
										}
									});
								}}>全部</span>
							{
								mounthList.data ?
								mounthList.data.map((item,i)=>(
									<span key={i} className={item ==this.props.state.mouNow?'choseMonthOn': 'choseMonth'} onClick={()=>{
										this.props.dispatch({
											type: 'report/changeMouth',
											payload:item
										});
										
									this.props.dispatch({
											type: 'report/queryQrDetail',
											payload:{
												classId:this.props.state.classId,
												year:this.props.state.years,
												subjectId:this.props.state.subId,
												info:0,
											}
										});
									}}>{item.k}</span>
								))
								:''
							}
							<Button 
								style={{background:'#67c23a',color:'#fff',position:'fixed',right:'20px',top:"73px"}}
						
								loading={this.state.loading} 
								onClick={()=>{
									if(this.props.state.stuDown.length!= 0){
										let load = !this.state.loading
										this.setState({loading:load})
										let This = this;
										if(!this.state.loading){
											let url = dataCenter('/web/report/getQuestionPdf?questionIds='+this.props.state.stuDown.join(','))
											// window.open(url,'_blank'); 
											this.setState({wordUrl:url})
											this.props.dispatch({
												type: 'down/delAllStu',
											});
										}
										setTimeout(function(){
											This.setState({loading:!load,wordUrl:''})
										},10000)
									}else{
										message.warning('请选择题目到错题篮')
									}
								}}>
                        	<img style={{verticalAlign:"sub"}} src={require('../../images/xc-cl-n.png')}></img>
							下载组卷({this.props.state.stuDown.length})
							</Button>
						</div>
					</div>
					<Layout className={style.innerOut}>
						<Sider  className={style.sider}>
							
								{
									detail.data? this.menulist():''
								}
						</Sider>
						<Content className={style.content}>
							{
									detail.data? this.questions():''
								}
						</Content>
					</Layout>
					<Modal
						visible={this.state.visible}
						width='1000px'
						className="showques"
						footer={null}
						onOk={()=>{
							this.setState({visible:false})
						}}
						onCancel={()=>{
							this.setState({visible:false})
						}}
					>
						{
							this.state.Img.split(',').map((item,i)=>(
								<img key={i} style={{width:'100%'}} src={item}></img>
							))
						}
					</Modal>
				</div>
			</Content>
		)
	}

	componentDidMount(){
		let classId = this.props.state.classId;
		let subId = this.props.state.subId;
		let year = this.props.state.years;
		let userId = this.props.state.userId;
		if(classId!== '' && subId!='' && year!== '' && userId!= ''){
			let data ={
					classId:classId,
					year:year,
					subjectId:this.props.state.subId,
					info:0,
					userId:this.props.state.userId
			}
			this.props.dispatch({
				type: 'report/queryQrDetail1',
				payload:data
			});
		}
	}
}

export default connect((state) => ({
	state: {
		...state.report,
		...state.temp,
		...state.down,
	}
}))(StuReport);