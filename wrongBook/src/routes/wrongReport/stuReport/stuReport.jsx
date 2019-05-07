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
			page:1,
			next:true,
		}
	}
	
	handleScroll(e){
        const { clientHeight} = this.refDom;
		hei = clientHeight;
    }
	menulist() {
		let  studentList = this.props.state.studentList;
		let current = this.props.state.userId ;
		if(studentList.data.length > 0 ){
			if(  current !== '' ){
				return (
					<Menu 
					// theme="dark" 
					mode="inline" 
					defaultSelectedKeys={[current]}
					onClick={(e)=>{
						this.setState({page:1})
						this.props.dispatch({
							type: 'down/stuName',
							payload:e.key
						});
						this.props.dispatch({
							type: 'report/userId',
							payload:e.key
						});
						this.props.dispatch({
							type:'report/qrStudentDetailList',
							payload:[]
						})
						let data ={
							classId:this.props.state.classId,
							year:this.props.state.years,
							subjectId:this.props.state.subId,
							userId:e.key,
							info:0,
							pageSize:50,
							pageNume:1
						}
						if(this.props.state.mouNow != 0){
							data.month = this.props.state.mouNow.v
						}
						this.props.dispatch({
							type: 'report/userQRdetail',
							payload:data
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
						studentList.data.map((item,i)=>(
							<Menu.Item key={item.userId} style={{cursor:'pointer'}} title={item.userName}>
								<div key={i} style={{overflow:'hidden'}}>
									<span style={{float:'left',width:"70%",overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.userName}</span>
									<span style={{float:'right'}}>{item.wrongNum}道</span>
								</div>
							</Menu.Item>
						))
					}
				</Menu>
				)
			}else{
				return (
					<Menu 
					// theme="dark" 
					mode="inline" 
				>
				</Menu>
				)
			}
		}else{

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
									{
										item.num != 0 ? 

										<span style={{borderLeft:'1px solid #ccc',paddingLeft:'20px'}}>已出卷<span style={{color:"#1890ff",fontWeight:'bold',padding:'0 5px'}}>{item.num}</span>次</span>
										:''
									}
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
										this.props.dispatch({
											type: 'down/stuDownPic',
											payload:item.picId
										});
									}else{
										this.props.dispatch({
											type: 'down/delstuDown',
											payload:item.questionId
										});
										this.props.dispatch({
											type: 'down/delstuDownPic',
											payload:item.picId
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
		let studentList = this.props.state.studentList;
		let  detail = this.props.state.qrdetailList1;
		return (
            <Content style={{
                background: '#fff', 
                minHeight: 280,
                overflow:'auto',
                position:'relative'
            }}
            ref='warpper'
            >
				<div className={style.layout}>
					<iframe style={{display:'none'}} src={this.state.wordUrl}/>
					<div style={{height:'50px',lineHeight:'50px'}}>
						<div style={{padding:'0 20px',background:"#fff",borderBottom:'1px solid #ccc'}}>
							<span>时间：</span>
								<span key={0} className={0 == this.props.state.mouNow?'choseMonthOn': 'choseMonth'} onClick={()=>{
									this.props.dispatch({
										type: 'report/changeMouth',
										payload:0
									});
									this.setState({page:1})
									this.props.dispatch({
										type:'report/qrStudentDetailList',
										payload:[]
									})
									let data ={
										classId:this.props.state.classId,
										year:this.props.state.years,
										subjectId:this.props.state.subId,
										info:0,
										pageSize:50,
										pageNume:1
										// month:item.v,
									}
									this.props.dispatch({
										type: 'report/queryQrStudentCount',
										payload:data
									});
									// this.props.dispatch({
									// 	type: 'report/queryQrDetail',
									// 	payload:{
									// 		classId:this.props.state.classId,
									// 		year:this.props.state.years,
									// 		subjectId:this.props.state.subId,
									// 		info:0,
									// 	}
									// });
									// this.props.dispatch({
                                    //     type: 'report/userQRdetail',
                                    //     payload:{
                                    //         classId:this.props.state.classId,
                                    //         year:this.props.state.years,
                                    //         subjectId:this.props.state.subId,
                                    //         info:0,
                                    //         userId:this.props.state.userId
                                    //     }
                                    // });
								}}>全部</span>
							{
								mounthList.data ?
								mounthList.data.map((item,i)=>(
									<span key={i} className={item ==this.props.state.mouNow?'choseMonthOn': 'choseMonth'} onClick={()=>{
										this.props.dispatch({
											type: 'report/changeMouth',
											payload:item
										});
										this.setState({page:1})
										this.props.dispatch({
											type:'report/qrStudentDetailList',
											payload:[]
										})
										let data ={
											classId:this.props.state.classId,
											year:this.props.state.years,
											subjectId:this.props.state.subId,
											info:0,
											month:item.v,
											pageSize:50,
											pageNume:1
										}
										this.props.dispatch({
											type: 'report/queryQrStudentCount',
											payload:data
										});
										// this.props.dispatch({
										// 	type: 'report/queryQrDetail',
										// 	payload:{
										// 		classId:this.props.state.classId,
										// 		year:this.props.state.years,
										// 		subjectId:this.props.state.subId,
										// 		info:0,
										// 	}
										// });
										// this.props.dispatch({
										// 	type: 'report/userQRdetail',
										// 	payload:{
										// 		classId:this.props.state.classId,
										// 		year:this.props.state.years,
										// 		subjectId:this.props.state.subId,
										// 		info:0,
										// 		month:item.v,
										// 		userId:this.props.state.userId
										// 	}
										// });
									}}>{item.k}</span>
								))
								:''
							}
							<Button 
								style={{background:'#67c23a',color:'#fff',float:'right',marginTop:"9px",border:'none'}}
								loading={this.state.loading} 
								onClick={()=>{
									if(this.props.state.stuDown.length!= 0){
										let load = !this.state.loading
										this.setState({loading:load})
										let This = this;
										if(!this.state.loading){
											let url = dataCenter('/web/report/getQuestionPdf?picIds='+this.props.state.stuDownPic.join(','))
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
							{/* <Button 
								type="primary"
								style={{float:'right',marginTop:"9px",border:'none',marginRight:'10px'}}
								>
							查看原图
							</Button> */}
						</div>
					</div>
					<Layout className={style.innerOut}>
						{
							studentList.data && studentList.data.length >0 ?
							<Sider  className={style.sider}>
								{this.menulist()}
							</Sider>:''
						}
						<Content className={style.content}
						ref='warpper'
						onScroll={(e)=>{
							if(hei-200 < e.target.scrollTop+e.target.clientHeight){
								if(this.state.next ){
									let page = this.state.page;
									let classId = this.props.state.classId;
									let subId = this.props.state.subId;
									let year = this.props.state.years;
									page++
									this.setState({next:false,page:page})
									let data ={
										classId:classId,
										year:year,
										subjectId:subId,
										info:0,
										pageNum:page,
										pageSize:50,
										userId:this.props.state.userId
									}   
									if(this.props.state.mouNow != 0){
										data.month = this.props.state.mouNow.v
									}      
									this.props.dispatch({
										type: 'report/userQRdetail1',
										payload:data
									});
									let This =this
									setTimeout(function (){
										This.setState({next:true})
									},1000)
								}
							}
						}}>
							{
									detail.data && detail.data.questionList.length != 0 ?  this.questions():
									<div style={{textAlign:'center',position:'absolute',top:'50%',left:'50%',transform: 'translate(-50%, -50%)',width:'100%'}}>
										<img src={require('../../images/wsj-n.png')}></img>
										<span style={{fontSize:'30px',marginLeft:'50px',fontWeight:'bold',color:"#434e59"}}>暂无数据</span>
									</div>
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
			}
			this.props.dispatch({
				type: 'report/queryQrStudentCount',
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