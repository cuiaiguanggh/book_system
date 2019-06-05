import React from 'react';
import { Table, Button, Modal,Select,Layout,Icon,Tooltip
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
	
	render() {
        let teachVideo = this.props.type.teachVideo;
        let duration = '';
        let time = '';
        if( teachVideo != null ) {
            duration = teachVideo.duration;
            let num0 = parseInt(duration/60)
            let num1 = duration%60
            let mm = num0;
            let ss = num1;
            if( num0 < 10 ) {
                mm = '0' + num0
            }
            if ( num1 < 10 ) {
                ss = '0' + num1
            }
            time = mm + "'" + ss + '"'
        }
		return (
            <div style={{float:'right'}}>
                {this.props.type.teachVideo != null ?
                <span >
                    <Tooltip placement="bottom" title="讲解视频">
                        <span style={{padding:'0 10px',background:"#52a5fa",color:'#fff',borderRadius:'3px',cursor:'pointer'}} onClick={()=>{
                            this.props.dispatch({
                                type: 'report/visible',
                                payload:true
                            });
                            this.props.dispatch({
                                type: 'report/visible1',
                                payload:true
                            });
                            this.props.dispatch({
                                type:'example/questionNews',
                                payload:this.props.type
                            })
                            this.props.dispatch({
                                type: 'report/videlUrl',
                                payload:this.props.type.teachVideo.url
                            });
                            this.props.dispatch({
                                type: 'example/num',
                                payload:this.props.num
                            });
                        }}>
                            <Icon type="play-circle"  theme="filled" style={{marginRight:'10px',cursor:"pointer"}} title=""  onClick={()=>{
                               
                            }}/>
                                {time}
                        </span>
                    </Tooltip>
                    <Tooltip placement="bottom" title="删除">
                        <Icon type="delete"  style={{margin:'0 10px',cursor:"pointer"}} onClick={()=>{
                            let This = this;
                            confirm({
                                title: '确认删除讲解视频？',
                                okText: '是',
                                cancelText: '否',
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
                    </Tooltip>
                </span>:
                    <span style={{float:'right',cursor:'pointer',color:'#52a5fa'}} onClick={()=>{
                        this.props.dispatch({
                            type: 'report/visible',
                            payload:true
                        });
                        this.props.dispatch({
                            type: 'report/visible1',
                            payload:false
                        });
                        this.props.dispatch({
                            type: 'report/toupload',
                            payload:false
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
                            type:'example/questionNews',
                            payload:this.props.type
                        })
                        this.props.dispatch({
                            type: 'example/num',
                            payload:this.props.num
                        });
                    }}><img style={{margin:'0 5px 3px 0'}} src={require('../../images/sp-lj-n.png')} />录讲解</span>
                }
            </div>
            
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