import React from 'react';
import { Layout, Menu, Button,message,Select,Modal,Icon
} from 'antd';
import { routerRedux, Link } from "dva/router";
import { connect } from 'dva';
// import {EditableCell,EditableFormRow} from '../../components/Example'
import style from './classUser.less';
import moment from 'moment';
import {dataCenter} from '../../../config/dataCenter'
import store from 'store';
import ClassAdmin from '../ClassAdmin/classAdmin'
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
	
	menuClick = (e) =>{
        const {dispatch} = this.props;
		let location = this.props.location.hash;
		let hash = location.substr(location.indexOf("sId=")+4);
		let id = location.substr(location.indexOf("&id=")+4);
		let head = hash.split('&id=');
		let link = `classUser#${head[0]}&id=`
		let userNews = store.get('wrongBookNews')
		console.log(this.props.state.memType)
		if(e.key !== id){
			if(userNews.rodeType === 10){

				dispatch({
					type: 'homePage/infoClass',
					payload:e.key
				});
			}else{
				let id = hash.substr(hash.indexOf("&id=")+4);
				dispatch({
					type: 'homePage/infoClass',
					payload:e.key
				});
				
			}
			dispatch(
				routerRedux.push({
					pathname: '/classUser',
					hash:`sId=${head[0]}&id=${e.key}`
				})
			)
			dispatch({
				type: 'homePage/teacherList',
				payload:{
					type:this.props.state.memType
				}
			});
			
		}
		
	}
	menulist() {
        let userNews = store.get('wrongBookNews')
        let location = this.props.location.hash;
		let classList = [];
        let hash = location.substr(location.indexOf("sId=")+4);
        let id = location.substr(location.indexOf("&id=")+4);
		let head = hash.split('&id=');
		let ha =store.get('wrong_hash')
		let link = `/grade#${ha.substr(ha.indexOf("#")+1)}`
		const rodeType = store.get('wrongBookNews').rodeType
		if(rodeType <= 20){
			classList = this.props.state.classList;
		}else{
			classList = this.props.state.classList1;
        }
        if(classList.data){
            return(
                <div className={style.leftInfo}>
                    <h3 style={{padding:'10px 24px',borderBottom:'1px solid #ebeef5'}}>
                        <Link to={link}>
                            <div>
                                <Icon type="left-circle" theme="twoTone" style={{fontSize:'16px',marginRight:'5px'}} />
                                <span style={{fontSize:'16px'}}>返回</span>
                            </div>
                        </Link>
                    </h3>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[id]}
                        className={style.menu}
                        onClick={this.menuClick}
                        // defaultSelectedKeys={['sub']}
                        defaultOpenKeys={['sub']}
                        // inlineCollapsed={col}
                    >
                        {
							rodeType <= 20 ?
                            classList.data.list.map((item,i)=>{
								const {dispatch} = this.props;
                                return (
                                    <Menu.Item key={item.classId} >
											{item.className}
                                    </Menu.Item>
								)
								} 
							):
							classList.data.map((item,i)=>{
								const {dispatch} = this.props;
                                return (
                                    <Menu.Item key={item.classId} >
											{item.className}
                                    </Menu.Item>
                                )
								}
							)
                        }
                    </Menu>
                </div>
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
					<Layout className={style.innerOut}>
                        <Sider  className={style.sider}>
                            {this.menulist()}
                        </Sider>
						<Content className={style.content}
						ref='warpper'>
							<ClassAdmin location={this.props.location}></ClassAdmin>
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
		const {dispatch} = this.props;
		let hash = this.props.location.hash;
        let userNews = store.get('wrongBookNews')
        if(userNews.rodeType <= 20){
			let ids = hash.substr(hash.indexOf("sId=")+4);
            let id = ids.split('&id=');
            let data = {
                schoolId:id[0],
                pageSize:9999,
                pageNum:1
            }
            dispatch({
                type: 'classHome/pageClass',
                payload:data
			});
			
			dispatch({
				type: 'homePage/infoClass',
				payload:id[1]
			});
			dispatch({
				type: 'homePage/infoSchool',
				payload:id[0]
			});
        }else{
			let id = hash.substr(hash.indexOf("&id=")+4);
			dispatch({
				type: 'homePage/infoClass',
				payload:id
			});
			dispatch({
				type: 'homePage/infoSchool',
				payload:userNews.schoolId
			});
			let data = {
                schoolId:userNews.schoolId,
                pageSize:9999,
                pageNum:1
            }
            dispatch({
                type: 'classHome/getClassList',
			});
		}
		
		this.props.dispatch({
			type: 'homePage/schoolTeacher',
		});
		this.props.dispatch({
			type: 'homePage/teacherList',
			payload:{
				type:1
			}
		});
		this.props.dispatch({
			type: 'homePage/subjectNodeList',
		});
	}
}

export default connect((state) => ({
	state: {
		...state.classHome,
		...state.homePage,
	}
}))(StuReport);