import React from 'react';
import { Button, message, Layout,Modal,Select ,Icon,Spin
} from 'antd';
import {dataCenter , dataCen,serverType} from '../../../config/dataCenter'
import { routerRedux,  } from "dva/router";
import { connect } from 'dva';
import QRCode from 'qrcode.react';

// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './classReport.less';
import TracksVideo from '../TracksVideo/TracksVideo';
import store from 'store';
import commonCss from '../../css/commonCss.css';
//作业中心界面内容
const Option = Select.Option;
const confirm = Modal.confirm;
const {
	Header, Footer, Sider, Content,
  } = Layout;

const antIcon = <Icon type="loading" style={{ fontSize: 50 }} spin />
let hei = 200
class wrongTop extends React.Component {
	constructor(props) {
        super(props);
        this.Ref = ref => {this.refDom = ref};
		this.state = {
			visible:false,
			key:0,
			showAns:'',
			wordUrl:'',
            loading:false,
            hei:0,
            next:true,
            visible1:false,
            userId:'',
            uqId:'',
            allPdf:false,
            toupload:false,
	    };
    }
	handleScroll(e){
        const { clientHeight} = this.refDom;
        hei = clientHeight;
    }
	quesList(){
		let ques = this.props.state.qrdetailList.data;
        let num = ques.memberNum;
		return(
            <div className={style.outBody}
                onWheel={(e) => this.handleScroll(e)}
                ref={this.Ref}
            >
                <div style={{overflow:'auto'}}>
                {
                    ques.questionList.map((item,i)=>{
                        let ans = []
                        for(let i=0;i< item.userAnswerList.length;i++){
                            if(item.userAnswerList[i].result == 0 ){
                                ans.push( item.userAnswerList[i].answer)
                            }
                        }
                        let downs = this.props.state.classDown;
                            let cls = 'down',name = '选题';
                        if(this.state.allPdf) {
                            cls = 'down ndown';
                            name = '移除';
                        }
                        for(let j = 0 ; j < downs.length ; j ++) {
                            if(downs[j] == item.questionId){
                                cls = 'down ndown';
                                name = '移除'
                            }
                        }
                        let j = i;
                        return(
                        <div key={i} className={style.questionBody}>
                            <div className={style.questionTop}>
                                <span style={{marginRight:'20px'}}>第{i+1}题</span>
                                <span>答错<span style={{color:"#1890ff",fontWeight:'bold',padding:'0 5px'}}>{item.wrongNum}</span>人</span>
                                {/* <span>{item.picId}</span> */}
                                {
                                    item.num != 0 ? 

                                    <span style={{marginLeft:'10px',borderLeft:'1px solid #ccc',paddingLeft:'10px'}}>已出卷<span style={{color:"#1890ff",fontWeight:'bold',padding:'0 5px'}}>{item.num}</span>次</span>
                                    :''
                                }
                                <TracksVideo type={item} num={j}></TracksVideo>
                            </div>
                            <div style={{padding:'10px',height:'250px',overflow:'hidden'}} onClick={()=>{
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
                                    item.questionUrl.split(',').map((item,i)=>(
                                        <img key={i} style={{width:'100%'}} src={item}></img>
                                    ))
                                }
                            </div>
                            <div style={{overflow:'hidden',paddingLeft:'10px',paddingTop:'20px'}}>
                                <span style={{float:'left',color:'#409eff',cursor:'pointer'}} onClick={()=>{
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
                                    
                                }}>查看统计</span>
                                <span className={cls}  onClick={()=>{
                                    let dom = document.getElementsByClassName('down');
                                    let downs = this.props.state.classDown;
                                    if( dom[i].innerText == '选题' ){
                                        cls = 'down ndown';
                                        name = '移除'
                                        this.props.dispatch({
                                            type: 'down/classDown',
                                            payload:item.questionId
                                        });
                                        this.props.dispatch({
                                            type: 'down/classDownPic',
                                            payload:item.picId
                                        });
                                    }else{
                                        cls = 'down';
                                        name = '选题'
                                        this.props.dispatch({
                                            type: 'down/delClassDown',
                                            payload:item.questionId
                                        }); 
                                        this.props.dispatch({
                                            type: 'down/delClassDownPic',
                                            payload:item.picId
                                        });
                                    }
                                }}>
                                {
                                    name == '选题' ?
                                    <img style={{marginTop:'-4px',marginRight:'4px'}} src={require('../../images/sp-xt-n.png')}/>:
                                    <img style={{marginTop:'-4px',marginRight:'4px'}} src={require('../../images/sp-yc-n.png')}/>
            
                                }
                                {name}</span>
                            </div>
                        </div>
                    )})
                }
                </div>
			</div>
		)
    }
    onImportExcel = file =>{
        let form = new FormData();
        let fil = document.getElementById("file").files[0];
        if(fil.type.indexOf('mp4') < 0 ) {
            message.warning('上传文件只支持mp4')
            return false
        }
        if((fil.size/1024)/1024 <= 50){
            message.warning('上传文件大小需小于50Mb')
            return false
        }
        form.append('file',document.getElementById("file").files[0]);
        var url = URL.createObjectURL(document.getElementById("file").files[0]);
        var audioElement = new Audio(url);
        var duration;
        audioElement.addEventListener("loadedmetadata", function (_event) {
            duration = audioElement.duration;
        });
        let This =this;
        This.props.dispatch({
            type: 'report/toupload',
            payload:true
        });
        let token = store.get('wrongBookToken');
        fetch(dataCenter('/file/uploadFlie?token=' + token), {
            method: "POST",
            body: form
        })
        .then(response => response.json())
        .then(res => {
            if(res.result === 0){
                This.props.dispatch({
                    type: 'report/uploadVideo',
                    payload:{
                        uqId:This.props.state.uqId,
                        url:res.data.path,
                        // authorId:store.get('wrongBookNews').userId,
                        duration:parseInt(duration)
                    }
                });
                
                
            }else{
                message.error(res.msg)
            }
        })
        .catch(function(error) {
            message.error(error.msg)
        })
            
	}
    addVie() {
        const userId = store.get('wrongBookNews').userId
        let value='http://hw-test.mizholdings.com/wx/'
        if(serverType===2){
            value='https://dy.kacha.xin/wx/takevideoPreview/'
        }
        value+='video?uqId='+this.props.state.uqId+'&authorId='+ userId
        let This = this;
        // console.log(this.props.state.visible1,this.props.state.toupload )
        if(!this.props.state.visible1 && !this.props.state.toupload ){
            var timestamp = new Date().getTime() + "";
            timestamp = timestamp.substring(0, timestamp.length-3);  
            var websocket = null;
            //判断当前浏览器是否支持WebSocket
            let url =  dataCen('/wrongManage/teachVideoUpload?userId='+userId+'&uqId='+this.props.state.uqId)
            if ('WebSocket' in window) {
                websocket = new WebSocket(url);
            }
            else {
                alert('当前浏览器  Not support websocket');
            }
            //连接发生错误的回调方法
            websocket.onerror = function () {
                console.log("WebSocket连接发生错误");
            };
            //连接成功建立的回调方法
            websocket.onopen = function () {
                console.log("WebSocket连接成功");
            }
            //接收到消息的回调方法
            websocket.onmessage = function (event) {
                console.log(event)
                let data = JSON.parse(event.data);
                let json ;
                if ( data.status == 2) {
                    This.props.dispatch({
                        type: 'report/toupload',
                        payload:true
                    });
                    
                }
                if ( data.url ) {
                    json = JSON.parse(data.url)
                    // message.success('视频上传成功')
                    This.props.dispatch({
                        type: 'report/updataVideo',
                        payload:{
                            video:json,
                            key:This.props.state.num
                        }
                    });
                    This.props.dispatch({
                        type: 'report/videlUrl',
						payload:json.url
                    });
                    This.props.dispatch({
                        type: 'report/visible1',
                        payload:true
                    });
                    This.props.dispatch({
                        type: 'report/toupload',
                        payload:false
                    });

                }
                
            }
            //连接关闭的回调方法
            websocket.onclose = function () {
                console.log("WebSocket连接关闭");

                This.props.dispatch({
                    type: 'report/toupload',
                    payload:false
                });
            }
            //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，
            //防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = function () {
                closeWebSocket();
            }
            //关闭WebSocket连接
            function closeWebSocket() {
                websocket.close();
            }
        }
        let questionNews = this.props.state.questionNews;
        return(
            <div className={style.codeFram} style={{textAlign:'center',overflow:"hidden"}}>
                <div  className={style.questionBody}>
                    <div className={style.questionTop}>
                        <span>答错<span style={{color:"#1890ff",fontWeight:'bold',padding:'0 5px'}}>{questionNews.wrongNum}</span>人</span>
                    </div>
                    <div style={{padding:'10px',height:'250px',overflow:'hidden'}} >
                        {
                            questionNews.questionUrl.split(',').map((item,i)=>(
                                <img key={i} style={{width:'100%'}} src={item}></img>
                            ))
                        }
                    </div>
                </div>
                <div className={style.phoneCode}>
                        {
                            !this.props.state.visible1 ?
                            <div>
                                {
                                    !this.props.state.toupload ?
                                    <div>
                                        <QRCode className='qrcode' size={150} value={value} />
                                        <p style={{marginTop:20,fontSize:'16px',color:'#606266'}}>手机微信扫码，录制视频讲解</p>
                                        
                                        <label htmlFor="file">
                                            <span
                                                className={style.addButon}
                                            >本地上传</span>
                                        </label> 
                                        <input
                                            type='file' 
                                            id='file' 
                                            accept='.mp4'  
                                            style={{display:'none'}}
                                            onChange={this.onImportExcel} 
                                        />
                                    </div>:
                                    <div>
                                        <Spin style={{height:'155px',marginLeft:'-24px',lineHeight:"150px"}} indicator={antIcon} />
                                        {/* <Icon type="loading" style={{ fontSize: 24 }} spin /> */}
                                        <p style={{marginTop:20,fontSize:'16px',color:'#606266'}}>正在上传...</p>
                                        <span
                                            className={style.addButon}
                                        >本地上传</span>
                                    </div>
                                }
                            </div>
                            :
                            <div>
                                <video 
                                    id="video" 
                                    controls="controls"
                                    width="100%" 
                                    style={{height:'210px'}}
                                    src={this.props.state.videlUrl}
                                    controls  >
                                </video>
                                <span
                                    className={style.addButon}
                                    onClick={()=>{
                                        let This = this;
                                        console.log(This.props.state.num,questionNews.teachVideo.videoId)
                                        confirm({
                                            title: '确认删除讲解视频？',
                                            okText: '是',
                                            cancelText: '否',
                                            onOk() {
                                                This.props.dispatch({
                                                    type: 'report/deleteTeachVideo',
                                                    payload:{
                                                        videoId:questionNews.teachVideo.videoId,
                                                        key:This.props.state.num
                                                    }
                                                });
                                            },
                                            onCancel() {
                                            },
                                        });
                                    }}
                                >删除视频</span>
                            </div>
                        }
                        
                    
                </div>
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
            
            let showAns = []
            if(this.state.showAns){
                showAns = this.state.showAns.split(',')
            }
            return(
                <div>
                    <div style={{border:'1px solid #ccc',marginBottom:'10px',padding:'10px'}}>
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
                        showAns.map((item,i)=>(
                            <img key={i} width='650px' src={item}></img>
                        ))
                    }
                </div>
            )
        }else{
            // return(
            //     <Empty />
            // )
        }
    }
    
	render() {
		let mounthList = this.props.state.mounthList;
		let key = this.state.key;
        let MaxKey = 0
        let QuestionDetail = this.props.state.qrdetailList;
        let fileLink=this.props.state.pdfUrl.fileLink;
        if(QuestionDetail.data){
            MaxKey = QuestionDetail.data.questionList.length-1;
        }
        // console.log(this.props.state.mouNow)
		return (

            <Content style={{position:'relative'}}>
				<iframe style={{display:'none'}} src={this.state.wordUrl}/>
                <Layout className={style.layout}>
                    <Header className={style.layoutHead} >
                        <span>时间：</span>
                            <span key={0} className={0 ==this.props.state.mouNow?'choseMonthOn': 'choseMonth'} onClick={()=>{
                                this.props.dispatch({
                                    type: 'report/changeMouth',
                                    payload:0
                                });                              
                                this.props.dispatch({
                                    type: 'report/propsPageNum',
                                    payload:1
                                });
                                this.props.dispatch({
                                    type: 'report/qrdetailList',
                                    payload:[]
                                });
                                this.props.dispatch({
                                    type: 'report/queryQrDetail',
                                    payload:{
                                        classId:this.props.state.classId,
                                        year:this.props.state.years,
                                        subjectId:this.props.state.subId,
                                        info:0,
                                        pageSize:50,
                                        pageNum:1
                                    }
                                });
                                
                                this.props.dispatch({
                                    type: 'down/AllPdf',
                                    payload:false
                                });
                            }}>全部</span>
                        {
                            mounthList.data ?
                            mounthList.data.map((item,i)=>{
                                return(
                                    <span key={i} className={item.k ==this.props.state.mouNow.k?'choseMonthOn': 'choseMonth'} onClick={()=>{
                                        this.props.dispatch({
                                            type: 'report/changeMouth',
                                            payload:item
                                        });
                                       
                                    this.props.dispatch({
                                        type: 'report/propsPageNum',
                                        payload:1
                                    });
                                    this.props.dispatch({
                                        type: 'report/qrdetailList',
                                        payload:[]
                                    });
                                    this.props.dispatch({
                                        type: 'report/queryQrDetail',
                                        payload:{
                                            classId:this.props.state.classId,
                                            year:this.props.state.years,
                                            subjectId:this.props.state.subId,
                                            info:0,
                                            month:item.v,
                                            pageSize:50,
                                            pageNum:1
                                        }
                                    });
                                    this.props.dispatch({
                                        type: 'down/AllPdf',
                                        payload:true
                                    });
                                    // w[i].className='wrongNum wrongNumOn'

                                }}>{item.k}</span>
                            )
                            })
                            :''
                        }
                        {QuestionDetail.data&&QuestionDetail.data.questionList.length>0?<Button 
                            style={{background:'#67c23a',color:'#fff',float:'right',marginTop:"9px",border:'none'}}
                            loading={this.props.state.downQue} 
                            disabled={this.props.state.classDown.length===0&&!this.props.state.downQue}
                            onClick={()=>{
                                if(this.props.state.classDown.length!= 0){
                                    
                                    this.props.dispatch({
                                        type: 'down/downQue',
                                        payload:true
                                    })
                                    this.props.dispatch({
                                        type: 'down/getQuestionPdf',
                                        payload:{
                                            picIds:this.props.state.classDownPic.join(','),
                                            mode:2
                                        }
                                    })
                                    
                                    // let url = dataCenter('/web/report/getQuestionPdf?picIds='+this.props.state.classDownPic.join(','))
                                    // this.setState({wordUrl:url})
                                    // 添加导出次数
                                    this.props.dispatch({
                                        type: 'report/addClassup',
                                        payload:this.props.state.classDownPic
                                    })
                                    // 下载清空选题
                                    this.props.dispatch({
                                        type: 'down/delAllClass',
                                    });
                                    
                                }else{
                                    message.warning('请选择题目到错题篮')
                                }
                            }}>
                            <img style={{marginLeft:'10px',height:'15px',marginBottom:'4px'}}  src={require('../../images/xc-cl-n.png')}></img>
                        下载组卷({this.props.state.classDown.length})
                        </Button>:''}
                        
                        {
                            (this.props.state.AllPdf&&0!=this.props.state.mouNow&&QuestionDetail.data&&QuestionDetail.data.questionList.length>0) ?
                            
                            <Button 
                                style={{background:'#67c23a',color:'#fff',float:'right',marginTop:"9px",border:'none',marginRight:'10px'}}
                                loading={this.props.state.toDown} 
                                onClick={()=>{
                                    this.props.dispatch({
                                        type: 'down/getAllPdfV2ForQrc',
                                        payload:{
                                            classId:this.props.state.classId,
                                            subjectId:this.props.state.subId,
                                            year:this.props.state.years,
                                            month:this.props.state.mouNow.v,
                                        }
                                    });
                                    // 添加导出次数
                                    let qlist = this.props.state.qrdetailList.data.questionList;

                                    this.props.dispatch({
                                            type: 'down/allClassDown',
                                            payload:qlist
                                    });

                                                                
                                    this.props.dispatch({
                                        type: 'report/addClassup',
                                        payload:this.props.state.allClassDown
                                    })

                                    this.props.dispatch({
                                        type: 'down/toDown',
                                        payload:true
                                    });
                                    this.props.dispatch({
                                        type: 'down/delAllClassDown',
                                        payload:true
                                    });

                                }}>
                                {
                                    this.props.state.toDown?
                                    '组卷中':'下载全部'
                                }
                            </Button>:''
                        }
                    </Header>
                    <Content style={{background:'#fff',overflow:'auto',position:'relative'}}
                        ref='warpper'
                        onScroll={(e)=>{
                            if(hei-200 < e.target.scrollTop+e.target.clientHeight){
                                if(this.state.next ){
                                    let page = this.props.state.propsPageNum;
                                    let classId = this.props.state.classId;
                                    let subId = this.props.state.subId;
                                    let year = this.props.state.years;
                                    page++
                                    this.setState({next:false})
                                    
                                    this.props.dispatch({
                                        type: 'report/propsPageNum',
                                        payload:page
                                    });
                                    let data ={
                                        classId:classId,
                                        year:year,
                                        subjectId:subId,
                                        info:0,
                                        pageNum:page,
                                        pageSize:50,
                                    }  
                                    if(this.props.state.mouNow != 0){
                                        data.month = this.props.state.mouNow.v
                                    }      
                                    this.props.dispatch({
                                        type: 'report/queryQrDetail1',
                                        payload:data
                                    });
                                    let This =this
                                    setTimeout(function (){
                                        This.setState({next:true})
                                    },1000)
                                }
                            }
                        }}
                    >
                        {
                            this.props.state.qrdetailList.data && this.props.state.qrdetailList.data.questionList.length != 0?
                            this.quesList():
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
                <Modal
                    visible={this.props.state.visible}
                    footer={null}
                    width= '950px'
                    title='添加讲解视频'
                    className={style.vidioCode}
                    onOk={()=>{
                        this.props.dispatch({
                            type: 'report/visible',
                            payload:false
                        });
                    }}
                    onCancel={()=>{
                        this.props.dispatch({
                            type: 'report/visible',
                            payload:false
                        });
                    }}>
                        {
                            this.props.state.visible ? this.addVie() : ''
                        }
                </Modal>

                <Modal
                    visible={this.props.state.showPdfModal}
                    maskClosable={false}
                    keyboard={false}
                    onOk={()=>{
                        window.location.href=this.props.state.pdfUrl.downloadLink
                    }}
                    onCancel={()=>{
                        this.props.dispatch({
                            type: 'down/showPdfModal',
                            payload:false
                        });
                    }}
                    className={commonCss.pdfModal}   
                    closable={false}
                    cancelText='取消'  
                    okText='下载'   
                >
                    <div style={{height:'700px'}}>
                        {/* <PDF
                            file="http://homework.mizholdings.com/pdf/240CA1A5-E7A9-4CF3-8CE2-5CD48B1FADB4.pdf"
                        /> */}
                        {/* <embed src={fileLink} type="application/pdf" width="100%" height="100%"></embed> */}
                        <iframe  src={fileLink} title='下载预览' style={{width:'100%',height:'100%',border:0}}></iframe>
                    </div>
                    
                </Modal>
            </Content>
		);
	  }
	componentDidMount(){
		let classId = this.props.state.classId;
		let subId = this.props.state.subId;
        let year = this.props.state.years;
        this.props.dispatch({
			type: 'down/showPdfModal',
			payload:false
        });
        this.props.dispatch({
            type: 'report/propsPageNum',
            payload:1
        });
		if(classId!== '' && subId!='' && year!== ''){
			let data ={
					classId:classId,
					year:year,
					subjectId:this.props.state.subId,
                    info:0,
                    pageNum:1,
                    pageSize:50,
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
        ...state.example,
	}
}))(wrongTop);