import React from 'react';
import { Table, Button, Modal,Select,Layout,Icon
} from 'antd';
import { connect } from 'dva';
import style from './TracksVideo.less';
import QRCode from 'qrcode.react';

// 视频功能
const Option = Select.Option;
const confirm = Modal.confirm;
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
			visible1:false,
			key:0,
			showAns:'',
			wordUrl:'',
            loading:false,
            videlUrl:''
	    };
	}
	
	addVie() {
        let value = 'http://hw-test.mizholdings.com/wx/video?uqId='+this.state.uqId+'&authorId='+ this.state.userId
        return(
            <div style={{textAlign:'center'}}>
                <QRCode className='qrcode' size='200' value={value} />
                <span className={style.updataCode} onClick={() =>{
                    this.props.dispatch({
                        type: 'report/queryTeachVideo',
                        payload:{
                            questionId:this.props.type.questionId,
                            key:this.props.num
                        }
                    });
                }}>视频已上传</span>
            </div>
        )
    }
	render() {

		return (
            <div style={{float:'right'}}>
                {this.props.type.teachVideo != null ?
                <span>
                    <Icon type="play-circle" style={{padding:'0 10px'}} onClick={()=>{
                        this.setState({visible1:true,videlUrl:this.props.type.teachVideo.url})
                    }}/>
                    <Icon type="delete"  style={{padding:'0 10px'}} onClick={()=>{
                        let This = this;
                        confirm({
                            title: '确认删除讲解视频？',
                            onOk() {
                                This.props.dispatch({
                                    type: 'report/deleteTeachVideo',
                                    payload:{
                                        videoId:This.props.type.teachVideo.videoId,
                                        key:This.props.num
                                    }
                                });
                            },
                            onCancel() {
                            },
                          });
                    }}/>
                </span>:
                    <span style={{float:'right',cursor:'pointer'}} onClick={()=>{
                        this.props.dispatch({
                            type: 'report/visible',
                            payload:true
                        });
                        this.props.dispatch({
                            type: 'example/uqId',
                            payload:this.props.type.questionId
                        });
                        this.props.dispatch({
                            type: 'example/userId',
                            payload:'4259550296541184'
                        });
                        this.props.dispatch({
                            type: 'example/questionId',
                            payload:this.props.type.questionId
                        });
                        this.props.dispatch({
                            type: 'example/num',
                            payload:this.props.num
                        });
                        
                    }}>添加讲解</span>
                }
                
                <Modal
                    visible={this.state.visible1}
                    footer={null}
                    // style={{padding:0}}
                    className={style.vidioCode1}
                    onOk={()=>{
                        this.setState({visible1:false,videlUrl:''})
                    }}
                    onCancel={()=>{
                        this.setState({visible1:false,videlUrl:''})
                    }}>
                        <div>
                            <video 
                                id="video" 
                                controls="controls"
                                 width="100%" 
                                 src={this.state.videlUrl}
                                 controls  >
                            </video>
                            {/* <Player
                                style={{width:'400px'}}
                                width = '400px'
                                playsInline
                                poster="/assets/poster.png"
                                src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                            /> */}
                        </div>
                </Modal>
            </div>
            
            // <span>
            //     添加视频
            // </span>
		);
	  }

	componentDidMount(){
		
    }

}

export default connect((state) => ({
	state: {
		...state.report,
		...state.temp,
		...state.down,
	}
}))(ClassReport);