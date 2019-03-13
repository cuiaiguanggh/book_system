import React from 'react';
import { Layout, Tabs, Input,Modal,Select,Icon,Progress, message,Anchor ,Button
} from 'antd';
// import {Link} from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './Problemlist.less';
import store from 'store';
import {dataCenter} from '../../config/dataCenter'
const { Link } = Anchor;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Option = Select.Option;
const { Content } = Layout;
const Search = Input.Search;
//作业中心界面内容


const operations = <div>Extra Action</div>;

class HomeworkCenter extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			editingKey: '',
			visible: false,
            classId:'',
            questionKey:0,
            showAns:'',
            loading: false,
            wordUrl:'',
	};
	}
	wronglist () {
		let state = this.props.state;
		let testScoreInfo = state.scoreList;
        let QuestionDetail = state.QuestionDetail;
        let list = QuestionDetail.data.qsList;
        return(
            <div>
                {
                    list.map((item,i) =>{
                        var scoreArea = [20,40];
                        let s =parseInt(item.wrongScore*100);
                        let are = ['#dcf2de','#fef7e3','#fcd8d2']
                        let key = ['#50c059','#ffbf00','#ee6b52']; 
                        let num = 0;                    
                        let color = ''
                        for(let j = 0; j<item.userAnswerList.length; j++) {
                            if(item.userAnswerList[j].result == 0){
                                num ++
                            }
                        }
                        if(item.wrongScore == 1){
                            console.log(item)
                            return(
                                <div key={i} 
                                className={style.quesList}
                                onClick={()=>this.scrollToAnchor(`ids${i}`)}>
                                    <Progress 
                                        type="circle" 
                                        strokeColor={key[2]}
                                        percent={100} 
                                        width={60}
                                        color='#ff7f69' 
                                        status="exception"
                                        format={() => '100%'} 
                                        style={{padding:'10px'}}
                                    />
                                    <span className={style.num}>{num}人</span>
                                    <p>{i+1}</p>  
                                </div>
                                
                            )
                        }else if(item.wrongScore == 0){
                            console.log(item)

                            return(
                                <div key={i} 
                                className={style.quesList}>
                                    <Progress 
                                    type="circle" 
                                    percent={100} 
                                    color={key[2]}
                                    width={60} 
                                    style={{padding:'10px'}}
                                    format={() => '0%'} />
                                    <span className={style.num}>{num}人</span>
                                    <p>{i+1}</p>  
                                </div>
                            )
                        }else{
                            if(s < scoreArea[0]){ 
                                color = key[0]
                            }else if (s >=  scoreArea[0] && s < scoreArea[1]) {
                                color = key[1]
                            }else{
                                color = key[2]
                            }
                            return(
                                <div key={i} 
                                className={style.quesList}
                                onClick={()=>this.scrollToAnchor(`ids${i}`)}>
                                    <Progress 
                                        type="circle" 
                                        strokeColor={color}
                                        percent={parseInt(item.wrongScore*100)} 
                                        width={60}
                                        style={{padding:'10px'}}
                                    />
                                    <span className={style.num}>{num}人</span>
                                    <p>{i+1}</p>  
                                </div>
                                
                            )
                        }


                        
                    })
                }
            </div>
            // <Progress type="circle" percent={30} width={80} />
            // <Progress type="circle" percent={70} width={80} status="exception" />
            // <Progress type="circle" percent={100} width={80} />
        )
    }	
	questionList(){
        let QuestionDetail = this.props.state.QuestionDetail;
        return(
            <div>
                {
                    QuestionDetail.data.qsList.map((item,i) =>{
                        if(item.wrongScore!=0){
                            let ids = `ids${i}`
                            let ans = []
                            for(let i=0;i< item.userAnswerList.length;i++){
                                if(item.userAnswerList[i].result == 0 ){
                                    ans.push( item.userAnswerList[i].answer)
                                }
                                
                            }
                            return(
                                <div id={ids} key={i} className={style.questonInner} onClick={()=>{
                                    this.setState({visible:true,questionKey:i,showAns:ans[0]})
                                    setTimeout(() => {
                                        let w = document.getElementsByClassName('wrongNum');
                                        for(let j = 0;j<w.length;j++){
                                            w[j].className='wrongNum'
                                        }
                                        w[0].className='wrongNum wrongNumOn'
                                    }, 10);
                                }}>
                                    <div className={style.questionTop}>
                                        <span style={{paddingRight:'10px'}}>第{i+1}题</span>
                                        <span>班级错误率：{(item.wrongScore *100).toFixed(0)}%</span>
                                        <span>（答错{ans.length}人）</span>
                                        {/* <span className={style.showAns} >错题统计</span> */}
                                    </div>
                                    <div style={{padding:'10px'}}>
                                        <span>{i+1}、</span>
                                        <img src={item.question} style={{width:'500px',verticalAlign:'top'}}></img>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>
        )
    }
    questionWrong() {
        let QuestionDetail = this.props.state.QuestionDetail;
        return(
            <div style={{padding:'10px'}}>
                {
                    QuestionDetail.data.qsList.map((item,i) =>{
                        let s = item.wrongScore*100;
					    var scoreArea = [20,40];
                        let are = ['#dcf2de','#fef7e3','#fcd8d2']
                        let key = ['#50c059','#ffbf00','#ee6b52']; 
                        
                        
                        for (var j=0; j<scoreArea.length; j++ ) {
                            //是否优秀
                            if( j == 0 ){
                                if (s<scoreArea[j]) {
                                    return(
                                        <div onClick={()=>this.scrollToAnchor(`ids${i}`)} key={i} style={{width:'33%',padding:'5px',display:'inline-block',textAlign:'center'}}>
                                            <span style={{cursor:'pointer',background:are[0],color:key[0],display:'inline-block',padding:'0 5px',width:'56px',height:'27px',lineHeight:'27px'}}>第{i+1}题</span>
                                        </div>
                                    )
                                }
                            }else{
                                if (s < scoreArea[j] && s >=scoreArea[j-1]) {
                                    return(
                                        <div onClick={()=>this.scrollToAnchor(`ids${i}`)} key={i} style={{width:'33%',padding:'5px',display:'inline-block',textAlign:'center'}}>
                                        <span style={{cursor:'pointer',background:are[1],color:key[1],display:'inline-block',padding:'0 5px',width:'56px',height:'27px',lineHeight:'27px'}} key={i}>第{i+1}题</span>
                                        </div>
                                    )
                                }else{
                                    return(
                                        <div onClick={()=>this.scrollToAnchor(`ids${i}`)} key={i} style={{width:'33%',padding:'5px',display:'inline-block',textAlign:'center'}}>
                                        <span style={{cursor:'pointer',background:are[2],color:key[2],display:'inline-block',padding:'0 5px',width:'56px',height:'27px',lineHeight:'27px'}} key={i}>第{i+1}题</span>
                                        </div>
                                    )
                                }
                            }
                            
                        }
                    })
                }
            </div>
        )
    }
    showQuestion() {
        let QuestionDetail = this.props.state.QuestionDetail;
        let key = this.state.questionKey;
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
        let Num = trueNum.length+ wrongNum.length
        return(
            <div>
                <div style={{border:'1px solid #ccc',marginBottom:'10px'}}>
                    <div style={{padding:'10px'}}>
                        <img src={question.question} style={{width:'500px'}}></img>
                    </div>
                    <div style={{borderTop:'1px solid #e7e7e7',padding:'10px',background:'#fafafa',overflow:'hidden',lineHeight:'30px'}}>
                        <span>班级错误率：{(question.wrongScore *100).toFixed(0)}%</span>
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
                    // this.state.showAns.map((item,i)=>(
                    //     <img width='500px' src={this.state.showAns}></img>
                    // ))
                    this.state.showAns != ''?
                    
                    <img width='500px' src={this.state.showAns}></img>:''
                }
            </div>
        )
    }
    scrollToAnchor = (anchorName) => {
        if (anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if(anchorElement) { anchorElement.scrollIntoView(); }
        }
      }
	render() {
		let state = this.props.state;
		let testScoreInfo = state.scoreList;
        let QuestionDetail = state.QuestionDetail;
        
        let key = this.state.questionKey;
        let MaxKey = 0
        if(QuestionDetail.data){
            MaxKey = QuestionDetail.data.qsList.length-1;
        }
		return (
            <div className={style.borderOut} >

                <div className={style.borderInner}>
                    <h3>作业错误率 
                    </h3>
                    {testScoreInfo.data && QuestionDetail.data ? this.wronglist():''}
                </div>
                <div className={style.borderInner}>
                    <h3>错题详情
                    <Button type="primary" 
                        style={{float:'right'}}
                        loading={this.state.loading} 
                        onClick={()=>{
                            let load = !this.state.loading
                            this.setState({loading:load})
                            let This = this;
                            if(!this.state.loading){
                                let url = dataCenter('/web/report/getTeacherWrongBook?homeworkId='+this.props.state.workId)
                                // window.open(url,'_blank'); 
                                this.setState({wordUrl:url})
                            }
                            setTimeout(function(){
                                This.setState({loading:!load,wordUrl:''})
                            },10000)
                        }}>
                    下载错题详情
                        </Button></h3>
                    <iframe style={{display:"none"}} src ={this.state.wordUrl}></iframe>
                    <div style={{width:'calc(100% - 240px)',float:'left'}}>
                        <div className={style.leftBody}>
                            {QuestionDetail.data?this.questionList():''}
                        </div>                  
                    </div>
                    <div style={{width:'240px',float:'left'}}>
                        <div className={style.rightBody}>
                            <div style={{borderBottom:'1px solid #e7e7e7',padding:'10px',background:'#fafafa'}}>答题情况（错误率）</div>
                            <div style={{padding:'10px 0'}}>
                                <div style={{display:'inline-block',margin:'0 10px'}}>
                                    <i style={{height:'14px',width:'14px',display:'inline-block',background:'#50c059',padding:'0 5px',verticalAlign:'sub'}}></i>
                                    <span>小于20%</span>
                                </div>
                                <div style={{display:'inline-block',margin:'0 10px'}}>
                                    <i style={{height:'14px',width:'14px',display:'inline-block',background:'#ffc104',padding:'0 5px',verticalAlign:'sub'}}></i>
                                    <span>介于20%~39%</span>
                                </div>
                                <div style={{display:'inline-block',margin:'0 10px'}}>
                                    <i style={{height:'14px',width:'14px',display:'inline-block',background:'#ee6b52',padding:'0 5px',verticalAlign:'sub'}}></i>
                                    <span>大于40%</span>
                                </div>
                                {QuestionDetail.data?this.questionWrong():''}

                            </div>
                        </div>
                    </div>
                </div>
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
                    {QuestionDetail.data?this.showQuestion():''}
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
                                        this.setState({questionKey:key-1,
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
                                        this.setState({questionKey:key+1*1,
                                            showAns:QuestionDetail.data.qsList[key+1].userAnswerList[i].answer})
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
	}
}

export default connect((state) => ({
	state: {
		...state.temp,
	}
}))(HomeworkCenter);