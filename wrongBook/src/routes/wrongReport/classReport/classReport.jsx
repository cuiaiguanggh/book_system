import React from 'react';
import { Button, message, Input,Modal,Select,Popover,Icon
} from 'antd';
import {dataCenter} from '../../../config/dataCenter'
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './classReport.less';
import { request } from 'http';
//作业中心界面内容
const Option = Select.Option;

class wrongTop extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible:false,
			key:0,
			showAns:'',
			wordUrl:'',
			loading:false,
	    };
    }
	
	quesList(){
		let ques = this.props.state.qrdetailList.data;
        let num = ques.memberNum;
        
        let dom = document.getElementsByClassName('down');
        // console.log(dom)
		return(
			<div className={style.outBody}>
			{
				ques.questionList.map((item,i)=>{
					let ans = []
					for(let i=0;i< item.userAnswerList.length;i++){
						if(item.userAnswerList[i].result == 0 ){
							ans.push( item.userAnswerList[i].answer)
						}
                    }
                    let downs = this.props.state.classDown;
                    
                    let cls = 'down',name = '加入错题篮'
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
							<span>班级错误率：{(item.wrongNum/num*100).toFixed(0)}%（答错{item.wrongNum}人）</span>
						</div>
						<div style={{padding:'10px',height:'250px',overflow:'hidden'}} onClick={()=>{
                            this.setState({visible:true,key:i,showAns:ans[0]})
                        }}>
                            {
                                item.questionUrl.split(',').map((item,i)=>(
                                    <img key={i} style={{width:'100%'}} src={item}></img>
                                ))
                            }
						</div>
						<div style={{overflow:'hidden',padding:'10px'}}>
							<Button style={{float:'left'}} onClick={()=>{
								this.setState({visible:true,key:i,showAns:ans[0]})
							}}>查看统计</Button>
							<span className={cls}  onClick={()=>{
                                let dom = document.getElementsByClassName('down');
                                let downs = this.props.state.classDown;
                                console.log(dom[i])
                                if( dom[i].innerHTML == '加入错题篮' ){
                                    console.log(dom[i])
                                    this.props.dispatch({
                                        type: 'down/classDown',
                                        payload:item.questionId
                                    });
                                    // dom[i].className="down ndown"
                                    // dom[i].innerHTML = '移出错题篮'
                                }else{
                                    console.log(222)
                                    this.props.dispatch({
                                        type: 'down/delClassDown',
                                        payload:item.questionId
                                    });
                                    // dom[i].className="down"
                                    // dom[i].innerHTML = '加入错题篮'
                                }
                                
                                
                            }}>{name}</span>
						</div>
					</div>
				)})
			}
			</div>
		)
	}
	showQuestion(){
		let QuestionDetail = this.props.state.qrdetailList;
        let key = this.state.key;
        let question = QuestionDetail.data.questionList[key]
        let trueNum = [];

        let wrongNum = [];
        let wrongQues = [];
        if(QuestionDetail.data.questionList.length>0){
            for(let i =0;i<question.userAnswerList.length;i++){
                if(question.userAnswerList[i].result == 1){
                    trueNum.push(question.userAnswerList[i].userName)
    
                }else if(question.userAnswerList[i].result == 0){
                    wrongNum.push(question.userAnswerList[i].userName)
                    wrongQues.push(question.userAnswerList[i].answer)
                }
            }  
            let Num = trueNum.length+ wrongNum.length
            return(
                <div>
                    <div style={{border:'1px solid #ccc',marginBottom:'10px'}}>
                        <div style={{padding:'10px'}}>
                            {
                                question.questionUrl.split(',').map((item,i)=>(
                                    <img key={i} src={item} style={{width:'500px'}}></img>
                                ))
                            }
                        </div>
                        <div style={{borderTop:'1px solid #e7e7e7',padding:'10px',background:'#fafafa',overflow:'hidden',lineHeight:'30px'}}>
                            <span>班级错误率：{(question.wrongNum/question.userAnswerList.length *100).toFixed(0)}%</span>
                        </div>
                    </div>
                    <div style={{border:'1px solid #ccc',marginBottom:'10px',padding:'10px'}}>
                        <h3>答题统计</h3>
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
                        </div>
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
                        this.state.showAns.split(',').map((item,i)=>(
                            <img key={i} width='500px' src={item}></img>
                        ))
                    }
                </div>
            )
        } 
	}
	render() {
		let mounthList = this.props.state.mounthList;
		let key = this.state.key;
		let MaxKey = 0
		let QuestionDetail = this.props.state.qrdetailList
        if(QuestionDetail.data){
            MaxKey = QuestionDetail.data.questionList.length-1;
        }
		return (
			<div style={{height:'50px',lineHeight:'50px'}}>
				<iframe style={{display:'none'}} src={this.state.wordUrl}/>
				<div style={{padding:'0 20px'}}>
					<span>时间：</span>
						<span key={0} className={0 ==this.props.state.mouNow?'choseMonthOn': 'choseMonth'} onClick={()=>{
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
										month:item.v
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
                            if(this.props.state.classDown.length!= 0){
                                let load = !this.state.loading
                                this.setState({loading:load})
                                let This = this;
                                if(!this.state.loading){
                                    let url = dataCenter('/web/report/getQuestionDoxc?questionIds='+this.props.state.classDown.join(','))
                                    // window.open(url,'_blank'); 
                                    this.setState({wordUrl:url})
                                    this.props.dispatch({
                                        type: 'down/delAllClass',
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
                    下载组卷({this.props.state.classDown.length})
                    </Button>
				</div>
					{this.props.state.qrdetailList.data?this.quesList():''}
				
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
                    {this.props.state.qrdetailList.data?this.showQuestion():''}
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
                                for(let i=0;i< QuestionDetail.data.questionList[key-1].userAnswerList.length;i++){
                                    if(QuestionDetail.data.questionList[key-1].userAnswerList[i].result !=1 ){
                                        this.setState({key:key-1,
                                            showAns:QuestionDetail.data.questionList[key-1].userAnswerList[i].answer})
                                        
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
								
                                for(let i=0;i< QuestionDetail.data.questionList[key+1].userAnswerList.length;i++){
                                    if(QuestionDetail.data.questionList[key+1*1].userAnswerList[i].result !=1 ){
                                        this.setState({key:key+1*1,
                                            showAns:QuestionDetail.data.questionList[key+1].userAnswerList[i].answer})
                                        return
                                    }
                                }
                            }
                        }}
                        type="right" />
                </Modal>
			</div>
		);
	  }

	componentDidMount(){
		let classId = this.props.state.classId;
		let subId = this.props.state.subId;
		let year = this.props.state.years;
		if(classId!== '' && subId!='' && year!== ''){
			let data ={
					classId:classId,
					year:year,
					subjectId:this.props.state.subId,
					info:0,
			}
			this.props.dispatch({
				type: 'report/queryQrDetail',
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
}))(wrongTop);