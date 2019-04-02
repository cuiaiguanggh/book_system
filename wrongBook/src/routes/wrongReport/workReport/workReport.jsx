import React from 'react';
import { Table, Button, message,Modal,Select,Layout,Icon
} from 'antd';
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './workReport.less';
import store from 'store';
import moment from 'moment';
import {dataCenter} from '../../../config/dataCenter'
import { format } from 'util';
import { stringify } from 'querystring';
//作业中心界面内容
const Option = Select.Option;
const {
	Header, Footer, Sider, Content,
  } = Layout;
let hei = 0

class ClassReport extends React.Component {
	constructor(props) {
		super(props);
        this.Ref = ref => {this.refDom = ref};
		this.state = {
			visible:false,
			key:0,
			showAns:'',
			wordUrl:'',
			loading:false,
	    };
	}
	
	handleScroll(e){
        const { clientHeight} = this.refDom;
        hei = clientHeight;
    }
    
    onScrollHandle(e) {
        console.log(e.target.scrollTop,hei,e.target.clientHeight)
    }
    getGrade() {
			const rodeType = store.get('wrongBookNews').rodeType;
			let homeworkList = this.props.state.homeworkList
			if(homeworkList.data && homeworkList.data.length > 0){
				let name = this.props.state.homeworkName
				return(
					<div>
						<span>选择作业：</span>
						<Select
							showSearch
							style={{ width: 250,margin:'0 20px'}}
							placeholder="作业名称"
							value={name}
							optionFilterProp="children"
							onChange={(value)=>{
								
								this.props.dispatch({
									type: 'report/homeworkName',
									payload:value
								});
								this.props.dispatch({
									type: 'report/queryUserScoreDetail',
									payload:{
										homeworkId:value
									}
								});
								this.props.dispatch({
									type: 'report/queryQuestionDetail',
									payload:{
										homeworkId:value
									}
								});
							}}
							filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						>
							{
								homeworkList.data.map((item,i) =>(
									<Option key={i} value={item.homeworkId}>{item.name}</Option>
								))
							}
						</Select>
						<Button 
							style={{background:'#67c23a',color:'#fff',position:'fixed',right:'20px',top:"73px",border:'none'}}
							loading={this.state.loading} 
							onClick={()=>{
								if(this.props.state.workDown.length!= 0){
									let load = !this.state.loading
									this.setState({loading:load})
									let This = this;
									if(!this.state.loading){
										let url = dataCenter('/web/report/getQuestionPdf?picIds='+this.props.state.workDownPic.join(','))
										// window.open(url,'_blank'); 
										this.setState({wordUrl:url})
										this.props.dispatch({
											type: 'down/delAllWork',
										});
									}
									setTimeout(function(){
										This.setState({loading:!load,wordUrl:''})
									},10000)
								}else{
									message.warning('请选择题目到错题篮')
								}
							}}>

                        	<img style={{verticalAlign:"sub",marginLeft:'10px'}} src={require('../../images/xc-cl-n.png')}></img>
							下载组卷（{this.props.state.workDown.length}）
						</Button>
					</div>
				)
			}else{
				return(
					<div>
						<span>选择作业：</span>
						<Select
							showSearch
							style={{ width: 250,margin:'0 20px'}}
							placeholder="作业名称"
							defaultValue='暂无作业'
							optionFilterProp="children"
							onChange={(value)=>{
							}}
							filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						>
						</Select>
						<Button 
							style={{background:'#67c23a',color:'#fff',position:'fixed',right:'20px',top:"73px"}}
							loading={this.state.loading} 
							onClick={()=>{
								if(this.props.state.workDown.length!= 0){
									let load = !this.state.loading
									this.setState({loading:load})
									let This = this;
									if(!this.state.loading){
										let url = dataCenter('/web/report/getQuestionDoxc?questionIds='+this.props.state.workDown.join(','))
										// window.open(url,'_blank'); 
										this.setState({wordUrl:url})
										this.props.dispatch({
											type: 'down/delAllWork',
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
							下载组卷({this.props.state.workDown.length})
						</Button>
					</div>
				)
			}
    }
    getSub() {

		}
	questions(){
		let questionDetail = this.props.state.questionDetail;
		if(questionDetail.data){
			return(
				<div style={{overflow:'hidden'}}>
					{
						questionDetail.data.qsList.map((item,i)=>{
							let ans = []
							for(let i=0;i< item.userAnswerList.length;i++){
								if(item.userAnswerList[i].result == 0 ){
									ans.push( item.userAnswerList[i].answer)
								}
							}
							let n = item.count.split('/');
							let won = n[1] - n[0];
							let downs = this.props.state.workDown;
							let cls = 'down',name = '加入错题篮'
							for(let j = 0 ; j < downs.length ; j ++) {
								if(downs[j] == item.questionId){
                                    cls = 'down ndown';
									name = '移出错题篮'
								}
							}
							return (
							<div key={i} className={style.questionBody}>
								<div className={style.questionTop}>
									<span style={{marginRight:"20px"}}>第{i+1}题</span>
									<span>班级错误率：{(item.wrongScore*100).toFixed(0)}%（答错{won}人）</span>
								</div>
								<div style={{padding:'10px',height:'250px',overflow:"hidden"}} onClick={()=>{
										// this.setState({visible:true,key:i,showAns:ans[0]})
										if(item.wrongScore != 0 ) {
											this.setState({visible:true,key:i,showAns:ans[0]})
										}
										let w = document.getElementsByClassName('wrongNum');
										if(w.length >0 ) {
											for(let j = 0;j<w.length;j++){
												w[j].className='wrongNum'
											}
											w[0].className='wrongNum wrongNumOn'
										}
									}}>
									{
										item.question.split(',').map((item,i)=>(
											<img key={i} style={{width:'100%'}} src={item}></img>
										))
									}
								</div>
								<div style={{overflow:'hidden',padding:'10px'}}>
									<Button style={{float:'left'}} onClick={()=>{
										if(item.wrongScore != 0 ) {
											this.setState({visible:true,key:i,showAns:ans[0]})
										}
										let w = document.getElementsByClassName('wrongNum');
										if(w.length >0 ) {
											for(let j = 0;j<w.length;j++){
												w[j].className='wrongNum'
											}
											w[0].className='wrongNum wrongNumOn'
										}
									}}>查看统计</Button>
									<span className={cls}  onClick={()=>{
										let dom = document.getElementsByClassName('down');
										if( dom[i].innerHTML == '加入错题篮' ){
											this.props.dispatch({
												type: 'down/workDown',
												payload:item.questionId
											});
											this.props.dispatch({
												type: 'down/workDownPic',
												payload:item.picId
											});
										}else{
											this.props.dispatch({
												type: 'down/delWorkDown',
												payload:item.questionId
											});
											this.props.dispatch({
												type: 'down/delWorkDownPic',
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
		}
	}
	showQuestion(){
		let QuestionDetail = this.props.state.questionDetail;
        let key = this.state.key;
        let question = QuestionDetail.data.qsList[key]
        let trueNum = [];
        let wrongNum = [];
		let wrongQues = []
        for(let i =0;i<question.userAnswerList.length;i++){
            if(question.userAnswerList[i].result == 1){
                trueNum.push(question.userAnswerList[i].userName)

            }else if(question.userAnswerList[i].result == 0){
                wrongNum.push(question.userAnswerList[i].userName)
                wrongQues.push(question.userAnswerList[i].answer)
            }
		}
		let showAns = []
		if(this.state.showAns){
			showAns = this.state.showAns.split(',')
		}
        let Num = trueNum.length+ wrongNum.length
        return(
            <div>
                {/* <div style={{border:'1px solid #ccc',marginBottom:'10px'}}>
                    <div style={{padding:'10px'}}>
						{
							question.question.split(',').map((item,i)=>(
								<img key={i} src={item} style={{width:'500px'}}></img>
							))
						}
                    </div>
                    <div style={{borderTop:'1px solid #e7e7e7',padding:'10px',background:'#fafafa',overflow:'hidden',lineHeight:'30px'}}>
                        <span>班级错误率：{(wrongNum.length/Num *100).toFixed(0)}%</span>
                    </div>
                </div> */}
                <div style={{border:'1px solid #ccc',marginBottom:'10px',padding:'10px'}}>
                    {/* <h3>答题统计</h3>
                    <h3 style={{overflow:'hidden'}}>
                        <span style={{
                            float:'left',background:'#e7f4dd',borderRadius:'30px',
                            padding:'0 10px',height:'30px',lineHeight:'30px',
                        }}>
                        答对（{trueNum.length}人）
                        </span>
                        <span style={{float:'right',color:"#88ca54"}}>
                        {(trueNum.length/Num *100).toFixed(0)}%</span>
                        </h3>
                    <div style={{borderBottom:'1px solid #ccc',marginBottom:'10px',padding:'10px 0'}}>
                        {
                           trueNum.map((item,i) =>(
                            <span key={i} style={{padding:'5px 10px',fontSize:"18px"}}>{item}</span>
                           )) 
                        }
                    </div> */}
                    <h3 style={{overflow:'hidden'}}>
                    <span style={{
                            float:'left',background:'#ffe1e4',borderRadius:'30px',
                            padding:'0 10px',height:'30px',lineHeight:'30px',
                        }}>
                        答错（{wrongNum.length}人）
                        </span>
                        <span style={{float:'right',color:"#ff6976"}}>
                        {(wrongNum.length/Num *100).toFixed(0)}%</span>
                    </h3>
                    <div>
                        {
                           wrongNum.map((item,i) =>(
                            <span key={i} className={i == 0?'wrongNum wrongNumOn' :'wrongNum'} 
                                onClick={()=>{
                                    let w = document.getElementsByClassName('wrongNum');
                                    for(let j = 0;j<w.length;j++){
                                        w[j].className='wrongNum'
                                    }
                                    w[i].className='wrongNum wrongNumOn'
                                    this.setState({showAns:wrongQues[i]})
                                }}
                            >{item}</span>
                           )) 
                        }
                    </div> 
                </div>
                 {
                    // this.state.showAns.map((item,i)=>(
                    //     <img width='500px' src={this.state.showAns}></img>
                    // ))
						showAns.map((item,i)=>(
							<img key={i} width='650px' src={item}></img>
						))
					
                }
            </div>
		)
	}
	render() {
		let columns = [
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				width: '100px',
				render: (text, record) => {
					return (
						<div className='space' style={{cursor:'pointer',textAlign:'center'}} onClick={()=>{
						}}>
							{text}
						</div>
					);
				}
			},
			{
				title:'错误率',
				dataIndex:'wrong',
				key:'wrong',
				width: '100px',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer',textAlign:'center'}} onClick={()=>{
						}}>
							{(text*100).toFixed(0)}%
						</div>
					);
				}
			},
			{
				title:'提交时间',
				dataIndex:'time',
				key:'time',
				width: '150px',
				render: (text, record) => {
					return (
						<div style={{cursor:'pointer',textAlign:'center'}} onClick={()=>{
							store.set('wrong_hash', this.props.location.hash)
						}}>
						<Icon type="clock-circle" style={{marginRight:'10px'}}/>
							{text}
						</div>
					);
				}
			},
			{
				title:<div style={{lineHeight:'17px'}}>
						<span>题目详情</span>
						<span  style={{float:'right',fontSize:'14px'}}>
							<Icon style={{color:'#f56c6c',fontSize:'14px',verticalAlign:'inherit',marginRight:'5px'}} type="close-circle" theme="filled"/>
							<span style={{color:'#909399',fontSize:'12px',marginRight:'10px',verticalAlign:'text-top'}}>错误</span>

						</span>
					</div>,
				dataIndex:'news',
				key:'news',
				render: (text, record) => {
					let arr = []
					for(let i = 0 ; i<text.length; i++){
						arr.push(
							<span className={text[i] == 1 ? 'qutrue':'quwrong'}>{i+1}</span>
						)
					}
					return arr
				}
			},
		]
		const dataSource = [];
		let scoreDetail = this.props.state.scoreDetail;
		if(scoreDetail.data){
			for(let i = 0;i < scoreDetail.data.userScoreList.length; i ++){
				let p = {};
				let det = scoreDetail.data.userScoreList[i];
				p["key"] = det.userId;
				p["name"] = det.userName;
				p["wrong"] = det.wrongScore;
				p["time"] = det.joinTime;
				p["news"] = det.resultList;
				p["list"] = det;
				dataSource[i]=p;
			}
		}

		let key = this.state.key;
		let MaxKey = 0
		let QuestionDetail = this.props.state.questionDetail
        if(QuestionDetail.data){
            MaxKey = QuestionDetail.data.qsList.length-1;
		}
		let homeworkList = this.props.state.homeworkList
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
			<div style={{height:'50px',lineHeight:'50px',padding:'20px'}}
			ref={this.Ref}
			onWheel={(e) => this.handleScroll(e)}
			>
				{homeworkList.data && homeworkList.data.length ?this.getGrade():''}
				<iframe style={{display:'none'}} src={this.state.wordUrl}/>
				
				<Table
					bordered
					dataSource={dataSource}
					columns={columns}
					rowClassName="editable-row"
				/>
				{this.questions()}
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
                    {this.props.state.questionDetail.data &&  QuestionDetail.data.qsList.length >0?this.showQuestion():''}
                    <Icon 
                        className={style.icLeft}
                        onClick={()=>{
                            if(key == 0){
                                message.warning('已是第一题')
                            }else{
                                this.setState({showAns:''})
                                let w = document.getElementsByClassName('wrongNum');
                                for(let j = 0;j<w.length;j++){
                                    w[j].className='wrongNum'
                                }
                                w[0].className='wrongNum wrongNumOn'
                                for(let i=0;i< QuestionDetail.data.qsList[key-1].userAnswerList.length;i++){
                                    if(QuestionDetail.data.qsList[key-1].userAnswerList[i].result !=1 ){
                                        this.setState({key:key-1,
                                            showAns:QuestionDetail.data.qsList[key-1].userAnswerList[i].answer})
                                        
                                        return
                                    }
                                }
                            }
                        }}
                        type="left" />
                    <Icon
                        className={style.icRight}
                        onClick={()=>{
                            if(key == MaxKey){
                                message.warning('已是最后一题')
                            }else{
                                let w = document.getElementsByClassName('wrongNum');
                                for(let j = 0;j<w.length;j++){
                                    w[j].className='wrongNum'
                                }
								w[0].className='wrongNum wrongNumOn'
								
                                for(let i=0;i< QuestionDetail.data.qsList[key+1].userAnswerList.length;i++){
                                    if(QuestionDetail.data.qsList[key+1*1].userAnswerList[i].result !=1 ){
                                        this.setState({key:key+1*1,
                                            showAns:QuestionDetail.data.qsList[key+1].userAnswerList[i].answer})
                                        return
                                    }
                                }
                            }
                        }}
                        type="right" />
                </Modal>
			</div>
			</Content>
		);
	  }

	componentDidMount(){
		this.props.dispatch({
			type: 'report/queryHomeworkList',
			payload:{
				classId:this.props.state.classId,
				subjectId:this.props.state.subId
			}
		});

		// 使用滚动时自动加载更多
        const loadMoreFn = this.props.loadMoreFn
        const wrapper = this.refs.wrapper
        let timeoutId
        function callback() {
            const top = wrapper.getBoundingClientRect().top
			const windowHeight = window.screen.height;
			console.log(2222)
            if (top && top < windowHeight) {
                // 证明 wrapper 已经被滚动到暴露在页面可视范围之内了
				// loadMoreFn()
				console.log('1111')
            }
        }
        window.addEventListener('scroll', function () {
			console.log(111)
        }.bind(this));
    }

}

export default connect((state) => ({
	state: {
		...state.report,
		...state.temp,
		...state.down,
	}
}))(ClassReport);